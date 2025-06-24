import io
import os
import tarfile
import zipfile
from base64 import b64encode
from collections.abc import Iterable
from pathlib import Path
from tarfile import TarFile, TarInfo
from typing import Any, Optional, TypeVar
from zipfile import ZipFile, ZipInfo

import github
import httpx
from github import Github
from github.GitRelease import GitRelease
from github.Repository import Repository

from website.utils import first, first_with_default, is_emoji

T = TypeVar("T")


def get_gh() -> Github:
    github_token = os.getenv("GITHUB_TOKEN")
    if github_token is None:
        raise ValueError("GITHUB_TOKEN environment variable not set.")
    return Github(github_token)


def get_repo_readme(repo: Repository) -> Optional[str]:
    print(f"Getting README for `{repo.name}`.")
    try:
        return repo.get_readme().decoded_content.decode("utf-8")
    except github.GithubException:
        return None


def get_repo_file(repo: Repository, file_path: str) -> str:
    print(f"Getting file `{file_path}` from `{repo.name}`.")
    file_content_raw = repo.get_contents(file_path)
    file_content = (
        file_content_raw[0] if isinstance(file_content_raw, list) else file_content_raw
    )
    return file_content.decoded_content.decode("utf-8")


def is_blogpost(repo: Repository) -> bool:
    return "blogpost" in repo.topics


def get_latest_release(repo: Repository) -> Optional[GitRelease]:
    print(f"Getting releases for `{repo.owner.name}/{repo.name}`.")
    releases = repo.get_releases()
    releases_sorted = sorted(
        releases, key=lambda release: release.published_at, reverse=True
    )
    return first_with_default(releases_sorted, default=None)


def download_file(url: str) -> bytes:
    print(f"Downloading URL `{url}`.")
    response = httpx.get(url, follow_redirects=True, timeout=60)
    print(f"Got status code {response.status_code}.")
    content = response.content
    print(f"Content length is {len(content)}.")
    return content


def extract_tar_file(from_tar_file: TarFile, member: TarInfo) -> str:
    extracted = from_tar_file.extractfile(member)
    if extracted is None:
        raise ValueError(f"Could not extract file {member}.")
    content = extracted.read()
    try:
        return content.decode("utf-8")
    except UnicodeDecodeError:
        return b64encode(content).decode("ascii")


def extract_zip_file(from_zip_file: ZipFile, member: ZipInfo) -> str:
    extracted = from_zip_file.read(member)
    try:
        return extracted.decode("utf-8")
    except UnicodeDecodeError:
        return b64encode(extracted).decode("ascii")


def get_tar_file_contents(content: bytes) -> list[dict[str, str]]:
    content_io = io.BytesIO(content)
    with tarfile.open(fileobj=content_io) as f:
        return [
            {"name": name.removeprefix("./"), "contents": contents}
            for name, contents in [
                (member.name, extract_tar_file(f, member))
                for member in f.getmembers()
                if member.path != "."
            ]
        ]


def download_first_release_asset(release: GitRelease) -> bytes:
    url = release.assets[0].browser_download_url
    return download_file(url)


def get_zip_file_contents(content: bytes) -> list[dict[str, str]]:
    content_io = io.BytesIO(content)
    with zipfile.ZipFile(content_io) as f:
        return [
            {"name": member.filename, "contents": extract_zip_file(f, member)}
            for member in f.infolist()
        ]


def get_user_repos(gh: Github) -> Iterable[Repository]:
    user = gh.get_user("hasnep")
    print(f"Getting repos for user `{user.name}`.")
    return user.get_repos()


def get_description(repo: Repository) -> Optional[str]:
    description: Optional[str] = repo.description
    return None if description is None or len(description) == 0 else description


def has_non_empty_description(repo: Repository) -> bool:
    return get_description(repo) is not None


def get_blogpost(repo: Repository) -> dict[str, str | list[dict[str, str]]]:
    blogpost_id = repo.name
    print(f"Getting blogpost `{blogpost_id}`.")
    latest_release = get_latest_release(repo)
    if latest_release is None:
        files = []
    else:
        blogpost_tar_file = download_first_release_asset(latest_release)
        # blogpost_tar_file = decompress_brotli_file(blogpost_brotli_compressed_tar)
        files = get_tar_file_contents(blogpost_tar_file)
    return {"id": blogpost_id, "files": files}


def get_blogposts(
    repos: list[Repository],
) -> list[dict[str, str | list[dict[str, str]]]]:
    print("Getting blogposts.")
    blogpost_repos = [repo for repo in repos if is_blogpost(repo)]
    return [get_blogpost(repo) for repo in blogpost_repos]


def get_projects(repos: list[Repository]) -> list[dict[str, Optional[str]]]:
    return [
        {
            "id": repo.name,
            "readme": get_repo_readme(repo),
            "description": get_description(repo),
            "last_updated": repo.get_commits()[0].commit.committer.date.isoformat(),
        }
        for repo in repos
        if not is_blogpost(repo)
    ]


def download_fonts() -> list[dict[str, str]]:
    gh = get_gh()
    font_repo = gh.get_repo("github/mona-sans")
    font_release = next(
        release for release in font_repo.get_releases() if release.tag_name == "v1.0.1"
    )
    font_files = get_zip_file_contents(download_first_release_asset(font_release))
    mona_sans_woff_2 = first(
        f for f in font_files if f["name"] == "Mona Sans/Mona-Sans.woff2"
    )
    return [{"name": "mona-sans.woff2", "contents": mona_sans_woff_2["contents"]}]


def get_scss_file() -> str:
    with (Path() / "styles.scss").open("r") as f:
        return f.read()


def download_icons() -> list[dict[str, str]]:
    url = "https://use.fontawesome.com/releases/v6.2.1/fontawesome-free-6.2.1-web.zip"
    icon_files = get_zip_file_contents(download_file(url))
    icon_prefix = "fontawesome-free-6.2.1-web/svgs"
    icons_to_download = {
        "mastodon.svg": icon_prefix + "/brands/mastodon.svg",
        "github.svg": icon_prefix + "/brands/github.svg",
        "envelope.svg": icon_prefix + "/solid/envelope.svg",
    }
    return [
        {
            "name": icon_name,
            "contents": first(
                f["contents"] for f in icon_files if f["name"] == icon_path
            ),
        }
        for (icon_name, icon_path) in icons_to_download.items()
    ]


def download_data() -> dict[str, Any]:
    gh = get_gh()
    repos = [
        repo
        for repo in get_user_repos(gh)
        if (not repo.fork)
        and (not repo.archived)
        and (
            (
                has_non_empty_description(repo)
                and is_emoji(repo.description.split(" ")[0])
            )
            or is_blogpost(repo)
        )
    ]
    blogposts = get_blogposts(repos)
    projects = get_projects(repos)
    cv_repo = first(repo for repo in repos if repo.name == "cv")
    return {
        "config": {
            "title": "Ha.nnes.dev",
            "contactLinks": [
                {
                    "text": "h@nnes.dev",
                    "href": "mailto:h@nnes.dev",
                    "image": "/static/icons/envelope.svg",
                },
                {
                    "text": "GitHub",
                    "href": "https://github.com/hasnep",
                    "image": "/static/icons/github.svg",
                },
                {
                    "text": "Mastodon",
                    "href": "https://julialang.social/@hasnep",
                    "image": "/static/icons/mastodon.svg",
                },
            ],
            "navBarLinks": [
                {"text": "Home", "href": "/"},
                {"text": "Blog", "href": "/blog"},
                {"text": "Projects", "href": "/projects"},
                {"text": "CV", "href": "/cv"},
            ],
        },
        "projects": projects,
        "blogposts": blogposts,
        "cv": get_repo_file(cv_repo, "src/cv-johannes-smit.md"),
        "static": {
            "fonts": download_fonts(),
            "icons": download_icons(),
            "scss": get_scss_file(),
        },
    }

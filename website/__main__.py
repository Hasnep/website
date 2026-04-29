import json
from base64 import b64decode
from pathlib import Path
from shutil import rmtree

from website import (
    get_atom_feed,
    get_blog_page,
    get_blogpost_page,
    get_cv_page,
    get_index_page,
    get_json_feed,
    get_project_page,
    get_projects_page,
    get_rss_feed,
    html,
    sass,
    xml,
)
from website.cli import get_action
from website.constants import BUILD_FOLDER, DATA_FILE, DATA_FOLDER, STATIC_FOLDER
from website.data import get_data
from website.downloader import download_data
from website.utils import flatten


def download() -> None:
    data = download_data()
    DATA_FOLDER.mkdir(exist_ok=True)
    with DATA_FILE.open("w") as f:
        json.dump(data, f, ensure_ascii=False)


def build() -> None:
    output: dict[Path, str | bytes] = {}

    pages = [
        (".", get_index_page()),
        ("./projects", get_projects_page()),
        *[
            (f"./projects/{project.project_id}", get_project_page(project))
            for project in get_data().projects
        ],
        ("./blog", get_blog_page()),
        *[
            (f"./blog/{blogpost.blogpost_id}", get_blogpost_page(blogpost))
            for blogpost in get_data().blogposts
        ],
        ("./cv", get_cv_page()),
    ]
    for page_path, page in pages:
        page_file_path = BUILD_FOLDER / page_path / "index.html"
        print(f"Writing page to `{page_file_path}`.")
        output[page_file_path] = html.render_page(page)

    assets = flatten(
        [
            [
                (blogpost, blogpost_file)
                for blogpost_file in blogpost.files
                if Path(blogpost_file.name).name
                not in ["blogpost.html", "metadata.toml"]
            ]
            for blogpost in get_data().blogposts
        ]
    )
    for blogpost, blogpost_asset in assets:
        asset_file_path = (
            BUILD_FOLDER / "blog" / blogpost.blogpost_id / blogpost_asset.name
        )
        print(f"Writing blogpost asset to `{asset_file_path}`.")
        output[asset_file_path] = blogpost_asset.to_bytes()

    feeds = [
        (BUILD_FOLDER / "rss.xml", xml.render(get_rss_feed(get_data().blogposts))),
        (BUILD_FOLDER / "atom.xml", xml.render(get_atom_feed(get_data().blogposts))),
        (BUILD_FOLDER / "feed.json", json.dumps(get_json_feed(get_data().blogposts))),
    ]
    for feed_path, feed in feeds:
        print(f"Writing feed to `{feed_path}`.")
        output[feed_path] = feed

    css_file = STATIC_FOLDER / "styles.css"
    print(f"Writing CSS file to `{css_file}`.")
    css = sass.compile_sass(get_data().static.scss)
    output[css_file] = css

    fonts_folder = STATIC_FOLDER / "fonts"
    for font in get_data().static.fonts:
        output[fonts_folder / font.name] = b64decode(font.contents)

    icons_folder = STATIC_FOLDER / "icons"
    for icon in get_data().static.icons:
        output[icons_folder / icon.name] = icon.contents

    rmtree(BUILD_FOLDER, ignore_errors=True)
    for p, contents in output.items():
        p.parent.mkdir(parents=True, exist_ok=True)
        match contents:
            case str():
                with p.open("w") as f:
                    _ = f.write(contents)
            case bytes():
                with p.open("wb") as f:
                    _ = f.write(contents)


def main() -> None:
    match get_action():
        case "download":
            download()
        case "build":
            build()


if __name__ == "__main__":
    main()

import functools
from base64 import b64decode
from binascii import Error as DecodeError
from datetime import date as PyDate, datetime as PyDateTime
from typing import List, Optional, Self

import msgspec
from msgspec import Struct
from whenever import Date, UTCDateTime

from website.constants import DATA_FILE
from website.utils import first_with_default, is_emoji


class ContactLink(Struct):
    text: str
    href: str
    image: str


class NavBarLink(Struct):
    text: str
    href: str


class Config(Struct):
    title: str
    contact_links: List[ContactLink] = msgspec.field(name="contactLinks")
    nav_bar_links: List[NavBarLink] = msgspec.field(name="navBarLinks")


class Project(Struct):
    project_id: str = msgspec.field(name="id")
    description: str
    readme: str
    _last_updated: PyDateTime = msgspec.field(name="last_updated")

    @property
    def last_updated(self: Self) -> UTCDateTime:
        return UTCDateTime.from_py_datetime(self._last_updated)

    @property
    def title(self: Self) -> str:
        return self.readme.splitlines()[0].lstrip("# ")

    @property
    def emoji(self: Self) -> str:
        first_word = [*self.description.split(" "), ""][0]
        return first_word if is_emoji(first_word) else ""

    @property
    def description_no_emoji(self: Self) -> str:
        return (self.description).removeprefix(self.emoji)

    @property
    def contents(self: Self) -> str:
        return "\n".join(self.readme.splitlines()[1:])

    # @property
    # def should_show_on_page(self) -> bool:
    #     return self.emoji != ""


class File(Struct):
    name: str
    contents: str

    def to_bytes(self: Self) -> bytes:
        try:
            return b64decode(self.contents, validate=True)
        except (DecodeError, ValueError):
            return self.contents.encode("utf-8")


class BlogpostMetaData(Struct):
    blogpost_id: str = msgspec.field(name="id")
    title: str
    _first_posted: PyDate = msgspec.field(name="first_posted")
    _last_updated: PyDate = msgspec.field(name="last_updated")
    emoji: str
    description: str

    @property
    def first_posted(self: Self) -> Date:
        return Date.from_py_date(self._first_posted)

    @property
    def last_updated(self: Self) -> Date:
        return Date.from_py_date(self._last_updated)


class Blogpost(Struct):
    blogpost_id: str = msgspec.field(name="id")
    files: List[File]

    def _get_file_contents(self: Self, file_name: str) -> Optional[str]:
        file = first_with_default(
            (f for f in self.files if f.name == file_name), default=None
        )
        return None if file is None else file.contents

    def _get_metadata(self: Self) -> BlogpostMetaData:
        metadata_file_contents = self._get_file_contents("metadata.toml") or ""
        try:
            return msgspec.toml.decode(metadata_file_contents, type=BlogpostMetaData)
        except msgspec.DecodeError as err:
            raise ValueError(
                f"Metadata file could not be decoded: `{metadata_file_contents}`"
            ) from err

    @property
    def contents(self: Self) -> str:
        return self._get_file_contents("blogpost.html") or ""

    @property
    def title(self: Self) -> str:
        return self._get_metadata().title

    @property
    def emoji(self: Self) -> str:
        return self._get_metadata().emoji

    @property
    def last_updated(self: Self) -> Date:
        return self._get_metadata().last_updated

    @property
    def first_posted(self: Self) -> Date:
        return self._get_metadata().first_posted

    @property
    def description(self: Self) -> str:
        return self._get_metadata().description

    @property
    def repo_url(self: Self) -> str:
        return f"https://github.com/Hasnep/{self.blogpost_id}"


class Static(Struct):
    fonts: List[File]
    icons: List[File]
    scss: str


class Data(Struct):
    config: Config
    projects: List[Project]
    blogposts: List[Blogpost]
    cv: str
    static: Static

    @property
    def projects_sorted(self: Self) -> List[Project]:
        return sorted(
            get_data().projects,
            key=lambda p: p.last_updated,
            reverse=True,
        )

    @property
    def blogposts_sorted(self: Self) -> List[Blogpost]:
        return sorted(
            get_data().blogposts,
            key=lambda b: b.first_posted,
            reverse=True,
        )


@functools.cache
def get_data() -> Data:
    with DATA_FILE.open("r") as f:
        return msgspec.json.decode(f.read(), type=Data)

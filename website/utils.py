import itertools
import subprocess
from collections.abc import Iterable
from typing import TypeVar

import emoji
from whenever import Date, Instant

T = TypeVar("T")
S = TypeVar("S")


def enquote(s: str) -> str:
    return f'"{s}"'


def is_emoji(s: str) -> bool:
    return emoji.is_emoji(s)


def flatten(nested_list: list[list[T]]) -> list[T]:
    return list(itertools.chain.from_iterable(nested_list))


def first(xs: Iterable[T] | list[T]) -> T:
    return next(x for x in xs)


def first_with_default(xs: Iterable[T] | list[T], default: S) -> T | S:
    return next((x for x in xs), default)


def run_cli_command(command: list[str], *, stdin: str) -> str:
    result = subprocess.run(
        command,
        capture_output=True,
        input=stdin,
        text=True,
        check=True,
        encoding="utf-8",
    )
    return result.stdout


def date_to_datetime(d: Date) -> Instant:
    return Instant.from_utc(d.year, d.month, d.day)


def strftime(d: Instant | Date, fmt: str) -> str:
    match d:
        case Date():
            return date_to_datetime(d).py_datetime().strftime(fmt)
        case Instant():
            return d.py_datetime().strftime(fmt)

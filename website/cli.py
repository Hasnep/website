from argparse import ArgumentParser
from typing import Literal


def get_action() -> Literal["download", "build"]:
    parser = ArgumentParser()
    parser.add_argument("action", type=str, choices=["download", "build"])
    args = parser.parse_args()
    return args.action  # type: ignore[no-any-return]

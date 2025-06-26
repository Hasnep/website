from argparse import ArgumentParser
from typing import Literal, cast


def get_action() -> Literal["download", "build"]:
    parser = ArgumentParser()
    _ = parser.add_argument("action", type=str, choices=["download", "build"])
    args = parser.parse_args()
    return cast("Literal['download', 'build']", args.action)

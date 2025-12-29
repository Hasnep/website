from website.utils import run_cli_command


def compile_sass(sass: str) -> str:
    return run_cli_command(["grass", "--stdin"], stdin=sass)

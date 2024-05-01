from website.utils import run_cli_command


def to_html_str(markdown: str) -> str:
    return run_cli_command(["pandoc", "--from=markdown", "--to=html"], stdin=markdown)

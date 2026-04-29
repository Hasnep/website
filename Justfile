set dotenv-load := true

default: check build

build:
    python -m website build

watch:
    fd | entr just download --offline build

download arg:
    python -m website download {{ arg }}

check:
    prek run --all-files

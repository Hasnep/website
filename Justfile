set dotenv-load := true

default: check build

build:
    python -m website build

watch:
    fd --extension py . website | entr just build

download:
    python -m website download

check:
    pre-commit run --all-files

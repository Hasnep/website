set dotenv-load := true

default: format lint build

# Build
build:
    python -m website build

watch:
    fd --extension py . website | entr just build

download:
    python -m website download

# Format
format: ruff_fix ruff_format prettier

ruff_fix:
    ruff check --fix-only

ruff_format:
    ruff format

prettier:
    prettier --write styles.scss

# Lint
lint: ruff mypy

ruff:
    ruff check

mypy:
    mypy

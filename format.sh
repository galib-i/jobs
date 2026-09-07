#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "(1/3) Formatting frontend"
cd "$SCRIPT_DIR/frontend"
bunx oxfmt .

echo "(2/3) Linting frontend"
bunx oxlint --fix .

echo "(3/3) Formatting backend"
cd "$SCRIPT_DIR"
go fmt ./...

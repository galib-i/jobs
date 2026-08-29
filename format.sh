#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "(1/3) Formatting frontend"
cd "$SCRIPT_DIR/frontend"
bunx oxfmt .

echo "(2/2) Linting frontend"
bunx oxlint --fix .

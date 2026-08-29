#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "(1/2) Updating frontend dependencies"
cd "$SCRIPT_DIR/frontend"
bun update

echo "(2/2) Updating backend dependencies"
cd "$SCRIPT_DIR"
go get -u ./...
go mod tidy

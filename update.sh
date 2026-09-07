#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "(1/3) Updating frontend dependencies"
cd "$SCRIPT_DIR/frontend"
bun update

echo "(2/3) Updating Wails CLI"
go install github.com/wailsapp/wails/v3/cmd/wails3@latest

echo "(3/3) Updating backend dependencies"
cd "$SCRIPT_DIR"
go get -u ./...
go mod tidy


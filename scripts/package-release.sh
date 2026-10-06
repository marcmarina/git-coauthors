#!/usr/bin/env bash
# Builds a binary for every release target and packages each as an archive
# in dist/release, with a checksums.txt covering them.
set -euo pipefail

cd "$(dirname "$0")/.."

TARGETS=(linux-x64 linux-arm64 darwin-x64 darwin-arm64)

rm -rf dist/build dist/release
mkdir -p dist/release

for target in "${TARGETS[@]}"; do
  mkdir -p "dist/build/$target"
  bun build src/index.ts --compile --minify \
    --target="bun-$target" \
    --outfile "dist/build/$target/git-coauthors"

  tar -czf "dist/release/git-coauthors-$target.tar.gz" -C "dist/build/$target" git-coauthors
done

(cd dist/release && shasum -a 256 -- * > checksums.txt)

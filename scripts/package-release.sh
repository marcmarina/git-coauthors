#!/usr/bin/env bash
# Builds a binary for every release target and packages each as an archive
# in dist/release, with a checksums.txt covering them.
set -euo pipefail

cd "$(dirname "$0")/.."

TARGETS=(linux-x64 linux-arm64 darwin-x64 darwin-arm64 windows-x64)

rm -rf dist/build dist/release
mkdir -p dist/release

for target in "${TARGETS[@]}"; do
  ext=""
  [[ $target == windows-* ]] && ext=".exe"

  mkdir -p "dist/build/$target"
  bun build src/index.ts --compile --minify \
    --target="bun-$target" \
    --outfile "dist/build/$target/git-coauthors$ext"

  # tar.gz keeps the executable bit; Windows doesn't need it, so zip
  if [[ $target == windows-* ]]; then
    (cd "dist/build/$target" && zip -q "../../release/git-coauthors-$target.zip" "git-coauthors$ext")
  else
    tar -czf "dist/release/git-coauthors-$target.tar.gz" -C "dist/build/$target" git-coauthors
  fi
done

(cd dist/release && shasum -a 256 -- * > checksums.txt)

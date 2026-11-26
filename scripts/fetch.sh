#!/bin/sh
# Downloads the dump from this repo's release into data/ and checks it
set -e
cd "$(dirname "$0")/.."
mkdir -p data
f=data/kaikki.org-dictionary-English.jsonl.gz
curl -fL -o $f https://github.com/multipleof4/wordx/releases/download/dump-2026-10-30/kaikki.org-dictionary-English.jsonl.gz
echo "4d03b6cba283744756c57ff661c2c6cbfe34fcf8ff513a966576cf7d97e91a99  $f" | sha256sum -c

# wordx

English words and syllable pieces from the full English Wiktionary, for word hashes built on [SpeckHashX](https://github.com/multipleof4/SpeckHashX).

## Results

| File | What |
|---|---|
| [`results/words.txt`](../results/words.txt) | 964,588 words, one per line |
| [`results/splits.tsv`](../results/splits.tsv) | Each word and the pieces it splits into |
| [`results/pieces.txt`](../results/pieces.txt) | 400,401 pieces, one per line |

How they are made: [rules](rules.md).

## The dump

The full English dump is attached to the [`dump-2026-10-30` release](https://github.com/multipleof4/wordx/releases/tag/dump-2026-10-30):

| | |
|---|---|
| File | `kaikki.org-dictionary-English.jsonl.gz` |
| Source | [kaikki.org](https://kaikki.org/dictionary/English/), made from English Wiktionary with [wiktextract](https://github.com/tatuylonen/wiktextract) |
| Date | 2026-10-30 |
| Size | 534,186,395 bytes, 3.4 GB unpacked |
| Entries | 1,499,161, one JSON object per line |
| SHA-256 | `4d03b6cba283744756c57ff661c2c6cbfe34fcf8ff513a966576cf7d97e91a99` |

## Run

```sh
scripts/fetch.sh               # the dump, into data/
python3 scripts/words.py       # results/words.txt
uv run scripts/pieces.py       # results/splits.tsv and results/pieces.txt
bun install
bun scripts/example.mjs abc    # a 16-byte hash as pieces
```

## Wiktionary

The dump and everything in `results/` come from [Wiktionary](https://en.wiktionary.org/),
by its contributors, under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and the [GFDL](https://www.gnu.org/licenses/fdl-1.3.html).

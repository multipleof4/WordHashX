# Rules

Everything here is applied to the full English dump, in this order. The counts are what each step leaves.

## Words

[`scripts/words.py`](../scripts/words.py) writes [`results/words.txt`](../results/words.txt).

| Step | Rule | Left |
|---|---|---|
| | Entries in the dump | 1,499,161 |
| 1 | Keep one of each spelling. A noun and a verb spelled the same are one. | 1,396,111 |
| 2 | Drop by group, below. | 1,372,691 |
| 3 | Drop every spelling with a character other than `A-Z`, `a-z`, `0-9`, space or hyphen. | 1,350,920 |
| 4 | Lowercase. Spellings that differ only in case are one. | 1,316,908 |
| 5 | Drop spellings of more than 3 chunks. A chunk is what sits between spaces. | 1,296,664 |
| 6 | Drop every spelling with a space or a hyphen. | 964,588 |
| 7 | Drop words where more than half the characters are digits, like `1790s`, `90210`, `m85`. Exactly half stays, like `0s`, `14er`. | 964,166 |
| 8 | Drop demonyms and nationalities, below. | 962,218 |
| 9 | Drop plurals that are also a verb form, below. | 953,773 |

The words are sorted by character code, so digits come before letters.

### Step 2 groups

Each spelling goes into the first group that matches it:

| Order | Group | | Spellings |
|---|---|---|---|
| 1 | Has a space | kept | 321,918 |
| 2 | Starts or ends with a hyphen: prefixes and suffixes like `astro-`, `-ation` | dropped | 3,971 |
| 3 | Has a digit | kept | 2,811 |
| 4 | No Latin letter: symbols, emoji, other scripts | dropped | 570 |
| 5 | Has a non-ASCII character: accents like `rōnin`, `jötun` | dropped | 10,026 |
| 6 | Has an apostrophe | dropped | 4,670 |
| 7 | Has a hyphen | kept | 54,902 |
| 8 | Has other punctuation, like `y.o.`, `R&O` | dropped | 4,131 |
| 9 | A single letter | dropped | 52 |
| 10 | Everything else | kept | 993,060 |

### Step 8

A demonym is the word for people from a place, like `columbian`.
A spelling is dropped if any entry for it in the dump, in any letter case, is in:

| Wiktionary category | Words dropped |
|---|---|
| Any with `demonym` in its name, like Demonyms, American demonyms, British demonyms | 1,732 |
| Nationalities, like `japanese`, `polish` | 216 more |

### Step 9

A word is dropped if it ends in `s` and every meaning it has in the dump is an inflected form,
with at least one "plural of" and at least one verb form. `fusions` is the plural of fusion and the verb form in "it fusions".
All its entries count, in any letter case.

| | Words | Examples |
|---|---|---|
| Dropped: a plural that is also a verb form | 8,445 | `fusions`, `flours`, `slides` |
| Kept: only a plural | 232,687 | `corgis`, `cruets` |
| Kept: a plural with a meaning of its own | 4,257 | `glasses`, `news`, `runs` |
| Kept: a plural and another form that is not a verb form | 17 | `wives`, `countesses` |
| Kept: a plural that does not end in `s` | 9,356 | `children`, `snowmen` |

Every spelling steps 8 and 9 drop is in [`results/dropped.txt`](../results/dropped.txt). For step 8 that includes spellings with spaces.

## Pieces

[`scripts/pieces.py`](../scripts/pieces.py) writes [`results/splits.tsv`](../results/splits.tsv) and [`results/pieces.txt`](../results/pieces.txt).

1. Find each word's syllable breaks with [pyphen](https://pypi.org/project/pyphen/) 0.17.2 and its `en_US` dictionary, with its defaults.
2. Split by length:

   | Letters | Pieces |
   |---|---|
   | 1 to 6 | 1, the whole word |
   | 7 to 10 | 2 |
   | 11 or more | 3 |

3. A word with fewer syllables than that gets one piece per syllable.
4. Syllables are joined into pieces in order. Of all the ways to do that, take the one where the longest and shortest piece differ least in letters.
   On a tie, take the one whose pieces come first alphabetically.
5. Collect every different piece.
6. Leave out the pieces that are in `results/dropped.txt`, like `columbian` from `precolumbian`.
7. Sort them by character code.

| | Count |
|---|---|
| Words in 1 piece | 227,907 |
| Words in 2 pieces | 435,943 |
| Words in 3 pieces | 289,923 |
| Words with fewer pieces than their length asks for | 139,236 |
| Different pieces | 397,519 |
| Left out because steps 8 and 9 dropped them as words | 2,083 |
| **Pieces** | **395,436** |
| Pieces that are words in `words.txt` | 232,820 |
| Pieces that are not | 162,616 |

## Hashes as pieces

[`scripts/example.mjs`](../scripts/example.mjs):

1. Hash the message with SpeckHashX 1.3.0.
2. Read the hash as one big-endian number, like SpeckHashX's `base()`.
3. Write it in base 395,436. Digit `d` is line `d` of `pieces.txt`, counting from 0.
4. Pad with zeros to the fewest pieces that fit any hash of that length. A 16-byte hash is 7 pieces.

7 pieces hold 130.1 bits and a 16-byte hash has 128, so the first piece is always one of the first 88,999, up to `dirtened`.

| Message | 16-byte hash | Pieces |
|---|---|---|
| empty | `504084C9293C8BB3D52E30681BB998C9` | bearhunts · opatic · werc · lafufu · nelist · croghans · zouse |
| `abc` | `DBFECC39D9DE1F993D00A90030E89294` | cuntal · hemis · hango · goudge · rncs · discour · nages |
| `hello` | `068EAAF039F2D333D66ED87202F4DF15` | acarmi · payeth · microvas · hogreeves · prony · aconure · holopho |
| `The quick brown fox jumps over the lazy dog` | `AEB761794FEF6E658F3FF2BCE1E69D11` | chronomed · ceedest · moazagotl · namoratas · bilette · feued · kazaskers |
| `password` | `1E8870FD3081AAA958F5D19AC6475F95` | ambio · siew · drec · rainos · orbers · vaas · kulfis |
| `SpeckHashX` | `C987CABE1FFC8E4DFD46026E310AE9C8` | corran · baekdu · khonim · marzbanates · fleshlily · cholestenol · isoto |

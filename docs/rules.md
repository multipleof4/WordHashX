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
5. Collect every different piece and sort them by character code.

| | Count |
|---|---|
| Words in 1 piece | 231,915 |
| Words in 2 pieces | 441,335 |
| Words in 3 pieces | 290,916 |
| Words with fewer pieces than their length asks for | 140,608 |
| **Pieces** | **399,979** |
| Pieces that are words in `words.txt` | 237,017 |
| Pieces that are not | 162,962 |

## Hashes as pieces

[`scripts/example.mjs`](../scripts/example.mjs):

1. Hash the message with SpeckHashX 1.3.0.
2. Read the hash as one big-endian number, like SpeckHashX's `base()`.
3. Write it in base 399,979. Digit `d` is line `d` of `pieces.txt`, counting from 0.
4. Pad with zeros to the fewest pieces that fit any hash of that length. A 16-byte hash is 7 pieces.

7 pieces hold 130.3 bits and a 16-byte hash has 128, so the first piece is always one of the first 83,103, up to `decl`.

| Message | 16-byte hash | Pieces |
|---|---|---|
| empty | `504084C9293C8BB3D52E30681BB998C9` | barkha · lewis · amars · orega · seadogs · rethrom · culli |
| `abc` | `DBFECC39D9DE1F993D00A90030E89294` | cotai · atony · azlon · cothere · sidestepped · cbos · dioxa |
| `hello` | `068EAAF039F2D333D66ED87202F4DF15` | abver · palmistries · phinal · utiliza · culios · cives · stemon |
| `The quick brown fox jumps over the lazy dog` | `AEB761794FEF6E658F3FF2BCE1E69D11` | charly · mosquitoish · skype · zafar · yawper · bouknight · cottam |
| `password` | `1E8870FD3081AAA958F5D19AC6475F95` | alou · parashot · longo · planters · hogle · stalgic · teebs |
| `SpeckHashX` | `C987CABE1FFC8E4DFD46026E310AE9C8` | clopaedist · willigob · turest · merlys · gonged · coryphoids · mumweight |

# wordx-k

wordx-k is a hash made of k pieces from [`results/pieces.txt`](../results/pieces.txt), for k from 1 to 64.
The site in [`site/`](../site) computes it with [`site/src/wordx.js`](../site/src/wordx.js).

## How

With N = 399,225, the number of lines in `pieces.txt`:

1. Take the fewest bytes n with 256<sup>n</sup> ≥ N<sup>k</sup> · 2<sup>128</sup>.
2. Hash the message with SpeckHashX 1.3.0 to n bytes, read big-endian as one number.
3. Take its remainder after dividing by N<sup>k</sup>.
4. Write the remainder in base N as k digits, most significant first. Digit `d` is line `d` of `pieces.txt`, counting from 0.
5. Capitalize the first letter of each piece and join them with nothing between.

Step 1 asks for 128 bits more than the k pieces hold, so every piece is equally likely in every position.
Every k asks SpeckHashX for a different length, so wordx-4 and wordx-5 of the same message are unrelated.

## Security

| | Bits | Bytes asked of SpeckHashX | Tries to find two messages with the same hash | Tries to find a message for a given hash |
|---|---|---|---|---|
| wordx-1 | 18.6 | 19 | 2<sup>9.3</sup> | 2<sup>18.6</sup> |
| wordx-2 | 37.2 | 21 | 2<sup>18.6</sup> | 2<sup>37.2</sup> |
| wordx-3 | 55.8 | 23 | 2<sup>27.9</sup> | 2<sup>55.8</sup> |
| wordx-4 | 74.4 | 26 | 2<sup>37.2</sup> | 2<sup>74.4</sup> |
| wordx-5 | 93.0 | 28 | 2<sup>46.5</sup> | 2<sup>93</sup> |
| wordx-6 | 111.6 | 30 | 2<sup>55.8</sup> | 2<sup>111.6</sup> |
| wordx-7 | 130.2 | 33 | 2<sup>65.1</sup> | 2<sup>130.2</sup> |
| wordx-8 | 148.8 | 35 | 2<sup>74.4</sup> | 2<sup>148.8</sup> |
| wordx-9 | 167.4 | 37 | 2<sup>83.7</sup> | 2<sup>167.4</sup> |
| wordx-10 | 186.0 | 40 | 2<sup>93</sup> | 2<sup>186</sup> |
| wordx-11 | 204.6 | 42 | 2<sup>102.3</sup> | 2<sup>204.6</sup> |
| wordx-12 | 223.2 | 44 | 2<sup>111.6</sup> | 2<sup>223.2</sup> |
| wordx-13 | 241.8 | 47 | 2<sup>120.9</sup> | 2<sup>241.8</sup> |
| wordx-14 | 260.4 | 49 | 2<sup>128</sup> | 2<sup>256</sup> |
| wordx-20 | 372.1 | 63 | 2<sup>128</sup> | 2<sup>256</sup> |
| wordx-32 | 595.4 | 91 | 2<sup>128</sup> | 2<sup>256</sup> |
| wordx-64 | 1190.8 | 165 | 2<sup>128</sup> | 2<sup>256</sup> |

Each piece adds 18.6 bits. The tries are half the bits and all the bits, up to SpeckHashX's limits:
it keeps 32 bytes inside, so from wordx-14 on security stays at 2<sup>128</sup> and 2<sup>256</sup>
([why](https://github.com/multipleof4/SpeckHashX/blob/main/docs/output-length.md)).
Numbers are rounded down to one decimal.

## Test vectors

| Message | k | wordx-k |
|---|---|---|
| empty | 1 | `Drollest` |
| empty | 4 | `FondlingsEnraMonolFilesi` |
| `abc` | 1 | `Qandilite` |
| `abc` | 2 | `PosauridsJcr` |
| `abc` | 4 | `GrassquitSamaresNixineWetzes` |
| `abc` | 13 | `LuctSlotaUcsbMilimeBundleTolisTaglishGergeDieselizedKilloffTacubesAssoilPrys` |
| `abc` | 14 | `DecimaThoughtKlokansMarsaAntireaSkuzzyDocblocksPanolytMogonPetrinizeMestomeKanatQuisatesCarangi` |
| `hello` | 1 | `Fusions` |
| `hello` | 4 | `HaisToyucMavenBasilide` |
| `The quick brown fox jumps over the lazy dog` | 4 | `MtasesKeizerVolaemicUtties` |

These match an independent Python version of the steps above for k from 1 to 64.

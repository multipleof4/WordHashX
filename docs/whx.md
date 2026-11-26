# WHX-k

WHX-k is a hash made of k pieces from [`results/pieces.txt`](../results/pieces.txt), for k from 1 to 64.
The site in [`site/`](../site) computes it with [`site/src/whx.js`](../site/src/whx.js).

## How

With N = 395,436, the number of lines in `pieces.txt`:

1. Take the fewest bytes n with 256<sup>n</sup> ≥ N<sup>k</sup> · 2<sup>128</sup>.
2. Hash the message with SpeckHashX 1.3.0 to n bytes, read big-endian as one number.
3. Take its remainder after dividing by N<sup>k</sup>.
4. Write the remainder in base N as k digits, most significant first. Digit `d` is line `d` of `pieces.txt`, counting from 0.
5. Capitalize the first letter of each piece and join them with nothing between.

Step 1 asks for 128 bits more than the k pieces hold, so every piece is equally likely in every position.
Every k asks SpeckHashX for a different length, so WHX-4 and WHX-5 of the same message are unrelated.

## Security

| | Bits | Bytes asked of SpeckHashX | Tries to find two messages with the same hash | Tries to find a message for a given hash |
|---|---|---|---|---|
| WHX-1 | 18.5 | 19 | 2<sup>9.2</sup> | 2<sup>18.5</sup> |
| WHX-2 | 37.1 | 21 | 2<sup>18.5</sup> | 2<sup>37.1</sup> |
| WHX-3 | 55.7 | 23 | 2<sup>27.8</sup> | 2<sup>55.7</sup> |
| WHX-4 | 74.3 | 26 | 2<sup>37.1</sup> | 2<sup>74.3</sup> |
| WHX-5 | 92.9 | 28 | 2<sup>46.4</sup> | 2<sup>92.9</sup> |
| WHX-6 | 111.5 | 30 | 2<sup>55.7</sup> | 2<sup>111.5</sup> |
| WHX-7 | 130.1 | 33 | 2<sup>65</sup> | 2<sup>130.1</sup> |
| WHX-8 | 148.7 | 35 | 2<sup>74.3</sup> | 2<sup>148.7</sup> |
| WHX-9 | 167.3 | 37 | 2<sup>83.6</sup> | 2<sup>167.3</sup> |
| WHX-10 | 185.9 | 40 | 2<sup>92.9</sup> | 2<sup>185.9</sup> |
| WHX-11 | 204.5 | 42 | 2<sup>102.2</sup> | 2<sup>204.5</sup> |
| WHX-12 | 223.1 | 44 | 2<sup>111.5</sup> | 2<sup>223.1</sup> |
| WHX-13 | 241.7 | 47 | 2<sup>120.8</sup> | 2<sup>241.7</sup> |
| WHX-14 | 260.3 | 49 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-20 | 371.8 | 63 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-32 | 594.9 | 91 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-64 | 1189.9 | 165 | 2<sup>128</sup> | 2<sup>256</sup> |

Each piece adds 18.5 bits. The tries are half the bits and all the bits, up to SpeckHashX's limits:
it keeps 32 bytes inside, so from WHX-14 on security stays at 2<sup>128</sup> and 2<sup>256</sup>
([why](https://github.com/multipleof4/SpeckHashX/blob/main/docs/output-length.md)).
Numbers are rounded down to one decimal.

## Test vectors

| Message | k | WHX-k |
|---|---|---|
| empty | 1 | `Lieship` |
| empty | 4 | `CropepWoodroachTaisNewbz` |
| `abc` | 1 | `Ypakoes` |
| `abc` | 2 | `StahlhelmersTeuchats` |
| `abc` | 4 | `MustaphaSerterWisticCabell` |
| `abc` | 13 | `TicallNdaGohmsSistaphyliaOxylithCellinoAucheLaddiePtisanMacroparaTaxyLoweensWellies` |
| `abc` | 14 | `PaytableMalmesPonianSlayedCmiNonbronAbajLofsDjinnyOlanidHimicPaleotemGulusNo` |
| `hello` | 1 | `Antigone` |
| `hello` | 4 | `BcsEuseLimicoFumary` |
| `The quick brown fox jumps over the lazy dog` | 4 | `ThymothOleuDrocopMixolimnion` |

These match an independent Python version of the steps above for k from 1 to 64.

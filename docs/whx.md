# WHX-k

WHX-k is a hash made of k pieces from [`results/pieces.txt`](../results/pieces.txt), for k from 1 to 64.
The site in [`site/`](../site) computes it with [`site/src/whx.js`](../site/src/whx.js).

## How

With N = 316,806, the number of lines in `pieces.txt`:

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
| WHX-1 | 18.2 | 19 | 2<sup>9.1</sup> | 2<sup>18.2</sup> |
| WHX-2 | 36.5 | 21 | 2<sup>18.2</sup> | 2<sup>36.5</sup> |
| WHX-3 | 54.8 | 23 | 2<sup>27.4</sup> | 2<sup>54.8</sup> |
| WHX-4 | 73.0 | 26 | 2<sup>36.5</sup> | 2<sup>73</sup> |
| WHX-5 | 91.3 | 28 | 2<sup>45.6</sup> | 2<sup>91.3</sup> |
| WHX-6 | 109.6 | 30 | 2<sup>54.8</sup> | 2<sup>109.6</sup> |
| WHX-7 | 127.9 | 32 | 2<sup>63.9</sup> | 2<sup>127.9</sup> |
| WHX-8 | 146.1 | 35 | 2<sup>73</sup> | 2<sup>146.1</sup> |
| WHX-9 | 164.4 | 37 | 2<sup>82.2</sup> | 2<sup>164.4</sup> |
| WHX-10 | 182.7 | 39 | 2<sup>91.3</sup> | 2<sup>182.7</sup> |
| WHX-11 | 201.0 | 42 | 2<sup>100.5</sup> | 2<sup>201</sup> |
| WHX-12 | 219.2 | 44 | 2<sup>109.6</sup> | 2<sup>219.2</sup> |
| WHX-13 | 237.5 | 46 | 2<sup>118.7</sup> | 2<sup>237.5</sup> |
| WHX-14 | 255.8 | 48 | 2<sup>127.9</sup> | 2<sup>255.8</sup> |
| WHX-15 | 274.0 | 51 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-20 | 365.4 | 62 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-32 | 584.7 | 90 | 2<sup>128</sup> | 2<sup>256</sup> |
| WHX-64 | 1169.4 | 163 | 2<sup>128</sup> | 2<sup>256</sup> |

Each piece adds 18.2 bits. The tries are half the bits and all the bits, up to SpeckHashX's limits:
it keeps 32 bytes inside, so from WHX-15 on security stays at 2<sup>128</sup> and 2<sup>256</sup>
([why](https://github.com/multipleof4/SpeckHashX/blob/main/docs/output-length.md)).
Numbers are rounded down to one decimal.

## Test vectors

| Message | k | WHX-k |
|---|---|---|
| empty | 1 | `Doaethal` |
| empty | 4 | `ToplinNishgaSewistSyngene` |
| `abc` | 1 | `Chegre` |
| `abc` | 2 | `AntigenMenses` |
| `abc` | 4 | `TrootEndazSuturalOynoun` |
| `abc` | 14 | `BometalDilaSpikegrassCgdSerosortRinizedChangeantCruxHandweavTrochromicLagoonRentlyCrovesiZhrit` |
| `abc` | 15 | `PadayOberryTorquIndaWakespanPokZebraWhameKagokItoxCosateDragliftUsuringSicatCurrey` |
| `hello` | 1 | `Phibic` |
| `hello` | 4 | `JodhsPurieChhabraLiometer` |
| `The quick brown fox jumps over the lazy dog` | 4 | `SpikiSniDarnumHwabyeong` |

These match an independent Python version of the steps above for k from 1 to 64.

# WordHashX

Hashes made of word pieces from the full English Wiktionary, built on [SpeckHashX](https://www.npmjs.com/package/speckhashx).
Try it at [wordhashx.pages.dev](https://wordhashx.pages.dev).

> **Beta.** Outputs are subject to change.

## Use

`npm i wordhashx@beta` (works in Node, Bun and browsers):

```js
import { whx, pieces } from 'wordhashx'

whx('abc', 4)     // 'FojtikRoynishElismsExpugn'
pieces('abc', 4)  // ['fojtik', 'roynish', 'elisms', 'expugn']
whx('abc', 1)     // 'Vpirna'
whx(bytes, 14)    // 14 pieces
```

The number is k, how many pieces the hash has, from 1 to 64. That hash is called WHX-k.
Each k is its own hash: WHX-4 and WHX-5 of the same message are unrelated.

Strings are hashed as UTF-8, and an `ArrayBuffer`, typed array or `DataView` as its bytes.

## Security

Each piece adds 18.5 bits. Security stops growing at WHX-14, where SpeckHashX's 32 bytes of state are the limit.

| | Bits | Tries to find two messages with the same hash | Tries to find a message for a given hash |
|---|---|---|---|
| WHX-1 | 18.5 | 2<sup>9.2</sup> | 2<sup>18.5</sup> |
| WHX-4 | 74.3 | 2<sup>37.1</sup> | 2<sup>74.3</sup> |
| WHX-7 | 130.1 | 2<sup>65</sup> | 2<sup>130.1</sup> |
| WHX-10 | 185.8 | 2<sup>92.9</sup> | 2<sup>185.8</sup> |
| WHX-13 | 241.6 | 2<sup>120.8</sup> | 2<sup>241.6</sup> |
| WHX-14 to 64 | 260.2 and up | 2<sup>128</sup> | 2<sup>256</sup> |

How it works, every k and test vectors: [docs/whx.md](https://github.com/multipleof4/WordHashX/blob/main/docs/whx.md).

## Wiktionary

The 394,548 pieces come from [Wiktionary](https://en.wiktionary.org/), by its contributors,
under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) and the [GFDL](https://www.gnu.org/licenses/fdl-1.3.html).
How they are made: [rules](https://github.com/multipleof4/WordHashX/blob/main/docs/rules.md).

import { shx } from 'speckhashx'
import list from './pieces.js'

// The pieces in order: digit d of a hash is piece d.
const P = list.split('\n'), N = BigInt(P.length)

// Bytes to ask SpeckHashX for k pieces: the fewest n with 256^n >= N^k * 2^128.
const bytes = k => {
  const t = N ** BigInt(k) << 128n
  let n = 0
  while (1n << BigInt(8 * n) < t) n++
  return n
}

// The k pieces of WHX-k of d, lowercase, in order.
export const pieces = (d, k) => {
  if (!Number.isInteger(k) || k < 1 || k > 64) throw RangeError('k must be an integer from 1 to 64')
  const o = []
  let x = BigInt('0x' + shx(d, bytes(k)).hex()) % N ** BigInt(k)
  while (k--) o.unshift(P[Number(x % N)]), x /= N
  return o
}

// WHX-k of d: its pieces, each capitalized, joined.
export const whx = (d, k) => pieces(d, k).map(p => p[0].toUpperCase() + p.slice(1)).join('')

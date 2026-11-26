import { shx } from 'speckhashx'

// Bytes to ask SHX for k pieces from a list of N: the fewest n with 256^n >= N^k * 2^128 (docs/whx.md).
export const bytes = (N, k) => {
  const t = BigInt(N) ** BigInt(k) << 128n
  let n = 0
  while (1n << BigInt(8 * n) < t) n++
  return n
}

// WHX-k of a message: k pieces from the list P.
export const whx = (P, m, k) => {
  const N = BigInt(P.length), o = []
  let x = BigInt('0x' + shx(m, bytes(P.length, k)).hex()) % N ** BigInt(k)
  while (k--) o.unshift(P[Number(x % N)]), x /= N
  return o
}

export const cap = p => p[0].toUpperCase() + p.slice(1)
export const join = o => o.map(cap).join('')

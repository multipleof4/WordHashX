// Writes SpeckHashX hashes as pieces from results/pieces.txt: bun scripts/example.mjs [message ...]
import { shx } from 'speckhashx'
import { readFileSync } from 'node:fs'
const P = readFileSync(new URL('../results/pieces.txt', import.meta.url), 'utf8').split('\n').slice(0, -1)
const N = BigInt(P.length)
const pieces = (m, n = 16) => {
  let x = BigInt('0x' + shx(m, n).hex()), k = 0, o = []
  for (let c = 1n; c < 256n ** BigInt(n); c *= N) k++
  while (k--) o.unshift(P[Number(x % N)]), x /= N
  return o
}
const M = process.argv.slice(2)
for (const m of M.length ? M : ['', 'abc', 'hello', 'The quick brown fox jumps over the lazy dog', 'password', 'SpeckHashX'])
  console.log(`${JSON.stringify(m)}\n  ${shx(m, 16).hex()}\n  ${pieces(m).join(' · ')}`)

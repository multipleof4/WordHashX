import { expect, test } from 'bun:test'
import { whx, pieces } from './index.js'
import list from './pieces.js'

// The test vectors in docs/whx.md, which match an independent Python version.
test('known answers', () => {
  expect(whx('', 1)).toBe('Dophoric')
  expect(whx('', 4)).toBe('CheeseryDreamtHeidMndy')
  expect(whx('abc', 1)).toBe('Vpirna')
  expect(whx('abc', 2)).toBe('TwixesRke')
  expect(whx('abc', 4)).toBe('FojtikRoynishElismsExpugn')
  expect(whx('abc', 13)).toBe('ComforEmbugZhongLicorePeapodsBianoQuasisynLawfulChildlySatyrePaytasPentaethyBelgud')
  expect(whx('abc', 14)).toBe('HornosScrubCleopaSsadPhysiolEarizesGabaysNonequipoNarayaniAghulProtibElytiRyperHumphris')
  expect(whx('hello', 1)).toBe('Narvi')
  expect(whx('hello', 4)).toBe('HollaTherethroughIgenicSurlily')
  expect(whx('The quick brown fox jumps over the lazy dog', 4)).toBe('ChodontsShmucksYeggPhameric')
})

test('pieces are the lowercase parts of whx', () => {
  const P = new Set(list.split('\n'))
  for (let k = 1; k <= 64; k++) {
    const o = pieces('abc', k)
    expect(o.length).toBe(k)
    expect(o.every(p => P.has(p))).toBe(true)
    expect(o.map(p => p[0].toUpperCase() + p.slice(1)).join('')).toBe(whx('abc', k))
  }
})

test('bytes hash the same as the string', () => {
  const b = new TextEncoder().encode('hello')
  expect(whx(b, 4)).toBe(whx('hello', 4))
  expect(whx(b.buffer, 4)).toBe(whx('hello', 4))
  expect(whx(new DataView(b.buffer), 4)).toBe(whx('hello', 4))
})

test('k must be an integer from 1 to 64', () => {
  for (const k of [0, 65, 1.5, -1, NaN, '4', undefined]) expect(() => whx('abc', k)).toThrow(RangeError)
  expect(() => whx(42, 4)).toThrow(TypeError)
})

/** A string is hashed as UTF-8; a buffer, typed array or DataView as its bytes. Anything else throws. */
type Data = string | ArrayBuffer | ArrayBufferView

/** WHX-k of `d`: k pieces, each capitalized, joined. `k` is an integer from 1 to 64. */
export function whx(d: Data, k: number): string

/** The k pieces of WHX-k of `d`, lowercase, in order. `k` is an integer from 1 to 64. */
export function pieces(d: Data, k: number): string[]

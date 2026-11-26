import { whx, cap, join } from './whx.js'
import url from '../../results/pieces.txt?url'
import './style.css'

const $ = id => document.getElementById(id)
const [msg, k, name, out, copy, note] = ['msg', 'k', 'name', 'out', 'copy', 'cap'].map($)
let P, text = ''

// 2^e with one decimal, rounded down so it never overstates, plus the plain number while it is small.
const pow = e => {
  const f = Math.floor(e * 10) / 10
  return `2<sup>${f % 1 ? f.toFixed(1) : f}</sup>${e < 50 ? ` <i>about ${Math.round(2 ** e).toLocaleString('en')}</i>` : ''}`
}

const show = () => {
  const n = +k.value
  name.textContent = `WHX-${n}`
  if (!P) return
  // top: the first count whose pieces hold 256 bits, where SpeckHashX's 32 bytes of state cap the security.
  const o = whx(P, msg.value, n), L = Math.log2(P.length), b = n * L, top = Math.ceil(256 / L)
  text = join(o)
  // A <wbr> between pieces lets long hashes wrap between pieces, not inside one.
  out.replaceChildren(...o.flatMap((p, i) => [...(i ? [document.createElement('wbr')] : []), Object.assign(document.createElement('span'), { textContent: cap(p) })]))
  $('bits').textContent = (Math.floor(b * 10) / 10).toFixed(1)
  $('col').innerHTML = pow(Math.min(b / 2, 128))
  $('pre').innerHTML = pow(Math.min(b, 256))
  $('top').textContent = `WHX-${top}`
  note.hidden = n < top
}

const step = d => (k.value = +k.value + d, show())
$('less').onclick = () => step(-1)
$('more').onclick = () => step(1)
msg.oninput = k.oninput = show
copy.onclick = async () => {
  await navigator.clipboard.writeText(text)
  copy.textContent = 'Copied'
  setTimeout(() => copy.textContent = 'Copy', 1200)
}

show()
P = (await (await fetch(url)).text()).split('\n').slice(0, -1)
show()

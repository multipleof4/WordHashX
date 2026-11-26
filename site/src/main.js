import './style.css'

const $ = id => document.getElementById(id)
const [msg, k, name, out, copy, note] = ['msg', 'k', 'name', 'out', 'copy', 'cap'].map($)
// W is the wordhashx package and N its number of pieces, both loaded after the page shows.
let W, N, text = ''
const cap = p => p[0].toUpperCase() + p.slice(1)

// 2^e with one decimal, rounded down so it never overstates, plus the plain number while it is small.
const pow = e => {
  const f = Math.floor(e * 10) / 10
  return `2<sup>${f % 1 ? f.toFixed(1) : f}</sup>${e < 50 ? ` <i>about ${Math.round(2 ** e).toLocaleString('en')}</i>` : ''}`
}

const show = () => {
  const n = +k.value
  name.textContent = `WHX-${n}`
  if (!W) return
  // top: the first count whose pieces hold 256 bits, where SpeckHashX's 32 bytes of state cap the security.
  const o = W.pieces(msg.value, n), L = Math.log2(N), b = n * L, top = Math.ceil(256 / L)
  text = o.map(cap).join('')
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

// The beta sticker opens a note; clicking it again, anywhere else, or Escape closes it.
const beta = $('beta'), betanote = $('betanote')
const open = v => (betanote.hidden = !v, beta.setAttribute('aria-expanded', v))
beta.onclick = e => (e.stopPropagation(), open(betanote.hidden))
document.addEventListener('click', e => e.target !== betanote && open(false))
document.addEventListener('keydown', e => e.key === 'Escape' && open(false))

show()
// The package's own list, one piece per line, for the bits per piece.
const [w, { default: list }] = await Promise.all([import('wordhashx'), import('wordhashx/pieces.js')])
N = 1
for (let i = -1; (i = list.indexOf('\n', i + 1)) >= 0;) N++
W = w
show()

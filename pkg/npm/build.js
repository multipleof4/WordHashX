// Writes pieces.js: results/pieces.txt as one string, a piece per line.
const r = `${import.meta.dir}/../..`, t = await Bun.file(`${r}/results/pieces.txt`).text()
if (!/^([a-z0-9]+\n)+$/.test(t)) throw Error('pieces.txt must be lines of a-z and 0-9')
await Bun.write(`${import.meta.dir}/pieces.js`, `export default \`${t.slice(0, -1)}\`\n`)
console.log(`pieces: ${t.split('\n').length - 1}`)

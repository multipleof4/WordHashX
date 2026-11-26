// The site reads ../results/pieces.txt, so the dev server may serve the repo root.
export default { server: { fs: { allow: ['..'] } } }

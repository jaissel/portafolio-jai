// Genera subsets woff2 de las fuentes del sitio en public/fonts (los sirve @nuxt/fonts con provider 'local',
// que además calcula las métricas de fallback para no tener CLS).
// Cubre español e inglés: Latin básico, Latin-1 y la tipografía usada en el contenido (comillas, guiones, flechas…).
// Uso: pnpm fonts  (también corre dentro de pnpm assets)
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import subsetFont from 'subset-font'

const range = (from, to) =>
  Array.from({ length: to - from + 1 }, (_, i) => String.fromCodePoint(from + i)).join('')
const TEXT = range(0x20, 0x7e) + range(0xa0, 0xff) + '‘’‚“”„–—…•−→←↑↓●◆♡€'

// [salida, origen en node_modules, opciones extra]
const fonts = [
  [
    'bricolage-grotesque-800-normal',
    '@fontsource/bricolage-grotesque/files/bricolage-grotesque-latin-800-normal',
  ],
  // Variables recortadas al rango de pesos usado: un archivo en vez de varios estáticos
  [
    'dm-sans-400-700-normal',
    '@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal',
    { variationAxes: { wght: { min: 400, max: 700 } } },
  ],
  [
    'jetbrains-mono-400-600-normal',
    '@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal',
    { variationAxes: { wght: { min: 400, max: 600 } } },
  ],
  // Caveat solo se usa en frases cortas: sin alternativas contextuales pesa la mitad (50 → 24 KB)
  ['caveat-600-normal', '@fontsource/caveat/files/caveat-latin-600-normal', { noLayoutClosure: true }],
]

rmSync('public/fonts', { recursive: true, force: true })
mkdirSync('public/fonts', { recursive: true })
for (const [name, from, options = {}] of fonts) {
  const src = readFileSync(`node_modules/${from}.woff2`)
  const out = await subsetFont(src, TEXT, { targetFormat: 'woff2', ...options })
  writeFileSync(`public/fonts/${name}.woff2`, out)
  console.log(
    `public/fonts/${name}.woff2`,
    `${(src.length / 1024).toFixed(1)} → ${(out.length / 1024).toFixed(1)} KB`,
  )
}

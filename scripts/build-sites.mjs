// Capturas de "Sitios en producción": design/sites/<slug>.png → public/sites/<slug>-<ancho>.{avif,webp} (16:10).
// Uso: pnpm sites  (también corre dentro de pnpm assets)
import { mkdirSync, readdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'design/sites'
const OUT = 'public/sites'
const widths = [480, 800]
mkdirSync(OUT, { recursive: true })

for (const file of readdirSync(SRC).filter((f) => f.endsWith('.png'))) {
  const slug = file.replace(/\.png$/, '')
  for (const w of widths) {
    const img = sharp(`${SRC}/${file}`).resize(w, Math.round(w * 0.625), { fit: 'cover', position: 'top' })
    await img.clone().avif({ quality: 55, effort: 9 }).toFile(`${OUT}/${slug}-${w}.avif`)
    await img.clone().webp({ quality: 74, effort: 6 }).toFile(`${OUT}/${slug}-${w}.webp`)
  }
  console.log(`${OUT}/${slug}-{${widths.join(',')}}.{avif,webp}`)
}

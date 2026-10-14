// Genera los avatares optimizados en public/avatars a partir de design/avatars.
// Uso: pnpm assets  (requiere ffmpeg en el PATH para el video del chat)
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import sharp from 'sharp'

const SRC = 'design/avatars'
const OUT = 'public/avatars'
mkdirSync(OUT, { recursive: true })

const stills = ['avatar-code', 'avatar-peace']
const widths = [480, 640, 960]

for (const name of stills) {
  for (const w of widths) {
    const img = sharp(`${SRC}/${name}.jpg`).resize(w, w)
    await img.clone().avif({ quality: 55, effort: 9 }).toFile(`${OUT}/${name}-${w}.avif`)
    await img.clone().webp({ quality: 72, effort: 6 }).toFile(`${OUT}/${name}-${w}.webp`)
  }
}

// Avatar con fondo blanco para el JSON-LD (Person.image)
await sharp(`${SRC}/avatar-white.jpg`)
  .resize(512, 512)
  .jpeg({ quality: 80, mozjpeg: true })
  .toFile(`${OUT}/avatar-white-512.jpg`)

// Favicon y apple-touch-icon desde la versión con fondo blanco
await sharp(`${SRC}/avatar-white.jpg`).resize(64, 64).png().toFile('public/favicon.png')
await sharp(`${SRC}/avatar-white.jpg`).resize(180, 180).png().toFile('public/apple-touch-icon.png')

// GIF del chat (2,8 MB) → video cuadrado 176 px (88 px @2x) + poster
const gif = `${SRC}/avatar-wink.gif`
const crop = 'crop=360:360:(iw-360)/2:0,scale=176:176:flags=lanczos'
const ff = (args) => execFileSync('ffmpeg', ['-y', '-loglevel', 'error', ...args], { stdio: 'inherit' })
ff([
  '-i',
  gif,
  '-vf',
  `${crop},format=yuv420p`,
  '-an',
  '-c:v',
  'libvpx-vp9',
  '-b:v',
  '0',
  '-crf',
  '38',
  '-row-mt',
  '1',
  `${OUT}/avatar-wink.webm`,
])
ff([
  '-i',
  gif,
  '-vf',
  `${crop},format=yuv420p`,
  '-an',
  '-c:v',
  'libx264',
  '-crf',
  '28',
  '-preset',
  'veryslow',
  '-movflags',
  '+faststart',
  `${OUT}/avatar-wink.mp4`,
])
await sharp(gif, { pages: 1 })
  .extract({ left: 140, top: 0, width: 360, height: 360 })
  .resize(176, 176)
  .webp({ quality: 75 })
  .toFile(`${OUT}/avatar-wink-poster.webp`)

console.log('Avatares generados en', OUT)

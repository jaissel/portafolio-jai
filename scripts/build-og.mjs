// Genera public/og/og-{es,en}.png (1200×630) desde el contenido seed y el avatar con fondo blanco.
// Uso: pnpm og  (también corre dentro de pnpm assets)
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { Resvg } from '@resvg/resvg-js'
import satori from 'satori'
import sharp from 'sharp'

const font = (pkg, file) => readFileSync(`node_modules/@fontsource/${pkg}/files/${file}`)
const fonts = [
  {
    name: 'Bricolage',
    data: font('bricolage-grotesque', 'bricolage-grotesque-latin-800-normal.woff'),
    weight: 800,
  },
  { name: 'DM Sans', data: font('dm-sans', 'dm-sans-latin-500-normal.woff'), weight: 500 },
  { name: 'DM Sans', data: font('dm-sans', 'dm-sans-latin-700-normal.woff'), weight: 700 },
  { name: 'Caveat', data: font('caveat', 'caveat-latin-600-normal.woff'), weight: 600 },
]

const avatar = await sharp('design/avatars/avatar-white.jpg')
  .resize(760, 760)
  .jpeg({ quality: 82 })
  .toBuffer()
const avatarSrc = `data:image/jpeg;base64,${avatar.toString('base64')}`

const C = {
  bg: '#FFF4EA',
  accent: '#D9430F',
  ink: '#B83A0C',
  pink: '#E0457B',
  peach: '#FFE3D3',
  text: '#3A1A0E',
}
const h = (type, style, children) => ({ type, props: { style, children } })

function card(c) {
  const [name, ...tld] = c.ui.logo.split('.')
  // satori no aplica border-box: el tamaño interno + padding suman 1200×630
  return h(
    'div',
    {
      width: 1072,
      height: 518,
      display: 'flex',
      background: C.bg,
      padding: '56px 64px',
      fontFamily: 'DM Sans',
    },
    [
      h('div', { display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: 690 }, [
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { display: 'flex', fontFamily: 'Bricolage', fontSize: 34, color: C.accent }, [
            name,
            h('span', { color: C.pink }, '.'),
            tld.join('.'),
          ]),
          h(
            'div',
            {
              display: 'flex',
              flexDirection: 'column',
              marginTop: 34,
              fontFamily: 'Bricolage',
              fontSize: 86,
              lineHeight: 0.92,
              letterSpacing: '-0.02em',
              color: C.accent,
            },
            c.hero.title.split('\n').map((line) => h('div', { display: 'flex' }, line)),
          ),
          h(
            'div',
            { display: 'flex', fontFamily: 'Caveat', fontSize: 66, color: C.pink, marginTop: 4 },
            c.hero.script,
          ),
        ]),
        h('div', { display: 'flex', flexDirection: 'column' }, [
          h('div', { display: 'flex', fontSize: 34, fontWeight: 700, color: C.text }, c.profile.name),
          h('div', { display: 'flex', fontSize: 24, color: C.ink, marginTop: 4 }, c.profile.jobTitle),
        ]),
      ]),
      h('div', { display: 'flex', position: 'relative', width: 380, height: 518, marginLeft: 'auto' }, [
        h('div', {
          position: 'absolute',
          right: 0,
          top: 0,
          width: 360,
          height: 518,
          background: C.accent,
          borderRadius: '190px 190px 32px 32px',
        }),
        {
          type: 'img',
          props: {
            src: avatarSrc,
            width: 300,
            height: 440,
            style: {
              position: 'absolute',
              right: 30,
              top: 48,
              width: 300,
              height: 440,
              objectFit: 'cover',
              borderRadius: '150px 150px 24px 24px',
            },
          },
        },
      ]),
    ],
  )
}

mkdirSync('public/og', { recursive: true })
for (const locale of ['es', 'en']) {
  const c = JSON.parse(readFileSync(`content/seed.${locale}.json`, 'utf8'))
  const svg = await satori(card(c), { width: 1200, height: 630, fonts })
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng()
  const out = await sharp(png).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer()
  writeFileSync(`public/og/og-${locale}.png`, out)
  console.log(`public/og/og-${locale}.png`, `${Math.round(out.length / 1024)} KB`)
}

// Carga content/seed.{es,en}.json en la tabla `content` de D1.
// Uso: pnpm db:seed (local) | pnpm db:seed:remote
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

const target = process.argv.includes('--remote') ? '--remote' : '--local'
const now = Date.now()
const q = (s) => `'${s.replaceAll("'", "''")}'`

const rows = []
for (const locale of ['es', 'en']) {
  const seed = JSON.parse(readFileSync(`content/seed.${locale}.json`, 'utf8'))
  for (const [section, data] of Object.entries(seed)) {
    rows.push(
      `INSERT INTO content (locale, section, data, updated_at) VALUES (${q(locale)}, ${q(section)}, ${q(JSON.stringify(data))}, ${now})
ON CONFLICT(locale, section) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at;`,
    )
  }
}

mkdirSync('.wrangler', { recursive: true })
const file = '.wrangler/seed.sql'
writeFileSync(file, rows.join('\n'))
execFileSync('pnpm', ['exec', 'wrangler', 'd1', 'execute', 'jai-portfolio', target, `--file=${file}`], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
})
console.log(`Seed cargado (${rows.length} filas, ${target.slice(2)})`)

// /llms.txt (https://llmstxt.org) generado desde el mismo contenido del sitio, en inglés con la sección en español.
const oneLine = (s: string) => s.replace(/\s*\n\s*/g, ' ').trim()

function section(c: SiteContent, locale: Locale, siteUrl: string) {
  const lines = [
    `- [${c.seo.title}](${siteUrl}/${locale}): ${c.seo.description}`,
    `- [CV (PDF)](${siteUrl}${c.hero.cvUrl})`,
    '',
    `### ${oneLine(c.about.title)}`,
    '',
    c.hero.body,
    '',
    c.about.body,
    '',
    ...c.services.map((s) => `- **${s.title}:** ${s.body}`),
    '',
    `### ${oneLine(c.projects.title)}`,
    '',
    ...c.projects.items.map(
      (p) =>
        `- **${p.title}** (${p.tag}) — ${p.metric} ${p.metricLabel}. ${p.body} Stack: ${p.stack.join(', ')}.`,
    ),
    '',
    `### ${oneLine(c.stack.title)}`,
    '',
    ...c.stack.layers.map((l) => `- ${l.name}: ${l.items.join(', ')}`),
    '',
    ...c.stats.map((s) => `- ${s.value} ${oneLine(s.label)}`),
    '',
    '### FAQ',
    '',
    ...c.ask.faq.map((f) => `- **${f.q}** ${f.a}`),
  ]
  return lines.join('\n')
}

export default defineEventHandler(async (event) => {
  const { siteUrl } = useRuntimeConfig(event).public
  const [en, es] = await Promise.all([getSiteContent(event, 'en'), getSiteContent(event, 'es')])
  const contact = [`- Email: ${en.footer.email}`, ...profileLinks(en).map((url) => `- ${url}`)].join('\n')

  setResponseHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return `# ${en.profile.name} — ${en.profile.jobTitle}

> ${en.seo.description}

${en.profile.degree}, ${en.profile.alumniOf}. Languages: Spanish (native), English.

## Contact

${contact}

## English

${section(en, 'en', siteUrl)}

## Español

${section(es, 'es', siteUrl)}
`
})

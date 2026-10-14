// JSON-LD (schema.org) generado desde el contenido: Person + ProfilePage + ItemList de proyectos.

/** Valores entre corchetes en el seed son marcadores pendientes. */
export const isPublished = (v: string | undefined): v is string => Boolean(v) && !v!.startsWith('[')

export function profileLinks(c: SiteContent): string[] {
  return [c.footer.linkedin, c.footer.github, c.footer.gitlab].filter(isPublished)
}

export function buildJsonLd(c: SiteContent, locale: Locale, siteUrl: string) {
  const pageUrl = `${siteUrl}/${locale}`
  const personId = `${siteUrl}/#person`
  const knowsAbout = [...new Set(c.stack.layers.flatMap((l) => l.items))]

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: c.profile.name,
        inLanguage: [...LOCALES],
        publisher: { '@id': personId },
      },
      {
        '@type': 'ProfilePage',
        '@id': `${pageUrl}#page`,
        url: pageUrl,
        name: c.seo.title,
        description: c.seo.description,
        inLanguage: locale,
        isPartOf: { '@id': `${siteUrl}/#website` },
        mainEntity: { '@id': personId },
        hasPart: { '@id': `${pageUrl}#projects` },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: c.profile.name,
        alternateName: c.ui.logo,
        jobTitle: c.profile.jobTitle,
        description: c.hero.body,
        url: siteUrl,
        image: `${siteUrl}/avatars/avatar-white-512.jpg`,
        email: `mailto:${c.footer.email}`,
        sameAs: profileLinks(c),
        knowsAbout,
        knowsLanguage: [
          { '@type': 'Language', name: 'Spanish', alternateName: 'es' },
          { '@type': 'Language', name: 'English', alternateName: 'en' },
        ],
        alumniOf: { '@type': 'CollegeOrUniversity', name: c.profile.alumniOf },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: c.profile.degree,
          recognizedBy: { '@type': 'CollegeOrUniversity', name: c.profile.alumniOf },
        },
      },
      {
        '@type': 'ItemList',
        '@id': `${pageUrl}#projects`,
        name: c.projects.title,
        numberOfItems: c.projects.items.length,
        itemListElement: c.projects.items.map((p, i) => ({
          '@type': 'ListItem',
          position: i + 1,
          item: {
            '@type': 'CreativeWork',
            '@id': `${pageUrl}#project-${p.slug}`,
            name: p.title,
            description: `${p.metric} ${p.metricLabel}. ${p.body}`,
            genre: p.tag,
            keywords: p.stack.join(', '),
            creator: { '@id': personId },
            inLanguage: locale,
          },
        })),
      },
    ],
  }
}

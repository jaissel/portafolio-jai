export type Locale = 'es' | 'en'

export interface SiteContent {
  hero: {
    chip: string
    title: string
    script: string
    body: string
    ctaPrimary: string
    ctaSecondary: string
    cvUrl: string
    badge: string
    avatarAlt: string
    codeCard: { role: string; years: number; stack: string[]; loves: string }
  }
  about: { title: string; body: string; signature: string; avatarAlt: string }
  services: { title: string; body: string }[]
  projects: {
    title: string
    items: {
      slug: string
      tag: string
      title: string
      metric: string
      metricLabel: string
      body: string
      stack: string[]
      /** Destacado: aparece en la home. Todos aparecen en /[locale]/sites */
      featured?: boolean
    }[]
  }
  sites: {
    title: string
    body: string
    linkLabel: string
    marketsLabel: string
    /** Botón en Casos de estudio que abre /[locale]/sites en otra pestaña */
    cta: string
    seoTitle: string
    seoDescription: string
    /** Captura en public/sites/<slug>-{480,800}.{avif,webp} (pnpm sites) */
    items: {
      slug: string
      name: string
      url: string
      tag: string
      body: string
      imageAlt: string
      /** Otras tiendas de la misma marca (p. ej. por país) */
      markets?: { label: string; url: string }[]
    }[]
    /** Trabajo sin captura (SEO): lista compacta */
    more: { title: string; items: { name: string; url: string; tag: string; body: string }[] }
  }
  stack: { title: string; layers: { name: string; items: string[] }[] }
  stats: { value: string; label: string }[]
  lab: { title: string; body: string; manual: { text: string; date?: string }[]; learning: string }
  ask: {
    label: string
    status: string
    title: string
    body: string
    placeholder: string
    faq: { q: string; a: string }[]
  }
  footer: {
    title: string
    script: string
    cta: string
    note: string
    email: string
    linkedin: string
    github: string
    gitlab: string
  }
  nav: { work: string; services: string; stack: string; contact: string; cta: string }
  profile: { name: string; jobTitle: string; alumniOf: string; degree: string }
  seo: { title: string; description: string }
  ui: {
    logo: string
    skip: string
    navLabel: string
    menuOpen: string
    menuClose: string
    swipe: string
    back: string
    newTab: string
    langLabel: string
    labLive: string
    learning: string
    askAvatarAlt: string
    askSend: string
    askSuggested: string
    askFallback: string
    socialLabel: string
  }
}

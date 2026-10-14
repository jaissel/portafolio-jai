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
    }[]
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

import seedEn from '../../content/seed.en.json'
import seedEs from '../../content/seed.es.json'

// Fase 1-2: lee los JSON seed. En la Fase 3 se reemplaza por la tabla `content` de D1.
const seeds: Record<Locale, SiteContent> = { es: seedEs, en: seedEn }

export function getSiteContent(locale: Locale): SiteContent {
  return seeds[locale]
}

import type { Ref } from 'vue'
import trackScript from '~/assets/track.js?raw'

interface PublicHeadOptions {
  locale: Ref<Locale>
  /** Ruta después del idioma: '' para la home, '/sites' para sitios en producción */
  path?: string
  title: () => string | undefined
  description: () => string | undefined
  siteName: () => string | undefined
}

/** <head> común de las páginas públicas: idioma, canonical, hreflang, OG/Twitter y analítica sin cookies. */
export function usePublicHead({ locale, path = '', title, description, siteName }: PublicHeadOptions) {
  const siteUrl = useRuntimeConfig().public.siteUrl
  const url = computed(() => `${siteUrl}/${locale.value}${path}`)
  const ogImage = computed(() => `${siteUrl}/og/og-${locale.value}.png`)

  useHead({
    htmlAttrs: { lang: locale },
    script: [
      // Analítica sin cookies (app/assets/track.js): inline al final del body, independiente de la hidratación
      { key: 'track', innerHTML: trackScript.replace(/^\s*\/\/.*\n/gm, ''), tagPosition: 'bodyClose' },
    ],
    link: () => [
      { rel: 'canonical', href: url.value },
      ...LOCALES.map((l) => ({ rel: 'alternate' as const, hreflang: l, href: `${siteUrl}/${l}${path}` })),
      { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}/es${path}` },
    ],
  })
  useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogLocale: () => (locale.value === 'es' ? 'es_ES' : 'en_US'),
    ogLocaleAlternate: () => (locale.value === 'es' ? 'en_US' : 'es_ES'),
    ogType: path ? 'website' : 'profile',
    ogUrl: () => url.value,
    ogSiteName: siteName,
    ogImage: () => ogImage.value,
    ogImageWidth: 1200,
    ogImageHeight: 630,
    ogImageAlt: title,
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: () => ogImage.value,
  })

  return { siteUrl }
}

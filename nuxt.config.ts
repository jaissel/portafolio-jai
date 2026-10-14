// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-10-01',
  devtools: { enabled: false },
  modules: ['@nuxt/fonts', '@nuxt/eslint', 'nitro-cloudflare-dev'],
  css: ['~/assets/css/tokens.css'],

  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
      meta: [{ name: 'theme-color', content: '#FFF4EA' }],
    },
  },

  // Fuentes self-hosted: subsets generados por `pnpm fonts` en public/fonts (provider local).
  // Solo se precargan las del primer render (titular y texto); mono y script cargan con swap.
  fonts: {
    processCSSVariables: true,
    defaults: { subsets: ['latin'], styles: ['normal'] },
    families: [
      { name: 'Bricolage Grotesque', weights: [800], provider: 'local' },
      { name: 'DM Sans', weights: [400, 500, 700], provider: 'local' },
      { name: 'JetBrains Mono', weights: [400, 600], provider: 'local' },
      { name: 'Caveat', weights: [600], provider: 'local' },
    ],
  },

  features: { inlineStyles: true },
  experimental: { payloadExtraction: false },

  nitro: {
    preset: 'cloudflare-pages',
    cloudflare: { nodeCompat: true },
  },

  // Caché SWR solo en producción, para no servir HTML viejo en desarrollo
  $production: {
    routeRules: {
      '/es': { swr: 3600 },
      '/en': { swr: 3600 },
      '/llms.txt': { swr: 3600 },
      '/sitemap.xml': { swr: 3600 },
      '/robots.txt': { swr: 86400 },
    },
  },

  routeRules: {
    '/avatars/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
    '/og/**': { headers: { 'cache-control': 'public, max-age=86400' } },
    '/fonts/**': { headers: { 'cache-control': 'public, max-age=2592000' } },
  },

  runtimeConfig: {
    // NUXT_PUBLIC_SITE_URL en Cloudflare; canonical y hreflang siempre absolutos
    public: { siteUrl: 'https://jaissel.pages.dev' },
  },

  typescript: { strict: true },
})

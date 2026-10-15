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
  // Se precargan las 4: todas aparecen en el primer render (titular, texto, chip mono y script).
  fonts: {
    processCSSVariables: true,
    // Sin src: local(): buscar fuentes instaladas en el sistema retrasaba el primer pintado en perfiles nuevos
    experimental: { disableLocalFallbacks: true },
    defaults: {
      subsets: ['latin'],
      styles: ['normal'],
      // Métricas de fallback solo para fuentes que existen: Arial (Windows/macOS) y Roboto (Android)
      fallbacks: {
        'sans-serif': ['Arial', 'Roboto'],
        'system-ui': ['Arial', 'Roboto'],
        monospace: ['Courier New', 'Roboto Mono'],
        'ui-monospace': ['Courier New', 'Roboto Mono'],
        cursive: ['Arial', 'Roboto'],
      },
    },
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

  // Caché SWR solo en producción. 60 s en la home: lo editado en el dashboard aparece en menos de un minuto
  // (el contenido además se versiona en server/utils/content.ts)
  $production: {
    routeRules: {
      '/es': { swr: 60 },
      '/en': { swr: 60 },
      '/llms.txt': { swr: 300 },
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

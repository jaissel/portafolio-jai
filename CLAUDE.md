# CLAUDE.md — Portafolio Jai

Lee `PLAN.md` antes de cualquier tarea: tiene stack, arquitectura, esquema de D1 y fases. Trabaja fase por fase y marca los checkboxes de `PLAN.md` al terminar cada ítem.

## Reglas del proyecto
- Presupuesto $0: solo servicios con capa gratuita (Cloudflare Pages, D1, Turnstile, Gemini free tier). No agregues servicios de pago ni SaaS de analítica.
- Nuxt 4 + TypeScript estricto, Composition API con `<script setup>`. pnpm.
- El diseño de referencia es `design/home-mockup.dc.html` (versión "Solar coral"), con `home-tablet.dc.html`, `home-mobile.dc.html` y las reglas de `design/RESPONSIVE.md` (mobile-first, breakpoints 640 y 1024). Respeta paleta, tipografías, radios y orden de secciones. Los `{{...}}` y el `<script type="text/x-dc">` de ese archivo son del editor de mockups; usa solo su markup y estilos como guía visual.
- Imágenes del mockup: `/_blob/e70de4…` = `design/avatars/avatar-code.jpg` (hero), `/_blob/39a53f…` = `design/avatars/avatar-peace.jpg` (sobre mí), `/_blob/9778de…` = `design/avatars/avatar-wink.gif` (chat). `avatar-white.jpg` es la versión con fondo blanco, para OG y favicon.
- Todo texto visible sale del contenido (seed JSON → D1), nunca hardcodeado. Siempre en ES y EN.
- Sin proyectos personales no-dev (impresión 3D, tiendas propias) ni testimonios.
- Analítica sin cookies; nunca guardar IPs.
- Presupuesto de performance: Lighthouse ≥ 98 móvil, JS inicial < 90 KB gz. Antes de añadir una dependencia, justifica su peso.
- Accesibilidad AA: elementos interactivos reales, foco visible, `prefers-reduced-motion`.
- Secretos solo en `.dev.vars` y en las variables de Cloudflare.

## Comandos
- `pnpm dev` — Nuxt con bindings locales de D1 (nitro-cloudflare-dev lee `wrangler.toml`)
- `pnpm db:migrate` / `pnpm db:seed` (local) · `pnpm db:migrate:remote` / `pnpm db:seed:remote`
- `pnpm build && pnpm preview` — build para Cloudflare Pages y prueba con `wrangler pages dev` (puerto 8788)
- `pnpm lint` / `pnpm typecheck` / `pnpm format`
- `pnpm assets` — regenera avatares (requiere ffmpeg), fuentes e imágenes OG · por separado: `pnpm fonts`, `pnpm og`
- `pnpm deploy` — build + `wrangler pages deploy`

## Notas de implementación
- El contenido tiene una sección `ui` para etiquetas de interfaz (aria-labels, textos del chat, etc.).
- Valores entre corchetes en el seed (`[tema]`, `[https://github.com/USUARIO]`) son marcadores pendientes; los enlaces con marcador no se renderizan.
- Botones y superficies con texto blanco chico usan `--c-accent-fill` (#D4420F) en vez de `--c-accent` para cumplir contraste AA.
- Secciones sin interacción van con `hydrate-never` en `app/pages/[locale]/index.vue`. Si una sección necesita JS, cámbiala a `hydrate-on-visible`.
- `server/plugins/defer-js.ts` carga el JS de Nuxt después del primer LCP. No reintroducir `modulepreload` en la home.
- Para medir: `pnpm build && pnpm preview` y Lighthouse móvil contra `localhost:8788` sin el dev server corriendo (la contención de CPU infla los resultados).

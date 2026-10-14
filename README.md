# jai.dev — Jaissel Pérez · Senior Full Stack Developer

Bilingual (ES/EN) portfolio built with Nuxt 4 and deployed on Cloudflare's free tier. It includes structured data for search engines and AI answer engines, and is designed for a near-perfect Lighthouse score on mobile.

> **Status:** v1, the public site. The private dashboard (content editor and cookie-free analytics) and the AI chat are in progress. See [PLAN.md](PLAN.md).

## Highlights

- **Lighthouse (mobile, local production build):** Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100. LCP 1.8 s, CLS 0.
- **SEO / AEO:** JSON-LD (`Person`, `ProfilePage`, `ItemList` of case studies), `hreflang`, canonical URLs, sitemap, and [`/llms.txt`](https://llmstxt.org), all generated from the same content source. There is also a per-language Open Graph image rendered at build time.
- **Content-driven:** every visible string lives in `content/seed.{es,en}.json`, with no hardcoded copy. The site will read it from Cloudflare D1, editable from a dashboard.
- **Performance work:**
  - Static sections use `hydrate-never`, so only the menu, the case-study carousel and the chat hydrate.
  - Nuxt's JS is loaded after the first LCP paint (`server/plugins/defer-js.ts`).
  - Fonts are self-hosted and subset to Latin/Latin‑1 (143 → 91 KB).
  - Avatars ship as AVIF/WebP, and the 2.8 MB GIF became a 10 KB looping video.
- **Accessibility:** WCAG AA contrast, real buttons and links, visible focus, `prefers-reduced-motion`, and keyboard-scrollable carousel.
- **$0 budget:** Cloudflare Pages + D1, with no paid services and no analytics SaaS.

## Stack

Nuxt 4 · Vue 3 (`<script setup>`) · TypeScript (strict) · Cloudflare Pages + D1 · `@nuxt/fonts` · pnpm · ESLint + Prettier.
Build-time tooling: sharp, ffmpeg, satori + resvg, subset-font.

## Run locally

```bash
pnpm install
pnpm db:migrate && pnpm db:seed   # local D1 via wrangler
pnpm dev                          # http://localhost:3000 → redirects to /es or /en
```

Production build, served by the Cloudflare runtime:

```bash
pnpm build && pnpm preview        # http://localhost:8788
```

| Script | What it does |
|---|---|
| `pnpm lint` / `pnpm typecheck` / `pnpm format` | Code quality |
| `pnpm assets` | Regenerates avatars (needs ffmpeg), font subsets and OG images |
| `pnpm fonts` / `pnpm og` | Only fonts / only OG images |
| `pnpm db:migrate:remote` / `pnpm db:seed:remote` | Same as local, against the remote D1 |
| `pnpm deploy` | Build + `wrangler pages deploy` |

Secrets go in `.dev.vars` (see `.dev.vars.example`) and in the Cloudflare project settings, never in the repo.

## Structure

```
app/            pages/[locale]/index.vue, components/site/*, composables, assets/css/tokens.css
server/         api/content/[locale], routes (sitemap.xml, robots.txt, llms.txt), plugins, database/
shared/         content types, locales, JSON-LD builder, responsive image sources
content/        seed.es.json, seed.en.json
scripts/        build-avatars, build-fonts, build-og, seed
design/         mockups (desktop, tablet, mobile) and responsive spec
```

## Roadmap

- [x] Bilingual site faithful to the "Solar coral" mockups (desktop, tablet, mobile)
- [x] SEO / AEO and performance budget
- [ ] Content from D1 + cookie-free analytics (`data-track`, no IPs stored)
- [ ] Private dashboard: stats, ES/EN content editor, chat log
- [ ] "Ask my portfolio": Gemini-powered chat with Turnstile and rate limiting
- [ ] Live `/lab` from GitHub, real Web Vitals in the footer, custom domain

---

© Jaissel Pérez. Code available for reference; the content, avatars and CV are personal and not licensed for reuse.

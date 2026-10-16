<script setup lang="ts">
// En /[locale]/sites es el contenido principal de la página: su título es h1
withDefaults(defineProps<{ sites: SiteContent['sites']; heading?: 'h1' | 'h2' }>(), { heading: 'h2' })

const srcset = (slug: string, ext: 'avif' | 'webp') =>
  [480, 800].map((w) => `/sites/${slug}-${w}.${ext} ${w}w`).join(', ')
// 1 columna en móvil, 2 desde md (ver grid abajo)
const sizes = '(min-width: 1024px) 560px, (min-width: 640px) 45vw, 92vw'
</script>

<template>
  <section id="sites" class="section container" data-track-section="section.sites">
    <div class="card">
      <div class="intro">
        <component :is="heading" class="display title">{{ sites.title }}</component>
        <p class="body">{{ sites.body }}</p>
      </div>
      <ul class="grid" role="list">
        <li v-for="s in sites.items" :key="s.slug">
          <article class="site" :data-track-section="`site.${s.slug}`">
            <div class="shot">
              <div class="bar" aria-hidden="true"><span /><span /><span /></div>
              <picture>
                <source type="image/avif" :srcset="srcset(s.slug, 'avif')" :sizes="sizes" />
                <img
                  :src="`/sites/${s.slug}-480.webp`"
                  :srcset="srcset(s.slug, 'webp')"
                  :sizes="sizes"
                  :alt="s.imageAlt"
                  width="800"
                  height="500"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
            </div>
            <p class="tag mono">{{ s.tag }}</p>
            <h3 class="display name">{{ s.name }}</h3>
            <p class="desc">{{ s.body }}</p>
            <a
              :href="s.url"
              class="btn btn-outline visit"
              target="_blank"
              rel="noopener"
              :data-track="`site.${s.slug}`"
              >{{ sites.linkLabel }}<span class="sr-only"> {{ s.name }}</span> ↗</a
            >
            <p v-if="s.markets?.length" class="markets mono">
              {{ sites.marketsLabel }}
              <template v-for="(m, i) in s.markets" :key="m.url">
                <a
                  :href="m.url"
                  target="_blank"
                  rel="noopener"
                  :data-track="`site.${s.slug}.${m.label.toLowerCase()}`"
                  ><span class="sr-only">{{ s.name }} </span>{{ m.label }}</a
                ><template v-if="i < s.markets.length - 1"> · </template>
              </template>
            </p>
          </article>
        </li>
      </ul>
      <div v-if="sites.more.items.length" class="more">
        <h3 class="more-title mono">{{ sites.more.title }}</h3>
        <ul class="more-list" role="list">
          <li v-for="m in sites.more.items" :key="m.url">
            <a
              :href="m.url"
              target="_blank"
              rel="noopener"
              class="more-link"
              :data-track="`site.${m.name.toLowerCase().replace(/\W+/g, '-')}`"
            >
              <span class="more-name">{{ m.name }} ↗</span>
              <span class="more-tag mono">{{ m.tag }}</span>
              <span class="more-body">{{ m.body }}</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): una columna */
.card {
  background: var(--c-surface);
  border-radius: var(--r-card);
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.title {
  font-size: 26px;
  line-height: 1.05;
}
.body {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
}
.grid {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
}
.grid li {
  display: flex;
}
.site {
  flex: 1;
  background: var(--c-bg);
  border-radius: 20px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.site p {
  margin: 0;
}
/* Captura con barra de navegador, como la tarjeta de código del hero */
.shot {
  border-radius: 14px;
  overflow: hidden;
  background: var(--c-dark);
  box-shadow: 0 10px 24px rgb(58 26 14 / 0.12);
}
.bar {
  display: flex;
  gap: 5px;
  padding: 8px 10px;
}
.bar span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff6b3d;
}
.bar span:nth-child(2) {
  background: var(--c-pink);
}
.bar span:nth-child(3) {
  background: var(--c-yellow);
}
.shot img {
  width: 100%;
  height: auto;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top;
}
.tag {
  margin-top: 4px !important;
  font-size: 10px;
  color: var(--c-accent-ink);
  letter-spacing: 0.08em;
}
.name {
  font-size: 22px;
  line-height: 1.05;
}
.desc {
  font-size: 13px;
  line-height: 1.5;
}
.visit {
  margin-top: auto;
  align-self: flex-start;
  font-size: 14px;
  padding: 10px 18px;
}
.markets {
  font-size: 12px;
  color: var(--c-accent-deep);
}
.markets a {
  display: inline-block;
  padding: 10px 4px;
  font-weight: 600;
}

/* Lista compacta: trabajo de SEO, sin captura */
.more {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.more-title {
  margin: 0;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-accent-deep);
}
.more-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
}
.more-link {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 12px;
  padding: 14px 16px;
  border-radius: 14px;
  background: var(--c-peach-soft);
  color: var(--c-text);
  text-decoration: none;
}
.more-link:hover {
  color: var(--c-text);
  background: var(--c-peach);
}
.more-name {
  font-weight: 700;
}
.more-tag {
  font-size: 11px;
  color: var(--c-accent-ink);
  letter-spacing: 0.06em;
}
.more-body {
  flex-basis: 100%;
  font-size: 13px;
}

/* md: 2 columnas */
@media (min-width: 640px) {
  .card {
    padding: 28px;
    gap: 22px;
  }
  .title {
    font-size: 28px;
  }
  .body {
    font-size: 15px;
  }
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .site {
    border-radius: 22px;
    padding: 16px;
  }
  .tag {
    font-size: 11px;
  }
  .name {
    font-size: 24px;
  }
  .desc {
    font-size: 14px;
  }
  .more-list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* lg */
@media (min-width: 1024px) {
  .card {
    padding: 36px;
    gap: 24px;
  }
  .title {
    font-size: 30px;
  }
  .grid {
    gap: 18px;
  }
}
</style>

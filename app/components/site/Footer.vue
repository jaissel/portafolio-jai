<script setup lang="ts">
const props = defineProps<{ footer: SiteContent['footer']; ui: SiteContent['ui'] }>()

const links = computed(
  () =>
    [
      { label: props.footer.email, href: `mailto:${props.footer.email}`, track: 'footer.email' },
      { label: 'LinkedIn', href: props.footer.linkedin, track: 'footer.linkedin' },
      { label: 'GitHub', href: props.footer.github, track: 'footer.github' },
      { label: 'GitLab', href: props.footer.gitlab, track: 'footer.gitlab' },
    ].filter((l) => isPublished(l.href.replace('mailto:', ''))), // los marcadores [..] no se publican
)
</script>

<template>
  <footer id="contact" class="footer container" data-track-section="section.contact">
    <div class="card">
      <div class="copy">
        <h2 class="display title">
          {{ footer.title }}<span class="script">{{ footer.script }}</span>
        </h2>
        <ul class="links mono" role="list" :aria-label="ui.socialLabel">
          <li v-for="l in links" :key="l.track">
            <a
              :href="l.href"
              :data-track="l.track"
              v-bind="l.href.startsWith('http') ? { rel: 'me noopener', target: '_blank' } : {}"
              >{{ l.label }}</a
            >
          </li>
        </ul>
      </div>
      <a :href="`mailto:${footer.email}`" class="btn btn-primary cta" data-track="footer.cta"
        >{{ footer.cta }} →</a
      >
    </div>
    <p class="note mono">{{ footer.note }}</p>
  </footer>
</template>

<style scoped>
/* base (< 640): título → CTA a ancho completo → links apilados */
.footer {
  padding-left: var(--card-gutter);
  padding-right: var(--card-gutter);
  padding-bottom: 28px;
}
.card {
  background: var(--c-peach-soft);
  border-radius: var(--r-card);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.copy {
  display: contents;
}
/* 44 px del mockup como máximo: «¿CONSTRUIMOS» no cabe a 44 px por debajo de ~420 px */
.title {
  order: 1;
  font-size: clamp(32px, 12.6vw - 9px, 44px);
  line-height: 0.92;
}
.title .script {
  font-size: 0.86em;
}
.cta {
  order: 2;
  font-size: 16px;
  padding: 18px;
}
.links {
  order: 3;
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  font-size: 14px;
}
.links li:first-child {
  flex-basis: 100%;
}
.links a {
  display: inline-block;
  padding: 10px 0;
}
.note {
  margin: 18px 0 0;
  text-align: center;
  font-size: 11px;
  line-height: 1.6;
  color: var(--c-accent-deep);
}

/* md: título 60 px; links y CTA en una fila */
@media (min-width: 640px) {
  .footer {
    padding-bottom: 36px;
  }
  .card {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 24px 20px;
    padding: 40px 32px;
  }
  .title {
    flex-basis: 100%;
    font-size: 60px;
  }
  .title .script {
    font-size: 0.83em;
  }
  .links {
    order: 2;
    gap: 4px 22px;
  }
  .links li:first-child {
    flex-basis: auto;
  }
  .cta {
    order: 3;
    padding: 18px 28px;
  }
  .note {
    margin-top: 20px;
    font-size: 12px;
  }
}

/* lg: título y links a la izquierda, CTA a la derecha */
@media (min-width: 1024px) {
  .footer {
    padding-bottom: 56px;
  }
  .card {
    border-radius: 36px;
    padding: 48px 40px;
    gap: 32px;
  }
  .copy {
    display: block;
    flex: 1 1 480px;
    min-width: 0;
  }
  .title {
    font-size: clamp(44px, 6vw, 72px);
  }
  .title .script {
    font-size: 0.85em;
  }
  .links {
    margin-top: 24px;
    gap: 8px 24px;
  }
  .cta {
    padding: 20px 32px;
  }
  .note {
    margin-top: 24px;
  }
}
</style>

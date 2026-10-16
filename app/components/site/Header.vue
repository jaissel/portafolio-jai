<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    nav: SiteContent['nav']
    ui: SiteContent['ui']
    locale: Locale
    /** Ruta de la página actual después del idioma ('' en la home, '/sites' en sitios) */
    path?: string
  }>(),
  { path: '' },
)
// En otras páginas, las anclas vuelven a las secciones de la home
const home = computed(() => (props.path ? `/${props.locale}` : ''))
const logo = computed(() => {
  const [name = '', ...rest] = props.ui.logo.split('.')
  return { name, tld: rest.join('.') }
})

const links = computed(() => [
  { href: `${home.value}#work`, label: props.nav.work, track: 'nav.work' },
  { href: `${home.value}#services`, label: props.nav.services, track: 'nav.services' },
  { href: `${home.value}#stack`, label: props.nav.stack, track: 'nav.stack' },
  { href: `${home.value}#contact`, label: props.nav.contact, track: 'nav.contact' },
])

// Menú hamburguesa (< 1024 px)
const open = ref(false)
const close = () => (open.value = false)
const onKey = (e: KeyboardEvent) => {
  if (e.key === 'Escape') close()
}
let desktop: MediaQueryList | undefined
onMounted(() => {
  window.addEventListener('keydown', onKey)
  desktop = window.matchMedia('(min-width: 1024px)')
  desktop.addEventListener('change', close)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKey)
  desktop?.removeEventListener('change', close)
})
</script>

<template>
  <header class="header" :class="{ open }">
    <div class="bar container">
      <a :href="`${home}#top`" class="logo" data-track="header.logo" @click="close">
        {{ logo.name }}<span class="dot">.</span>{{ logo.tld }}
      </a>
      <nav id="site-nav" :aria-label="ui.navLabel" class="nav">
        <a v-for="l in links" :key="l.href" :href="l.href" :data-track="l.track" @click="close">{{
          l.label
        }}</a>
        <a :href="`${home}#contact`" class="btn btn-primary cta-menu" data-track="header.cta" @click="close"
          >{{ nav.cta }} →</a
        >
      </nav>
      <div class="actions">
        <SiteLangSwitch :label="ui.langLabel" :locale="locale" :path="path" />
        <a :href="`${home}#contact`" class="btn btn-primary cta" data-track="header.cta">{{ nav.cta }} →</a>
        <button
          type="button"
          class="burger"
          aria-controls="site-nav"
          :aria-expanded="open"
          :aria-label="open ? ui.menuClose : ui.menuOpen"
          data-track="header.menu"
          @click="open = !open"
        >
          <span aria-hidden="true" />
          <span aria-hidden="true" />
          <span aria-hidden="true" />
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgb(255 244 234 / 0.9);
  backdrop-filter: blur(10px);
}
.bar {
  position: relative;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}
.logo {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 22px;
  color: var(--c-accent);
  text-decoration: none;
}
.dot {
  color: var(--c-pink-strong);
}
.actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.cta {
  display: none;
  font-size: 14px;
  padding: 14px 22px;
}

/* Hamburguesa (base y md) */
.burger {
  width: 44px;
  height: 44px;
  flex: none;
  border: 0;
  border-radius: 14px;
  background: var(--c-accent-fill);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
}
.burger span {
  display: block;
  width: 18px;
  height: 2px;
  border-radius: 2px;
  background: #fff;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease,
    width 0.2s ease;
}
.burger span:nth-child(3) {
  width: 12px;
}
.open .burger span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}
.open .burger span:nth-child(2) {
  opacity: 0;
}
.open .burger span:nth-child(3) {
  width: 18px;
  transform: translateY(-7px) rotate(-45deg);
}

/* Panel del menú (base y md): oscuro, con links grandes */
.nav {
  display: none;
  position: absolute;
  top: calc(100% - 4px);
  left: var(--card-gutter);
  right: var(--card-gutter);
  flex-direction: column;
  gap: 4px;
  padding: 20px;
  background: var(--c-dark);
  border-radius: 24px;
  box-shadow: 0 20px 40px rgb(58 26 14 / 0.3);
}
.open .nav {
  display: flex;
}
.nav a:not(.btn) {
  color: var(--c-peach-soft);
  text-decoration: none;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 28px;
  padding: 8px 4px;
  border-radius: 12px;
}
.nav a:not(.btn):hover {
  color: var(--c-pink);
}
.cta-menu {
  margin-top: 12px;
  padding: 16px;
}

/* md: CTA visible, hamburguesa con borde y menú flotante a la derecha */
@media (min-width: 640px) {
  .bar {
    padding-top: 22px;
    padding-bottom: 22px;
    gap: 16px;
  }
  .logo {
    font-size: 26px;
  }
  .actions {
    gap: 12px;
  }
  .cta {
    display: inline-flex;
  }
  .cta-menu {
    display: none;
  }
  .burger {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    border: 2px solid var(--c-text);
    background: transparent;
  }
  .burger span {
    width: 20px;
    background: var(--c-text);
  }
  .burger span:nth-child(3) {
    width: 14px;
  }
  .open .burger span:nth-child(3) {
    width: 20px;
  }
  .nav {
    left: auto;
    right: var(--gutter);
    width: 320px;
    padding: 22px;
  }
}

/* lg: nav completo en línea */
@media (min-width: 1024px) {
  .bar {
    padding-top: 28px;
    padding-bottom: 28px;
  }
  .burger,
  .cta-menu {
    display: none;
  }
  .nav,
  .open .nav {
    display: flex;
    position: static;
    width: auto;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 28px;
    padding: 0;
    background: none;
    box-shadow: none;
  }
  .nav a:not(.btn) {
    color: var(--c-text);
    font-family: var(--f-mono);
    font-weight: 400;
    font-size: 13px;
    padding: 12px 0;
  }
  .nav a:not(.btn):hover {
    color: var(--c-accent-ink);
    text-decoration: underline;
  }
}

/* Al bajar, el header gana sombra y en desktop se compacta (scroll-driven, sin JS) */
@supports (animation-timeline: scroll()) {
  .header {
    animation: header-shadow linear both;
    animation-timeline: scroll();
    animation-range: 0 80px;
  }
  @media (min-width: 1024px) {
    .bar {
      animation: header-compact linear both;
      animation-timeline: scroll();
      animation-range: 0 80px;
    }
  }
}
@keyframes header-shadow {
  to {
    box-shadow: 0 6px 24px rgb(58 26 14 / 0.08);
  }
}
@keyframes header-compact {
  to {
    padding-top: 14px;
    padding-bottom: 14px;
  }
}
</style>

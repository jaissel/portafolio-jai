<script setup lang="ts">
const props = defineProps<{ projects: SiteContent['projects']; ui: SiteContent['ui'] }>()

// Carrusel en móvil: los dots siguen la tarjeta visible (en md/lg el carrusel es un grid y no hay dots)
const track = ref<HTMLElement | null>(null)
const active = ref(0)
function onScroll() {
  const el = track.value
  const first = el?.firstElementChild as HTMLElement | null
  if (!el || !first) return
  const step = first.offsetWidth + parseFloat(getComputedStyle(el).columnGap || '0')
  const max = el.scrollWidth - el.clientWidth
  active.value = el.scrollLeft >= max - 4 ? props.projects.items.length - 1 : Math.round(el.scrollLeft / step)
}
</script>

<template>
  <section id="work" class="section container" data-track-section="section.work">
    <div class="panel">
      <div class="head">
        <h2 id="work-title" class="display title">{{ projects.title }}</h2>
        <span class="hint mono" aria-hidden="true">{{ ui.swipe }} →</span>
      </div>
      <!-- tabindex: el carrusel tiene scroll propio y debe poder recorrerse con teclado -->
      <ul
        ref="track"
        class="track"
        role="list"
        tabindex="0"
        aria-labelledby="work-title"
        @scroll.passive="onScroll"
      >
        <li v-for="p in projects.items" :key="p.slug">
          <article :id="`project-${p.slug}`" class="project" :data-track-section="`project.${p.slug}`">
            <p class="tag mono">{{ p.tag }}</p>
            <h3 class="display name">{{ p.title }}</h3>
            <div class="metric">
              <p class="metric-value">{{ p.metric }}</p>
              <p class="metric-label">{{ p.metricLabel }}</p>
            </div>
            <p class="body">{{ p.body }}</p>
            <p class="stack mono">{{ p.stack.join(' · ') }}</p>
          </article>
        </li>
      </ul>
      <div class="dots" aria-hidden="true">
        <span v-for="(p, i) in projects.items" :key="p.slug" :class="{ on: i === active }" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): carrusel horizontal con scroll-snap */
.panel {
  /* --c-accent-fill: el texto de 12 px («desliza →») necesita 4,5:1 sobre el coral */
  background: var(--c-accent-fill);
  border-radius: var(--r-card);
  padding: 28px 0 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.head {
  padding: 0 20px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}
.title {
  font-size: 28px;
  line-height: 1;
  color: #fff;
}
.hint {
  font-size: 12px;
  color: #fff;
  white-space: nowrap;
}
.track {
  list-style: none;
  margin: 0;
  padding: 0 20px 4px;
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding: 0 20px;
  scrollbar-width: none;
}
.track::-webkit-scrollbar {
  display: none;
}
.track:focus-visible {
  outline-color: #fff;
  outline-offset: -3px;
  border-radius: 20px;
}
.track li {
  flex: 0 0 270px;
  display: flex;
  scroll-snap-align: start;
}
.project {
  flex: 1;
  background: var(--c-bg);
  border-radius: 20px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.project p {
  margin: 0;
}
.tag {
  font-size: 10px;
  color: var(--c-accent-ink);
  letter-spacing: 0.08em;
}
.name {
  font-size: 22px;
  line-height: 1.05;
}
.metric {
  background: var(--c-peach);
  border-radius: 14px;
  padding: 14px;
}
.metric-value {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 32px;
  color: var(--c-accent-deep);
}
.metric-label {
  font-size: 12px;
  color: var(--c-accent-darker);
}
.body {
  font-size: 13px;
  line-height: 1.5;
}
.stack {
  margin-top: auto !important;
  font-size: 11px;
  color: var(--c-accent-deep);
}
.dots {
  display: flex;
  justify-content: center;
  gap: 6px;
}
.dots span {
  width: 6px;
  height: 6px;
  border-radius: 3px;
  background: #ffb596;
  transition:
    width 0.2s ease,
    background-color 0.2s ease;
}
.dots span.on {
  width: 18px;
  background: #fff;
}

/* md: grid 2×2 */
@media (min-width: 640px) {
  .panel {
    padding: 32px 28px;
    gap: 22px;
  }
  .head {
    padding: 0;
  }
  .title {
    font-size: 32px;
    line-height: 1.1;
  }
  .hint,
  .dots {
    display: none;
  }
  .track {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
    padding: 0;
    overflow: visible;
  }
  .project {
    border-radius: 22px;
    padding: 20px;
  }
  .tag {
    font-size: 11px;
  }
  .name {
    font-size: 24px;
  }
  .metric {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px 10px;
    padding: 14px 16px;
  }
  .metric-value {
    font-size: 34px;
  }
  .metric-label {
    font-size: 13px;
  }
  .body {
    font-size: 14px;
  }
  .stack {
    font-size: 12px;
  }
}

/* lg: grid automático (4 en fila) */
@media (min-width: 1024px) {
  .panel {
    border-radius: 36px;
    padding: 40px 32px;
    gap: 28px;
  }
  .title {
    font-size: 34px;
  }
  .track {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 18px;
  }
  .project {
    padding: 22px;
    gap: 12px;
  }
  .metric {
    display: block;
    padding: 18px 16px;
  }
}
</style>

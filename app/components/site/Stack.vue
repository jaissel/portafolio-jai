<script setup lang="ts">
defineProps<{ stack: SiteContent['stack']; stats: SiteContent['stats'] }>()

// Colores de las tarjetas de números, en el orden del mockup
const tones = ['peach', 'pink', 'yellow', 'white'] as const
</script>

<template>
  <section id="stack" class="section container wrap" data-track-section="section.stack">
    <div class="layers-card">
      <h2 class="display title">{{ stack.title }}</h2>
      <dl class="layers mono">
        <div v-for="l in stack.layers" :key="l.name" class="layer">
          <dt>{{ l.name }}</dt>
          <dd class="chips">
            <span v-for="item in l.items" :key="item">{{ item }}</span>
          </dd>
        </div>
      </dl>
    </div>
    <ul class="stats" role="list">
      <li v-for="(s, i) in stats" :key="s.value" :class="['stat', `tone-${tones[i % tones.length]}`]">
        <p class="value">{{ s.value }}</p>
        <p class="label">{{ s.label }}</p>
      </li>
    </ul>
  </section>
</template>

<style scoped>
/* base (< 640): etiqueta de capa encima de los chips; números 2×2 */
.wrap {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.layers-card {
  min-width: 0;
  background: var(--c-peach-soft);
  border-radius: var(--r-card);
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.title {
  font-size: 26px;
}
.layers {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 12px;
}
.layer {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
dt {
  font-weight: 600;
  color: var(--c-accent-deep);
}
dd {
  margin: 0;
}
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.chips span {
  background: var(--c-surface);
  padding: 7px 10px;
  border-radius: 8px;
}
.stats {
  min-width: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.stat {
  border-radius: 20px;
  padding: 18px;
}
.stat p {
  margin: 0;
}
.value {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 38px;
  color: var(--c-accent);
}
.label {
  font-size: 13px;
  font-weight: 500;
  white-space: pre-line;
}
.tone-peach {
  background: var(--c-peach);
}
.tone-pink {
  background: var(--c-pink);
}
.tone-pink .value {
  color: var(--c-pink-ink);
}
.tone-pink .label {
  color: var(--c-pink-deep);
}
.tone-yellow {
  background: var(--c-yellow);
}
.tone-yellow .value {
  color: var(--c-yellow-ink);
}
.tone-yellow .label {
  color: var(--c-yellow-deep);
}
.tone-white {
  background: var(--c-surface);
}

/* md: etiqueta de 120 px a la izquierda; números 4 en fila */
@media (min-width: 640px) {
  .wrap {
    gap: 14px;
  }
  .layers-card {
    padding: 28px;
  }
  .title {
    font-size: 28px;
  }
  .layers {
    gap: 14px;
    font-size: 13px;
  }
  .layer {
    display: grid;
    grid-template-columns: 120px minmax(0, 1fr);
    gap: 10px;
    align-items: center;
  }
  .chips {
    gap: 8px;
  }
  .chips span {
    padding: 8px 12px;
  }
  .stats {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
}

/* lg: stack y números 2×2 lado a lado */
@media (min-width: 1024px) {
  .wrap {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 24px;
  }
  .layers-card {
    flex: 1 1 560px;
    padding: 36px;
    gap: 20px;
  }
  .title {
    font-size: 30px;
  }
  .layer {
    grid-template-columns: 110px minmax(0, 1fr);
  }
  .stats {
    flex: 1 1 360px;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .stat {
    border-radius: 22px;
    padding: 22px;
  }
  .value {
    font-size: 44px;
  }
  .label {
    font-size: 14px;
  }
}
</style>

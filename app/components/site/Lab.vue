<script setup lang="ts">
defineProps<{ lab: SiteContent['lab']; ui: SiteContent['ui'] }>()
</script>

<template>
  <section id="lab" class="section container" data-track-section="section.lab">
    <div class="card">
      <div class="intro">
        <p class="kicker mono">{{ ui.labLive }}<span class="cursor" aria-hidden="true">_</span></p>
        <h2 class="display title">{{ lab.title }}</h2>
        <p class="body">{{ lab.body }}</p>
      </div>
      <ul class="feed mono" role="list">
        <li v-for="item in lab.manual" :key="item.text" class="row">
          <span><span aria-hidden="true">● </span>{{ item.text }}</span>
          <span v-if="item.date" class="meta">{{ item.date }}</span>
        </li>
        <li class="row learning">
          <span><span aria-hidden="true">◆ </span>{{ ui.learning }} {{ lab.learning }}</span>
          <span class="meta" aria-hidden="true">→</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): todo en columna; la fecha va debajo del texto */
.card {
  background: var(--c-surface);
  border-radius: var(--r-card);
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.intro {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.kicker {
  margin: 0;
  font-size: 12px;
  color: var(--c-accent-ink);
}
.cursor {
  color: var(--c-pink-strong);
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
.feed {
  min-width: 0;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 12px;
}
.row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: var(--c-bg);
  padding: 12px 14px;
  border-radius: 12px;
}
.row.learning {
  background: var(--c-peach-soft);
}
.meta {
  color: var(--c-accent-deep);
  font-size: 11px;
  white-space: nowrap;
}

/* md: fecha a la derecha */
@media (min-width: 640px) {
  .card {
    padding: 28px;
    gap: 16px;
  }
  .intro {
    gap: 10px;
  }
  .kicker {
    font-size: 13px;
  }
  .title {
    font-size: 28px;
  }
  .body {
    font-size: 15px;
  }
  .feed {
    gap: 10px;
    font-size: 13px;
  }
  .row {
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
    padding: 14px 16px;
  }
  .meta {
    font-size: inherit;
  }
}

/* lg: texto a la izquierda y filas a la derecha */
@media (min-width: 1024px) {
  .card {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 28px;
    padding: 36px;
  }
  .intro {
    flex: 1 1 340px;
    gap: 12px;
  }
  .title {
    font-size: 30px;
  }
  .feed {
    flex: 1 1 520px;
  }
}
</style>

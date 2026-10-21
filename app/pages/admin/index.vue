<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Resumen · jai.dev admin' })

const ranges = [
  { value: 'today', label: 'Hoy', days: 1 },
  { value: '7', label: '7 días', days: 7 },
  { value: '30', label: '30 días', days: 30 },
  { value: '90', label: '90 días', days: 90 },
]
const range = ref('7')
const days = computed(() => ranges.find((r) => r.value === range.value)?.days ?? 7)
const { data: stats, refresh, status } = await useFetch('/api/admin/stats', { query: { range } })

// "En vivo": se refresca solo cada 30 s mientras la pestaña está abierta
let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => (timer = setInterval(() => refresh(), 30_000)))
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <AdminShell title="Resumen">
    <template #actions>
      <div class="ranges" role="group" aria-label="Período">
        <button
          v-for="r in ranges"
          :key="r.value"
          type="button"
          :aria-pressed="range === r.value"
          @click="range = r.value"
        >
          {{ r.label }}
        </button>
      </div>
      <a :href="`/api/admin/events.csv?range=${range}`" class="csv" download>Exportar CSV</a>
    </template>

    <div v-if="stats" class="grid" :class="{ loading: status === 'pending' }">
      <p class="live">
        <span class="dot" aria-hidden="true" />{{ stats.live }} visitantes en los últimos 5 min
      </p>

      <div class="kpis">
        <AdminStatCard
          label="Visitantes únicos"
          :value="stats.kpis.visitors ?? 0"
          :previous="stats.previous.visitors ?? 0"
        />
        <AdminStatCard
          label="Vistas"
          :value="stats.kpis.pageviews ?? 0"
          :previous="stats.previous.pageviews ?? 0"
        />
        <AdminStatCard
          label="Descargas del CV"
          :value="stats.kpis.cvDownloads ?? 0"
          :previous="stats.previous.cvDownloads ?? 0"
        />
        <AdminStatCard
          label="Preguntas al chat"
          :value="stats.kpis.chatAsks ?? 0"
          :previous="stats.previous.chatAsks ?? 0"
        />
      </div>

      <section class="card wide">
        <h2>Visitas por día</h2>
        <AdminLineChart :points="stats.timeline" :days="days" />
      </section>

      <section class="card">
        <h2>Embudo</h2>
        <AdminFunnel v-bind="stats.funnel" />
      </section>

      <section class="card">
        <h2>Interacción por bloque</h2>
        <AdminBarList :rows="stats.blocks" />
      </section>

      <section class="card">
        <h2>Top clicks</h2>
        <AdminBarList :rows="stats.topClicks" />
      </section>

      <section class="card">
        <h2>Secciones y casos vistos</h2>
        <AdminBarList :rows="stats.sections" />
      </section>

      <section class="card">
        <h2>De dónde vienen</h2>
        <AdminBarList :rows="stats.referrers" />
      </section>

      <section class="card">
        <h2>Países</h2>
        <AdminBarList :rows="stats.countries" />
      </section>

      <section class="card">
        <h2>Idioma</h2>
        <AdminBarList :rows="stats.locales" />
      </section>

      <section class="card">
        <h2>Dispositivo</h2>
        <AdminBarList :rows="stats.devices" />
      </section>
    </div>
  </AdminShell>
</template>

<style scoped>
.ranges {
  display: flex;
  background: var(--c-peach-soft);
  border-radius: 999px;
  padding: 3px;
}
.ranges button {
  border: 0;
  background: none;
  border-radius: 999px;
  padding: 8px 14px;
  min-height: 36px;
  font: inherit;
  font-size: 13px;
  color: var(--c-accent-deep);
  cursor: pointer;
}
.ranges button[aria-pressed='true'] {
  background: var(--c-accent-fill);
  color: #fff;
}
.csv {
  font-size: 13px;
  padding: 8px 0;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  transition: opacity 0.2s;
}
.grid.loading {
  opacity: 0.6;
}
.live {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 14px;
  font-weight: 700;
}
.dot {
  display: inline-block;
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #2f9e5b;
  margin-right: 8px;
}
.kpis {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}
.card {
  background: var(--c-surface);
  border-radius: 20px;
  padding: 18px 20px;
  min-width: 0;
}
.card.wide {
  grid-column: 1 / -1;
}
h2 {
  margin: 0 0 12px;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 18px;
  color: var(--c-accent);
}
</style>

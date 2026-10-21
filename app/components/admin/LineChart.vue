<script setup lang="ts">
// Línea de tiempo diaria en SVG (sin librerías). Rellena con 0 los días sin datos.
const props = defineProps<{
  points: { day: string; visitors: number; pageviews: number }[]
  days: number
}>()

const W = 640
const H = 200
const PAD = { t: 12, r: 12, b: 26, l: 34 }

const series = computed(() => {
  const byDay = new Map(props.points.map((p) => [p.day, p]))
  const out: { day: string; visitors: number; pageviews: number }[] = []
  const today = new Date()
  for (let i = props.days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - i))
    const day = d.toISOString().slice(0, 10)
    out.push(byDay.get(day) ?? { day, visitors: 0, pageviews: 0 })
  }
  return out
})
const max = computed(() => Math.max(1, ...series.value.map((p) => p.pageviews)))
const x = (i: number) => PAD.l + (i * (W - PAD.l - PAD.r)) / Math.max(1, series.value.length - 1)
const y = (v: number) => H - PAD.b - (v / max.value) * (H - PAD.t - PAD.b)
const path = (key: 'visitors' | 'pageviews') =>
  series.value.map((p, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(p[key]).toFixed(1)}`).join(' ')
const ticks = computed(() => {
  const n = series.value.length
  const step = Math.max(1, Math.ceil(n / 6))
  return series.value
    .map((p, i) => ({ i, label: p.day.slice(5) }))
    .filter((t) => t.i % step === 0 || t.i === n - 1)
})
</script>

<template>
  <figure class="chart">
    <svg :viewBox="`0 0 ${W} ${H}`" role="img" aria-label="Visitas por día">
      <line
        v-for="f in [0, 0.5, 1]"
        :key="f"
        :x1="PAD.l"
        :x2="W - PAD.r"
        :y1="y(max * f)"
        :y2="y(max * f)"
        class="grid"
      />
      <text
        v-for="f in [0, 0.5, 1]"
        :key="`l${f}`"
        :x="PAD.l - 6"
        :y="y(max * f) + 4"
        class="axis"
        text-anchor="end"
      >
        {{ Math.round(max * f) }}
      </text>
      <path :d="path('pageviews')" class="line views" />
      <path :d="path('visitors')" class="line visitors" />
      <text v-for="t in ticks" :key="t.i" :x="x(t.i)" :y="H - 6" class="axis" text-anchor="middle">
        {{ t.label }}
      </text>
    </svg>
    <figcaption>
      <span class="key visitors">Visitantes únicos</span>
      <span class="key views">Vistas</span>
    </figcaption>
  </figure>
</template>

<style scoped>
.chart {
  margin: 0;
}
svg {
  width: 100%;
  height: auto;
  display: block;
}
.grid {
  stroke: var(--c-peach);
  stroke-width: 1;
}
.axis {
  font-family: var(--f-mono);
  font-size: 10px;
  fill: var(--c-accent-deep);
}
.line {
  fill: none;
  stroke-width: 2.5;
  stroke-linejoin: round;
  stroke-linecap: round;
}
.line.views {
  stroke: var(--c-pink-strong);
}
.line.visitors {
  stroke: var(--c-accent);
}
figcaption {
  display: flex;
  gap: 16px;
  font-size: 12px;
  margin-top: 6px;
}
.key::before {
  content: '';
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 3px;
  margin-right: 6px;
  vertical-align: -1px;
}
.key.visitors::before {
  background: var(--c-accent);
}
.key.views::before {
  background: var(--c-pink-strong);
}
</style>

<script setup lang="ts">
const props = defineProps<{ visits: number; sawCase: number; converted: number }>()
const steps = computed(() => [
  { label: 'Visitan el sitio', value: props.visits },
  { label: 'Ven un caso de estudio', value: props.sawCase },
  { label: 'Contactan o descargan el CV', value: props.converted },
])
const pct = (v: number) => (props.visits ? Math.round((v / props.visits) * 100) : 0)
</script>

<template>
  <ol class="funnel">
    <li v-for="(s, i) in steps" :key="s.label" :style="{ '--w': `${Math.max(pct(s.value), 4)}%` }">
      <span class="bar" aria-hidden="true" />
      <span class="label">{{ i + 1 }}. {{ s.label }}</span>
      <span class="value"
        >{{ s.value }} <small>({{ pct(s.value) }} %)</small></span
      >
    </li>
  </ol>
</template>

<style scoped>
.funnel {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
li {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border-radius: 12px;
  overflow: hidden;
  background: var(--c-bg);
  font-size: 14px;
}
.bar {
  position: absolute;
  inset: 0 auto 0 0;
  width: var(--w);
  background: var(--c-peach);
}
.label,
.value {
  position: relative;
}
.value {
  font-weight: 700;
}
small {
  font-weight: 400;
  color: var(--c-accent-deep);
}
</style>

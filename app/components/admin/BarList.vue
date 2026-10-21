<script setup lang="ts">
const props = defineProps<{ rows: { label: string; value: number }[]; empty?: string }>()
const max = computed(() => Math.max(1, ...props.rows.map((r) => r.value)))
</script>

<template>
  <ul v-if="rows.length" class="bars" role="list">
    <li v-for="r in rows" :key="r.label">
      <span class="bar" :style="{ width: `${(r.value / max) * 100}%` }" aria-hidden="true" />
      <span class="label">{{ r.label }}</span>
      <span class="value">{{ r.value }}</span>
    </li>
  </ul>
  <p v-else class="empty">{{ empty ?? 'Sin datos en este período.' }}</p>
</template>

<style scoped>
.bars {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
li {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 7px 10px;
  font-size: 13px;
  border-radius: 8px;
  overflow: hidden;
}
.bar {
  position: absolute;
  inset: 0 auto 0 0;
  background: var(--c-peach-soft);
  border-radius: 8px;
}
.label,
.value {
  position: relative;
}
.label {
  font-family: var(--f-mono);
  font-size: 12px;
  overflow-wrap: anywhere;
}
.value {
  font-weight: 700;
}
.empty {
  margin: 0;
  font-size: 13px;
  color: var(--c-accent-deep);
}
</style>

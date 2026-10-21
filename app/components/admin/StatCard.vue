<script setup lang="ts">
const props = defineProps<{ label: string; value: number; previous?: number }>()
const delta = computed(() => {
  if (props.previous === undefined) return null
  if (!props.previous) return props.value ? null : 0
  return Math.round(((props.value - props.previous) / props.previous) * 100)
})
const fmt = new Intl.NumberFormat('es')
</script>

<template>
  <div class="stat">
    <p class="label">{{ label }}</p>
    <p class="value">{{ fmt.format(value) }}</p>
    <p v-if="previous !== undefined" class="delta" :class="{ up: (delta ?? 0) > 0, down: (delta ?? 0) < 0 }">
      <template v-if="delta === null">nuevo · antes 0</template>
      <template v-else
        >{{ delta > 0 ? '▲' : delta < 0 ? '▼' : '=' }} {{ Math.abs(delta) }} % vs. período anterior</template
      >
    </p>
  </div>
</template>

<style scoped>
.stat {
  background: var(--c-surface);
  border-radius: 20px;
  padding: 18px 20px;
}
.stat p {
  margin: 0;
}
.label {
  font-family: var(--f-mono);
  font-size: 12px;
  color: var(--c-accent-ink);
}
.value {
  margin-top: 6px !important;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 36px;
  color: var(--c-text);
}
.delta {
  font-size: 12px;
  color: var(--c-accent-deep);
}
.delta.up {
  color: #1f6b3a;
}
.delta.down {
  color: #a3241a;
}
</style>

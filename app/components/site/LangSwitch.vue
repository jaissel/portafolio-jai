<script setup lang="ts">
defineProps<{ label: string; locale: Locale }>()
</script>

<template>
  <div role="group" :aria-label="label" class="switch mono">
    <a
      v-for="l in LOCALES"
      :key="l"
      :href="`/${l}`"
      :hreflang="l"
      :lang="l"
      :aria-current="l === locale ? 'page' : undefined"
      :class="{ active: l === locale }"
      :data-track="`lang.${l}`"
      >{{ l.toUpperCase() }}</a
    >
  </div>
</template>

<style scoped>
.switch {
  display: flex;
  background: var(--c-peach-soft);
  border-radius: var(--r-pill);
  padding: 3px;
  font-size: 12px;
  font-weight: 600;
}
a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 38px;
  padding: 0 10px;
  border-radius: var(--r-pill);
  color: var(--c-accent-deep);
  text-decoration: none;
}
a.active {
  background: var(--c-accent-fill);
  color: #fff;
}
@media (min-width: 640px) {
  .switch {
    padding: 4px;
    font-size: 13px;
  }
  a {
    min-width: 48px;
    min-height: 40px;
  }
}
</style>

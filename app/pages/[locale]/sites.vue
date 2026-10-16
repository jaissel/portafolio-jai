<script setup lang="ts">
// Todos los casos de estudio + sitios en producción: página aparte (se abre en otra pestaña desde la home).
definePageMeta({ validate: (route) => isLocale(route.params.locale) })

const route = useRoute()
const locale = computed(() => route.params.locale as Locale)
const { data: c } = await useContent(locale)
if (!c.value) throw createError({ statusCode: 500, statusMessage: 'Content unavailable', fatal: true })

usePublicHead({
  locale,
  path: '/sites',
  title: () => c.value?.sites.seoTitle,
  description: () => c.value?.sites.seoDescription,
  siteName: () => c.value?.profile.name,
})
</script>

<template>
  <div v-if="c">
    <a href="#main" class="skip-link">{{ c.ui.skip }}</a>
    <SiteHeader :nav="c.nav" :ui="c.ui" :locale="locale" path="/sites" />
    <main id="main">
      <div class="container back-wrap">
        <a :href="`/${locale}`" class="back mono" data-track="sites.back">← {{ c.ui.back }}</a>
      </div>
      <!-- Todos los casos de estudio (la home muestra solo los destacados) y luego las tiendas en vivo -->
      <LazySiteProjects
        hydrate-on-visible
        :projects="c.projects"
        :sites="c.sites"
        :ui="c.ui"
        :locale="locale"
        mode="all"
        heading="h1"
      />
      <LazySiteSites hydrate-never :sites="c.sites" />
    </main>
    <LazySiteFooter hydrate-never :footer="c.footer" :ui="c.ui" />
  </div>
</template>

<style scoped>
.back-wrap {
  padding-top: 8px;
  padding-bottom: 12px;
}
.back {
  display: inline-block;
  padding: 10px 0;
  font-size: 13px;
  text-decoration: none;
}
.back:hover {
  text-decoration: underline;
}
</style>

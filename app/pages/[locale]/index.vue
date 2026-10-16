<script setup lang="ts">
definePageMeta({ validate: (route) => isLocale(route.params.locale) })

const route = useRoute()
const locale = computed(() => route.params.locale as Locale)
const { data: c } = await useContent(locale)
if (!c.value) throw createError({ statusCode: 500, statusMessage: 'Content unavailable', fatal: true })

const { siteUrl } = usePublicHead({
  locale,
  title: () => c.value?.seo.title,
  description: () => c.value?.seo.description,
  siteName: () => c.value?.profile.name,
})
useHead({
  script: () => [
    {
      key: 'jsonld',
      type: 'application/ld+json',
      innerHTML: JSON.stringify(buildJsonLd(c.value!, locale.value, siteUrl)),
    },
  ],
  link: [
    // La imagen del hero es el LCP: se pide antes de que el parser llegue al <img>
    {
      rel: 'preload',
      as: 'image',
      type: 'image/avif',
      imagesrcset: HERO_AVATAR.avif,
      imagesizes: HERO_AVATAR.sizes,
      fetchpriority: 'high',
      tagPriority: 'critical',
    },
  ],
})
</script>

<template>
  <div v-if="c">
    <a href="#main" class="skip-link">{{ c.ui.skip }}</a>
    <SiteHeader :nav="c.nav" :ui="c.ui" :locale="locale" />
    <!-- Secciones estáticas: hydrate-never → no se hidratan. Header, carrusel de proyectos y chat sí. -->
    <main id="main">
      <LazySiteHero hydrate-never :hero="c.hero" />
      <LazySiteAbout hydrate-never :about="c.about" :services="c.services" />
      <LazySiteProjects
        hydrate-on-visible
        :projects="c.projects"
        :sites="c.sites"
        :ui="c.ui"
        :locale="locale"
      />
      <LazySiteStack hydrate-never :stack="c.stack" :stats="c.stats" />
      <LazySiteLab hydrate-never :lab="c.lab" :ui="c.ui" />
      <LazySiteAskBot hydrate-on-visible :ask="c.ask" :ui="c.ui" />
    </main>
    <LazySiteFooter hydrate-never :footer="c.footer" :ui="c.ui" />
  </div>
</template>

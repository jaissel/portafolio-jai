<script setup lang="ts">
// Interfaz del dashboard: herramienta privada, en español y fuera del contenido editable del sitio.
defineProps<{ title: string }>()
const { data: me } = await useFetch('/api/admin/me')
const route = useRoute()
const links = [
  { to: '/admin', label: 'Resumen' },
  { to: '/admin/content', label: 'Contenido' },
  { to: '/admin/chat', label: 'Chat' },
]
useHead({ meta: [{ name: 'robots', content: 'noindex, nofollow' }], htmlAttrs: { lang: 'es' } })
</script>

<template>
  <div class="admin">
    <aside class="side">
      <NuxtLink to="/admin" class="brand">jai<span>.</span>dev <small>admin</small></NuxtLink>
      <nav aria-label="Dashboard">
        <NuxtLink
          v-for="l in links"
          :key="l.to"
          :to="l.to"
          :aria-current="route.path === l.to ? 'page' : undefined"
        >
          {{ l.label }}
        </NuxtLink>
        <a href="/es" target="_blank" rel="noopener">Ver sitio ↗</a>
      </nav>
      <div v-if="me" class="me">
        <img :src="me.avatar" alt="" width="32" height="32" />
        <span>{{ me.name }}</span>
        <form method="post" action="/auth/logout">
          <button type="submit">Salir</button>
        </form>
      </div>
    </aside>
    <main class="main">
      <header class="top">
        <h1>{{ title }}</h1>
        <slot name="actions" />
      </header>
      <slot />
    </main>
  </div>
</template>

<style scoped>
.admin {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  background: var(--c-bg);
}
.side {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 24px 16px;
  background: var(--c-dark);
  color: var(--c-peach-soft);
}
.brand {
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 22px;
  color: #fff;
  text-decoration: none;
}
.brand span {
  color: var(--c-pink);
}
.brand small {
  font-family: var(--f-mono);
  font-weight: 400;
  font-size: 11px;
  color: var(--c-code-key);
  margin-left: 4px;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
nav a {
  padding: 10px 12px;
  border-radius: 10px;
  color: var(--c-peach-soft);
  text-decoration: none;
  font-size: 14px;
}
nav a:hover {
  background: var(--c-dark-2);
  color: #fff;
}
nav a[aria-current='page'] {
  background: var(--c-accent-fill);
  color: #fff;
}
.me {
  margin-top: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.me img {
  border-radius: 50%;
}
.me form {
  margin-left: auto;
}
.me button {
  background: none;
  border: 1px solid var(--c-dark-line);
  color: var(--c-peach-soft);
  border-radius: 8px;
  padding: 6px 10px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.main {
  min-width: 0;
  padding: 28px 32px 48px;
}
.top {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 24px;
}
.top h1 {
  margin: 0;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 28px;
  color: var(--c-accent);
}
@media (max-width: 800px) {
  .admin {
    grid-template-columns: minmax(0, 1fr);
  }
  .side {
    position: static;
    height: auto;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
  }
  nav {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .me {
    margin: 0 0 0 auto;
  }
  .main {
    padding: 20px 16px 40px;
  }
}
</style>

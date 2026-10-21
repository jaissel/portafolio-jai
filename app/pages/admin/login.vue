<script setup lang="ts">
const route = useRoute()
const errors: Record<string, string> = {
  denied: 'Esta cuenta de GitHub no tiene acceso al dashboard.',
  state: 'La sesión de login expiró o no es válida. Intenta de nuevo.',
  token: 'GitHub no devolvió un token. Intenta de nuevo.',
  user: 'No se pudo leer el usuario de GitHub.',
}
const error = computed(() => errors[String(route.query.error ?? '')])
useHead({
  title: 'Entrar · jai.dev admin',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  htmlAttrs: { lang: 'es' },
})
</script>

<template>
  <main class="login">
    <div class="card">
      <p class="brand">jai<span>.</span>dev <small>admin</small></p>
      <h1>Dashboard</h1>
      <p class="hint">Estadísticas, contenido y preguntas del chat.</p>
      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <a href="/auth/login" class="btn btn-primary gh">Entrar con GitHub</a>
    </div>
  </main>
</template>

<style scoped>
.login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: var(--c-bg);
}
.card {
  width: min(380px, 100%);
  background: var(--c-surface);
  border-radius: 28px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 18px 40px rgb(58 26 14 / 0.08);
}
.brand {
  margin: 0;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 22px;
  color: var(--c-accent);
}
.brand span {
  color: var(--c-pink-strong);
}
.brand small {
  font-family: var(--f-mono);
  font-weight: 400;
  font-size: 11px;
  color: var(--c-accent-ink);
}
h1 {
  margin: 8px 0 0;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 32px;
  color: var(--c-text);
}
.hint {
  margin: 0;
  font-size: 14px;
}
.error {
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: var(--c-peach-soft);
  color: var(--c-accent-deep);
  font-size: 13px;
}
.gh {
  margin-top: 8px;
  padding: 14px 20px;
}
</style>

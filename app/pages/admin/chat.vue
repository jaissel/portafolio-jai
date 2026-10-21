<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Chat · jai.dev admin' })

const { data: rows, refresh } = await useFetch('/api/admin/chat')
async function toggle(id: number, flagged: boolean) {
  await $fetch(`/api/admin/chat/${id}`, { method: 'PATCH', body: { flagged } })
  await refresh()
}
const fmt = (ts: number) => new Date(ts).toLocaleString('es')
</script>

<template>
  <AdminShell title="Preguntas del chat">
    <p class="hint">
      Marca una pregunta para convertirla en FAQ: aparece en
      <NuxtLink to="/admin/content">Contenido → ask</NuxtLink>
      con un botón para agregarla.
    </p>
    <div v-if="rows?.length" class="table-wrap">
      <table>
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Idioma</th>
            <th scope="col">País</th>
            <th scope="col">Pregunta</th>
            <th scope="col">Respuesta</th>
            <th scope="col">FAQ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in rows" :key="r.id">
            <td class="mono">{{ fmt(r.ts) }}</td>
            <td class="mono">{{ r.locale ?? '—' }}</td>
            <td class="mono">{{ r.country ?? '—' }}</td>
            <td>{{ r.question }}</td>
            <td class="answer">{{ r.answer ?? '—' }}</td>
            <td>
              <label class="flag">
                <input
                  type="checkbox"
                  :checked="!!r.flagged"
                  :aria-label="`Marcar para FAQ: ${r.question}`"
                  @change="toggle(r.id, !r.flagged)"
                />
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="empty">
      Todavía no hay preguntas. Aparecerán aquí cuando el chat con IA esté activo (Fase 5).
    </p>
  </AdminShell>
</template>

<style scoped>
.hint {
  margin: -8px 0 16px;
  font-size: 13px;
}
.table-wrap {
  overflow-x: auto;
  background: var(--c-surface);
  border-radius: 16px;
}
table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
th,
td {
  text-align: left;
  vertical-align: top;
  padding: 10px 12px;
  border-bottom: 1px solid var(--c-peach-soft);
}
th {
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 600;
  color: var(--c-accent-deep);
}
.answer {
  max-width: 420px;
  color: #5b3a2c;
}
.flag input {
  width: 18px;
  height: 18px;
}
.empty {
  background: var(--c-surface);
  border-radius: 16px;
  padding: 20px;
  font-size: 14px;
}
</style>

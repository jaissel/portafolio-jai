<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useHead({ title: 'Contenido · jai.dev admin' })

type Json = string | number | boolean | null | Json[] | { [key: string]: Json }
type Draft = Record<Locale, Record<string, Json>>

const { data, refresh } = await useFetch('/api/admin/content')
const { data: flagged } = await useFetch('/api/admin/chat', { query: { flagged: '1' } })

// Copias editables y la última versión guardada (para saber qué cambió)
const draft = ref<Draft>({ es: {}, en: {} })
const saved = ref('')
function load() {
  if (!data.value) return
  draft.value = JSON.parse(JSON.stringify({ es: data.value.es, en: data.value.en }))
  saved.value = JSON.stringify(draft.value)
}
load()

const sections = computed(() => Object.keys(draft.value.es))
const section = ref('hero')
const savedObj = computed(() => JSON.parse(saved.value || '{"es":{},"en":{}}') as Draft)
const isDirty = (l: Locale, s: string) =>
  JSON.stringify(draft.value[l][s]) !== JSON.stringify(savedObj.value[l][s])
const dirtySections = computed(() => sections.value.filter((s) => LOCALES.some((l) => isDirty(l, s))))

const saving = ref(false)
const message = ref('')
async function save() {
  saving.value = true
  message.value = ''
  try {
    for (const s of dirtySections.value)
      for (const l of LOCALES)
        if (isDirty(l, s))
          await $fetch('/api/admin/content', {
            method: 'PUT',
            body: { locale: l, section: s, data: draft.value[l][s] },
          })
    saved.value = JSON.stringify(draft.value)
    message.value = 'Guardado. El sitio público lo muestra en menos de un minuto.'
    reloadPreview()
  } catch (e) {
    message.value = `No se pudo guardar: ${(e as { statusMessage?: string }).statusMessage ?? 'error'}`
  } finally {
    saving.value = false
  }
}
async function discard() {
  await refresh()
  load()
  message.value = 'Cambios descartados.'
}

// Vista previa en vivo (iframe con ?preview=1: no registra analítica)
const preview = ref(false)
const previewLocale = ref<Locale>('es')
const previewKey = ref(Date.now())
const previewPath = computed(() => (['sites'].includes(section.value) ? '/sites' : ''))
const previewUrl = computed(
  () => `/${previewLocale.value}${previewPath.value}?preview=1&t=${previewKey.value}`,
)
function reloadPreview() {
  previewKey.value = Date.now()
}

// Preguntas del chat marcadas → borrador de FAQ en la sección `ask`
const flaggedFor = (l: Locale) => (flagged.value ?? []).filter((x) => !x.locale || x.locale === l)
function addFaq(l: Locale, q: string, a: string | null) {
  const ask = draft.value[l].ask as { faq: { q: string; a: string }[] }
  ask.faq.push({ q, a: a ?? '' })
}

onBeforeRouteLeave(() => {
  if (dirtySections.value.length && !confirm('Hay cambios sin guardar. ¿Salir igual?')) return false
})
</script>

<template>
  <AdminShell title="Contenido">
    <template #actions>
      <span v-if="message" class="msg" role="status">{{ message }}</span>
      <button type="button" class="ghost" @click="preview = !preview">
        {{ preview ? 'Ocultar vista previa' : 'Vista previa' }}
      </button>
      <button type="button" class="ghost" :disabled="!dirtySections.length || saving" @click="discard">
        Descartar
      </button>
      <button
        type="button"
        class="btn btn-primary save"
        :disabled="!dirtySections.length || saving"
        @click="save"
      >
        {{ saving ? 'Guardando…' : `Guardar${dirtySections.length ? ` (${dirtySections.length})` : ''}` }}
      </button>
    </template>

    <div class="layout" :class="{ withPreview: preview }">
      <nav class="sections" aria-label="Secciones">
        <button
          v-for="s in sections"
          :key="s"
          type="button"
          :aria-current="s === section ? 'true' : undefined"
          @click="section = s"
        >
          {{ s }}<span v-if="dirtySections.includes(s)" class="dot" aria-label="sin guardar">●</span>
        </button>
      </nav>

      <div class="editors">
        <section v-for="l in LOCALES" :key="l" class="col">
          <h2>
            {{ l === 'es' ? 'Español' : 'English' }}
            <small v-if="data?.updatedAt[`${l}:${section}`]">
              · guardado {{ new Date(data.updatedAt[`${l}:${section}`]!).toLocaleString('es') }}
            </small>
          </h2>
          <AdminFieldEditor :parent="draft[l]" :k="section" :label="''" />

          <div v-if="section === 'ask' && flaggedFor(l).length" class="flagged">
            <h3>Preguntas marcadas del chat</h3>
            <div v-for="f in flaggedFor(l)" :key="f.id" class="q">
              <p>{{ f.question }}</p>
              <button type="button" @click="addFaq(l, f.question, f.answer)">+ Agregar como FAQ</button>
            </div>
          </div>
        </section>
      </div>

      <aside v-if="preview" class="preview">
        <div class="preview-bar">
          <button
            v-for="l in LOCALES"
            :key="l"
            type="button"
            :aria-pressed="previewLocale === l"
            @click="previewLocale = l"
          >
            {{ l.toUpperCase() }}
          </button>
          <button type="button" @click="reloadPreview">↻</button>
          <small>Muestra lo guardado</small>
        </div>
        <iframe :key="previewUrl" :src="previewUrl" title="Vista previa del sitio" />
      </aside>
    </div>
  </AdminShell>
</template>

<style scoped>
.msg {
  font-size: 13px;
  color: var(--c-accent-deep);
}
.ghost {
  border: 1px solid var(--c-peach);
  background: #fff;
  border-radius: 999px;
  padding: 9px 16px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
}
.ghost:disabled,
.save:disabled {
  opacity: 0.45;
  cursor: default;
}
.save {
  padding: 10px 18px;
  font-size: 14px;
  border: 0;
  cursor: pointer;
}
.layout {
  display: grid;
  grid-template-columns: 150px minmax(0, 1fr);
  gap: 16px;
  align-items: start;
}
.layout.withPreview {
  grid-template-columns: 150px minmax(0, 1fr) minmax(360px, 1fr);
}
/* Con la vista previa abierta, ES y EN van uno debajo del otro */
.layout.withPreview .editors {
  grid-template-columns: minmax(0, 1fr);
}
.sections {
  position: sticky;
  top: 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.sections button {
  text-align: left;
  border: 0;
  background: none;
  padding: 8px 10px;
  border-radius: 8px;
  font-family: var(--f-mono);
  font-size: 13px;
  cursor: pointer;
  color: var(--c-text);
}
.sections button[aria-current='true'] {
  background: var(--c-accent-fill);
  color: #fff;
}
.dot {
  margin-left: 6px;
  color: var(--c-pink-strong);
}
.sections button[aria-current='true'] .dot {
  color: #fff;
}
.editors {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}
.col {
  background: var(--c-surface);
  border-radius: 16px;
  padding: 16px;
  min-width: 0;
}
.col h2 {
  margin: 0 0 12px;
  font-family: var(--f-display);
  font-weight: 800;
  font-size: 16px;
  color: var(--c-accent);
}
.col h2 small {
  font-family: var(--f-body);
  font-weight: 400;
  font-size: 11px;
  color: var(--c-accent-deep);
}
.flagged {
  margin-top: 16px;
  border-top: 1px dashed var(--c-peach);
  padding-top: 12px;
}
.flagged h3 {
  margin: 0 0 8px;
  font-size: 13px;
}
.q {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  margin-bottom: 6px;
}
.q p {
  margin: 0;
}
.q button {
  flex: none;
  border: 1px solid var(--c-peach);
  background: #fff;
  border-radius: 6px;
  padding: 4px 8px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.preview {
  position: sticky;
  top: 16px;
  background: var(--c-surface);
  border-radius: 16px;
  overflow: hidden;
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
}
.preview-bar {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-bottom: 1px solid var(--c-peach);
  font-size: 12px;
}
.preview-bar button {
  border: 1px solid var(--c-peach);
  background: #fff;
  border-radius: 6px;
  padding: 3px 8px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
}
.preview-bar button[aria-pressed='true'] {
  background: var(--c-accent-fill);
  color: #fff;
  border-color: transparent;
}
.preview-bar small {
  margin-left: auto;
  color: var(--c-accent-deep);
}
iframe {
  flex: 1;
  width: 100%;
  border: 0;
}
@media (max-width: 1100px) {
  .layout,
  .layout.withPreview {
    grid-template-columns: minmax(0, 1fr);
  }
  .sections {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }
  .editors {
    grid-template-columns: minmax(0, 1fr);
  }
  .preview {
    position: static;
    height: 70vh;
  }
}
</style>

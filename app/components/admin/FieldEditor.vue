<script setup lang="ts">
// Editor recursivo de JSON: edita parent[k] en su lugar según el tipo del valor.
// - string → input (o textarea si es largo o tiene saltos de línea)
// - number / boolean → input numérico / casilla
// - array → lista reordenable (↑ ↓ ✕ + agregar); los objetos de una lista muestran la unión de campos
//   de sus hermanos (p. ej. `featured` o `markets` opcionales)
// - object → grupo de campos
type Json = string | number | boolean | null | Json[] | { [key: string]: Json }
type Container = Json[] | { [key: string]: Json }

const props = defineProps<{ parent: Container; k: string | number; label?: string; siblings?: Json[] }>()

const value = computed<Json>({
  get: () => (props.parent as Record<string | number, Json>)[props.k] as Json,
  set: (v) => ((props.parent as Record<string | number, Json>)[props.k] = v),
})
// Vistas tipadas para v-model (un cast dentro de v-model no compila en producción)
const text = computed<string>({ get: () => String(value.value ?? ''), set: (v) => (value.value = v) })
const num = computed<number>({ get: () => Number(value.value), set: (v) => (value.value = v) })
const bool = computed<boolean>({ get: () => Boolean(value.value), set: (v) => (value.value = v) })
const kind = computed(() => {
  const v = value.value
  if (Array.isArray(v)) return 'array'
  if (v !== null && typeof v === 'object') return 'object'
  return typeof v
})
const isLong = computed(
  () => typeof value.value === 'string' && (value.value.length > 70 || value.value.includes('\n')),
)
// Filas según saltos de línea y largo (~55 caracteres por fila en una columna del editor)
const rows = computed(() => {
  if (typeof value.value !== 'string') return 2
  const lines = value.value.split('\n').reduce((n, l) => n + Math.max(1, Math.ceil(l.length / 55)), 0)
  return Math.min(10, Math.max(2, lines + 1))
})

/** Valor vacío con la misma forma (para "+ agregar" y campos opcionales) */
function blank(v: Json): Json {
  if (Array.isArray(v)) return []
  if (v !== null && typeof v === 'object')
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, blank(x)]))
  if (typeof v === 'number') return 0
  if (typeof v === 'boolean') return false
  return ''
}

// Campos del objeto: los propios más los que tengan sus hermanos en la misma lista
const objectKeys = computed(() => {
  const v = value.value as Record<string, Json>
  const keys = new Set(Object.keys(v))
  for (const s of props.siblings ?? [])
    if (s && typeof s === 'object' && !Array.isArray(s)) Object.keys(s).forEach((k) => keys.add(k))
  return [...keys]
})
function ensureKey(key: string) {
  const v = value.value as Record<string, Json>
  if (key in v) return
  const model = (props.siblings ?? []).find(
    (s) => s && typeof s === 'object' && !Array.isArray(s) && key in s,
  ) as Record<string, Json> | undefined
  v[key] = model ? blank(model[key]!) : ''
}

const list = computed(() => value.value as Json[])
function move(i: number, d: number) {
  const a = list.value
  const j = i + d
  if (j < 0 || j >= a.length) return
  ;[a[i], a[j]] = [a[j]!, a[i]!]
}
function remove(i: number) {
  list.value.splice(i, 1)
}
function add() {
  const a = list.value
  a.push(a.length ? blank(a[0]!) : '')
}
const isComposite = (item: Json) => item !== null && typeof item === 'object'
const itemTitle = (item: Json, i: number) => {
  if (item && typeof item === 'object' && !Array.isArray(item)) {
    const o = item as Record<string, Json>
    const t = o.title ?? o.name ?? o.q ?? o.label ?? o.text ?? o.slug
    if (typeof t === 'string' && t) return `${i + 1}. ${t.split('\n')[0]}`
  }
  return `${i + 1}`
}
</script>

<template>
  <div class="field" :class="kind">
    <!-- Texto -->
    <label v-if="kind === 'string'" class="row">
      <span class="name">{{ label ?? k }}</span>
      <textarea v-if="isLong" v-model="text" :rows="rows" />
      <input v-else v-model="text" type="text" />
    </label>

    <!-- Número -->
    <label v-else-if="kind === 'number'" class="row">
      <span class="name">{{ label ?? k }}</span>
      <input v-model.number="num" type="number" />
    </label>

    <!-- Sí / no -->
    <label v-else-if="kind === 'boolean'" class="row check">
      <input v-model="bool" type="checkbox" />
      <span class="name">{{ label ?? k }}</span>
    </label>

    <!-- Lista -->
    <fieldset v-else-if="kind === 'array'" class="group">
      <legend>
        {{ label ?? k }} <small>({{ list.length }})</small>
      </legend>
      <div v-for="(item, i) in list" :key="i" class="item" :class="{ inline: !isComposite(item) }">
        <!-- Textos simples (p. ej. stack): campo y botones en una sola fila -->
        <template v-if="!isComposite(item)">
          <AdminFieldEditor :parent="list" :k="i" :label="''" />
          <span class="tools">
            <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">↑</button>
            <button type="button" :disabled="i === list.length - 1" aria-label="Bajar" @click="move(i, 1)">
              ↓
            </button>
            <button type="button" aria-label="Quitar" class="danger" @click="remove(i)">✕</button>
          </span>
        </template>
        <div v-else class="item-head">
          <span class="item-title">{{ itemTitle(item, i) }}</span>
          <span class="tools">
            <button type="button" :disabled="i === 0" aria-label="Subir" @click="move(i, -1)">↑</button>
            <button type="button" :disabled="i === list.length - 1" aria-label="Bajar" @click="move(i, 1)">
              ↓
            </button>
            <button type="button" aria-label="Quitar" class="danger" @click="remove(i)">✕</button>
          </span>
        </div>
        <AdminFieldEditor v-if="isComposite(item)" :parent="list" :k="i" :label="''" :siblings="list" />
      </div>
      <button type="button" class="add" @click="add">+ Agregar</button>
    </fieldset>

    <!-- Objeto -->
    <fieldset v-else-if="kind === 'object'" class="group" :class="{ bare: label === '' }">
      <legend v-if="label !== ''">{{ label ?? k }}</legend>
      <template v-for="key in objectKeys" :key="key">
        <AdminFieldEditor v-if="key in (value as object)" :parent="value as Container" :k="key" />
        <button v-else type="button" class="add optional" @click="ensureKey(key)">+ {{ key }}</button>
      </template>
    </fieldset>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 10px;
}
.row.check {
  flex-direction: row;
  align-items: center;
  gap: 8px;
}
.name,
legend {
  font-family: var(--f-mono);
  font-size: 11px;
  color: var(--c-accent-deep);
}
legend small {
  color: var(--c-accent-ink);
}
input[type='text'],
input[type='number'],
textarea {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--c-peach);
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  color: var(--c-text);
  resize: vertical;
}
input:focus,
textarea:focus {
  outline: 2px solid var(--c-pink-strong);
  outline-offset: 0;
  border-color: transparent;
}
.group {
  border: 1px solid var(--c-peach);
  border-radius: 12px;
  padding: 10px 12px 4px;
  margin: 0 0 12px;
  min-width: 0;
}
.group.bare {
  border: 0;
  padding: 0;
  margin: 0;
}
.item {
  background: var(--c-bg);
  border-radius: 10px;
  padding: 8px 10px 2px;
  margin-bottom: 8px;
}
.item.inline {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: none;
  padding: 0;
  margin-bottom: 0;
}
.item.inline > .field {
  flex: 1;
  min-width: 0;
}
.item.inline .tools {
  padding-top: 6px;
}
.item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.item-title {
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.tools {
  display: flex;
  gap: 4px;
  flex: none;
}
.tools button,
.add {
  border: 1px solid var(--c-peach);
  background: #fff;
  border-radius: 6px;
  padding: 3px 8px;
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  color: var(--c-text);
}
.tools button:disabled {
  opacity: 0.35;
  cursor: default;
}
.tools .danger:hover {
  background: #fbe3df;
}
.add {
  margin: 2px 0 10px;
}
.add.optional {
  display: block;
  color: var(--c-accent-ink);
}
</style>

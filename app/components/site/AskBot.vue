<script setup lang="ts">
const props = defineProps<{ ask: SiteContent['ask']; ui: SiteContent['ui'] }>()

// Fase 1: respuestas desde las FAQ del contenido. La Fase 5 conecta /api/ask.
const selected = ref(0)
const question = ref('')
const custom = ref<{ q: string; a: string } | null>(null)

const current = computed(() => custom.value ?? props.ask.faq[selected.value])

function pick(i: number) {
  selected.value = i
  custom.value = null
}

function submit() {
  const q = question.value.trim()
  if (!q) return
  custom.value = { q, a: props.ui.askFallback }
  question.value = ''
}

// El avatar animado solo se reproduce si el usuario no pidió reducir movimiento (si no, queda el poster)
const video = ref<HTMLVideoElement | null>(null)
onMounted(() => {
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) video.value?.play().catch(() => {})
})
</script>

<template>
  <section id="ask" class="section container" aria-labelledby="ask-title">
    <div class="panel">
      <div class="intro">
        <div class="bot">
          <video
            ref="video"
            class="avatar"
            muted
            loop
            playsinline
            preload="none"
            poster="/avatars/avatar-wink-poster.webp"
            width="88"
            height="88"
            :aria-label="ui.askAvatarAlt"
          >
            <source src="/avatars/avatar-wink.webm" type="video/webm" />
            <source src="/avatars/avatar-wink.mp4" type="video/mp4" />
          </video>
          <div class="bot-text">
            <p class="status mono">
              {{ ask.label }}<span class="online">{{ ask.status }} <span aria-hidden="true">●</span></span>
            </p>
            <h2 id="ask-title" class="display title">{{ ask.title }}</h2>
          </div>
        </div>
        <p class="body">{{ ask.body }}</p>
      </div>

      <div class="chat">
        <div class="chips" role="group" :aria-label="ui.askSuggested">
          <button
            v-for="(f, i) in ask.faq"
            :key="f.q"
            type="button"
            class="chip"
            :aria-pressed="!custom && i === selected"
            :data-track="`ask.chip_${i + 1}`"
            @click="pick(i)"
          >
            {{ f.q }}
          </button>
        </div>
        <div class="convo">
          <div v-if="current" class="thread" aria-live="polite">
            <p class="bubble user">{{ current.q }}</p>
            <div class="reply">
              <img src="/avatars/avatar-wink-poster.webp" alt="" width="36" height="36" loading="lazy" />
              <p class="bubble bot-msg">{{ current.a }}</p>
            </div>
          </div>
          <form class="ask-form" @submit.prevent="submit">
            <label for="ask-input" class="sr-only">{{ ask.placeholder }}</label>
            <input
              id="ask-input"
              v-model="question"
              type="text"
              maxlength="300"
              autocomplete="off"
              :placeholder="ask.placeholder"
            />
            <button type="submit" class="send" :aria-label="ui.askSend" data-track="ask.send">↑</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): columna; chips en scroll horizontal; conversación en caja aparte */
.panel {
  background: var(--c-dark);
  color: var(--c-peach-soft);
  border-radius: var(--r-card);
  padding: 22px 18px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.intro {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.bot {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 16px 14px;
}
/* En base y lg el título va debajo de la fila avatar+estado; en md, al lado del avatar */
.bot-text {
  display: contents;
}
.title {
  flex-basis: 100%;
  font-size: 28px;
  line-height: 1.02;
  color: #fff;
}
.avatar {
  width: 64px;
  height: 64px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--c-pink);
  background: var(--c-dark-2);
}
.status {
  margin: 0;
  font-size: 12px;
  color: var(--c-code-key);
}
.online {
  display: block;
  color: var(--c-peach-soft);
}
.body {
  margin: 0;
  font-size: 14px;
  line-height: 1.55;
}
.chat {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
}
.chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 -18px;
  padding: 0 18px;
  scrollbar-width: none;
}
.chips::-webkit-scrollbar {
  display: none;
}
.chip {
  flex: none;
  white-space: nowrap;
  background: transparent;
  color: var(--c-peach-soft);
  border: 1px solid var(--c-dark-line);
  border-radius: var(--r-pill);
  padding: 10px 14px;
  min-height: 44px;
  font: inherit;
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}
.chip:hover {
  border-color: var(--c-pink);
}
.chip[aria-pressed='true'] {
  background: var(--c-pink);
  color: var(--c-pink-deep);
  border-color: var(--c-pink);
}
.convo {
  background: var(--c-dark-2);
  border-radius: 18px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.thread {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.bubble {
  margin: 0;
  padding: 10px 12px;
  line-height: 1.45;
}
.user {
  align-self: flex-end;
  max-width: 85%;
  background: var(--c-accent-fill);
  color: #fff;
  border-radius: 14px 14px 4px 14px;
}
.reply {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
.reply img {
  width: 30px;
  height: 30px;
  flex: none;
  border-radius: 50%;
  object-fit: cover;
}
.bot-msg {
  background: var(--c-bg);
  color: var(--c-text);
  border-radius: 14px 14px 14px 4px;
}
.ask-form {
  display: flex;
  gap: 8px;
}
input {
  flex: 1;
  min-width: 0;
  min-height: 44px;
  background: var(--c-dark);
  border: 1px solid var(--c-dark-border);
  color: var(--c-peach-soft);
  border-radius: 12px;
  padding: 12px;
  font: inherit;
  /* 16 px evita el zoom automático de iOS al enfocar */
  font-size: 16px;
}
input::placeholder {
  color: #c9a593;
}
.send {
  background: var(--c-pink);
  border: 0;
  border-radius: 12px;
  width: 48px;
  min-height: 44px;
  color: var(--c-pink-deep);
  font-size: 18px;
  cursor: pointer;
}
.send:hover {
  background: #fbb8cf;
}

/* md: título en una línea al lado del avatar; chips en wrap */
@media (min-width: 640px) {
  .panel {
    padding: 28px;
    gap: 18px;
  }
  .intro {
    gap: 18px;
  }
  .bot {
    flex-wrap: nowrap;
    gap: 16px;
  }
  .bot-text {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .avatar {
    width: 80px;
    height: 80px;
  }
  .online {
    display: inline;
  }
  .online::before {
    content: ' · ';
    color: var(--c-code-key);
  }
  .title {
    font-size: 30px;
    white-space: normal;
  }
  .body {
    font-size: 15px;
  }
  .chat {
    gap: 18px;
  }
  .chips {
    flex-wrap: wrap;
    overflow: visible;
    margin: 0;
    padding: 0;
  }
  .chip {
    white-space: normal;
  }
  .convo {
    border-radius: 20px;
    padding: 18px;
    gap: 12px;
  }
  .thread {
    gap: 12px;
  }
  .bubble {
    padding: 10px 14px;
    line-height: 1.5;
  }
  .user {
    max-width: 75%;
  }
  .reply {
    gap: 10px;
    max-width: 85%;
  }
  .reply img {
    width: 34px;
    height: 34px;
  }
  input {
    padding: 12px 14px;
  }
  .send {
    width: 52px;
  }
}

/* lg: dos columnas, texto y chat (chips dentro de la caja) */
@media (min-width: 1024px) {
  .panel {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 32px;
    padding: 36px;
  }
  .intro {
    flex: 1 1 360px;
    gap: 12px;
  }
  .bot {
    flex-wrap: wrap;
    gap: 12px 16px;
  }
  .bot-text {
    display: contents;
  }
  .avatar {
    width: 88px;
    height: 88px;
  }
  .status {
    font-size: 13px;
  }
  .online {
    display: block;
  }
  .online::before {
    content: none;
  }
  .title {
    font-size: 34px;
    line-height: 1.05;
    white-space: pre-line;
  }
  .chat {
    flex: 1 1 420px;
    background: var(--c-dark-2);
    border-radius: 20px;
    padding: 20px;
    gap: 12px;
  }
  .convo {
    background: none;
    padding: 0;
    border-radius: 0;
  }
  .user {
    max-width: 80%;
  }
  .reply {
    max-width: 90%;
  }
  .reply img {
    width: 36px;
    height: 36px;
  }
  input {
    font-size: 14px;
  }
  .send {
    width: 48px;
  }
}
</style>

<script setup lang="ts">
defineProps<{ hero: SiteContent['hero'] }>()
const img = HERO_AVATAR
</script>

<template>
  <section id="top" class="hero container">
    <div class="copy">
      <p class="chip mono">{{ hero.chip }}<span class="cursor" aria-hidden="true">_</span></p>
      <h1 class="display title">
        {{ hero.title }}<span class="script">{{ hero.script }}</span>
      </h1>
      <p class="body">{{ hero.body }}</p>
      <div class="ctas">
        <a href="#work" class="btn btn-primary cta-work" data-track="hero.cta_work"
          >{{ hero.ctaPrimary }} →</a
        >
        <a :href="hero.cvUrl" class="btn btn-outline cta-cv" download data-track="hero.cta_cv">{{
          hero.ctaSecondary
        }}</a>
      </div>
    </div>

    <div class="visual">
      <div class="arch" aria-hidden="true" />
      <picture>
        <source type="image/avif" :srcset="img.avif" :sizes="img.sizes" />
        <img
          class="avatar"
          :src="img.src"
          :srcset="img.webp"
          :sizes="img.sizes"
          :alt="hero.avatarAlt"
          width="480"
          height="480"
          fetchpriority="high"
        />
      </picture>
      <!-- Tarjeta de código: en móvil solo years/loves, en tablet sin stack (RESPONSIVE.md) -->
      <div class="code mono" aria-hidden="true">
        <div class="dots"><span /><span /><span /></div>
        <div><span class="kw">const</span> jai = {</div>
        <div class="in l-role">
          role: <span class="str">'{{ hero.codeCard.role }}'</span>,
        </div>
        <div class="in">
          years: <span class="num">{{ hero.codeCard.years }}</span
          >,
        </div>
        <div class="in l-stack">
          stack: [<template v-for="(s, i) in hero.codeCard.stack" :key="s"
            ><span class="str">'{{ s }}'</span
            ><template v-if="i < hero.codeCard.stack.length - 1">, </template></template
          >],
        </div>
        <div class="in">
          loves: <span class="str">'{{ hero.codeCard.loves }}'</span>
        </div>
        <div>}</div>
      </div>
      <p class="badge mono">{{ hero.badge }}</p>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): una columna */
.hero {
  padding-top: 8px;
  padding-bottom: var(--section-gap);
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.chip {
  margin: 0;
  font-size: 11px;
  line-height: 1.5;
  color: var(--c-accent-ink);
  background: var(--c-peach-soft);
  padding: 8px 12px;
  border-radius: 8px;
  align-self: flex-start;
}
.cursor {
  color: var(--c-pink-strong);
  animation: blink 1.1s steps(2, start) infinite;
}
@keyframes blink {
  to {
    visibility: hidden;
  }
}
/* Tamaños del mockup como máximo; fluidos para que la línea más larga quepa en 360 px y en tablet angosto */
.title {
  font-size: clamp(40px, 15.8vw - 7px, 54px);
  line-height: 0.9;
  letter-spacing: -0.02em;
}
.title .script {
  font-size: 0.815em;
  margin-top: 4px;
}
.body {
  margin: 0;
  font-size: 16px;
  line-height: 1.55;
}
.ctas {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.cta-work {
  padding: 16px;
}
.cta-cv {
  padding: 14px;
}

.visual {
  position: relative;
  height: 430px;
  margin-top: 10px;
}
.arch {
  position: absolute;
  inset: 0 0 30px;
  background: var(--c-accent);
  border-radius: 180px 180px 32px 32px;
}
.avatar {
  position: absolute;
  left: 18px;
  top: 18px;
  width: calc(100% - 36px);
  height: 360px;
  object-fit: cover;
  object-position: 60% 30%;
  background: #f0a6b8;
  border-radius: 160px 160px 24px 24px;
}
.code {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 230px;
  background: var(--c-dark);
  color: var(--c-peach-soft);
  border-radius: 14px;
  padding: 12px 14px;
  font-size: 11px;
  line-height: 1.6;
  box-shadow: 0 14px 30px rgb(58 26 14 / 0.3);
  white-space: nowrap;
}
.l-role,
.l-stack {
  display: none;
}
.in {
  padding-left: 2ch;
}
.dots {
  display: flex;
  gap: 5px;
  margin-bottom: 6px;
}
.dots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ff6b3d;
}
.dots span:nth-child(2) {
  background: var(--c-pink);
}
.dots span:nth-child(3) {
  background: var(--c-yellow);
}
.kw {
  color: var(--c-code-key);
}
.str {
  color: var(--c-yellow);
}
.num {
  color: var(--c-pink);
}
.badge {
  margin: 0;
  position: absolute;
  right: -6px;
  top: -6px;
  width: 88px;
  height: 88px;
  border-radius: 50%;
  background: var(--c-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  font-size: 9px;
  font-weight: 600;
  color: var(--c-accent-ink);
  line-height: 1.35;
  box-shadow: 0 8px 20px rgb(58 26 14 / 0.18);
  white-space: pre-line;
}

/* md (640–1023): dos columnas 1:1 */
@media (min-width: 640px) {
  .hero {
    padding-top: 12px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 28px;
    align-items: center;
  }
  .copy {
    gap: 20px;
  }
  .chip {
    font-size: 12px;
  }
  .title {
    font-size: clamp(42px, 7.9vw - 8px, 62px);
  }
  .ctas {
    flex-direction: row;
    flex-wrap: wrap;
  }
  .cta-work {
    padding: 15px 22px;
  }
  .cta-cv {
    padding: 13px 20px;
  }
  .visual {
    height: 520px;
    margin-top: 0;
  }
  .arch {
    inset: 0;
    border-radius: 200px 200px 32px 32px;
  }
  .avatar {
    left: 20px;
    top: 20px;
    width: calc(100% - 40px);
    height: 440px;
    object-position: 62% 30%;
    border-radius: 180px 180px 24px 24px;
  }
  .code {
    left: -16px;
    bottom: -20px;
    width: 250px;
    padding: 14px 16px;
    font-size: 12px;
  }
  .l-role {
    display: block;
  }
  .dots span {
    width: 9px;
    height: 9px;
  }
  .badge {
    right: -8px;
    top: -8px;
    width: 100px;
    height: 100px;
    font-size: 10px;
  }
}

/* lg (≥ 1024): mockup de escritorio */
@media (min-width: 1024px) {
  .hero {
    padding-top: 24px;
    padding-bottom: 64px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 48px;
  }
  .copy {
    flex: 1 1 500px;
    gap: 24px;
  }
  .chip {
    font-size: 14px;
    padding: 8px 14px;
  }
  .title {
    font-size: clamp(56px, 8vw, 104px);
  }
  .title .script {
    font-size: 0.8em;
    margin-top: 0;
  }
  .body {
    font-size: 18px;
    max-width: 480px;
  }
  .ctas {
    gap: 14px;
  }
  .cta-work {
    padding: 16px 26px;
  }
  .cta-cv {
    padding: 14px 24px;
  }
  .visual {
    flex: 1 1 400px;
    min-width: 0;
    max-width: 600px;
    margin: 0 auto;
  }
  .arch {
    inset: 0 0 0 auto;
    width: 88%;
    border-radius: 280px 280px 40px 40px;
  }
  .avatar {
    left: auto;
    right: 6%;
    top: 40px;
    width: 76%;
    object-position: 60% 30%;
    border-radius: 240px 240px 32px 32px;
  }
  .code {
    left: 0;
    bottom: 40px;
    width: 310px;
    padding: 18px 20px;
    font-size: 13px;
    line-height: 1.7;
    border-radius: 16px;
    box-shadow: var(--shadow-card);
  }
  .l-stack {
    display: block;
  }
  .dots {
    gap: 6px;
    margin-bottom: 10px;
  }
  .dots span {
    width: 10px;
    height: 10px;
  }
  .badge {
    right: 0;
    top: 24px;
    width: 120px;
    height: 120px;
    font-size: 11px;
    line-height: 1.4;
    box-shadow: 0 8px 24px rgb(58 26 14 / 0.15);
  }
}
</style>

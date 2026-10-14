<script setup lang="ts">
defineProps<{ about: SiteContent['about']; services: SiteContent['services'] }>()
const img = ABOUT_AVATAR
</script>

<template>
  <section id="services" class="section container">
    <div class="card">
      <div class="arch">
        <picture>
          <source type="image/avif" :srcset="img.avif" :sizes="img.sizes" />
          <img
            :src="img.src"
            :srcset="img.webp"
            :sizes="img.sizes"
            :alt="about.avatarAlt"
            width="480"
            height="480"
            loading="lazy"
            decoding="async"
          />
        </picture>
        <div class="braces mono" aria-hidden="true">{ }</div>
      </div>
      <div class="content">
        <div class="intro">
          <h2 class="display title">{{ about.title }}</h2>
          <p class="body">{{ about.body }}</p>
          <p class="signature">{{ about.signature }}</p>
        </div>
        <ul class="services" role="list">
          <li v-for="(s, i) in services" :key="s.title" class="service">
            <span class="num mono" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="service-title">{{ s.title }}</h3>
            <p class="service-body">{{ s.body }}</p>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* base (< 640): arco arriba → título → texto → servicios 2×2 */
.card {
  background: var(--c-surface);
  border-radius: var(--r-card);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.arch {
  position: relative;
  height: 330px;
  background: var(--c-pink);
  border-radius: 160px 160px 22px 22px;
  overflow: hidden;
}
.arch img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 50% 20%;
}
.braces {
  position: absolute;
  left: 12px;
  bottom: 12px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--c-accent-fill);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 15px;
}
.content {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.intro {
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.title {
  font-size: 30px;
  line-height: 1.02;
}
.body {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
}
.signature {
  margin: -6px 0 0;
  font-family: var(--f-script);
  font-weight: 600;
  font-size: 30px;
  color: var(--c-pink-strong);
  /* El espacio de Caveat es muy angosto y el ♡ queda pegado */
  word-spacing: 0.25em;
}
.services {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}
.service {
  background: var(--c-bg);
  border-radius: 16px;
  padding: 14px;
}
.num {
  color: var(--c-accent-ink);
  font-size: 12px;
}
.service-title {
  margin: 4px 0 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.25;
}
.service-body {
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.4;
}

/* md: avatar 260 px + texto; servicios 4 en fila debajo */
@media (min-width: 640px) {
  .card {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 28px;
    align-items: start;
    padding: 28px;
  }
  .arch {
    height: 340px;
    border-radius: 130px 130px 22px 22px;
  }
  .braces {
    width: 54px;
    height: 54px;
  }
  .content {
    display: contents;
  }
  .title {
    font-size: 32px;
  }
  .services {
    grid-column: 1 / -1;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 12px;
  }
  .service {
    padding: 16px;
  }
  .service-title {
    margin-top: 6px;
    font-size: 15px;
  }
  .service-body {
    line-height: 1.45;
  }
}

/* lg: avatar + texto y servicios 2×2 a la derecha */
@media (min-width: 1024px) {
  .card {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 40px;
    padding: 40px;
  }
  .arch {
    flex: 1 1 300px;
    min-width: 0;
    height: 400px;
    border-radius: 200px 200px 28px 28px;
  }
  .braces {
    left: 18px;
    bottom: 18px;
    width: 64px;
    height: 64px;
    font-size: 18px;
  }
  .content {
    flex: 2 1 560px;
    display: flex;
    gap: 24px;
  }
  .title {
    font-size: 34px;
    line-height: 1.05;
  }
  .body {
    font-size: 16px;
  }
  .signature {
    margin-top: 0;
    font-size: 34px;
  }
  .services {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .service {
    border-radius: 18px;
    padding: 20px;
  }
  .num {
    font-size: 13px;
  }
  .service-title {
    font-size: 16px;
    line-height: inherit;
  }
  .service-body {
    font-size: 14px;
    line-height: 1.5;
  }
}
</style>

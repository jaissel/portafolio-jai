// Fuentes responsive de los avatares (generadas por `pnpm assets`). El hero se usa también para el preload del LCP.
const srcset = (name: string, ext: 'avif' | 'webp') =>
  [480, 640, 960].map((w) => `/avatars/${name}-${w}.${ext} ${w}w`).join(', ')

export const HERO_AVATAR = {
  avif: srcset('avatar-code', 'avif'),
  webp: srcset('avatar-code', 'webp'),
  src: '/avatars/avatar-code-480.webp',
  // object-fit: cover en una caja de ~314×360 (móvil) o 440×440 (md/lg): manda el lado mayor
  sizes: '(min-width: 640px) 440px, 360px',
}

export const ABOUT_AVATAR = {
  avif: srcset('avatar-peace', 'avif'),
  webp: srcset('avatar-peace', 'webp'),
  src: '/avatars/avatar-peace-480.webp',
  // Arco de 330–340 px de alto (base/md) o 400 px (lg), con cover
  sizes: '(min-width: 1024px) 400px, 340px',
}

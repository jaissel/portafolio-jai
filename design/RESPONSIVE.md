# Responsive — Solar coral

Tres mockups de referencia: `home-mockup.dc.html` (desktop 1280), `home-tablet.dc.html` (834) y `home-mobile.dc.html` (390). Implementar mobile-first con estos breakpoints:

| Token | Rango | Mockup |
|---|---|---|
| base | < 640 px | móvil 390 |
| `md` | 640–1023 px | tablet 834 |
| `lg` | ≥ 1024 px | desktop 1280 (contenedor máx. 1200) |

## Por sección

| Sección | Móvil | Tablet | Desktop |
|---|---|---|---|
| Header | Logo + switch ES/EN + botón hamburguesa (44×44). Menú = panel oscuro desplegable con links grandes y CTA | Logo + switch + CTA "Hablemos" + hamburguesa; menú flotante a la derecha (320 px) | Nav completo en línea + switch + CTA |
| Hero | Una columna: chip → H1 54px → script → texto → CTAs a ancho completo apilados → arco con avatar debajo; tarjeta de código pequeña abajo a la izquierda; badge 88px | Dos columnas 1:1, H1 62px, avatar 520px de alto | Dos columnas, H1 `clamp(56px, 8vw, 104px)` |
| Sobre mí | Arco del avatar arriba (330px) → título → texto → servicios en 2×2 | Avatar 260px a la izquierda + texto; servicios 4 en fila debajo | Avatar + texto y servicios 2×2 a la derecha |
| Casos de estudio | **Carrusel horizontal** con scroll-snap, tarjetas de 270px, hint "desliza →" y dots | Grid 2×2 | Grid automático (4 en fila) |
| Stack | Etiqueta de capa encima de los chips | Etiqueta 120px a la izquierda | Igual que tablet, al lado de los números |
| Números | 2×2 | 4 en fila | 2×2 a la derecha del stack |
| Lab | Filas con fecha debajo del texto | Filas con fecha a la derecha | Texto a la izquierda y filas a la derecha |
| Chat IA | Chips en scroll horizontal; input con `font-size: 16px` (evita el zoom en iOS) | Chips en wrap; título en una línea al lado del avatar | Dos columnas: texto y chat |
| Footer | Título 44px, CTA a ancho completo, links apilados | Título 60px, links y CTA en una fila | Título `clamp(44px, 6vw, 72px)` |

## Reglas
- Gutter lateral: 20px móvil, 24–32px tablet, 24px más contenedor de 1200 en desktop.
- Radios de las tarjetas grandes: 28px móvil, 32px tablet, 32–36px desktop.
- Áreas táctiles ≥ 44×44 px. Sin hover como única pista.
- Imágenes con `sizes` correctos para cada breakpoint (`@nuxt/image`). Avatar del hero con `fetchpriority="high"`.
- `prefers-reduced-motion`: sin animación del avatar del chat (mostrar el poster).
- Probar en 360, 390, 414, 768, 834, 1024, 1280 y 1440 px.

// El HTML llega completo del servidor; el JS de Nuxt solo hidrata el menú, el carrusel de proyectos y el chat.
// Medido con Lighthouse móvil: la misma página sin JS da LCP 2,0 s y con el JS cargando en paralelo, ~3 s.
// Por eso el JS no compite con el primer render:
// 1. se quitan los modulepreload/prefetch de chunks, y
// 2. el entry se importa en cuanto el navegador pinta el LCP (o antes, si la persona toca o usa el teclado).
const PRELOAD_JS_RE = /<link rel="(?:modulepreload|prefetch)"[^>]*>/g
const ENTRY_RE = /<script type="module" src="([^"]+)"[^>]*><\/script>/

// Sin soporte de LCP (navegadores viejos) se carga al terminar `load`; con soporte, 4 s después de `load` como red de seguridad.
const loader = (src: string) =>
  `<script type="module">let d=!1;const go=()=>{d||(d=!0,import(${JSON.stringify(src)}))};` +
  `for(const e of["pointerdown","keydown","focusin"])addEventListener(e,go,{once:!0,passive:!0});` +
  `const lcp=PerformanceObserver.supportedEntryTypes?.includes("largest-contentful-paint");` +
  `lcp&&new PerformanceObserver(()=>setTimeout(go,0)).observe({type:"largest-contentful-paint",buffered:!0});` +
  `const late=()=>setTimeout(go,lcp?4e3:0);document.readyState==="complete"?late():addEventListener("load",late,{once:!0})</script>`

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html) => {
    html.head = html.head.map((chunk) =>
      chunk.replace(PRELOAD_JS_RE, '').replace(ENTRY_RE, (_, src: string) => loader(src)),
    )
  })
})

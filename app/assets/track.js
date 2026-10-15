// Analítica sin cookies, insertada inline en la página (se importa con ?raw en app/pages/[locale]/index.vue).
// JS plano a propósito: el build del servidor reemplaza window/document por undefined, así que no puede
// ser una función serializada. Corre antes de la hidratación (que se difiere hasta después del LCP).
// Sin cookies ni almacenamiento: cada carga de página es independiente. Respeta DNT y GPC.
;(function () {
  var w = window
  var nav = navigator
  w.jaiTrack = function () {}
  if (nav.doNotTrack === '1' || nav.globalPrivacyControl || /[?&]preview=1/.test(location.search)) return

  var doc = document
  var path = location.pathname
  var lang = doc.documentElement.lang
  function send(t, g, r) {
    var body = JSON.stringify({ t: t, g: g || null, p: path, l: lang, r: r })
    if (!(nav.sendBeacon && nav.sendBeacon('/api/track', body)))
      fetch('/api/track', { method: 'POST', body: body, keepalive: true }).catch(function () {})
  }
  w.jaiTrack = send
  send('pageview', null, doc.referrer)

  // Clicks declarativos: data-track="hero.cta_work". Un enlace con `download` cuenta como descarga del CV.
  doc.addEventListener(
    'click',
    function (e) {
      var el = e.target && e.target.closest && e.target.closest('[data-track]')
      if (el) send(el.hasAttribute('download') ? 'cv_download' : 'click', el.getAttribute('data-track'))
    },
    { capture: true, passive: true },
  )

  // Profundidad de scroll: 25/50/75/100 %, una vez por carga
  var seen = {}
  addEventListener(
    'scroll',
    function () {
      var pct = ((scrollY + innerHeight) / doc.documentElement.scrollHeight) * 100
      ;[25, 50, 75, 100].forEach(function (m) {
        if (pct >= m - 1 && !seen[m]) {
          seen[m] = 1
          send('scroll_depth', String(m))
        }
      })
    },
    { passive: true },
  )

  // Secciones vistas al cruzar la franja central de la pantalla (sirve para secciones más altas que la
  // pantalla), una vez cada una: embudo y heatmap del dashboard
  function observe() {
    if (!('IntersectionObserver' in w)) return
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return
          io.unobserve(en.target)
          send('section_view', en.target.getAttribute('data-track-section'))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    doc.querySelectorAll('[data-track-section]').forEach(function (el) {
      io.observe(el)
    })
  }
  if (doc.readyState === 'loading') doc.addEventListener('DOMContentLoaded', observe)
  else observe()
})()

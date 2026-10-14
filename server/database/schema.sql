-- Esquema completo de referencia. Los cambios se aplican con migraciones en ./migrations.

-- Contenido editable, un documento JSON por sección e idioma
CREATE TABLE IF NOT EXISTS content (
  locale     TEXT NOT NULL,          -- 'es' | 'en'
  section    TEXT NOT NULL,          -- 'hero','about','services','projects','stack','stats','lab','ask','footer','nav','seo','ui'
  data       TEXT NOT NULL,          -- JSON
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (locale, section)
);

-- Eventos de analítica (sin cookies, sin IP)
CREATE TABLE IF NOT EXISTS events (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  ts         INTEGER NOT NULL,
  type       TEXT NOT NULL,          -- 'pageview' | 'click' | 'cv_download' | 'chat_open' | 'chat_ask' | 'scroll_depth'
  target     TEXT,
  path       TEXT,
  locale     TEXT,
  referrer   TEXT,                   -- solo el dominio
  country    TEXT,                   -- cf-ipcountry
  device     TEXT,                   -- 'mobile' | 'desktop' | 'tablet'
  visitor    TEXT                    -- hash(ip + user-agent + sal diaria)
);
CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);
CREATE INDEX IF NOT EXISTS idx_events_type_target ON events(type, target);

-- Preguntas del chat
CREATE TABLE IF NOT EXISTS chat_logs (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  ts        INTEGER NOT NULL,
  locale    TEXT,
  question  TEXT NOT NULL,
  answer    TEXT,
  country   TEXT,
  flagged   INTEGER DEFAULT 0
);

-- Rate limit simple
CREATE TABLE IF NOT EXISTS rate_limits (
  key        TEXT PRIMARY KEY,       -- hash de IP + ventana
  count      INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);

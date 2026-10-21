import type { H3Event } from 'h3'

// Tipos mínimos de D1 (lo que usamos), para no depender de @cloudflare/workers-types.
export interface D1Result<T> {
  results: T[]
}
export interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement
  first<T = Record<string, unknown>>(): Promise<T | null>
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>
  run(): Promise<unknown>
}
export interface D1Database {
  prepare(query: string): D1PreparedStatement
  batch(statements: D1PreparedStatement[]): Promise<unknown[]>
}

interface CloudflareEnv {
  DB?: D1Database
  HASH_SALT_SECRET?: string
  // Dashboard (Fase 4): login con GitHub
  NUXT_SESSION_PASSWORD?: string
  NUXT_OAUTH_GITHUB_CLIENT_ID?: string
  NUXT_OAUTH_GITHUB_CLIENT_SECRET?: string
  ADMIN_GITHUB_LOGIN?: string
}

/** Bindings y variables de Cloudflare (en dev las provee nitro-cloudflare-dev desde wrangler.toml y .dev.vars). */
export function useCloudflareEnv(event: H3Event): CloudflareEnv {
  return (event.context.cloudflare?.env ?? {}) as CloudflareEnv
}

/** D1 o `null` si no hay binding (p. ej. en un entorno sin Cloudflare): quien llama decide el fallback. */
export function useDB(event: H3Event): D1Database | null {
  return useCloudflareEnv(event).DB ?? null
}

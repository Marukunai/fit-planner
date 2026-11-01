import { describe, expect, it } from 'vitest'
import { parseEnv } from './env'

const valid = {
  VITE_SUPABASE_URL: 'http://127.0.0.1:54321',
  VITE_SUPABASE_ANON_KEY: 'anon-key',
  VITE_APP_URL: 'http://localhost:5173',
}

describe('parseEnv', () => {
  it('acepta una configuración válida y aplica el nombre por defecto', () => {
    const env = parseEnv(valid)
    expect(env.VITE_APP_NAME).toBe('Fit Planner')
    expect(env.VITE_VAPID_PUBLIC_KEY).toBeUndefined()
  })

  it('rechaza una URL de Supabase inválida con un mensaje legible', () => {
    expect(() => parseEnv({ ...valid, VITE_SUPABASE_URL: 'no-es-una-url' })).toThrow(
      /VITE_SUPABASE_URL/,
    )
  })

  it('rechaza si falta la clave anon', () => {
    const rest: Record<string, unknown> = { ...valid }
    delete rest.VITE_SUPABASE_ANON_KEY
    expect(() => parseEnv(rest)).toThrow(/VITE_SUPABASE_ANON_KEY/)
  })
})

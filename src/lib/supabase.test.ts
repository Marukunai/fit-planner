import { afterEach, describe, expect, it, vi } from 'vitest'

describe('getSupabase', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('devuelve siempre la misma instancia', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'http://127.0.0.1:54321')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'clave-publica-de-prueba')
    vi.stubEnv('VITE_APP_URL', 'http://localhost:5173')
    const { getSupabase } = await import('./supabase')
    expect(getSupabase()).toBe(getSupabase())
  })

  it('falla con un mensaje claro si falta la configuración', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    vi.stubEnv('VITE_APP_URL', '')
    const { getSupabase } = await import('./supabase')
    expect(() => getSupabase()).toThrow(/Variables de entorno no válidas/)
  })
})

import { createClient, type SupabaseClient } from '@supabase/supabase-js'

import type { Database } from '@/types/database.types'

import { getEnv } from './env'

export type AppSupabaseClient = SupabaseClient<Database>

let client: AppSupabaseClient | undefined

/**
 * Único cliente de Supabase de la app. Se crea la primera vez que se pide,
 * así un .env.local incompleto da un mensaje claro en lugar de romper al importar.
 * Usa solo la clave pública (anon/publishable); la seguridad la aplica el RLS.
 */
export function getSupabase(): AppSupabaseClient {
  if (!client) {
    const env = getEnv()
    client = createClient<Database>(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  }
  return client
}

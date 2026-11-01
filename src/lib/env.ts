import { z } from 'zod'

const envSchema = z.object({
  VITE_SUPABASE_URL: z.url(),
  VITE_SUPABASE_ANON_KEY: z.string().min(1),
  VITE_APP_NAME: z.string().min(1).default('Fit Planner'),
  VITE_APP_URL: z.url(),
  VITE_VAPID_PUBLIC_KEY: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

export function parseEnv(raw: Record<string, unknown>): Env {
  const result = envSchema.safeParse(raw)
  if (!result.success) {
    const problems = result.error.issues
      .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
      .join('\n')
    throw new Error(
      `Variables de entorno no válidas. Revisa tu .env.local (modelo en .env.example):\n${problems}`,
    )
  }
  return result.data
}

let cached: Env | undefined

/** Lectura perezosa y validada: falla con un mensaje claro si falta algo. */
export function getEnv(): Env {
  cached ??= parseEnv(import.meta.env)
  return cached
}

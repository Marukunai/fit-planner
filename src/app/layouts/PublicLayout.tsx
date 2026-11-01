import { Outlet } from 'react-router-dom'
import { getAppName } from '@/app/app-name'

/** Pantallas sin sesión: acceso y 404. */
export function PublicLayout() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center gap-6 px-6 py-10">
        <p className="text-center font-display text-2xl font-semibold text-primary">
          {getAppName()}
        </p>
        <Outlet />
      </main>
    </div>
  )
}

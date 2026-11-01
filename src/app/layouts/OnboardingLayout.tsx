import { Outlet } from 'react-router-dom'
import { getAppName } from '@/app/app-name'

/** Emparejamiento: crear espacio, código, unirse y tour. */
export function OnboardingLayout() {
  return (
    <div className="min-h-dvh bg-bg text-ink">
      <main className="mx-auto flex min-h-dvh max-w-lg flex-col gap-6 px-6 py-10">
        <p className="font-display text-xl font-semibold text-primary">{getAppName()}</p>
        <Outlet />
      </main>
    </div>
  )
}

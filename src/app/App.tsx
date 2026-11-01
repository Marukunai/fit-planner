import { lazy, Suspense } from 'react'
import { Toaster } from '@/components/ui/toaster'

// La página /design solo existe en desarrollo; en producción se elimina del build.
const DesignPage = import.meta.env.DEV ? lazy(() => import('./design/DesignPage')) : null

export function App() {
  const showDesign = DesignPage !== null && window.location.pathname === '/design'

  return (
    <>
      {showDesign && DesignPage ? (
        <Suspense fallback={null}>
          <DesignPage />
        </Suspense>
      ) : (
        <main className="mx-auto max-w-content p-6">
          <h1 className="text-3xl">Fit Planner</h1>
          {import.meta.env.DEV && (
            <p className="mt-2 text-sm text-muted">
              <a className="text-primary underline" href="/design">
                Ver sistema de diseño
              </a>
            </p>
          )}
        </main>
      )}
      <Toaster />
    </>
  )
}

import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { QuickAddSheet } from '@/components/shared/quick-add-sheet'
import { SideNav } from '@/components/shared/side-nav'
import { TabBar } from '@/components/shared/tab-bar'
import { getAppName } from '@/app/app-name'
import { activeNavId, mainNav } from '@/app/nav'

/** Zona de la pareja: barra inferior en móvil, navegación lateral en escritorio. */
export function AuthenticatedLayout() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const [addOpen, setAddOpen] = useState(false)
  const activeId = activeNavId(pathname) ?? ''

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-control focus:bg-surface focus:px-4 focus:py-2 focus:shadow-soft"
      >
        Saltar al contenido
      </a>
      <SideNav
        items={mainNav}
        activeId={activeId}
        appName={getAppName()}
        onAdd={() => setAddOpen(true)}
        className="fixed inset-y-0 left-0 z-30 hidden w-60 md:flex"
      />
      <main
        id="contenido"
        className="mx-auto max-w-content px-4 pb-28 pt-6 md:pb-10 md:pl-[17rem] md:pr-8"
      >
        <Outlet />
      </main>
      <TabBar
        items={mainNav}
        activeId={activeId}
        onSelect={(id) => {
          const target = mainNav.find((item) => item.id === id)
          if (target) navigate(target.to)
        }}
        onAdd={() => setAddOpen(true)}
        className="fixed inset-x-0 bottom-0 z-30 md:hidden"
      />
      <QuickAddSheet open={addOpen} onOpenChange={setAddOpen} />
    </div>
  )
}

import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { type NavItem } from '@/app/nav'

interface SideNavProps {
  items: readonly NavItem[]
  activeId: string
  appName: string
  onAdd: () => void
  className?: string
}

/** Navegación lateral para pantallas anchas. */
export function SideNav({ items, activeId, appName, onAdd, className }: SideNavProps) {
  return (
    <aside className={cn('flex-col gap-6 border-r bg-surface p-4', className)}>
      <p className="px-3 pt-2 font-display text-xl font-semibold">{appName}</p>
      <Button onClick={onAdd} className="w-full">
        <Plus className="h-5 w-5" aria-hidden="true" />
        Añadir
      </Button>
      <nav aria-label="Navegación lateral" className="flex flex-col gap-1">
        {items.map(({ id, label, icon: Icon, to }) => {
          const active = id === activeId
          return (
            <Link
              key={id}
              to={to}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex min-h-11 items-center gap-3 rounded-control px-3 text-sm transition-colors duration-micro',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                active
                  ? 'bg-primary-soft font-semibold text-primary'
                  : 'font-medium text-muted hover:bg-surface-2 hover:text-ink',
              )}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

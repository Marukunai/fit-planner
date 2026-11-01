import { Plus, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface TabItem {
  id: string
  label: string
  icon: LucideIcon
}

interface TabBarProps {
  /** Cinco pestañas: las dos primeras quedan a la izquierda del botón "+", el resto a la derecha. */
  items: readonly TabItem[]
  activeId: string
  onSelect: (id: string) => void
  onAdd: () => void
  className?: string
}

export function TabBar({ items, activeId, onSelect, onAdd, className }: TabBarProps) {
  const renderTab = ({ id, label, icon: Icon }: TabItem) => {
    const active = id === activeId
    return (
      <button
        key={id}
        type="button"
        aria-current={active ? 'page' : undefined}
        onClick={() => onSelect(id)}
        className={cn(
          'flex min-h-14 flex-col items-center justify-center gap-0.5 text-xs transition-colors duration-micro',
          active ? 'font-semibold text-primary' : 'font-medium text-muted hover:text-ink',
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
        {label}
      </button>
    )
  }

  return (
    <nav
      aria-label="Navegación principal"
      className={cn(
        'grid grid-cols-6 items-end border-t bg-surface pb-[env(safe-area-inset-bottom)]',
        className,
      )}
    >
      {items.slice(0, 2).map(renderTab)}
      <button
        type="button"
        aria-label="Añadir"
        onClick={onAdd}
        className="mx-auto mb-2 grid h-14 w-14 place-items-center rounded-full bg-primary text-on-primary shadow-soft transition-transform duration-micro ease-soft active:scale-95 motion-reduce:active:scale-100"
      >
        <Plus className="h-6 w-6" aria-hidden="true" />
      </button>
      {items.slice(2).map(renderTab)}
    </nav>
  )
}

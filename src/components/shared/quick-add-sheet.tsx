import { Link } from 'react-router-dom'
import { Sheet, SheetClose, SheetContent } from '@/components/ui/sheet'
import { quickActions } from '@/app/nav'

interface QuickAddSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/** Hoja del botón "+": acciones rápidas de creación. */
export function QuickAddSheet({ open, onOpenChange }: QuickAddSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent title="¿Qué quieres añadir?">
        <ul className="flex flex-col gap-2">
          {quickActions.map(({ label, description, to, icon: Icon }) => (
            <li key={to}>
              <SheetClose asChild>
                <Link
                  to={to}
                  className="flex min-h-14 items-center gap-4 rounded-card bg-surface-2 px-4 py-3 transition-colors duration-micro hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-soft text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="flex flex-col">
                    <span className="text-sm font-semibold">{label}</span>
                    <span className="text-xs text-muted">{description}</span>
                  </span>
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  )
}

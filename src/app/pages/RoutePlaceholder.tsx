import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'
import { EmptyState } from '@/components/shared/empty-state'

interface RoutePlaceholderProps {
  icon: LucideIcon
  title: string
  emptyTitle: string
  description: string
  action?: ReactNode
}

/** Maqueta de una pantalla aún sin construir: título de página + estado vacío ilustrado. */
export function RoutePlaceholder({
  icon,
  title,
  emptyTitle,
  description,
  action,
}: RoutePlaceholderProps) {
  return (
    <section>
      <h1 className="text-3xl">{title}</h1>
      <EmptyState icon={icon} title={emptyTitle} description={description} action={action} />
    </section>
  )
}

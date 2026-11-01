import { type LucideIcon } from 'lucide-react'
import { type ReactNode } from 'react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-6 py-12 text-center">
      <div className="relative grid h-28 w-28 place-items-center" aria-hidden="true">
        <svg viewBox="0 0 112 112" className="absolute inset-0 text-primary-soft">
          <path d="M56 6c22 0 46 14 50 38s-8 52-34 60S18 98 8 70 14 6 56 6z" fill="currentColor" />
          <circle cx="98" cy="18" r="6" className="fill-accent" opacity="0.8" />
          <circle cx="14" cy="96" r="4" className="fill-primary" opacity="0.5" />
        </svg>
        <Icon className="relative h-10 w-10 text-primary" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl">{title}</h3>
      <p className="max-w-xs text-sm text-muted">{description}</p>
      {action}
    </div>
  )
}

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

/** Etiqueta seleccionable. El área táctil llega a 44 px aunque el chip mida 36. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, selected = false, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-pressed={selected}
      className={cn(
        'relative inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm font-medium',
        'transition-colors duration-micro ease-soft',
        'before:absolute before:-inset-y-1 before:inset-x-0 before:content-[""]',
        selected
          ? 'border-primary bg-primary-soft text-primary'
          : 'border-border bg-surface-2 text-ink hover:border-muted',
        className,
      )}
      {...props}
    />
  ),
)
Chip.displayName = 'Chip'

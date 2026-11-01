import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  interactive?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'rounded-card border bg-surface shadow-soft',
        interactive &&
          'transition-transform duration-base ease-soft hover:-translate-y-0.5 active:translate-y-0 motion-reduce:transform-none',
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

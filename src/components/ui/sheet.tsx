import * as Dialog from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Sheet = Dialog.Root
export const SheetTrigger = Dialog.Trigger
export const SheetClose = Dialog.Close

interface SheetContentProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
}

/** Hoja inferior (bottom sheet) accesible: foco atrapado, Esc para cerrar. */
export function SheetContent({ title, description, children, className }: SheetContentProps) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-[var(--overlay)] [animation-duration:250ms] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
      <Dialog.Content
        {...(description ? {} : { 'aria-describedby': undefined })}
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-sheet bg-surface p-6 shadow-soft',
          'pb-[max(1.5rem,env(safe-area-inset-bottom))] focus:outline-none',
          '[animation-duration:350ms] [animation-timing-function:cubic-bezier(.2,.8,.2,1)]',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
          className,
        )}
      >
        <div aria-hidden="true" className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-border" />
        <Dialog.Title className="font-display text-xl font-semibold">{title}</Dialog.Title>
        {description && (
          <Dialog.Description className="mt-1 text-sm text-muted">{description}</Dialog.Description>
        )}
        <div className="mt-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  )
}

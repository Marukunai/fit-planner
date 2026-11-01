import { useId, type ReactNode } from 'react'

interface FieldControlProps {
  id: string
  'aria-describedby'?: string
  'aria-invalid'?: true
}

interface FieldProps {
  label: string
  hint?: string
  error?: string
  children: (control: FieldControlProps) => ReactNode
}

/** Etiqueta + control + pista/error, con los atributos ARIA ya asociados. */
export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  const messageId = `${id}-msg`
  const message = error ?? hint
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-ink">
        {label}
      </label>
      {children({
        id,
        'aria-describedby': message ? messageId : undefined,
        'aria-invalid': error ? true : undefined,
      })}
      {message && (
        <p
          id={messageId}
          role={error ? 'alert' : undefined}
          className={error ? 'text-sm text-danger-strong' : 'text-sm text-muted'}
        >
          {message}
        </p>
      )}
    </div>
  )
}

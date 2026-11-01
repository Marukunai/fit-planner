import { type CSSProperties } from 'react'
import { Toaster as Sonner } from 'sonner'
import { useThemeStore } from '@/lib/theme'

const toastVars = {
  '--normal-bg': 'var(--surface)',
  '--normal-text': 'var(--ink)',
  '--normal-border': 'var(--border)',
  '--border-radius': '16px',
} as CSSProperties

// Abajo y por encima de la barra de pestañas (móvil), para no tapar el contenido.
const toastOffset = { bottom: 'calc(5.5rem + env(safe-area-inset-bottom))' }

export function Toaster() {
  const theme = useThemeStore((state) => state.theme)
  return (
    <Sonner
      theme={theme}
      position="bottom-center"
      offset={toastOffset}
      mobileOffset={toastOffset}
      style={toastVars}
    />
  )
}

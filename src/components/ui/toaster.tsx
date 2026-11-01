import { type CSSProperties } from 'react'
import { Toaster as Sonner } from 'sonner'
import { useThemeStore } from '@/lib/theme'

const toastVars = {
  '--normal-bg': 'var(--surface)',
  '--normal-text': 'var(--ink)',
  '--normal-border': 'var(--border)',
  '--border-radius': '16px',
} as CSSProperties

export function Toaster() {
  const theme = useThemeStore((state) => state.theme)
  return <Sonner theme={theme} position="top-center" style={toastVars} />
}

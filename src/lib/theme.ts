import { create } from 'zustand'

export type Theme = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'fp-theme'
const THEME_COLORS = { light: '#FAF8F5', dark: '#121014' } as const

export function resolveTheme(theme: Theme, prefersDark: boolean): 'light' | 'dark' {
  if (theme === 'system') return prefersDark ? 'dark' : 'light'
  return theme
}

function systemPrefersDark(): boolean {
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false
}

function readStored(): Theme {
  try {
    const value = localStorage.getItem(STORAGE_KEY)
    if (value === 'light' || value === 'dark' || value === 'system') return value
  } catch {
    /* almacenamiento no disponible: se usa el valor por defecto */
  }
  return 'system'
}

function applyTheme(theme: Theme): void {
  const resolved = resolveTheme(theme, systemPrefersDark())
  const root = document.documentElement
  root.classList.toggle('dark', resolved === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', THEME_COLORS[resolved])
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: readStored(),
  setTheme: (theme) => {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* almacenamiento no disponible: el cambio solo dura la sesión */
    }
    applyTheme(theme)
    set({ theme })
  },
}))

/** Aplica el tema guardado y reacciona a cambios del sistema. Llamar antes de renderizar. */
export function initTheme(): void {
  applyTheme(useThemeStore.getState().theme)
  window.matchMedia?.('(prefers-color-scheme: dark)')?.addEventListener('change', () => {
    if (useThemeStore.getState().theme === 'system') applyTheme('system')
  })
}

import { beforeEach, describe, expect, it } from 'vitest'
import { resolveTheme, useThemeStore } from './theme'

describe('resolveTheme', () => {
  it('respeta la elección explícita', () => {
    expect(resolveTheme('light', true)).toBe('light')
    expect(resolveTheme('dark', false)).toBe('dark')
  })

  it('en automático sigue al sistema', () => {
    expect(resolveTheme('system', true)).toBe('dark')
    expect(resolveTheme('system', false)).toBe('light')
  })
})

describe('useThemeStore', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('aplica y quita la clase dark al cambiar de tema', () => {
    useThemeStore.getState().setTheme('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    useThemeStore.getState().setTheme('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})

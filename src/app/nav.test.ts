import { describe, expect, it } from 'vitest'
import { activeNavId } from './nav'

describe('activeNavId', () => {
  it.each([
    ['/', 'home'],
    ['/wardrobe', 'wardrobe'],
    ['/wardrobe/abc', 'wardrobe'],
    ['/outfits/new', 'wardrobe'],
    ['/plans/new', 'plans'],
    ['/tips/42', 'tips'],
    ['/us', 'us'],
    ['/settings', 'us'],
    ['/notifications', 'us'],
  ])('%s → %s', (pathname, expected) => {
    expect(activeNavId(pathname)).toBe(expected)
  })

  it('no marca ninguna sección en rutas desconocidas', () => {
    expect(activeNavId('/nada-por-aqui')).toBeUndefined()
  })
})

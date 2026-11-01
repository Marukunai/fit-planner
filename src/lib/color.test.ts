import { describe, expect, it } from 'vitest'
import { contrastRatio, ratingColor, readableOn } from './color'

describe('ratingColor', () => {
  it('respeta los tres puntos de la escala del documento', () => {
    expect(ratingColor(1)).toBe('#D9453D')
    expect(ratingColor(5)).toBe('#E3A21A')
    expect(ratingColor(10)).toBe('#2FA36B')
  })

  it('limita valores fuera de rango', () => {
    expect(ratingColor(-3)).toBe(ratingColor(1))
    expect(ratingColor(99)).toBe(ratingColor(10))
  })
})

describe('contrastRatio', () => {
  it('da 21 entre negro y blanco', () => {
    expect(contrastRatio('#000000', '#FFFFFF')).toBeCloseTo(21, 0)
  })
})

describe('readableOn', () => {
  it('elige texto claro sobre fondos oscuros y oscuro sobre claros', () => {
    expect(readableOn('#1B181F')).toBe('#FFFFFF')
    expect(readableOn('#FAF8F5')).toBe('#1F1B24')
  })

  it('el número de cada nota es legible (contraste ≥ 3 para texto grande y en negrita)', () => {
    for (let score = 1; score <= 10; score++) {
      const background = ratingColor(score)
      expect(contrastRatio(background, readableOn(background))).toBeGreaterThanOrEqual(3)
    }
  })
})

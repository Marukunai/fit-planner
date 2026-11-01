type RGB = readonly [number, number, number]

const LOW: RGB = [217, 69, 61] // #D9453D
const MID: RGB = [227, 162, 26] // #E3A21A
const HIGH: RGB = [47, 163, 107] // #2FA36B

const INK = '#1F1B24'
const WHITE = '#FFFFFF'

function mix(a: RGB, b: RGB, t: number): RGB {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function toHex(rgb: RGB): string {
  return (
    '#' +
    rgb
      .map((c) => Math.round(c).toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  )
}

function hexToRgb(hex: string): RGB {
  const clean = hex.replace('#', '')
  const n = parseInt(clean, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** Color de la escala de valoración: rojo (1) → ámbar (5) → verde (10). */
export function ratingColor(score: number): string {
  const s = Math.min(10, Math.max(1, score))
  return toHex(s <= 5 ? mix(LOW, MID, (s - 1) / 4) : mix(MID, HIGH, (s - 5) / 5))
}

export function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  }) as [number, number, number]
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Ratio de contraste WCAG entre dos colores hexadecimales. */
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a)
  const lb = relativeLuminance(b)
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05)
}

/** Devuelve blanco o tinta, el que mejor contraste dé sobre el fondo indicado. */
export function readableOn(background: string): string {
  return contrastRatio(background, WHITE) >= contrastRatio(background, INK) ? WHITE : INK
}

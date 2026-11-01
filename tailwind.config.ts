import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

// Los tokens de diseño (colores, tipografías, radios) se añaden en el bloque 4.
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: { extend: {} },
  plugins: [animate],
} satisfies Config

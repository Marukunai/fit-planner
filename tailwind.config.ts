import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        muted: 'var(--muted)',
        border: 'var(--border)',
        primary: {
          DEFAULT: 'var(--primary)',
          hover: 'var(--primary-hover)',
          soft: 'var(--primary-soft)',
        },
        'on-primary': 'var(--on-primary)',
        accent: 'var(--accent)',
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger: {
          DEFAULT: 'var(--danger)',
          strong: 'var(--danger-strong)',
        },
        'on-danger': 'var(--on-danger)',
        'partner-a': 'var(--partner-a)',
        'partner-b': 'var(--partner-b)',
      },
      fontFamily: {
        display: ['"Fraunces Variable"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans Variable"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1.5' }],
        sm: ['0.875rem', { lineHeight: '1.5' }],
        base: ['1rem', { lineHeight: '1.5' }],
        lg: ['1.125rem', { lineHeight: '1.5' }],
        xl: ['1.375rem', { lineHeight: '1.4' }],
        '2xl': ['1.75rem', { lineHeight: '1.3' }],
        '3xl': ['2.25rem', { lineHeight: '1.25' }],
      },
      borderRadius: {
        control: '12px',
        card: '16px',
        sheet: '24px',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
      },
      maxWidth: {
        content: '1120px',
      },
      transitionDuration: {
        micro: '150ms',
        base: '250ms',
        sheet: '350ms',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.2,.8,.2,1)',
      },
    },
  },
  plugins: [animate],
} satisfies Config

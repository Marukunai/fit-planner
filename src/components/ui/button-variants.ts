import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  [
    'inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-control font-semibold',
    'transition-[background-color,transform,filter] duration-micro ease-soft',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
    'active:scale-[.98] motion-reduce:active:scale-100',
  ],
  {
    variants: {
      variant: {
        primary: 'bg-primary text-on-primary shadow-soft hover:bg-primary-hover',
        secondary: 'bg-surface-2 text-ink hover:brightness-95',
        ghost: 'bg-transparent text-ink hover:bg-surface-2',
        destructive: 'bg-danger-strong text-on-danger hover:brightness-95',
      },
      size: {
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  },
)

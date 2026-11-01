import { useId } from 'react'
import { ratingColor, readableOn } from '@/lib/color'
import { cn } from '@/lib/utils'

interface RatingSliderProps {
  value: number
  onChange: (value: number) => void
  label?: string
  className?: string
}

function haptic() {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(8)
}

/** Selector de nota 1-10. Siempre muestra el número: el color nunca va solo. */
export function RatingSlider({ value, onChange, label = 'Tu nota', className }: RatingSliderProps) {
  const id = useId()
  const background = ratingColor(value)
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
        </label>
        <output
          htmlFor={id}
          className="grid h-11 w-11 place-items-center rounded-full font-display text-xl font-bold transition-colors duration-micro"
          style={{ backgroundColor: background, color: readableOn(background) }}
        >
          {value}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={1}
        max={10}
        step={1}
        value={value}
        aria-valuetext={`${value} de 10`}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (next !== value) {
            haptic()
            onChange(next)
          }
        }}
        className="h-11 w-full cursor-pointer accent-primary"
      />
      <div aria-hidden="true" className="flex justify-between px-1 text-xs text-muted">
        {Array.from({ length: 10 }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
    </div>
  )
}

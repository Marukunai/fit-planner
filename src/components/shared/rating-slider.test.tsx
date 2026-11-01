import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RatingSlider } from './rating-slider'

describe('RatingSlider', () => {
  it('muestra la nota actual y la anuncia como "N de 10"', () => {
    render(<RatingSlider value={7} onChange={() => {}} />)
    const slider = screen.getByLabelText('Tu nota')
    expect(slider).toHaveValue('7')
    expect(slider).toHaveAttribute('aria-valuetext', '7 de 10')
    expect(screen.getByRole('status')).toHaveTextContent('7')
  })

  it('avisa con la nueva nota al moverlo', () => {
    const onChange = vi.fn()
    render(<RatingSlider value={5} onChange={onChange} />)
    fireEvent.change(screen.getByLabelText('Tu nota'), { target: { value: '9' } })
    expect(onChange).toHaveBeenCalledWith(9)
  })
})

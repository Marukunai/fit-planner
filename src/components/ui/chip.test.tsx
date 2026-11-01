import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Chip } from './chip'

describe('Chip', () => {
  it('refleja su estado con aria-pressed', () => {
    const { rerender } = render(<Chip>Verano</Chip>)
    expect(screen.getByRole('button', { name: 'Verano' })).toHaveAttribute('aria-pressed', 'false')
    rerender(<Chip selected>Verano</Chip>)
    expect(screen.getByRole('button', { name: 'Verano' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('dispara onClick', () => {
    const onClick = vi.fn()
    render(<Chip onClick={onClick}>Casual</Chip>)
    fireEvent.click(screen.getByRole('button', { name: 'Casual' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

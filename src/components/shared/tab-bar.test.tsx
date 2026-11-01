import { fireEvent, render, screen } from '@testing-library/react'
import { CalendarDays, Heart, House, Lightbulb, Shirt } from 'lucide-react'
import { describe, expect, it, vi } from 'vitest'
import { TabBar } from './tab-bar'

const items = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'wardrobe', label: 'Armario', icon: Shirt },
  { id: 'plans', label: 'Planes', icon: CalendarDays },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'us', label: 'Nosotros', icon: Heart },
] as const

describe('TabBar', () => {
  it('marca la pestaña activa con aria-current', () => {
    render(<TabBar items={items} activeId="plans" onSelect={() => {}} onAdd={() => {}} />)
    expect(screen.getByRole('button', { name: 'Planes' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('button', { name: 'Inicio' })).not.toHaveAttribute('aria-current')
  })

  it('avisa de la pestaña elegida y del botón "Añadir"', () => {
    const onSelect = vi.fn()
    const onAdd = vi.fn()
    render(<TabBar items={items} activeId="home" onSelect={onSelect} onAdd={onAdd} />)
    fireEvent.click(screen.getByRole('button', { name: 'Tips' }))
    fireEvent.click(screen.getByRole('button', { name: 'Añadir' }))
    expect(onSelect).toHaveBeenCalledWith('tips')
    expect(onAdd).toHaveBeenCalledTimes(1)
  })
})

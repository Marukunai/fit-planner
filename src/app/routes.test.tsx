import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { appRoutes } from './routes'

function renderAt(path: string) {
  const router = createMemoryRouter(appRoutes, { initialEntries: [path] })
  render(<RouterProvider router={router} />)
  return router
}

describe('rutas', () => {
  it('muestra Inicio con la barra de navegación', async () => {
    renderAt('/')
    expect(await screen.findByRole('heading', { level: 1, name: 'Inicio' })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: 'Navegación principal' })).toBeInTheDocument()
  })

  it('marca la sección activa y agrupa los outfits en Armario', async () => {
    renderAt('/outfits')
    const tabs = await screen.findByRole('navigation', { name: 'Navegación principal' })
    expect(within(tabs).getByRole('button', { name: 'Armario' })).toHaveAttribute(
      'aria-current',
      'page',
    )
  })

  it('navega al pulsar una pestaña', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    const tabs = await screen.findByRole('navigation', { name: 'Navegación principal' })
    await user.click(within(tabs).getByRole('button', { name: 'Tips' }))
    expect(router.state.location.pathname).toBe('/tips')
    expect(await screen.findByRole('heading', { level: 1, name: 'Tips' })).toBeInTheDocument()
  })

  it('el botón "+" ofrece las cuatro acciones rápidas', async () => {
    const user = userEvent.setup()
    const router = renderAt('/')
    const tabs = await screen.findByRole('navigation', { name: 'Navegación principal' })
    await user.click(within(tabs).getByRole('button', { name: 'Añadir' }))
    const dialog = await screen.findByRole('dialog', { name: '¿Qué quieres añadir?' })
    expect(within(dialog).getAllByRole('link')).toHaveLength(4)
    await user.click(within(dialog).getByRole('link', { name: /Nuevo tip/ }))
    expect(router.state.location.pathname).toBe('/tips/new')
  })

  it('las rutas públicas no llevan la navegación de la app', async () => {
    renderAt('/login')
    expect(await screen.findByRole('heading', { level: 1, name: 'Entrar' })).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('una ruta desconocida muestra el 404 con enlace a inicio', async () => {
    renderAt('/esto-no-existe')
    expect(await screen.findByRole('heading', { name: 'Página no encontrada' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/')
  })
})

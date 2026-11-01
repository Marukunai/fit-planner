import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from '@/app/App'
import { initTheme } from '@/lib/theme'
import '@/styles/globals.css'

initTheme()

const root = document.getElementById('root')
if (!root) throw new Error('No se encuentra el elemento #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

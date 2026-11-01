import {
  CalendarDays,
  CalendarPlus,
  Heart,
  House,
  Lightbulb,
  Shirt,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import { type TabItem } from '@/components/shared/tab-bar'

export interface NavItem extends TabItem {
  to: string
}

/** Las cinco secciones principales (barra inferior en móvil, lateral en escritorio). */
export const mainNav: readonly NavItem[] = [
  { id: 'home', label: 'Inicio', icon: House, to: '/' },
  { id: 'wardrobe', label: 'Armario', icon: Shirt, to: '/wardrobe' },
  { id: 'plans', label: 'Planes', icon: CalendarDays, to: '/plans' },
  { id: 'tips', label: 'Tips', icon: Lightbulb, to: '/tips' },
  { id: 'us', label: 'Nosotros', icon: Heart, to: '/us' },
]

export interface QuickAction {
  label: string
  description: string
  to: string
  icon: LucideIcon
}

/** Acciones del botón "+". */
export const quickActions: readonly QuickAction[] = [
  {
    label: 'Añadir prenda',
    description: 'Foto, recorte y etiquetas',
    to: '/wardrobe/new',
    icon: Shirt,
  },
  {
    label: 'Crear outfit',
    description: 'Combina prendas de los dos',
    to: '/outfits/new',
    icon: Sparkles,
  },
  { label: 'Nuevo plan', description: 'Cena, cita, viaje…', to: '/plans/new', icon: CalendarPlus },
  { label: 'Nuevo tip', description: 'Una idea de compra', to: '/tips/new', icon: Lightbulb },
]

/** Sección principal a la que pertenece una ruta (los outfits cuelgan del armario). */
export function activeNavId(pathname: string): string | undefined {
  if (pathname === '/') return 'home'
  const section = pathname.split('/')[1]
  switch (section) {
    case 'wardrobe':
    case 'outfits':
      return 'wardrobe'
    case 'plans':
      return 'plans'
    case 'tips':
      return 'tips'
    case 'us':
    case 'settings':
    case 'notifications':
      return 'us'
    default:
      return undefined
  }
}

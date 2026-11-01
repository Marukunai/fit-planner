import {
  Bell,
  CalendarDays,
  CalendarPlus,
  Heart,
  House,
  KeyRound,
  Lightbulb,
  LogIn,
  PartyPopper,
  Settings,
  Shirt,
  Sparkles,
  UserPlus,
  Users,
  type LucideIcon,
} from 'lucide-react'
import { Link, Navigate, type RouteObject } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { AuthenticatedLayout } from './layouts/AuthenticatedLayout'
import { OnboardingLayout } from './layouts/OnboardingLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { NotFoundPage } from './pages/NotFoundPage'
import { RoutePlaceholder } from './pages/RoutePlaceholder'

function page(icon: LucideIcon, title: string, emptyTitle: string, description: string) {
  return (
    <RoutePlaceholder icon={icon} title={title} emptyTitle={emptyTitle} description={description} />
  )
}

const homeAction = import.meta.env.DEV ? (
  <Button asChild variant="secondary">
    <Link to="/design">Ver sistema de diseño</Link>
  </Button>
) : undefined

const devRoutes: RouteObject[] = import.meta.env.DEV
  ? [
      {
        path: '/design',
        lazy: async () => ({ Component: (await import('./design/DesignPage')).default }),
      },
    ]
  : []

/** Mapa de pantallas (sección 1.8). Todas son maquetas hasta que se construya cada feature. */
export const appRoutes: RouteObject[] = [
  {
    element: <PublicLayout />,
    children: [
      {
        path: '/login',
        element: page(
          LogIn,
          'Entrar',
          'Pronto podrás entrar',
          'Aquí irá el acceso con correo, contraseña o enlace mágico.',
        ),
      },
      {
        path: '/register',
        element: page(
          UserPlus,
          'Crear cuenta',
          'Pronto podrás registrarte',
          'Aquí irá el registro de cada persona de la pareja.',
        ),
      },
      {
        path: '/recover',
        element: page(
          KeyRound,
          'Recuperar acceso',
          'Pronto podrás recuperarlo',
          'Aquí irá la recuperación de contraseña.',
        ),
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: '/onboarding',
    element: <OnboardingLayout />,
    children: [
      {
        index: true,
        element: page(
          Heart,
          'Vuestro espacio',
          'Empezad vuestro espacio',
          'Crea el espacio compartido o únete con el código de tu pareja.',
        ),
      },
      {
        path: 'create',
        element: page(
          Users,
          'Crear espacio',
          'Crea el espacio de los dos',
          'Aquí se generará el código para invitar a tu pareja.',
        ),
      },
      {
        path: 'join',
        element: page(
          KeyRound,
          'Tengo un código',
          'Introduce el código',
          'Aquí pegarás el código de 8 caracteres que te ha pasado tu pareja.',
        ),
      },
      {
        path: 'tour',
        element: page(
          PartyPopper,
          'Bienvenidos',
          'Un tour de tres pasos',
          'Aquí verás cómo funcionan el armario, los outfits y los tips.',
        ),
      },
    ],
  },
  {
    element: <AuthenticatedLayout />,
    children: [
      {
        path: '/',
        element: (
          <RoutePlaceholder
            icon={House}
            title="Inicio"
            emptyTitle="Todo tranquilo por ahora"
            description="Aquí verás vuestra próxima quedada, los outfits propuestos y los tips nuevos."
            action={homeAction}
          />
        ),
      },
      {
        path: '/wardrobe',
        element: page(
          Shirt,
          'Armario',
          'Vuestro armario está vacío',
          'Añade la primera prenda y empezad a combinar.',
        ),
      },
      {
        path: '/wardrobe/new',
        element: page(
          Shirt,
          'Añadir prenda',
          'Foto, recorte y etiquetas',
          'Aquí subirás una prenda nueva.',
        ),
      },
      {
        path: '/wardrobe/:id',
        element: page(
          Shirt,
          'Prenda',
          'Detalle de la prenda',
          'Aquí verás sus datos, su historial de uso y los comentarios.',
        ),
      },
      {
        path: '/outfits',
        element: page(
          Sparkles,
          'Outfits',
          'Aún no hay outfits',
          'Crea el primero y valoradlo entre los dos.',
        ),
      },
      {
        path: '/outfits/new',
        element: page(
          Sparkles,
          'Crear outfit',
          'Combina prendas',
          'Aquí elegirás las prendas y a quién se las asignas.',
        ),
      },
      {
        path: '/outfits/:id',
        element: page(
          Sparkles,
          'Outfit',
          'Detalle del outfit',
          'Aquí pondréis la nota del 1 al 10 y comentaréis.',
        ),
      },
      {
        path: '/plans',
        element: page(
          CalendarDays,
          'Planes',
          'Sin planes a la vista',
          'Crea una cena, una cita o una escapada.',
        ),
      },
      {
        path: '/plans/new',
        element: page(
          CalendarPlus,
          'Nuevo plan',
          'Organiza el próximo plan',
          'Aquí pondrás fecha, lugar y dress code.',
        ),
      },
      {
        path: '/plans/:id',
        element: page(
          CalendarDays,
          'Plan',
          'Detalle del plan',
          'Aquí verás los outfits de cada uno para este plan.',
        ),
      },
      {
        path: '/tips',
        element: page(
          Lightbulb,
          'Tips',
          'Aún no hay tips',
          'Deja una idea de compra para tu pareja o para ti.',
        ),
      },
      {
        path: '/tips/new',
        element: page(
          Lightbulb,
          'Nuevo tip',
          'Pega un enlace',
          'Aquí añadirás una idea de compra, incluso como sorpresa.',
        ),
      },
      {
        path: '/tips/:id',
        element: page(
          Lightbulb,
          'Tip',
          'Detalle del tip',
          'Aquí podrás reservarlo o marcarlo como comprado.',
        ),
      },
      {
        path: '/us',
        element: page(
          Heart,
          'Nosotros',
          'Vuestra historia, en números',
          'Aquí verás estadísticas, retos y recuerdos.',
        ),
      },
      {
        path: '/settings',
        element: page(
          Settings,
          'Ajustes',
          'Ajustes de la cuenta',
          'Perfil, tema, notificaciones y privacidad.',
        ),
      },
      {
        path: '/notifications',
        element: page(
          Bell,
          'Avisos',
          'Nada pendiente',
          'Aquí aparecerán las novedades de tu pareja.',
        ),
      },
    ],
  },
  { path: '/index.html', element: <Navigate to="/" replace /> },
  ...devRoutes,
]

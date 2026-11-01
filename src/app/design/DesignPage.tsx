import { CalendarDays, Heart, House, Lightbulb, Shirt, Trash2 } from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { EmptyState } from '@/components/shared/empty-state'
import { Field } from '@/components/shared/field'
import { RatingSlider } from '@/components/shared/rating-slider'
import { TabBar, type TabItem } from '@/components/shared/tab-bar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Chip } from '@/components/ui/chip'
import { Input } from '@/components/ui/input'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from '@/lib/toast'
import { useThemeStore, type Theme } from '@/lib/theme'

const swatches = [
  ['bg', 'Fondo'],
  ['surface', 'Tarjeta'],
  ['surface-2', 'Secundario'],
  ['ink', 'Texto'],
  ['muted', 'Texto suave'],
  ['border', 'Borde'],
  ['primary', 'Primario'],
  ['primary-soft', 'Primario suave'],
  ['accent', 'Acento'],
  ['success', 'Éxito'],
  ['warning', 'Aviso'],
  ['danger', 'Error'],
  ['partner-a', 'Pareja A'],
  ['partner-b', 'Pareja B'],
] as const

const tabs: TabItem[] = [
  { id: 'home', label: 'Inicio', icon: House },
  { id: 'wardrobe', label: 'Armario', icon: Shirt },
  { id: 'plans', label: 'Planes', icon: CalendarDays },
  { id: 'tips', label: 'Tips', icon: Lightbulb },
  { id: 'us', label: 'Nosotros', icon: Heart },
]

const themes: { id: Theme; label: string }[] = [
  { id: 'light', label: 'Claro' },
  { id: 'dark', label: 'Oscuro' },
  { id: 'system', label: 'Automático' },
]

const occasions = ['Casual', 'Cita', 'Cena', 'Fiesta', 'Trabajo', 'Viaje']

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl">{title}</h2>
      {children}
    </section>
  )
}

export default function DesignPage() {
  const theme = useThemeStore((state) => state.theme)
  const setTheme = useThemeStore((state) => state.setTheme)
  const [selected, setSelected] = useState<string[]>(['Casual'])
  const [score, setScore] = useState(7)
  const [tab, setTab] = useState('home')
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  const toggle = (value: string) =>
    setSelected((current) =>
      current.includes(value) ? current.filter((v) => v !== value) : [...current, value],
    )

  return (
    <main className="mx-auto flex max-w-content flex-col gap-12 px-4 py-8 md:px-8">
      <header className="flex flex-col gap-4">
        <p className="text-sm font-semibold text-primary">Solo desarrollo</p>
        <h1 className="text-3xl">Sistema de diseño</h1>
        <p className="max-w-prose text-muted">
          Componentes base de Fit Planner. Cambia de tema para revisar cada superficie en claro y
          oscuro.
        </p>
        <div role="group" aria-label="Tema" className="flex flex-wrap gap-2">
          {themes.map(({ id, label }) => (
            <Chip key={id} selected={theme === id} onClick={() => setTheme(id)}>
              {label}
            </Chip>
          ))}
        </div>
      </header>

      <Section title="Color">
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {swatches.map(([token, label]) => (
            <li key={token} className="flex flex-col gap-1.5">
              <div
                className="h-14 rounded-control border"
                style={{ backgroundColor: `var(--${token})` }}
              />
              <span className="text-sm font-medium">{label}</span>
              <code className="text-xs text-muted">--{token}</code>
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Tipografía">
        <Card className="flex flex-col gap-3 p-6">
          <p className="font-display text-3xl font-bold">Fraunces para titulares</p>
          <p className="font-display text-2xl font-semibold">Elige tu outfit de la cita</p>
          <p className="text-lg">Plus Jakarta Sans para la interfaz y el texto.</p>
          <p className="text-base">Tu pareja te ha dejado un tip: unas zapatillas blancas.</p>
          <p className="text-sm text-muted">Texto secundario de 14 px con ñ, á, é, ü y ¿?</p>
          <p className="text-xs text-muted">Texto auxiliar de 12 px</p>
        </Card>
      </Section>

      <Section title="Botones">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Guardar</Button>
          <Button variant="secondary">Cancelar</Button>
          <Button variant="ghost">Ahora no</Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Eliminar
          </Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" variant="secondary" aria-label="Me gusta">
            <Heart className="h-5 w-5" aria-hidden="true" />
          </Button>
          <Button disabled>Deshabilitado</Button>
        </div>
      </Section>

      <Section title="Campos">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Nombre de la prenda" hint="Por ejemplo: camisa de lino azul">
            {(control) => (
              <Input
                {...control}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Camisa de lino"
              />
            )}
          </Field>
          <Field label="Enlace del tip" error="Introduce una dirección que empiece por https://">
            {(control) => <Input {...control} defaultValue="tienda" />}
          </Field>
        </div>
      </Section>

      <Section title="Chips">
        <div role="group" aria-label="Ocasiones" className="flex flex-wrap gap-2">
          {occasions.map((occasion) => (
            <Chip
              key={occasion}
              selected={selected.includes(occasion)}
              onClick={() => toggle(occasion)}
            >
              {occasion}
            </Chip>
          ))}
        </div>
      </Section>

      <Section title="Tarjetas">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {['Camisa de lino', 'Vaqueros rectos', 'Vestido midi', 'Zapatillas blancas'].map(
            (item, index) => (
              <Card key={item} interactive className="overflow-hidden">
                <div className="grid aspect-[4/5] place-items-center bg-surface-2 text-muted">
                  <Shirt className="h-10 w-10" strokeWidth={1.25} aria-hidden="true" />
                </div>
                <div className="flex items-center justify-between gap-2 p-4">
                  <span className="font-medium">{item}</span>
                  <span className="rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
                    {index === 2 ? 'Lavadora' : 'Limpia'}
                  </span>
                </div>
              </Card>
            ),
          )}
        </div>
      </Section>

      <Section title="Valoración 1-10">
        <Card className="max-w-md p-6">
          <RatingSlider value={score} onChange={setScore} label="¿Cómo te queda?" />
        </Card>
      </Section>

      <Section title="Hoja inferior y toast">
        <div className="flex flex-wrap gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="secondary">Abrir hoja inferior</Button>
            </SheetTrigger>
            <SheetContent
              title="Añadir prenda"
              description="Sube una foto o elige una de tu galería."
            >
              <div className="flex gap-3">
                <SheetClose asChild>
                  <Button className="flex-1">Hacer foto</Button>
                </SheetClose>
                <SheetClose asChild>
                  <Button variant="secondary" className="flex-1">
                    Galería
                  </Button>
                </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
          <Button
            variant="secondary"
            onClick={() =>
              toast('Se ha guardado', {
                action: { label: 'Deshacer', onClick: () => toast('Cambio deshecho') },
              })
            }
          >
            Mostrar toast
          </Button>
        </div>
      </Section>

      <Section title="Esqueleto de carga">
        <div className="flex flex-col gap-3">
          <div>
            <Button variant="ghost" onClick={() => setLoading((value) => !value)}>
              {loading ? 'Ver contenido' : 'Ver esqueleto'}
            </Button>
          </div>
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true">
              {[0, 1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-[4/5] rounded-none" />
                  <div className="flex flex-col gap-2 p-4">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted">Aquí iría el contenido real.</p>
          )}
        </div>
      </Section>

      <Section title="Estado vacío">
        <Card>
          <EmptyState
            icon={Shirt}
            title="Aún no hay nada por aquí"
            description="Sube tu primera prenda y empieza a montar vuestros outfits."
            action={<Button>Subir prenda</Button>}
          />
        </Card>
      </Section>

      <Section title="Barra de pestañas">
        <div className="max-w-md overflow-hidden rounded-card border">
          <div className="grid h-24 place-items-center bg-bg text-sm text-muted">
            Pestaña activa: {tabs.find((t) => t.id === tab)?.label}
          </div>
          <TabBar
            items={tabs}
            activeId={tab}
            onSelect={setTab}
            onAdd={() => toast('Aquí se abrirán las acciones rápidas')}
          />
        </div>
      </Section>
    </main>
  )
}

import { Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/shared/empty-state'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <section>
      <h1 className="sr-only">Página no encontrada</h1>
      <EmptyState
        icon={Compass}
        title="Aquí no hay nada"
        description="Esta página no existe o se ha movido. Vuelve al inicio y seguimos desde ahí."
        action={
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        }
      />
    </section>
  )
}

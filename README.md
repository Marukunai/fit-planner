# Fit Planner

App web instalable (PWA) para dos personas: armario compartido, planificación de outfits, valoraciones del 1 al 10, comentarios, ideas de compra ("tips") y estadísticas. Cada pareja tiene su propio espacio, aislado del resto por RLS en la base de datos.

> Estado: **Etapa 1** (cimientos). Hay esquema de base de datos con RLS, sistema de diseño y una maqueta navegable. Las pantallas todavía muestran estados vacíos.

## Stack

| Capa         | Tecnología                                                                             |
| ------------ | -------------------------------------------------------------------------------------- |
| Frontend     | Vite 7, React 18, TypeScript estricto, React Router 7                                  |
| Estilos      | Tailwind CSS 3.4 con tokens en variables CSS (claro/oscuro), componentes estilo shadcn |
| Estado/Datos | TanStack Query, Zustand, React Hook Form + Zod                                         |
| Backend      | Supabase (Postgres 17, Auth, Storage), todo con RLS                                    |
| Calidad      | ESLint 9, Prettier, Husky, lint-staged, commitlint, Vitest + Testing Library, pgTAP    |
| Despliegue   | Netlify (frontend) y Supabase Cloud (más adelante)                                     |

## Requisitos

- Node.js 20 o superior (`.nvmrc`)
- Docker Desktop en marcha
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)
- Git

## Puesta en marcha

```bash
npm install
npm run db:start      # primera vez: descarga imágenes de Docker y tarda unos minutos
npm run db:reset      # aplica migraciones y seed
```

Copia `.env.example` a `.env.local` y rellénalo con los valores que imprime `supabase start`:

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=<clave "Publishable">
VITE_APP_NAME=Fit Planner
VITE_APP_URL=http://localhost:5173
```

Después:

```bash
npm run dev           # http://localhost:5173
```

Usa solo la clave pública (publishable/anon). La clave secreta no debe estar nunca en el frontend ni en el repositorio.

### Usuarios de prueba (solo local)

| Usuario | Correo         | Contraseña        |
| ------- | -------------- | ----------------- |
| Ana     | ana@test.local | `fitplanner-test` |
| Leo     | leo@test.local | `fitplanner-test` |

Ambos forman la pareja "Ana y Leo" con 15 prendas, 4 outfits, 3 planes y 5 tips (uno en modo sorpresa). Estudio de Supabase: http://127.0.0.1:54323 · correos de prueba (Mailpit): http://127.0.0.1:54324.

## Scripts

| Comando                                | Qué hace                                                   |
| -------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                          | Servidor de desarrollo                                     |
| `npm run build`                        | Comprueba tipos y genera `dist/`                           |
| `npm run preview`                      | Sirve el build en local                                    |
| `npm run lint` / `npm run format`      | ESLint / Prettier (`format:check` solo comprueba)          |
| `npm run typecheck`                    | `tsc --noEmit`                                             |
| `npm run test` / `npm run test:watch`  | Tests de interfaz y lógica (Vitest)                        |
| `npm run db:start` / `npm run db:stop` | Arranca o para Supabase local                              |
| `npm run db:reset`                     | Reconstruye la base desde cero (migraciones + `seed.sql`)  |
| `npm run db:test`                      | Tests pgTAP (RLS, visibilidad, pareja, outfits, Storage)   |
| `npm run db:types`                     | Regenera `src/types/database.types.ts` desde la base local |
| `npm run db:diff`                      | Crea una migración a partir de los cambios hechos en local |

Tras cambiar el esquema: `npm run db:reset && npm run db:test && npm run db:types`.

## Arquitectura

```
src/
  app/            Router, layouts (público, autenticado, onboarding), navegación y páginas
  components/
    ui/           Piezas base (botón, input, chip, tarjeta, hoja inferior, toast…)
    shared/       Composiciones reutilizables (barra de pestañas, navegación lateral, estado vacío…)
  features/       Un directorio por dominio: auth, couple, wardrobe, outfits, plans, tips,
                  ratings, comments, stats, notifications, settings
  lib/            Entorno validado (env.ts), cliente único de Supabase, tema, utilidades
  styles/         Tokens de diseño, tipografías autoalojadas y estilos globales
  types/          Tipos generados de la base de datos
supabase/
  migrations/     Esquema, funciones, triggers, RLS y Storage
  seed.sql        Datos de prueba
  tests/          Tests pgTAP
docs/
  decisions.md    Decisiones de arquitectura y diseño
```

Cómo encaja todo:

- **Un único cliente de Supabase** (`getSupabase()` en `src/lib/supabase.ts`), tipado con `Database` y creado de forma perezosa.
- **Variables de entorno** validadas con Zod en `src/lib/env.ts`; si falta algo, el error dice qué.
- **Seguridad en la base de datos**: RLS en todas las tablas, funciones `security definer` con `search_path` vacío, y el emparejamiento (`create_couple`, `create_invite`, `join_couple`) solo por funciones. El frontend no es la barrera de seguridad.
- **Visibilidad** de prendas, outfits y tips: `private`, `couple` o `surprise` (los tips sorpresa se ocultan a la pareja hasta `hidden_until`).
- **Storage** privado; los archivos viven en `{bucket}/{couple_id}/{user_id}/{uuid}.webp`.
- **Sistema de diseño** en `/design` (solo en desarrollo, no existe en producción).

## Flujo de trabajo

- Commits con [Conventional Commits](https://www.conventionalcommits.org/es/): `feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`.
- Husky ejecuta lint-staged al hacer commit y commitlint sobre el mensaje.
- La CI de GitHub Actions ejecuta lint, typecheck, tests y build en cada push y pull request.
- Ramas: `main` (producción), `develop` (integración), `feat/*` y `fix/*`.
- Las decisiones importantes se anotan en [`docs/decisions.md`](docs/decisions.md).

## Seguridad

- No subas `.env.local` ni claves. Solo `.env.example`, con los nombres de las variables.
- Las claves y contraseñas que aparecen en este README son de desarrollo local y no valen en ningún otro sitio.

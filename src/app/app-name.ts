/** Nombre de la app para mostrar en pantalla (sin exigir el resto del entorno). */
export function getAppName(): string {
  const name: unknown = import.meta.env.VITE_APP_NAME
  return typeof name === 'string' && name.length > 0 ? name : 'Fit Planner'
}

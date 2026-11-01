# Decisiones de arquitectura y diseño

Formato corto: contexto, decisión y consecuencias. Fecha de la Etapa 1: 2026-11-01.

## Stack y herramientas

### 001 · Vite + React 18 + TypeScript estricto

**Decisión.** SPA con Vite 7 y React 18.3. TypeScript con `strict`, `noUncheckedIndexedAccess` y `verbatimModuleSyntax`.
**Consecuencias.** Los accesos a arrays y mapas devuelven `T | undefined` y hay que tratarlos. Los imports de tipos llevan `type`.

### 002 · Tailwind 3.4 con tokens en variables CSS

**Decisión.** Los colores, radios y sombras viven en variables CSS (`tokens.css`) y Tailwind las referencia. El modo oscuro se activa con la clase `dark` en `<html>`.
**Consecuencias.** Cambiar la paleta no toca componentes. La clase `dark` la gestiona `src/lib/theme.ts` (sigue el sistema o la elección guardada).

### 003 · Validación de entorno con Zod, de forma perezosa

**Decisión.** `getEnv()` valida `import.meta.env` la primera vez que se usa; el cliente de Supabase se crea igual (`getSupabase()`).
**Consecuencias.** Un `.env.local` incompleto da un mensaje claro en español en lugar de romper al importar. Los tests pueden simular el entorno.

### 004 · Hooks de Git

**Decisión.** lint-staged solo trata `js, json, md, css, html, yml, yaml`. Los `.toml` quedan fuera porque Prettier no los entiende.
**Decisión.** `docs/fit*` está en `.gitignore`: los documentos de trabajo del proyecto se quedan en local.

## Base de datos y seguridad

### 005 · RLS en todas las tablas, como defensa principal

**Decisión.** Las 15 tablas de `public` tienen RLS activada y un test lo comprueba. Las políticas usan `(select auth.uid())` para que Postgres lo evalúe una sola vez por consulta.
**Decisión.** Se revocan privilegios a `anon`, y `truncate`, `references` y `trigger` a `authenticated` (defensa en profundidad).
**Consecuencias.** Un usuario sin sesión no puede leer nada. Las funciones nuevas requieren `grant execute` explícito.

### 006 · Funciones `security definer` con `search_path` vacío

**Decisión.** Las funciones auxiliares (`current_couple_id`, `is_partner_of`, `is_couple_member`) y los triggers que escriben con más permisos fijan `set search_path = ''` y usan nombres completos.
**Consecuencias.** Evita secuestros de `search_path`. Todo objeto referenciado lleva su esquema.

### 007 · Emparejamiento solo por funciones

**Decisión.** `create_couple`, `create_invite` y `join_couple` son las únicas vías para crear o entrar en una pareja. No hay políticas de `insert` en `couples` ni en `couple_members`.
**Decisión.** Máximo dos miembros, forzado por trigger con bloqueo de la fila de la pareja (evita la carrera de dos uniones simultáneas). Un usuario solo puede estar en una pareja (`unique user_id`).
**Decisión.** Los códigos tienen 8 caracteres de un alfabeto de 32 símbolos sin ambiguos (sin 0/O/1/I), se generan con aleatoriedad criptográfica, caducan a las 48 h y se invalidan al regenerar.
**Nota.** `is_partner_of` recibe el **id de la pareja**, no un usuario: el documento maestro era ambiguo y esta firma es la que encaja con las políticas.

### 008 · Visibilidad: `private`, `couple`, `surprise`

**Decisión.** Prendas y outfits: el autor siempre los ve; la pareja solo si es `couple`. Tips: el autor siempre; la pareja si no es privado y, en modo sorpresa, solo cuando pasa `hidden_until`.
**Consecuencias.** Las prendas y outfits en `surprise` son solo del propietario: no se revelan solos (no hay `hidden_until` en esas tablas). Comentarios, reacciones, valoraciones y piezas de outfit heredan la visibilidad del elemento al que pertenecen.

### 009 · Qué puede cambiar cada persona en una propuesta de outfit

**Decisión.** Si Ana propone un outfit a Leo, solo Leo decide (aceptar, rechazar, marcar como llevado) y solo puede cambiar eso. Ana no puede decidir por él. Lo hace un trigger (`outfits_01_guard`).
**Decisión.** Los tips siguen la misma idea: la pareja solo puede cambiar `status` y `reserved_by` (reservar o marcar comprado).

### 010 · Historial de uso escrito solo por trigger

**Decisión.** `wear_log` no admite escrituras directas. Al pasar un outfit a `worn`, un trigger inserta una fila por prenda y actualiza `wear_count` y `last_worn_on`.
**Consecuencias.** Deshacer un "llevado" **no** revierte el historial (pendiente de decidir cómo).

### 011 · La RLS no filtra `deleted_at`

**Decisión.** Las políticas no excluyen filas con `deleted_at`. Si lo hicieran, un `UPDATE … RETURNING` que marca el borrado fallaría (la fila deja de ser visible al terminar).
**Consecuencias.** La aplicación filtra `deleted_at is null` en sus consultas.

### 012 · Storage privado y más estricto que el documento

**Decisión.** Buckets `garments`, `tips`, `plan-photos`, `receipts` y `avatars`, todos privados. Ruta `{couple_id}/{user_id}/{uuid}.webp`: el primer segmento debe ser tu pareja y para escribir el segundo debe ser tú.
**Decisión.** Para leer un archivo ajeno, debe estar referenciado por una prenda, tip o perfil que puedas ver. La foto de una prenda privada no se descarga aunque se conozca la ruta. Los tickets (`receipts`) son solo del propietario.
**Pendiente.** `plan-photos` queda abierto a la pareja hasta que exista la tabla de fotos de plan (Etapa 2).

### 013 · Pospuesto a propósito

- **Salir de la pareja** (`leave_couple`): falta decidir de quién son los datos al separarse.
- **Borrar cuenta**: ahora lo bloquean las claves foráneas sin `on delete cascade`. Hay que definir qué se conserva.
- **Realtime**: la publicación `supabase_realtime` se añade en la Etapa 2, cuando haya pantallas que la usen.

## Interfaz

### 014 · Accesibilidad de color

**Decisión.** Se añadieron `--danger-strong` y `--on-danger` para texto y botón destructivo, y se oscureció el fondo suave del primario en modo oscuro, porque la paleta original no llegaba al contraste AA.
**Decisión.** `warning` y `accent` en modo claro no llegan a 3:1: se usan **solo como elemento gráfico**, nunca como texto. Hay una función y tests de contraste en `src/lib/color.ts`.
**Decisión.** Los títulos grandes llevan interlineado 1,3 para que la tipografía Fraunces no se corte.

### 015 · Navegación y rutas

**Decisión.** Cinco secciones (Inicio, Armario, Planes, Tips, Nosotros) y un botón "+" con las acciones rápidas. Barra inferior en móvil y lateral desde 768 px.
**Decisión.** Los outfits cuelgan de Armario, y Ajustes y Avisos de Nosotros, a efectos de qué pestaña se marca como activa.
**Decisión.** `/design` es una ruta más del router, existe solo con `import.meta.env.DEV` y no entra en el build de producción.
**Consecuencias.** En la barra inferior el "+" queda entre la segunda y la tercera pestaña (5 pestañas, no simétricas). Hasta que haya login, las rutas autenticadas no tienen guarda.

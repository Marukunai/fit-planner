-- Fit Planner · migración 2: buckets de Storage privados y sus políticas.
--
-- Convención de ruta (dentro de cada bucket): {couple_id}/{user_id}/{uuid}.webp
-- Las columnas photo_path, cutout_path, thumb_path, image_path, avatar_path y receipt_path
-- guardan esa ruta SIN el nombre del bucket (el bucket lo implica la columna).
--
-- Lectura: además de pertenecer a la pareja (primer segmento), el archivo debe ser propio
-- (segundo segmento) o estar referenciado por una fila que el usuario puede ver. Así, la
-- foto de una prenda privada no se puede listar ni descargar aunque se conozca su ruta.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('garments', 'garments', false, 10485760, array['image/webp', 'image/jpeg', 'image/png']),
  ('tips', 'tips', false, 10485760, array['image/webp', 'image/jpeg', 'image/png']),
  ('plan-photos', 'plan-photos', false, 10485760, array['image/webp', 'image/jpeg', 'image/png']),
  ('receipts', 'receipts', false, 10485760, array['image/webp', 'image/jpeg', 'image/png', 'application/pdf']),
  ('avatars', 'avatars', false, 5242880, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do update
  set public = false,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

create policy fit_planner_objects_select on storage.objects for select to authenticated
  using (
    bucket_id in ('garments', 'tips', 'plan-photos', 'receipts', 'avatars')
    and (storage.foldername(objects.name))[1] = (select public.current_couple_id())::text
    and (
      (storage.foldername(objects.name))[2] = (select auth.uid())::text
      or (
        objects.bucket_id = 'garments'
        and exists (
          select 1 from public.garments g
          where objects.name in (g.photo_path, g.cutout_path, g.thumb_path)
        )
      )
      or (
        objects.bucket_id = 'tips'
        and exists (select 1 from public.tips t where t.image_path = objects.name)
      )
      or (
        objects.bucket_id = 'avatars'
        and exists (select 1 from public.profiles p where p.avatar_path = objects.name)
      )
      -- TODO(fase 2): plan-photos se restringirá cuando exista la tabla plan_photos.
      or objects.bucket_id = 'plan-photos'
      -- receipts: solo el propietario (primer OR de arriba).
    )
  );

-- Escritura: solo dentro de la propia carpeta {couple_id}/{user_id}/.
create policy fit_planner_objects_insert on storage.objects for insert to authenticated
  with check (
    bucket_id in ('garments', 'tips', 'plan-photos', 'receipts', 'avatars')
    and (storage.foldername(objects.name))[1] = (select public.current_couple_id())::text
    and (storage.foldername(objects.name))[2] = (select auth.uid())::text
  );

create policy fit_planner_objects_update on storage.objects for update to authenticated
  using (
    bucket_id in ('garments', 'tips', 'plan-photos', 'receipts', 'avatars')
    and (storage.foldername(objects.name))[1] = (select public.current_couple_id())::text
    and (storage.foldername(objects.name))[2] = (select auth.uid())::text
  )
  with check (
    bucket_id in ('garments', 'tips', 'plan-photos', 'receipts', 'avatars')
    and (storage.foldername(objects.name))[1] = (select public.current_couple_id())::text
    and (storage.foldername(objects.name))[2] = (select auth.uid())::text
  );

create policy fit_planner_objects_delete on storage.objects for delete to authenticated
  using (
    bucket_id in ('garments', 'tips', 'plan-photos', 'receipts', 'avatars')
    and (storage.foldername(objects.name))[1] = (select public.current_couple_id())::text
    and (storage.foldername(objects.name))[2] = (select auth.uid())::text
  );

-- Storage: buckets privados y acceso por carpeta {couple_id}/{user_id}/...
begin;
create extension if not exists pgtap with schema extensions;
select plan(10);

create function pg_temp.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;

select is((select count(*)::int from storage.buckets where id in ('garments','tips','plan-photos','receipts','avatars') and not public), 5, 'Los 5 buckets existen y son privados');
select is((select count(*)::int from storage.buckets where public), 0, 'No hay ningún bucket público');

-- Fotos simuladas
update public.garments set photo_path = 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/pijama.webp'
  where id = '10000000-0000-4000-8000-000000000008';
update public.garments set photo_path = 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/vestido.webp'
  where id = '10000000-0000-4000-8000-000000000003';
insert into storage.objects (bucket_id, name, owner) values
  ('garments', 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/pijama.webp', 'a0000000-0000-4000-8000-000000000001'),
  ('garments', 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/vestido.webp', 'a0000000-0000-4000-8000-000000000001'),
  ('receipts', 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/ticket.webp', 'a0000000-0000-4000-8000-000000000001'),
  ('garments', 'c0000000-0000-4000-8000-000000000009/a0000000-0000-4000-8000-000000000009/otra.webp', null);

select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select is((select count(*)::int from storage.objects where name like '%vestido.webp'), 1, 'Leo ve la foto de una prenda visible de Ana');
select is((select count(*)::int from storage.objects where name like '%pijama.webp'), 0, 'Leo no ve la foto de la prenda privada');
select is((select count(*)::int from storage.objects where bucket_id = 'receipts'), 0, 'Leo no ve los tickets de Ana');
select is((select count(*)::int from storage.objects where name like '%otra.webp'), 0, 'Leo no ve archivos de otra pareja');
select throws_ok(
  $$insert into storage.objects (bucket_id, name) values ('garments', 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000001/falso.webp')$$,
  '42501', null, 'Leo no puede subir a la carpeta de Ana');
select lives_ok(
  $$insert into storage.objects (bucket_id, name) values ('garments', 'c0000000-0000-4000-8000-000000000001/a0000000-0000-4000-8000-000000000002/camisa.webp')$$,
  'Leo sí puede subir a su carpeta');
reset role;

select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from storage.objects where bucket_id = 'receipts'), 1, 'Ana ve su ticket');
select is((select count(*)::int from storage.objects where name like '%pijama.webp'), 1, 'Ana ve la foto de su prenda privada');
reset role;

select * from finish();
rollback;

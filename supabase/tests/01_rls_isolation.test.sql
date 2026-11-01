-- Aislamiento entre parejas: un usuario ajeno no ve ni toca nada de otra pareja.
begin;
create extension if not exists pgtap with schema extensions;
select plan(22);

create function pg_temp.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;

-- Usuarias ajenas a la pareja del seed: Eva y Max forman otra pareja.
insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
values
  ('a0000000-0000-4000-8000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'eva@test.local', '{"display_name":"Eva"}', now(), now()),
  ('a0000000-0000-4000-8000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'max@test.local', '{"display_name":"Max"}', now(), now());

select pg_temp.as_user('a0000000-0000-4000-8000-000000000003');
select lives_ok($$select public.create_couple('Eva y Max', null)$$, 'Eva puede crear su pareja');
insert into public.garments (couple_id, owner_id, name, category)
values (public.current_couple_id(), 'a0000000-0000-4000-8000-000000000003', 'Abrigo de Eva', 'outerwear');
reset role;

-- Eva (otra pareja) no ve nada de Ana y Leo
select pg_temp.as_user('a0000000-0000-4000-8000-000000000003');
select is((select count(*)::int from public.garments), 1, 'Eva solo ve su propia prenda');
select is((select count(*)::int from public.outfits), 0, 'Eva no ve outfits ajenos');
select is((select count(*)::int from public.outfit_items), 0, 'Eva no ve outfit_items ajenos');
select is((select count(*)::int from public.tips), 0, 'Eva no ve tips ajenos');
select is((select count(*)::int from public.plans), 0, 'Eva no ve planes ajenos');
select is((select count(*)::int from public.comments), 0, 'Eva no ve comentarios ajenos');
select is((select count(*)::int from public.ratings), 0, 'Eva no ve valoraciones ajenas');
select is((select count(*)::int from public.wear_log), 0, 'Eva no ve el historial de uso ajeno');
select is((select count(*)::int from public.notifications), 0, 'Eva no ve notificaciones ajenas');
select is((select count(*)::int from public.couples), 1, 'Eva solo ve su pareja');
select is((select count(*)::int from public.profiles), 1, 'Eva solo ve su propio perfil (Max aún no se ha unido)');

-- ...ni puede escribir en ella
select throws_ok(
  $$insert into public.garments (couple_id, owner_id, name, category)
    values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'Intruso', 'top')$$,
  '42501', null, 'Eva no puede insertar prendas en la pareja de Ana');
update public.garments set name = 'Hackeada' where owner_id = 'a0000000-0000-4000-8000-000000000001';
delete from public.garments where owner_id = 'a0000000-0000-4000-8000-000000000001';
select throws_ok(
  $$insert into public.tips (couple_id, author_id, for_user_id, title)
    values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003', 'a0000000-0000-4000-8000-000000000001', 'Spam')$$,
  '42501', null, 'Eva no puede dejar tips en la pareja de Ana');
reset role;
select is(
  (select count(*)::int from public.garments where owner_id = 'a0000000-0000-4000-8000-000000000001' and name <> 'Hackeada'),
  8, 'Eva no ha podido actualizar ni borrar las prendas de Ana');

-- Ana no ve las prendas de Eva ni puede suplantar a Leo
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.garments where owner_id = 'a0000000-0000-4000-8000-000000000003'), 0, 'Ana no ve prendas de Eva');
select throws_ok(
  $$insert into public.garments (couple_id, owner_id, name, category)
    values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'Suplantación', 'top')$$,
  '42501', null, 'Ana no puede crear prendas a nombre de Leo');
select is((select count(*)::int from public.profiles), 2, 'Ana ve su perfil y el de Leo');
reset role;

-- anon no tiene acceso a ninguna tabla
set local role anon;
select throws_ok($$select * from public.garments$$, '42501', null, 'anon no puede leer prendas');
select throws_ok($$select * from public.profiles$$, '42501', null, 'anon no puede leer perfiles');
select throws_ok($$select public.create_couple('x', null)$$, '42501', null, 'anon no puede ejecutar create_couple');
reset role;

-- Cobertura: toda tabla de public tiene RLS activa
select is(
  (select count(*)::int from pg_class c join pg_namespace n on n.oid = c.relnamespace
   where n.nspname = 'public' and c.relkind = 'r' and not c.relrowsecurity),
  0, 'Todas las tablas de public tienen RLS activada');

select * from finish();
rollback;

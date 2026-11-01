-- Flujo de outfits: propuestas, decisión de quien los lleva, historial de uso y guardas.
begin;
create extension if not exists pgtap with schema extensions;
select plan(16);

create function pg_temp.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;

-- Estado inicial del seed: dos outfits "worn" generaron historial por pieza
select is((select count(*)::int from public.wear_log), 7, 'El seed generó 7 registros de uso (4 + 3 piezas)');
select is((select wear_count from public.garments where id = '10000000-0000-4000-8000-000000000003'), 1, 'La prenda usada tiene wear_count = 1');
select is((select wear_count from public.garments where id = '10000000-0000-4000-8000-000000000001'), 0, 'Una prenda sin usar tiene wear_count = 0');
select isnt((select last_worn_on from public.garments where id = '10000000-0000-4000-8000-000000000003'), null, 'last_worn_on se rellena al llevarlo');

-- Leo decide sobre la propuesta de Ana
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select throws_ok(
  $$update public.outfits set status = 'accepted' where id = '20000000-0000-4000-8000-000000000003'$$,
  'P0001', 'only_wearer_can_decide', 'Ana no puede aceptar por Leo su propia propuesta');
reset role;

select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select throws_ok(
  $$update public.outfits set title = 'Lo cambio yo' where id = '20000000-0000-4000-8000-000000000003'$$,
  'P0001', 'wearer_can_only_decide', 'Leo solo puede decidir, no editar el contenido de la propuesta');
select lives_ok(
  $$update public.outfits set status = 'accepted' where id = '20000000-0000-4000-8000-000000000003'$$,
  'Leo acepta la propuesta');
select lives_ok(
  $$update public.outfits set status = 'worn' where id = '20000000-0000-4000-8000-000000000003'$$,
  'Leo marca el outfit como llevado');
reset role;
select is((select worn_on from public.outfits where id = '20000000-0000-4000-8000-000000000003'), current_date, 'worn_on toma la fecha de hoy por defecto');
select is((select count(*)::int from public.wear_log where outfit_id = '20000000-0000-4000-8000-000000000003'), 4, 'Se registran las 4 piezas del outfit');
select is((select wear_count from public.garments where id = '10000000-0000-4000-8000-000000000012'), 2, 'Zapatillas de Leo: dos usos (cena + cine)');

-- Mutaciones prohibidas
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select throws_ok(
  $$update public.outfits set created_by = 'a0000000-0000-4000-8000-000000000002' where id = '20000000-0000-4000-8000-000000000004'$$,
  'P0001', 'immutable_column', 'created_by no se puede cambiar');
select throws_ok(
  $$insert into public.wear_log (couple_id, garment_id, outfit_id, worn_on) values ('c0000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', null, current_date)$$,
  '42501', null, 'wear_log no admite escrituras directas');
reset role;

-- Valoraciones
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select throws_ok(
  $$insert into public.ratings (outfit_id, rater_id, score) values ('20000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 5)$$,
  '42501', null, 'Leo no puede valorar en nombre de Ana');
select throws_ok(
  $$insert into public.outfit_items (outfit_id, garment_id, position) values ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000009', 9)$$,
  '42501', null, 'Leo no puede añadir piezas a un outfit que no creó');
select throws_ok(
  $$insert into public.ratings (outfit_id, rater_id, score) values ('20000000-0000-4000-8000-000000000004', 'a0000000-0000-4000-8000-000000000002', 11)$$,
  '23514', null, 'La nota debe estar entre 1 y 10');
reset role;

select * from finish();
rollback;

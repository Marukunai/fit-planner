-- Visibilidad: privado, pareja y sorpresa (hidden_until).
begin;
create extension if not exists pgtap with schema extensions;
select plan(15);

create function pg_temp.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;

-- Prendas
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select is((select count(*)::int from public.garments), 14, 'Leo ve 14 prendas (15 menos la pijama privada de Ana)');
select is((select count(*)::int from public.garments where name = 'Pijama de seda'), 0, 'Leo no ve la prenda privada de Ana');
select throws_ok(
  $$insert into public.comments (couple_id, author_id, garment_id, body)
    values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000008', 'curioseando')$$,
  '42501', null, 'Leo no puede comentar una prenda privada');
reset role;
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.garments), 15, 'Ana ve sus 8 prendas y las 7 de Leo');
reset role;

-- Tips sorpresa
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select is((select count(*)::int from public.tips), 4, 'Leo ve 4 de los 5 tips (la sorpresa de Ana está oculta)');
select is((select count(*)::int from public.tips where visibility = 'surprise'), 0, 'Leo no ve el tip sorpresa');
update public.tips set title = 'Spoiler' where id = '40000000-0000-4000-8000-000000000002';
delete from public.tips where id = '40000000-0000-4000-8000-000000000002';
reset role;
select is(
  (select title from public.tips where id = '40000000-0000-4000-8000-000000000002'),
  'Cazadora bomber verde', 'Leo no puede modificar ni borrar el tip sorpresa');
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.tips), 5, 'Ana (autora) ve los 5 tips, incluida la sorpresa');
reset role;

-- Al vencer hidden_until, el tip se revela
update public.tips set hidden_until = now() - interval '1 minute' where id = '40000000-0000-4000-8000-000000000002';
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select is((select count(*)::int from public.tips where id = '40000000-0000-4000-8000-000000000002'), 1, 'Pasada hidden_until, Leo ve el tip');
reset role;

-- Tips privados: solo el autor
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
insert into public.tips (couple_id, author_id, for_user_id, title, visibility)
values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 'Idea privada', 'private');
reset role;
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.tips where title = 'Idea privada'), 0, 'Ana no ve el tip privado de Leo');
reset role;

-- Outfits privados: no se ven ellos ni sus piezas
update public.outfits set visibility = 'private' where id = '20000000-0000-4000-8000-000000000004';
select pg_temp.as_user('a0000000-0000-4000-8000-000000000002');
select is((select count(*)::int from public.outfits), 3, 'Leo ve 3 de los 4 outfits (el borrador pasó a privado)');
select is((select count(*)::int from public.outfit_items where outfit_id = '20000000-0000-4000-8000-000000000004'), 0, 'Leo no ve las piezas del outfit privado');
select is((select count(*)::int from public.outfit_items where outfit_id = '20000000-0000-4000-8000-000000000001'), 4, 'Leo sí ve las piezas de un outfit de pareja');
reset role;
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.outfits), 4, 'Ana (autora) ve sus 4 outfits');
reset role;

-- Comentarios sobre contenido visible
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select is((select count(*)::int from public.comments), 3, 'Ana ve los 3 comentarios del seed');
reset role;

select * from finish();
rollback;

-- Reglas de pareja: máximo 2 miembros, códigos de invitación y funciones de emparejamiento.
begin;
create extension if not exists pgtap with schema extensions;
select plan(17);

create function pg_temp.as_user(p_uid uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claims', json_build_object('sub', p_uid, 'role', 'authenticated')::text, true);
  set local role authenticated;
end $$;

insert into auth.users (id, instance_id, aud, role, email, raw_user_meta_data, created_at, updated_at)
select ('a0000000-0000-4000-8000-00000000000' || n)::uuid, '00000000-0000-0000-0000-000000000000',
       'authenticated', 'authenticated', 'user' || n || '@test.local', '{}', now(), now()
from generate_series(3, 7) as n;

-- Pareja llena: no admite invitaciones ni miembros extra
select pg_temp.as_user('a0000000-0000-4000-8000-000000000001');
select throws_ok($$select public.create_invite()$$, 'P0001', 'couple_full', 'Una pareja completa no puede crear invitaciones');
select throws_ok($$select public.create_couple('Otra', null)$$, 'P0001', 'already_in_couple', 'Quien ya está en pareja no puede crear otra');
select throws_ok($$select public.join_couple('ABCDEFGH')$$, 'P0001', 'already_in_couple', 'Quien ya está en pareja no puede unirse a otra');
reset role;
select throws_ok(
  $$insert into public.couple_members (couple_id, user_id) values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003')$$,
  'P0001', 'couple_full', 'El trigger impide un tercer miembro');
select throws_ok(
  $$insert into public.couple_members (couple_id, user_id) values (gen_random_uuid(), 'a0000000-0000-4000-8000-000000000003')$$,
  '23503', null, 'No se puede insertar en una pareja inexistente');

-- Sin pareja
select pg_temp.as_user('a0000000-0000-4000-8000-000000000003');
select throws_ok($$select public.create_invite()$$, 'P0001', 'not_in_couple', 'Sin pareja no se puede invitar');
select throws_ok($$select public.join_couple('ZZZZZZZZ')$$, 'P0001', 'invalid_code', 'Un código inexistente se rechaza');
select throws_ok(
  $$insert into public.couples (name, created_by) values ('Directa', 'a0000000-0000-4000-8000-000000000003')$$,
  '42501', null, 'No se puede crear una pareja saltándose create_couple');
select throws_ok(
  $$insert into public.couple_members (couple_id, user_id) values ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000003')$$,
  '42501', null, 'No se puede insertar miembros directamente');
select lives_ok($$select public.create_couple('Pareja nueva', null)$$, 'Crear pareja funciona');
select matches((select public.create_invite()), '^[A-HJ-NP-Z2-9]{8}$', 'El código tiene 8 caracteres sin ambiguos (0/O/1/I)');
select is((select count(*)::int from public.couple_invites), 1, 'Solo hay una invitación activa');
reset role;

-- Regenerar invalida el código anterior
create temp table inv(code text);
grant all on pg_temp.inv to public;
select pg_temp.as_user('a0000000-0000-4000-8000-000000000003');
insert into pg_temp.inv select public.create_invite();
reset role;
select is((select count(*)::int from public.couple_invites where couple_id = (select couple_id from public.couple_members where user_id = 'a0000000-0000-4000-8000-000000000003')), 1, 'Regenerar sustituye el código anterior');

-- Unirse con el código, y no reutilizarlo
select pg_temp.as_user('a0000000-0000-4000-8000-000000000004');
select lives_ok($$select public.join_couple((select code from pg_temp.inv))$$, 'Max se une con el código');
reset role;
select pg_temp.as_user('a0000000-0000-4000-8000-000000000005');
select throws_ok($$select public.join_couple((select code from pg_temp.inv))$$, 'P0001', 'code_used', 'El código no se puede reutilizar');
reset role;

-- Caducidad
select pg_temp.as_user('a0000000-0000-4000-8000-000000000006');
select public.create_couple('Caducada', null);
create temp table inv_exp(code text);
grant all on pg_temp.inv_exp to public;
insert into pg_temp.inv_exp select public.create_invite();
reset role;
update public.couple_invites set expires_at = now() - interval '1 minute' where code = (select code from pg_temp.inv_exp);
select pg_temp.as_user('a0000000-0000-4000-8000-000000000007');
select throws_ok($$select public.join_couple((select code from pg_temp.inv_exp))$$, 'P0001', 'code_expired', 'Un código caducado se rechaza');
reset role;

-- Un usuario solo puede estar en una pareja (restricción única)
select throws_ok(
  $$insert into public.couple_members (couple_id, user_id) select couple_id, 'a0000000-0000-4000-8000-000000000001' from public.couple_members where user_id = 'a0000000-0000-4000-8000-000000000006'$$,
  '23505', null, 'Un usuario no puede pertenecer a dos parejas');

select * from finish();
rollback;

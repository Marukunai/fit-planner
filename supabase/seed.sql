-- Fit Planner · datos de prueba para desarrollo local (NUNCA para producción).
-- Se aplica con `npm run db:reset`. Los tests de pgTAP dependen de estos datos y de estos UUID.
--
-- Usuarios de prueba:   ana@test.local  y  leo@test.local   (contraseña: fitplanner-test)
-- Las fotos no se siembran aquí: las sube scripts/seed-images.ts (Etapa 2).

-- ---------------------------------------------------------------------------
-- Usuarios (el trigger on_auth_user_created crea sus perfiles)
-- ---------------------------------------------------------------------------
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
  confirmation_token, recovery_token, email_change_token_new, email_change
) values
  (
    'a0000000-0000-4000-8000-000000000001', '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'ana@test.local',
    extensions.crypt('fitplanner-test', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"display_name":"Ana"}', now(), now(),
    '', '', '', ''
  ),
  (
    'a0000000-0000-4000-8000-000000000002', '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'leo@test.local',
    extensions.crypt('fitplanner-test', extensions.gen_salt('bf')), now(),
    '{"provider":"email","providers":["email"]}', '{"display_name":"Leo"}', now(), now(),
    '', '', '', ''
  );

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
)
select
  gen_random_uuid(), u.id, u.id::text,
  jsonb_build_object('sub', u.id::text, 'email', u.email, 'email_verified', true),
  'email', now(), now(), now()
from auth.users u
where u.email in ('ana@test.local', 'leo@test.local');

update public.profiles set accent_color = '#5B4BDB' where id = 'a0000000-0000-4000-8000-000000000001';
update public.profiles set accent_color = '#1FA3A3' where id = 'a0000000-0000-4000-8000-000000000002';

-- ---------------------------------------------------------------------------
-- Pareja
-- ---------------------------------------------------------------------------
insert into public.couples (id, name, anniversary, created_by) values
  ('c0000000-0000-4000-8000-000000000001', 'Ana y Leo', current_date - 730, 'a0000000-0000-4000-8000-000000000001');

insert into public.couple_members (couple_id, user_id) values
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002');

-- ---------------------------------------------------------------------------
-- 15 prendas (8 de Ana, 7 de Leo). Una privada de Ana (la pijama).
-- ---------------------------------------------------------------------------
insert into public.garments
  (id, couple_id, owner_id, name, category, colors, primary_color, seasons, occasions,
   fabric, brand, size, status, visibility, is_staple, purchase_price, store)
values
  ('10000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Camiseta blanca básica', 'top', '{"#FFFFFF"}', '#FFFFFF', '{all}', '{casual,work}',
   'algodón', 'Básicos Norte', 'M', 'clean', 'couple', true, 12.95, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Vaqueros rectos azules', 'bottom', '{"#2F4B7C"}', '#2F4B7C', '{all}', '{casual,date}',
   'denim', null, '38', 'clean', 'couple', true, 49.90, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Vestido midi floral', 'dress', '{"#C9657A","#F4E3D7"}', '#C9657A', '{spring,summer}', '{date,dinner,party}',
   'viscosa', null, 'M', 'clean', 'couple', false, 59.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Blazer beige', 'outerwear', '{"#D8C3A5"}', '#D8C3A5', '{spring,autumn}', '{work,dinner,formal}',
   'lino', null, 'M', 'clean', 'couple', false, 79.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Zapatillas blancas', 'shoes', '{"#FFFFFF"}', '#FFFFFF', '{all}', '{casual,date,travel}',
   'cuero', null, '38', 'clean', 'couple', true, 85.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Bolso bandolera negro', 'bag', '{"#1F1B24"}', '#1F1B24', '{all}', '{casual,dinner,party}',
   'piel', null, null, 'clean', 'couple', false, 65.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Jersey de punto verde', 'top', '{"#3E7B5B"}', '#3E7B5B', '{autumn,winter}', '{casual,travel}',
   'lana', null, 'M', 'laundry', 'couple', false, 39.90, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000008', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Pijama de seda', 'underwear', '{"#E8D5E0"}', '#E8D5E0', '{all}', '{other}',
   'seda', null, 'M', 'clean', 'private', false, 70.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Camisa de lino azul', 'top', '{"#6C8EBF"}', '#6C8EBF', '{spring,summer}', '{casual,date,dinner}',
   'lino', null, 'L', 'clean', 'couple', true, 45.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Chinos beige', 'bottom', '{"#CDB99A"}', '#CDB99A', '{spring,summer,autumn}', '{casual,work,date}',
   'algodón', null, '40', 'clean', 'couple', true, 42.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000011', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Chaqueta vaquera', 'outerwear', '{"#3B5B8C"}', '#3B5B8C', '{spring,autumn}', '{casual,travel}',
   'denim', null, 'L', 'clean', 'couple', false, 69.90, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000012', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Zapatillas de cuero', 'shoes', '{"#F2EFE9"}', '#F2EFE9', '{all}', '{casual,date}',
   'cuero', null, '43', 'clean', 'couple', true, 95.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000013', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Polo verde oliva', 'top', '{"#6B7A3A"}', '#6B7A3A', '{spring,summer}', '{casual,date}',
   'algodón', null, 'L', 'clean', 'couple', false, 29.90, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000014', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Reloj plateado', 'accessory', '{"#C0C0C0"}', '#C0C0C0', '{all}', '{casual,formal,dinner}',
   'acero', null, null, 'clean', 'couple', false, 120.00, 'Tienda de ejemplo'),
  ('10000000-0000-4000-8000-000000000015', 'c0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Sudadera gris', 'sport', '{"#9A9A9A"}', '#9A9A9A', '{autumn,winter}', '{sport,casual}',
   'algodón', null, 'L', 'lent', 'couple', false, 35.00, 'Tienda de ejemplo');

-- ---------------------------------------------------------------------------
-- 3 planes: uno pasado, uno próximo y una escapada
-- ---------------------------------------------------------------------------
insert into public.plans (id, couple_id, title, kind, starts_at, ends_at, place, dress_code, notes, created_by) values
  ('30000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'Cena de aniversario', 'dinner', date_trunc('day', now()) - interval '10 days' + interval '21 hours',
   date_trunc('day', now()) - interval '10 days' + interval '23 hours',
   'Restaurante La Huerta', 'Elegante informal', 'Mesa reservada a las 21:00.',
   'a0000000-0000-4000-8000-000000000001'),
  ('30000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001',
   'Cita en el cine', 'date', date_trunc('day', now()) + interval '3 days' + interval '20 hours', null,
   'Cines del centro', 'Casual', null,
   'a0000000-0000-4000-8000-000000000002'),
  ('30000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001',
   'Escapada a Oporto', 'trip', date_trunc('day', now()) + interval '20 days',
   date_trunc('day', now()) + interval '22 days', 'Oporto', 'Cómodo para caminar', 'Llevar chubasquero.',
   'a0000000-0000-4000-8000-000000000001');

-- ---------------------------------------------------------------------------
-- 4 outfits
--   1) Ana · cena (llevado)      2) Leo · cena (llevado)
--   3) Ana propone a Leo (propuesto)      4) Ana · borrador sin plan
-- Los dos primeros se insertan como "accepted" y se pasan a "worn" para ejercitar el trigger de wear_log.
-- ---------------------------------------------------------------------------
insert into public.outfits
  (id, couple_id, wearer_id, created_by, plan_id, title, status, occasion, mood, visibility, note)
values
  ('20000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   '30000000-0000-4000-8000-000000000001', 'Cena elegante', 'accepted', 'dinner', 'especial', 'couple',
   'Funcionó genial con el blazer.'),
  ('20000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002',
   '30000000-0000-4000-8000-000000000001', 'Camisa de lino y chinos', 'accepted', 'dinner', 'tranquilo', 'couple', null),
  ('20000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001',
   '30000000-0000-4000-8000-000000000002', 'Para el cine', 'proposed', 'date', 'relajado', 'couple',
   'Pruébate el polo verde, te queda muy bien.'),
  ('20000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   null, 'Domingo cómodo', 'draft', 'casual', 'relajado', 'couple', null);

insert into public.outfit_items (outfit_id, garment_id, position) values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000003', 0),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000004', 1),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000005', 2),
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000006', 3),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000009', 0),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000010', 1),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000012', 2),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000013', 0),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000010', 1),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000011', 2),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000012', 3),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000001', 0),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 1),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000005', 2);

update public.outfits
set status = 'worn', worn_on = current_date - 10
where id in ('20000000-0000-4000-8000-000000000001', '20000000-0000-4000-8000-000000000002');

-- ---------------------------------------------------------------------------
-- Valoraciones y comentarios
-- ---------------------------------------------------------------------------
insert into public.ratings (outfit_id, rater_id, score) values
  ('20000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001', 8),
  ('20000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002', 10),
  ('20000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002', 7),
  ('20000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001', 8);

insert into public.comments (id, couple_id, author_id, outfit_id, garment_id, tip_id, body) values
  ('50000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', '20000000-0000-4000-8000-000000000001', null, null,
   'Te queda increíble ese vestido con el blazer.'),
  ('50000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', null, '10000000-0000-4000-8000-000000000003', null,
   '¿Te lo pones para Oporto?');

-- ---------------------------------------------------------------------------
-- 5 tips (uno en modo sorpresa, oculto para Leo durante 30 días)
-- ---------------------------------------------------------------------------
insert into public.tips
  (id, couple_id, author_id, for_user_id, title, url, store, price, category, note, priority,
   status, reserved_by, visibility, hidden_until)
values
  ('40000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000001',
   'Zapatillas blancas de piel', 'https://example.com/zapatillas-blancas', 'Tienda de ejemplo', 89.90,
   'shoes', 'Te irían genial con el vestido midi.', 2, 'idea', null, 'couple', null),
  ('40000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Cazadora bomber verde', 'https://example.com/bomber-verde', 'Tienda de ejemplo', 79.00,
   'outerwear', 'Sorpresa para su cumpleaños.', 3, 'idea', null, 'surprise', now() + interval '30 days'),
  ('40000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000001',
   'Bolso de piel marrón', 'https://example.com/bolso-marron', 'Tienda de ejemplo', 120.00,
   'bag', 'Para mi lista de deseos.', 2, 'reserved', 'a0000000-0000-4000-8000-000000000002', 'couple', null),
  ('40000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000002', 'a0000000-0000-4000-8000-000000000002',
   'Gafas de sol', 'https://example.com/gafas-sol', 'Tienda de ejemplo', 59.00,
   'accessory', null, 1, 'bought', null, 'couple', null),
  ('40000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', 'a0000000-0000-4000-8000-000000000002',
   'Cinturón de cuero', null, null, 35.00,
   'accessory', 'Combina con los chinos.', 3, 'idea', null, 'couple', null);

insert into public.comments (id, couple_id, author_id, outfit_id, garment_id, tip_id, body) values
  ('50000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000001',
   'a0000000-0000-4000-8000-000000000001', null, null, '40000000-0000-4000-8000-000000000001',
   '¡Me encantan! Gracias por el tip.');

-- ---------------------------------------------------------------------------
-- Notificaciones de ejemplo
-- ---------------------------------------------------------------------------
insert into public.notifications (user_id, couple_id, type, title, body, payload) values
  ('a0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'tip', 'Tu pareja te ha dejado un tip', 'Zapatillas blancas de piel',
   '{"tip_id":"40000000-0000-4000-8000-000000000001"}'),
  ('a0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000001',
   'proposal', 'Tu pareja te propone un outfit', 'Para el cine',
   '{"outfit_id":"20000000-0000-4000-8000-000000000003"}');

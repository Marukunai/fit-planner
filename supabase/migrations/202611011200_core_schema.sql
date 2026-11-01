-- Fit Planner · migración 1: esquema del núcleo, funciones, triggers y RLS.
-- Fuente de verdad del esquema: no se edita una vez aplicada; los cambios van en migraciones nuevas.

-- ============================================================================
-- 1. Tipos enumerados
-- ============================================================================
create type public.visibility as enum ('private', 'couple', 'surprise');
create type public.garment_category as enum
  ('top', 'bottom', 'dress', 'outerwear', 'shoes', 'bag', 'accessory', 'underwear', 'sport', 'other');
create type public.garment_status as enum ('clean', 'laundry', 'lent', 'repair', 'stored', 'sold');
create type public.season as enum ('spring', 'summer', 'autumn', 'winter', 'all');
create type public.occasion as enum
  ('casual', 'date', 'dinner', 'party', 'work', 'sport', 'travel', 'formal', 'other');
create type public.outfit_status as enum ('draft', 'proposed', 'accepted', 'rejected', 'worn');
create type public.tip_status as enum ('idea', 'reserved', 'bought', 'discarded');
create type public.plan_kind as enum ('date', 'dinner', 'trip', 'party', 'event', 'other');

-- ============================================================================
-- 2. Tablas
-- ============================================================================

-- Perfiles (1 a 1 con auth.users). Se crean solos con el trigger handle_new_user.
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 60),
  avatar_path text,
  accent_color text not null default '#5B4BDB' check (accent_color ~ '^#[0-9A-Fa-f]{6}$'),
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  locale text not null default 'es-ES',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Parejas (espacio compartido)
create table public.couples (
  id uuid primary key default gen_random_uuid(),
  name text check (char_length(name) <= 80),
  anniversary date,
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now()
);

-- Miembros (máximo 2 por pareja, reforzado con trigger)
create table public.couple_members (
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (couple_id, user_id),
  unique (user_id) -- un usuario solo pertenece a una pareja
);

-- Invitaciones por código
create table public.couple_invites (
  code text primary key check (code ~ '^[A-HJ-NP-Z2-9]{8}$'),
  couple_id uuid not null references public.couples (id) on delete cascade,
  created_by uuid references public.profiles (id),
  expires_at timestamptz not null default now() + interval '48 hours',
  used_by uuid references public.profiles (id),
  used_at timestamptz
);
create index couple_invites_couple_id_idx on public.couple_invites (couple_id);

-- Prendas
create table public.garments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  owner_id uuid not null references public.profiles (id),
  name text not null check (char_length(name) between 1 and 120),
  category public.garment_category not null,
  subcategory text,
  colors text[] not null default '{}', -- hex o nombres normalizados
  primary_color text,
  seasons public.season[] not null default '{all}',
  occasions public.occasion[] not null default '{casual}',
  fabric text,
  brand text,
  size text,
  status public.garment_status not null default 'clean',
  visibility public.visibility not null default 'couple',
  photo_path text, -- original comprimido
  cutout_path text, -- recorte sin fondo
  thumb_path text,
  is_staple boolean not null default false, -- "comodín"
  purchase_price numeric(10, 2) check (purchase_price >= 0),
  purchase_date date,
  store text,
  product_url text check (product_url ~* '^https?://'),
  receipt_path text,
  return_deadline date,
  care_instructions text,
  notes text check (char_length(notes) <= 2000),
  wear_count int not null default 0 check (wear_count >= 0),
  last_worn_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index garments_couple_owner_category_idx
  on public.garments (couple_id, owner_id, category) where deleted_at is null;

-- Planes / quedadas
create table public.plans (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  title text not null check (char_length(title) between 1 and 120),
  kind public.plan_kind not null default 'date',
  starts_at timestamptz not null,
  ends_at timestamptz,
  place text,
  lat numeric,
  lng numeric,
  dress_code text,
  notes text check (char_length(notes) <= 2000),
  google_event_id text, -- Fase 4
  created_by uuid references public.profiles (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  check (ends_at is null or ends_at >= starts_at)
);
create index plans_couple_starts_idx on public.plans (couple_id, starts_at) where deleted_at is null;

-- Outfits
create table public.outfits (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  wearer_id uuid not null references public.profiles (id), -- quien lo lleva
  created_by uuid not null references public.profiles (id), -- quien lo ha creado/propuesto
  plan_id uuid references public.plans (id) on delete set null,
  title text check (char_length(title) <= 120),
  status public.outfit_status not null default 'draft',
  occasion public.occasion,
  mood text,
  visibility public.visibility not null default 'couple',
  canvas jsonb, -- posiciones en el lienzo (Fase 2)
  cover_path text,
  worn_on date,
  note text check (char_length(note) <= 1000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index outfits_couple_wearer_idx on public.outfits (couple_id, wearer_id) where deleted_at is null;
create index outfits_plan_id_idx on public.outfits (plan_id);

create table public.outfit_items (
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  garment_id uuid not null references public.garments (id) on delete restrict,
  position int not null default 0,
  primary key (outfit_id, garment_id)
);
create index outfit_items_garment_id_idx on public.outfit_items (garment_id);

-- Valoraciones 1-10 (una por persona y outfit)
create table public.ratings (
  outfit_id uuid not null references public.outfits (id) on delete cascade,
  rater_id uuid not null references public.profiles (id),
  score smallint not null check (score between 1 and 10),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (outfit_id, rater_id)
);

-- Tips de compra / wishlist (antes que comments, que los referencia)
create table public.tips (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_id uuid not null references public.profiles (id), -- quien lo sugiere
  for_user_id uuid not null references public.profiles (id), -- para quién es (uno mismo = wishlist)
  title text not null check (char_length(title) between 1 and 160),
  url text check (url ~* '^https?://'),
  image_path text,
  store text,
  price numeric(10, 2) check (price >= 0),
  currency text not null default 'EUR',
  category public.garment_category,
  note text check (char_length(note) <= 1000),
  priority smallint not null default 2 check (priority between 1 and 3),
  status public.tip_status not null default 'idea',
  reserved_by uuid references public.profiles (id),
  visibility public.visibility not null default 'couple',
  hidden_until timestamptz, -- modo sorpresa
  target_price numeric(10, 2) check (target_price >= 0), -- alerta de precio (Fase 5)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index tips_couple_for_status_idx on public.tips (couple_id, for_user_id, status) where deleted_at is null;

-- Reacciones rápidas (Fase 2, tabla creada ya)
create table public.reactions (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  user_id uuid not null references public.profiles (id),
  outfit_id uuid references public.outfits (id) on delete cascade,
  garment_id uuid references public.garments (id) on delete cascade,
  emoji text not null check (char_length(emoji) between 1 and 16),
  created_at timestamptz not null default now(),
  check (num_nonnulls(outfit_id, garment_id) = 1)
);
create index reactions_couple_id_idx on public.reactions (couple_id);
create index reactions_outfit_id_idx on public.reactions (outfit_id);
create index reactions_garment_id_idx on public.reactions (garment_id);

-- Comentarios por prenda, outfit o tip
create table public.comments (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  author_id uuid not null references public.profiles (id),
  outfit_id uuid references public.outfits (id) on delete cascade,
  garment_id uuid references public.garments (id) on delete cascade,
  tip_id uuid references public.tips (id) on delete cascade,
  body text not null check (char_length(btrim(body)) between 1 and 1000),
  created_at timestamptz not null default now(),
  edited_at timestamptz,
  deleted_at timestamptz,
  check (num_nonnulls(outfit_id, garment_id, tip_id) = 1)
);
create index comments_couple_id_idx on public.comments (couple_id);
create index comments_outfit_id_idx on public.comments (outfit_id) where outfit_id is not null;
create index comments_garment_id_idx on public.comments (garment_id) where garment_id is not null;
create index comments_tip_id_idx on public.comments (tip_id) where tip_id is not null;

-- Registro de uso (alimenta estadísticas y coste por uso). Solo lo escribe un trigger.
create table public.wear_log (
  id uuid primary key default gen_random_uuid(),
  couple_id uuid not null references public.couples (id) on delete cascade,
  garment_id uuid not null references public.garments (id) on delete cascade,
  outfit_id uuid references public.outfits (id) on delete set null,
  user_id uuid references public.profiles (id),
  worn_on date not null default current_date,
  unique (garment_id, outfit_id, worn_on)
);
create index wear_log_couple_id_idx on public.wear_log (couple_id);
create index wear_log_outfit_id_idx on public.wear_log (outfit_id);

-- Notificaciones in-app
create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  couple_id uuid references public.couples (id) on delete cascade,
  type text not null, -- 'tip', 'rating', 'proposal', 'plan_reminder', ...
  title text not null,
  body text,
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_created_idx on public.notifications (user_id, created_at desc);
create index notifications_couple_id_idx on public.notifications (couple_id);

create table public.push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);
create index push_subscriptions_user_id_idx on public.push_subscriptions (user_id);

-- Índices de apoyo a las claves foráneas que usan las políticas
create index garments_owner_id_idx on public.garments (owner_id);
create index outfits_created_by_idx on public.outfits (created_by);
create index tips_author_id_idx on public.tips (author_id);

-- ============================================================================
-- 3. Funciones auxiliares (security definer: evitan recursión de RLS)
-- ============================================================================

-- Pareja del usuario autenticado (null si no tiene).
create function public.current_couple_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select cm.couple_id from public.couple_members cm where cm.user_id = auth.uid()
$$;

-- true si el usuario autenticado es miembro de la pareja indicada.
create function public.is_partner_of(p_couple_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.couple_members cm
    where cm.couple_id = p_couple_id and cm.user_id = auth.uid()
  )
$$;

-- true si p_user_id pertenece a la pareja p_couple_id (para validar "quién lo lleva", "para quién es").
create function public.is_couple_member(p_couple_id uuid, p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.couple_members cm
    where cm.couple_id = p_couple_id and cm.user_id = p_user_id
  )
$$;

-- Código de invitación de 8 caracteres sin ambiguos (sin 0/O ni 1/I), con aleatoriedad criptográfica.
create function public.generate_invite_code()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  alphabet constant text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; -- 32 símbolos: 256 % 32 = 0, sin sesgo
  result text := '';
  bytes bytea;
begin
  bytes := uuid_send(gen_random_uuid());
  for i in 0..7 loop
    result := result || substr(alphabet, (get_byte(bytes, i) % 32) + 1, 1);
  end loop;
  return result;
end;
$$;

-- ============================================================================
-- 4. Funciones de emparejamiento (la única vía para crear/unirse a una pareja)
-- ============================================================================

create function public.create_couple(p_name text default null, p_anniversary date default null)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  new_couple_id uuid;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  if exists (select 1 from public.couple_members where user_id = uid) then
    raise exception 'already_in_couple';
  end if;

  insert into public.couples (name, anniversary, created_by)
  values (nullif(btrim(p_name), ''), p_anniversary, uid)
  returning id into new_couple_id;

  insert into public.couple_members (couple_id, user_id) values (new_couple_id, uid);
  return new_couple_id;
end;
$$;

-- Genera un código nuevo (48 h) e invalida los anteriores sin usar ("regenerar código").
create function public.create_invite()
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  my_couple uuid;
  new_code text;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  select couple_id into my_couple from public.couple_members where user_id = uid;
  if my_couple is null then
    raise exception 'not_in_couple';
  end if;
  if (select count(*) from public.couple_members where couple_id = my_couple) >= 2 then
    raise exception 'couple_full';
  end if;

  delete from public.couple_invites where couple_id = my_couple and used_at is null;

  loop
    new_code := public.generate_invite_code();
    exit when not exists (select 1 from public.couple_invites where code = new_code);
  end loop;

  insert into public.couple_invites (code, couple_id, created_by) values (new_code, my_couple, uid);
  return new_code;
end;
$$;

create function public.join_couple(p_code text)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
  invite public.couple_invites;
begin
  if uid is null then
    raise exception 'not_authenticated';
  end if;
  if exists (select 1 from public.couple_members where user_id = uid) then
    raise exception 'already_in_couple';
  end if;

  select * into invite
  from public.couple_invites
  where code = upper(btrim(p_code))
  for update;

  if not found then
    raise exception 'invalid_code';
  end if;
  if invite.used_at is not null then
    raise exception 'code_used';
  end if;
  if invite.expires_at <= now() then
    raise exception 'code_expired';
  end if;

  -- El trigger enforce_couple_size lanza 'couple_full' si ya son dos.
  insert into public.couple_members (couple_id, user_id) values (invite.couple_id, uid);
  update public.couple_invites set used_by = uid, used_at = now() where code = invite.code;
  return invite.couple_id;
end;
$$;

-- ============================================================================
-- 5. Triggers
-- ============================================================================

-- updated_at automático
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_set_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger garments_set_updated_at before update on public.garments
  for each row execute function public.set_updated_at();
create trigger plans_set_updated_at before update on public.plans
  for each row execute function public.set_updated_at();
create trigger ratings_set_updated_at before update on public.ratings
  for each row execute function public.set_updated_at();
create trigger tips_set_updated_at before update on public.tips
  for each row execute function public.set_updated_at();

-- Perfil automático al registrarse
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    left(
      coalesce(
        nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
        nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
        'Usuario'
      ),
      60
    )
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Máximo 2 miembros por pareja (con bloqueo de la fila de la pareja para evitar carreras)
create function public.enforce_couple_size()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  perform 1 from public.couples where id = new.couple_id for update;
  if (select count(*) from public.couple_members where couple_id = new.couple_id) >= 2 then
    raise exception 'couple_full';
  end if;
  return new;
end;
$$;

create trigger couple_members_enforce_size before insert on public.couple_members
  for each row execute function public.enforce_couple_size();

-- Outfits: solo quien lo lleva decide sobre una propuesta ajena
create function public.guard_outfit_write()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null then
    return new; -- service_role, migraciones y seed
  end if;

  if tg_op = 'INSERT' then
    if new.created_by <> new.wearer_id and new.status not in ('draft', 'proposed') then
      raise exception 'only_wearer_can_decide';
    end if;
    return new;
  end if;

  if new.couple_id <> old.couple_id or new.created_by <> old.created_by then
    raise exception 'immutable_column';
  end if;

  if uid = old.created_by then
    if new.created_by <> new.wearer_id
       and new.status is distinct from old.status
       and new.status in ('accepted', 'rejected', 'worn') then
      raise exception 'only_wearer_can_decide';
    end if;
  else
    -- Quien lo lleva (y no lo ha creado) solo puede decidir sobre estado, fecha y nota.
    if (to_jsonb(new) - 'status' - 'worn_on' - 'note' - 'updated_at')
       is distinct from (to_jsonb(old) - 'status' - 'worn_on' - 'note' - 'updated_at') then
      raise exception 'wearer_can_only_decide';
    end if;
    if new.status is distinct from old.status and new.status not in ('accepted', 'rejected', 'worn') then
      raise exception 'wearer_can_only_decide';
    end if;
  end if;
  return new;
end;
$$;

create function public.outfit_worn_defaults()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'worn' and old.status is distinct from 'worn' and new.worn_on is null then
    new.worn_on := current_date;
  end if;
  return new;
end;
$$;

-- Al marcar un outfit como llevado: wear_log + wear_count + last_worn_on.
-- (Deshacer "llevado" no revierte el registro: decisión pendiente, ver docs/decisions.md.)
create function public.log_outfit_worn()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  with inserted as (
    insert into public.wear_log (couple_id, garment_id, outfit_id, user_id, worn_on)
    select new.couple_id, oi.garment_id, new.id, new.wearer_id, new.worn_on
    from public.outfit_items oi
    where oi.outfit_id = new.id
    on conflict do nothing
    returning garment_id, worn_on
  )
  update public.garments g
  set wear_count = g.wear_count + 1,
      last_worn_on = greatest(coalesce(g.last_worn_on, i.worn_on), i.worn_on)
  from inserted i
  where g.id = i.garment_id;
  return new;
end;
$$;

create trigger outfits_01_guard before insert or update on public.outfits
  for each row execute function public.guard_outfit_write();
create trigger outfits_02_worn_defaults before update on public.outfits
  for each row execute function public.outfit_worn_defaults();
create trigger outfits_03_set_updated_at before update on public.outfits
  for each row execute function public.set_updated_at();
create trigger outfits_04_log_worn after update of status on public.outfits
  for each row when (new.status = 'worn' and old.status is distinct from 'worn')
  execute function public.log_outfit_worn();

-- Tips: la pareja solo puede reservar o marcar como comprado
create function public.guard_tip_write()
returns trigger
language plpgsql
set search_path = ''
as $$
declare
  uid uuid := auth.uid();
begin
  if uid is null or tg_op = 'INSERT' then
    return new;
  end if;

  if new.couple_id <> old.couple_id or new.author_id <> old.author_id then
    raise exception 'immutable_column';
  end if;

  if uid <> old.author_id then
    if (to_jsonb(new) - 'status' - 'reserved_by' - 'updated_at')
       is distinct from (to_jsonb(old) - 'status' - 'reserved_by' - 'updated_at') then
      raise exception 'partner_can_only_reserve';
    end if;
    if new.status not in ('idea', 'reserved', 'bought')
       or (new.reserved_by is not null and new.reserved_by <> uid) then
      raise exception 'partner_can_only_reserve';
    end if;
  end if;
  return new;
end;
$$;

create trigger tips_guard before insert or update on public.tips
  for each row execute function public.guard_tip_write();

-- Comentarios: marca de edición y destino inmutable
create function public.comments_before_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.outfit_id is distinct from old.outfit_id
     or new.garment_id is distinct from old.garment_id
     or new.tip_id is distinct from old.tip_id
     or new.couple_id <> old.couple_id
     or new.author_id <> old.author_id then
    raise exception 'immutable_column';
  end if;
  if new.body is distinct from old.body then
    new.edited_at := now();
  end if;
  return new;
end;
$$;

create trigger comments_before_update before update on public.comments
  for each row execute function public.comments_before_update();

-- Notificaciones: el usuario solo puede marcarlas como leídas
create function public.guard_notification_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if auth.uid() is not null
     and (to_jsonb(new) - 'read_at') is distinct from (to_jsonb(old) - 'read_at') then
    raise exception 'only_read_at_can_change';
  end if;
  return new;
end;
$$;

create trigger notifications_guard before update on public.notifications
  for each row execute function public.guard_notification_update();

-- ============================================================================
-- 6. Row Level Security: activada en TODAS las tablas
--    Sin política = sin acceso. Los filtros de borrado lógico (deleted_at) los
--    aplica la capa de acceso a datos, no la RLS: un UPDATE ... RETURNING que
--    marca deleted_at fallaría si la política SELECT ocultara la fila resultante.
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.couples enable row level security;
alter table public.couple_members enable row level security;
alter table public.couple_invites enable row level security;
alter table public.garments enable row level security;
alter table public.plans enable row level security;
alter table public.outfits enable row level security;
alter table public.outfit_items enable row level security;
alter table public.ratings enable row level security;
alter table public.reactions enable row level security;
alter table public.tips enable row level security;
alter table public.comments enable row level security;
alter table public.wear_log enable row level security;
alter table public.notifications enable row level security;
alter table public.push_subscriptions enable row level security;

-- profiles: el propio y el de la pareja. Se crean con el trigger; no hay INSERT/DELETE de cliente.
create policy profiles_select on public.profiles for select to authenticated
  using (
    id = (select auth.uid())
    or id in (
      select cm.user_id from public.couple_members cm
      where cm.couple_id = (select public.current_couple_id())
    )
  );
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

-- couples: solo miembros. Se crean con create_couple().
create policy couples_select on public.couples for select to authenticated
  using (id = (select public.current_couple_id()));
create policy couples_update on public.couples for update to authenticated
  using (id = (select public.current_couple_id()))
  with check (id = (select public.current_couple_id()));

-- couple_members: lectura de los miembros de mi pareja. Altas solo con join_couple()/create_couple().
create policy couple_members_select on public.couple_members for select to authenticated
  using (couple_id = (select public.current_couple_id()));

-- couple_invites: ver y revocar los de mi pareja. Altas y usos solo por función.
create policy couple_invites_select on public.couple_invites for select to authenticated
  using (couple_id = (select public.current_couple_id()));
create policy couple_invites_delete on public.couple_invites for delete to authenticated
  using (couple_id = (select public.current_couple_id()));

-- garments: private/surprise solo para el propietario; couple para ambos. Solo el propietario escribe.
create policy garments_select on public.garments for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (owner_id = (select auth.uid()) or visibility = 'couple')
  );
create policy garments_insert on public.garments for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and owner_id = (select auth.uid())
  );
create policy garments_update on public.garments for update to authenticated
  using (couple_id = (select public.current_couple_id()) and owner_id = (select auth.uid()))
  with check (couple_id = (select public.current_couple_id()) and owner_id = (select auth.uid()));
create policy garments_delete on public.garments for delete to authenticated
  using (couple_id = (select public.current_couple_id()) and owner_id = (select auth.uid()));

-- plans: compartidos por la pareja.
create policy plans_select on public.plans for select to authenticated
  using (couple_id = (select public.current_couple_id()));
create policy plans_insert on public.plans for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and created_by = (select auth.uid())
  );
create policy plans_update on public.plans for update to authenticated
  using (couple_id = (select public.current_couple_id()))
  with check (couple_id = (select public.current_couple_id()));
create policy plans_delete on public.plans for delete to authenticated
  using (couple_id = (select public.current_couple_id()));

-- outfits: el autor los ve siempre; la pareja solo si visibility = 'couple'.
-- Quién puede cambiar qué en una propuesta lo decide el trigger guard_outfit_write.
create policy outfits_select on public.outfits for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (created_by = (select auth.uid()) or visibility = 'couple')
  );
create policy outfits_insert on public.outfits for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and created_by = (select auth.uid())
    and public.is_couple_member(couple_id, wearer_id)
    and (plan_id is null or exists (select 1 from public.plans p where p.id = outfits.plan_id))
  );
create policy outfits_update on public.outfits for update to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (
      created_by = (select auth.uid())
      or (wearer_id = (select auth.uid()) and visibility = 'couple')
    )
  )
  with check (
    couple_id = (select public.current_couple_id())
    and (created_by = (select auth.uid()) or wearer_id = (select auth.uid()))
    and public.is_couple_member(couple_id, wearer_id)
  );
create policy outfits_delete on public.outfits for delete to authenticated
  using (couple_id = (select public.current_couple_id()) and created_by = (select auth.uid()));

-- outfit_items: heredan la visibilidad del outfit; solo su autor los modifica, y solo con prendas visibles.
create policy outfit_items_select on public.outfit_items for select to authenticated
  using (exists (select 1 from public.outfits o where o.id = outfit_items.outfit_id));
create policy outfit_items_insert on public.outfit_items for insert to authenticated
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.created_by = (select auth.uid())
    )
    and exists (select 1 from public.garments g where g.id = outfit_items.garment_id)
  );
create policy outfit_items_update on public.outfit_items for update to authenticated
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.created_by = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.created_by = (select auth.uid())
    )
    and exists (select 1 from public.garments g where g.id = outfit_items.garment_id)
  );
create policy outfit_items_delete on public.outfit_items for delete to authenticated
  using (
    exists (
      select 1 from public.outfits o
      where o.id = outfit_items.outfit_id and o.created_by = (select auth.uid())
    )
  );

-- ratings: ambos ven y valoran outfits visibles; cada uno solo toca su nota.
create policy ratings_select on public.ratings for select to authenticated
  using (exists (select 1 from public.outfits o where o.id = ratings.outfit_id));
create policy ratings_insert on public.ratings for insert to authenticated
  with check (
    rater_id = (select auth.uid())
    and exists (select 1 from public.outfits o where o.id = ratings.outfit_id)
  );
create policy ratings_update on public.ratings for update to authenticated
  using (rater_id = (select auth.uid()))
  with check (rater_id = (select auth.uid()));
create policy ratings_delete on public.ratings for delete to authenticated
  using (rater_id = (select auth.uid()));

-- reactions: sobre outfits o prendas visibles; cada uno borra las suyas.
create policy reactions_select on public.reactions for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (
      (outfit_id is not null and exists (select 1 from public.outfits o where o.id = reactions.outfit_id))
      or (garment_id is not null and exists (select 1 from public.garments g where g.id = reactions.garment_id))
    )
  );
create policy reactions_insert on public.reactions for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and user_id = (select auth.uid())
    and (
      (outfit_id is not null and exists (select 1 from public.outfits o where o.id = reactions.outfit_id))
      or (garment_id is not null and exists (select 1 from public.garments g where g.id = reactions.garment_id))
    )
  );
create policy reactions_delete on public.reactions for delete to authenticated
  using (user_id = (select auth.uid()) and couple_id = (select public.current_couple_id()));

-- tips: el autor siempre; la pareja solo si no es privado, y en modo sorpresa solo pasada hidden_until.
create policy tips_select on public.tips for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (
      author_id = (select auth.uid())
      or (visibility = 'couple' and (hidden_until is null or hidden_until <= now()))
      or (visibility = 'surprise' and hidden_until is not null and hidden_until <= now())
    )
  );
create policy tips_insert on public.tips for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and author_id = (select auth.uid())
    and public.is_couple_member(couple_id, for_user_id)
  );
create policy tips_update on public.tips for update to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (
      author_id = (select auth.uid())
      or (visibility = 'couple' and (hidden_until is null or hidden_until <= now()))
      or (visibility = 'surprise' and hidden_until is not null and hidden_until <= now())
    )
  )
  with check (couple_id = (select public.current_couple_id()));
create policy tips_delete on public.tips for delete to authenticated
  using (couple_id = (select public.current_couple_id()) and author_id = (select auth.uid()));

-- comments: sobre elementos visibles; solo el autor edita (o marca como borrado) los suyos.
create policy comments_select on public.comments for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and (
      (outfit_id is not null and exists (select 1 from public.outfits o where o.id = comments.outfit_id))
      or (garment_id is not null and exists (select 1 from public.garments g where g.id = comments.garment_id))
      or (tip_id is not null and exists (select 1 from public.tips t where t.id = comments.tip_id))
    )
  );
create policy comments_insert on public.comments for insert to authenticated
  with check (
    couple_id = (select public.current_couple_id())
    and author_id = (select auth.uid())
    and (
      (outfit_id is not null and exists (select 1 from public.outfits o where o.id = comments.outfit_id))
      or (garment_id is not null and exists (select 1 from public.garments g where g.id = comments.garment_id))
      or (tip_id is not null and exists (select 1 from public.tips t where t.id = comments.tip_id))
    )
  );
create policy comments_update on public.comments for update to authenticated
  using (author_id = (select auth.uid()) and couple_id = (select public.current_couple_id()))
  with check (author_id = (select auth.uid()) and couple_id = (select public.current_couple_id()));

-- wear_log: solo lectura (lo escribe el trigger) y solo de prendas visibles.
create policy wear_log_select on public.wear_log for select to authenticated
  using (
    couple_id = (select public.current_couple_id())
    and exists (select 1 from public.garments g where g.id = wear_log.garment_id)
  );

-- notifications: cada usuario las suyas. Las crean triggers y funciones del servidor.
create policy notifications_select on public.notifications for select to authenticated
  using (user_id = (select auth.uid()));
create policy notifications_update on public.notifications for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy notifications_delete on public.notifications for delete to authenticated
  using (user_id = (select auth.uid()));

-- push_subscriptions: cada usuario las suyas.
create policy push_subscriptions_select on public.push_subscriptions for select to authenticated
  using (user_id = (select auth.uid()));
create policy push_subscriptions_insert on public.push_subscriptions for insert to authenticated
  with check (user_id = (select auth.uid()));
create policy push_subscriptions_update on public.push_subscriptions for update to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
create policy push_subscriptions_delete on public.push_subscriptions for delete to authenticated
  using (user_id = (select auth.uid()));

-- ============================================================================
-- 7. Permisos: mínimo necesario (defensa en profundidad además de RLS)
-- ============================================================================
revoke all on all tables in schema public from anon;
revoke all on all sequences in schema public from anon;
revoke truncate, references, trigger on all tables in schema public from authenticated;
alter default privileges in schema public revoke all on tables from anon;
alter default privileges in schema public revoke truncate, references, trigger on tables from authenticated;

-- Funciones: nada para anon; las de política y RPC, solo para usuarios con sesión.
revoke execute on all functions in schema public from public, anon;
grant execute on function public.current_couple_id() to authenticated, service_role;
grant execute on function public.is_partner_of(uuid) to authenticated, service_role;
grant execute on function public.is_couple_member(uuid, uuid) to authenticated, service_role;
grant execute on function public.create_couple(text, date) to authenticated, service_role;
grant execute on function public.create_invite() to authenticated, service_role;
grant execute on function public.join_couple(text) to authenticated, service_role;
revoke execute on function public.generate_invite_code() from authenticated;

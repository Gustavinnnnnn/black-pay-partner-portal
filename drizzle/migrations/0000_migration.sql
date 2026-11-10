
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- First signed-in user may claim admin only while no admin exists.
create or replace function public.claim_first_admin()
returns boolean language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return false; end if;
  if exists (select 1 from public.user_roles where role = 'admin') then
    return public.has_role(auth.uid(), 'admin');
  end if;
  insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
  return true;
end $$;
revoke all on function public.claim_first_admin() from public, anon;
grant execute on function public.claim_first_admin() to authenticated;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  modality text not null check (modality in ('suporte','investidor','expansao')),
  full_name text not null check (char_length(full_name) between 3 and 120),
  age int not null check (age between 16 and 100),
  city_state text not null check (char_length(city_state) between 2 and 120),
  whatsapp text not null check (whatsapp ~ '^[0-9]{10,13}$'),
  instagram text check (instagram is null or char_length(instagram) <= 60),
  answers jsonb not null default '{}'::jsonb,
  consent boolean not null check (consent = true),
  status text not null default 'nova' check (status in ('nova','em_analise','em_negociacao','aprovada','recusada')),
  admin_notes text check (admin_notes is null or char_length(admin_notes) <= 5000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index applications_modality_idx on public.applications(modality);
create index applications_status_idx on public.applications(status);
create index applications_created_idx on public.applications(created_at desc);

grant insert on public.applications to anon, authenticated;
grant select, update, delete on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;

create policy "Anyone can submit new applications" on public.applications for insert to anon, authenticated
  with check (status = 'nova' and admin_notes is null and consent = true);
create policy "Admins read applications" on public.applications for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update applications" on public.applications for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "Admins delete applications" on public.applications for delete to authenticated using (public.has_role(auth.uid(),'admin'));

create table public.application_events (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null,
  actor_id uuid,
  action text not null check (action in ('status_change','notes_update','deleted')),
  from_value text,
  to_value text,
  created_at timestamptz not null default now()
);
create index application_events_app_idx on public.application_events(application_id);
grant select on public.application_events to authenticated;
grant all on public.application_events to service_role;
alter table public.application_events enable row level security;
create policy "Admins read events" on public.application_events for select to authenticated using (public.has_role(auth.uid(),'admin'));

create or replace function public.log_application_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' then
    new.updated_at := now();
    if new.status is distinct from old.status then
      insert into public.application_events(application_id, actor_id, action, from_value, to_value)
      values (new.id, auth.uid(), 'status_change', old.status, new.status);
    end if;
    if new.admin_notes is distinct from old.admin_notes then
      insert into public.application_events(application_id, actor_id, action) values (new.id, auth.uid(), 'notes_update');
    end if;
    return new;
  elsif tg_op = 'DELETE' then
    insert into public.application_events(application_id, actor_id, action, from_value)
    values (old.id, auth.uid(), 'deleted', old.full_name);
    return old;
  end if;
  return null;
end $$;

create trigger applications_before_update before update on public.applications
  for each row execute function public.log_application_change();
create trigger applications_after_delete after delete on public.applications
  for each row execute function public.log_application_change();

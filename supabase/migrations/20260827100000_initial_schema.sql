-- GPW Srinagar CMS schema
-- Run: supabase db push  OR  supabase migration up

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Admin profiles (linked to Supabase Auth)
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Departments
-- ---------------------------------------------------------------------------
create table public.departments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  summary text not null default '',
  head_name text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Academic programs
-- ---------------------------------------------------------------------------
create table public.programs (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments (id) on delete set null,
  name text not null,
  dept_label text not null,
  duration text not null default '3 Years',
  eligibility text not null default '',
  seats text not null default '',
  stream text not null default 'Engineering',
  overview text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Notices / announcements (unified)
-- ---------------------------------------------------------------------------
create table public.notices (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Notices',
  tag text not null default 'Notice',
  published_at date not null default current_date,
  priority text not null default 'General' check (priority in ('Urgent', 'Important', 'General')),
  file_label text,
  file_url text,
  is_pinned boolean not null default false,
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Campus events
-- ---------------------------------------------------------------------------
create table public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date text not null,
  venue text not null default '',
  description text not null default '',
  is_published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Homepage content blocks
-- ---------------------------------------------------------------------------
create table public.institute_stats (
  id uuid primary key default gen_random_uuid(),
  value numeric not null,
  label text not null,
  prefix text not null default '',
  suffix text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.institute_spotlights (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  link_path text not null default '/',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.academic_units (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text not null default '',
  link_path text not null default '/academics',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.home_faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Admissions content
-- ---------------------------------------------------------------------------
create table public.admission_cycles (
  id uuid primary key default gen_random_uuid(),
  year int not null,
  title text not null,
  intro text not null default '',
  fee_note text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admission_steps (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  step_number int not null,
  title text not null,
  description text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admission_documents (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  label text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admission_dates (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  label text not null,
  date_value text not null default '[ADD DATE]',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admission_faqs (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Updated-at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();
create trigger departments_updated_at before update on public.departments
  for each row execute function public.set_updated_at();
create trigger programs_updated_at before update on public.programs
  for each row execute function public.set_updated_at();
create trigger notices_updated_at before update on public.notices
  for each row execute function public.set_updated_at();
create trigger events_updated_at before update on public.events
  for each row execute function public.set_updated_at();
create trigger institute_stats_updated_at before update on public.institute_stats
  for each row execute function public.set_updated_at();
create trigger institute_spotlights_updated_at before update on public.institute_spotlights
  for each row execute function public.set_updated_at();
create trigger academic_units_updated_at before update on public.academic_units
  for each row execute function public.set_updated_at();
create trigger home_faqs_updated_at before update on public.home_faqs
  for each row execute function public.set_updated_at();
create trigger admission_cycles_updated_at before update on public.admission_cycles
  for each row execute function public.set_updated_at();
create trigger admission_steps_updated_at before update on public.admission_steps
  for each row execute function public.set_updated_at();
create trigger admission_documents_updated_at before update on public.admission_documents
  for each row execute function public.set_updated_at();
create trigger admission_dates_updated_at before update on public.admission_dates
  for each row execute function public.set_updated_at();
create trigger admission_faqs_updated_at before update on public.admission_faqs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Helper: is admin
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor')
  );
$$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''), 'admin');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.programs enable row level security;
alter table public.notices enable row level security;
alter table public.events enable row level security;
alter table public.institute_stats enable row level security;
alter table public.institute_spotlights enable row level security;
alter table public.academic_units enable row level security;
alter table public.home_faqs enable row level security;
alter table public.admission_cycles enable row level security;
alter table public.admission_steps enable row level security;
alter table public.admission_documents enable row level security;
alter table public.admission_dates enable row level security;
alter table public.admission_faqs enable row level security;

-- Public read (published / active)
create policy "Public read departments" on public.departments for select using (is_active = true);
create policy "Public read programs" on public.programs for select using (is_active = true);
create policy "Public read notices" on public.notices for select using (is_published = true);
create policy "Public read events" on public.events for select using (is_published = true);
create policy "Public read stats" on public.institute_stats for select using (is_active = true);
create policy "Public read spotlights" on public.institute_spotlights for select using (is_active = true);
create policy "Public read academic_units" on public.academic_units for select using (is_active = true);
create policy "Public read home_faqs" on public.home_faqs for select using (is_active = true);
create policy "Public read admission_cycles" on public.admission_cycles for select using (is_active = true);
create policy "Public read admission_steps" on public.admission_steps for select using (
  exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);
create policy "Public read admission_documents" on public.admission_documents for select using (
  exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);
create policy "Public read admission_dates" on public.admission_dates for select using (
  exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);
create policy "Public read admission_faqs" on public.admission_faqs for select using (
  exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);

-- Admin read all
create policy "Admin read all departments" on public.departments for select using (public.is_admin());
create policy "Admin read all programs" on public.programs for select using (public.is_admin());
create policy "Admin read all notices" on public.notices for select using (public.is_admin());
create policy "Admin read all events" on public.events for select using (public.is_admin());
create policy "Admin read all stats" on public.institute_stats for select using (public.is_admin());
create policy "Admin read all spotlights" on public.institute_spotlights for select using (public.is_admin());
create policy "Admin read all academic_units" on public.academic_units for select using (public.is_admin());
create policy "Admin read all home_faqs" on public.home_faqs for select using (public.is_admin());
create policy "Admin read all admission_cycles" on public.admission_cycles for select using (public.is_admin());
create policy "Admin read all admission_steps" on public.admission_steps for select using (public.is_admin());
create policy "Admin read all admission_documents" on public.admission_documents for select using (public.is_admin());
create policy "Admin read all admission_dates" on public.admission_dates for select using (public.is_admin());
create policy "Admin read all admission_faqs" on public.admission_faqs for select using (public.is_admin());
create policy "Users read own profile" on public.profiles for select using (auth.uid() = id);

-- Admin write (CMA)
create policy "Admin write departments" on public.departments for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write programs" on public.programs for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write notices" on public.notices for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write events" on public.events for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write stats" on public.institute_stats for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write spotlights" on public.institute_spotlights for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write academic_units" on public.academic_units for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write home_faqs" on public.home_faqs for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write admission_cycles" on public.admission_cycles for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write admission_steps" on public.admission_steps for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write admission_documents" on public.admission_documents for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write admission_dates" on public.admission_dates for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin write admission_faqs" on public.admission_faqs for all using (public.is_admin()) with check (public.is_admin());
create policy "Admin update own profile" on public.profiles for update using (auth.uid() = id);

-- Indexes
create index idx_notices_published on public.notices (is_published, sort_order, published_at desc);
create index idx_events_published on public.events (is_published, sort_order);
create index idx_programs_active on public.programs (is_active, sort_order);
create index idx_departments_active on public.departments (is_active, sort_order);

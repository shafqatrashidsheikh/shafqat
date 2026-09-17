-- Hostel rooms / beds / allocations
-- Roommate & vacancy data is visible only to HOD-approved students (and staff/admin).
-- Public visitors never get roster rows through RLS.

create table if not exists public.hostel_rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  floor_label text,
  capacity integer not null check (capacity > 0 and capacity <= 8),
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.hostel_beds (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.hostel_rooms (id) on delete cascade,
  bed_label text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (room_id, bed_label)
);

create table if not exists public.hostel_allocations (
  id uuid primary key default gen_random_uuid(),
  bed_id uuid not null references public.hostel_beds (id) on delete cascade,
  student_id uuid not null references public.profiles (id) on delete cascade,
  status text not null default 'active'
    check (status in ('active', 'vacated')),
  from_date date not null default (current_date),
  to_date date,
  allocated_by uuid references public.profiles (id) on delete set null,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists hostel_allocations_one_active_bed
  on public.hostel_allocations (bed_id)
  where status = 'active';

create unique index if not exists hostel_allocations_one_active_student
  on public.hostel_allocations (student_id)
  where status = 'active';

create index if not exists idx_hostel_beds_room on public.hostel_beds (room_id);
create index if not exists idx_hostel_allocations_student on public.hostel_allocations (student_id);
create index if not exists idx_hostel_allocations_status on public.hostel_allocations (status);

alter table public.hostel_rooms enable row level security;
alter table public.hostel_beds enable row level security;
alter table public.hostel_allocations enable row level security;

-- Approved students + reviewers/admins may read vacancy/roster
drop policy if exists "Approved students read hostel rooms" on public.hostel_rooms;
create policy "Approved students read hostel rooms"
  on public.hostel_rooms for select
  using (
    public.is_approved_student()
    or public.is_principal()
    or public.is_admin()
    or public.is_department_reviewer()
  );

drop policy if exists "Approved students read hostel beds" on public.hostel_beds;
create policy "Approved students read hostel beds"
  on public.hostel_beds for select
  using (
    public.is_approved_student()
    or public.is_principal()
    or public.is_admin()
    or public.is_department_reviewer()
  );

drop policy if exists "Approved students read hostel allocations" on public.hostel_allocations;
create policy "Approved students read hostel allocations"
  on public.hostel_allocations for select
  using (
    public.is_approved_student()
    or public.is_principal()
    or public.is_admin()
    or public.is_department_reviewer()
  );

-- Only principal / admin manage allotments (HOD approval is for student accounts, not room edits)
drop policy if exists "Principal admin manage hostel rooms" on public.hostel_rooms;
create policy "Principal admin manage hostel rooms"
  on public.hostel_rooms for all
  using (public.is_principal() or public.is_admin())
  with check (public.is_principal() or public.is_admin());

drop policy if exists "Principal admin manage hostel beds" on public.hostel_beds;
create policy "Principal admin manage hostel beds"
  on public.hostel_beds for all
  using (public.is_principal() or public.is_admin())
  with check (public.is_principal() or public.is_admin());

drop policy if exists "Principal admin manage hostel allocations" on public.hostel_allocations;
create policy "Principal admin manage hostel allocations"
  on public.hostel_allocations for all
  using (public.is_principal() or public.is_admin())
  with check (public.is_principal() or public.is_admin());

-- Seed a small vacant block so vacancy answers work before allotments are entered
insert into public.hostel_rooms (code, floor_label, capacity, notes)
values
  ('A-101', 'Ground', 2, 'Women hostel — Block A'),
  ('A-102', 'Ground', 2, 'Women hostel — Block A'),
  ('A-103', 'Ground', 2, 'Women hostel — Block A'),
  ('A-201', 'First', 2, 'Women hostel — Block A'),
  ('A-202', 'First', 2, 'Women hostel — Block A'),
  ('A-203', 'First', 3, 'Women hostel — Block A')
on conflict (code) do nothing;

insert into public.hostel_beds (room_id, bed_label)
select r.id, b.bed_label
from public.hostel_rooms r
cross join lateral (
  select generate_series(1, r.capacity)::text as bed_label
) b
where r.code like 'A-%'
  and not exists (
    select 1 from public.hostel_beds hb where hb.room_id = r.id and hb.bed_label = b.bed_label
  );

-- Portal roles: principal, HOD, staff, student approval workflow

-- ---------------------------------------------------------------------------
-- Extend profiles for multi-role portal
-- ---------------------------------------------------------------------------
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add column if not exists department_id uuid references public.departments (id) on delete set null,
  add column if not exists roll_number text,
  add column if not exists phone text,
  add column if not exists approval_status text not null default 'n/a',
  add column if not exists rejection_reason text,
  add column if not exists reviewed_by uuid references public.profiles (id) on delete set null,
  add column if not exists reviewed_at timestamptz;

alter table public.profiles
  add constraint profiles_role_check
    check (role in ('admin', 'editor', 'principal', 'hod', 'staff', 'student'));

alter table public.profiles
  add constraint profiles_approval_status_check
    check (approval_status in ('n/a', 'pending_profile', 'pending_review', 'approved', 'rejected'));

create index if not exists idx_profiles_role on public.profiles (role);
create index if not exists idx_profiles_department on public.profiles (department_id);
create index if not exists idx_profiles_approval on public.profiles (approval_status, department_id);

-- ---------------------------------------------------------------------------
-- Role helpers
-- ---------------------------------------------------------------------------
create or replace function public.is_principal()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'principal')
  );
$$;

create or replace function public.is_hod()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'hod'
  );
$$;

create or replace function public.is_staff_member()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'staff'
  );
$$;

create or replace function public.is_department_reviewer()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('hod', 'staff') and department_id is not null
  );
$$;

create or replace function public.is_approved_student()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'student' and approval_status = 'approved'
  );
$$;

-- CMS admin includes principal
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'editor', 'principal')
  );
$$;

-- ---------------------------------------------------------------------------
-- Signup trigger — default student role, staff invited via metadata
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  assigned_role text;
  assigned_status text;
  assigned_department uuid;
begin
  assigned_role := coalesce(new.raw_user_meta_data->>'role', 'student');
  assigned_department := nullif(new.raw_user_meta_data->>'department_id', '')::uuid;

  if assigned_role = 'student' then
    assigned_status := 'pending_profile';
  else
    assigned_status := 'n/a';
  end if;

  insert into public.profiles (
    id, email, full_name, role, department_id, approval_status
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    assigned_role,
    assigned_department,
    assigned_status
  );

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Profile RLS extensions
-- ---------------------------------------------------------------------------
create policy "Principal read all profiles"
  on public.profiles for select
  using (public.is_principal());

create policy "HOD read department profiles"
  on public.profiles for select
  using (
    public.is_hod()
    and department_id = (select department_id from public.profiles where id = auth.uid())
  );

create policy "Staff read department profiles"
  on public.profiles for select
  using (
    public.is_staff_member()
    and department_id = (select department_id from public.profiles where id = auth.uid())
  );

create policy "Students read own profile"
  on public.profiles for select
  using (auth.uid() = id and role = 'student');

create policy "Students update own profile for onboarding"
  on public.profiles for update
  using (auth.uid() = id and role = 'student' and approval_status in ('pending_profile', 'rejected'))
  with check (auth.uid() = id and role = 'student');

create policy "HOD update department student approvals"
  on public.profiles for update
  using (
    public.is_hod()
    and role = 'student'
    and department_id = (select department_id from public.profiles where id = auth.uid())
    and approval_status = 'pending_review'
  );

create policy "Staff update department student approvals"
  on public.profiles for update
  using (
    public.is_staff_member()
    and role = 'student'
    and department_id = (select department_id from public.profiles where id = auth.uid())
    and approval_status = 'pending_review'
  );

create policy "Principal manage profiles"
  on public.profiles for update
  using (public.is_principal());

-- Departments readable by authenticated users (for signup form)
create policy "Authenticated read departments"
  on public.departments for select
  using (auth.uid() is not null and is_active = true);

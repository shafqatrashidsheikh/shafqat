-- ---------------------------------------------------------------------------
-- Signup / profile role hardening
--
-- Two privilege-escalation paths existed:
--   1. handle_new_user() read the role out of raw_user_meta_data, which any
--      visitor controls via the public signup API:
--      auth.signUp({ ..., options: { data: { role: 'admin' } } }).
--   2. The initial-schema policy "Admin update own profile" let any signed-in
--      user update their own profiles row with no column restrictions, so a
--      student could simply set role = 'admin'.
--
-- Self-signups are now always students. Elevated roles must arrive through
-- raw_app_meta_data (service role only, written by portalInviteUser) or be set
-- by an admin / principal / the service role.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  requested_role text;
  assigned_role text;
  assigned_status text;
  assigned_department uuid;
begin
  -- app metadata is service-role only; user metadata is attacker controlled
  requested_role := new.raw_app_meta_data->>'role';

  if requested_role in ('admin', 'editor', 'principal', 'hod', 'staff', 'student') then
    assigned_role := requested_role;
  else
    assigned_role := 'student';
  end if;

  if assigned_role = 'student' then
    assigned_status := 'pending_profile';
    assigned_department := null;
  else
    assigned_status := 'n/a';
    assigned_department := nullif(new.raw_app_meta_data->>'department_id', '')::uuid;
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
-- Role column is immutable for everyone except admins, principals and the
-- service role (used by the invite + user-management server functions).
-- ---------------------------------------------------------------------------
create or replace function public.prevent_profile_role_escalation()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  jwt_claims text := current_setting('request.jwt.claims', true);
  jwt_role text := coalesce(current_setting('request.jwt.claim.role', true), '');
begin
  if new.role is not distinct from old.role then
    return new;
  end if;

  -- Direct database / migration access carries no PostgREST claims.
  if jwt_claims is null then
    return new;
  end if;

  if jwt_role = 'service_role' or (jwt_claims::jsonb->>'role') = 'service_role' then
    return new;
  end if;

  if public.is_admin() or public.is_principal() then
    return new;
  end if;

  raise exception 'Not allowed to change profile role';
end;
$$;

drop trigger if exists profiles_prevent_role_escalation on public.profiles;

create trigger profiles_prevent_role_escalation
  before update on public.profiles
  for each row execute function public.prevent_profile_role_escalation();

-- The unrestricted self-update policy is replaced by the onboarding policy from
-- 20260831130000_portal_production.sql plus the trigger above.
drop policy if exists "Admin update own profile" on public.profiles;

create policy "Users update own profile details"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

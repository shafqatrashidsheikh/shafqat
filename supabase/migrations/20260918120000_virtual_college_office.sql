-- Virtual College Office: academic records, audit, content drafts, notifications
-- Integrates with existing profiles / departments / CMS. Does not replace portal approval.

-- Optional semester on student profiles (1–6 diploma)
alter table public.profiles
  add column if not exists semester smallint
  check (semester is null or (semester >= 1 and semester <= 6));

-- Prevent duplicate active student roll numbers
create unique index if not exists profiles_student_roll_active_uidx
  on public.profiles (lower(roll_number))
  where role = 'student'
    and roll_number is not null
    and approval_status in ('pending_review', 'approved');

create table if not exists public.academic_subjects (
  id uuid primary key default gen_random_uuid(),
  department_id uuid not null references public.departments(id) on delete cascade,
  semester smallint not null check (semester >= 1 and semester <= 6),
  code text,
  name text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (department_id, semester, name)
);

create table if not exists public.academic_attendance (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  session_date date not null,
  present boolean not null,
  uploaded_by uuid references public.profiles(id) on delete set null,
  upload_batch_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  unique (subject_id, student_id, session_date)
);

create table if not exists public.academic_marks (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid not null references public.academic_subjects(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  exam_type text not null default 'internal'
    check (exam_type in ('internal', 'external', 'practical', 'assignment', 'other')),
  marks numeric(6,2) not null,
  max_marks numeric(6,2) not null default 100,
  uploaded_by uuid references public.profiles(id) on delete set null,
  upload_batch_id uuid,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (subject_id, student_id, exam_type)
);

create table if not exists public.vo_audit_log (
  id uuid primary key default gen_random_uuid(),
  officer text not null
    check (officer in ('student_approval', 'academic_data', 'website_management', 'student_notification')),
  action text not null,
  actor_id uuid references public.profiles(id) on delete set null,
  entity_type text,
  entity_id text,
  summary text not null,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.vo_content_drafts (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending_confirm'
    check (status in ('pending_confirm', 'applied', 'cancelled', 'reverted')),
  target_table text not null,
  target_id uuid,
  operation text not null check (operation in ('update', 'create', 'delete', 'publish')),
  before_data jsonb,
  after_data jsonb not null default '{}'::jsonb,
  instruction text not null,
  preview_summary text not null,
  created_by uuid references public.profiles(id) on delete set null,
  confirmed_by uuid references public.profiles(id) on delete set null,
  confirmed_at timestamptz,
  applied_at timestamptz,
  reverted_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.vo_notifications (
  id uuid primary key default gen_random_uuid(),
  status text not null default 'pending_review'
    check (status in ('pending_review', 'queued', 'sent', 'failed', 'cancelled')),
  subject text not null,
  body text not null,
  audience jsonb not null default '{}'::jsonb,
  recipient_count integer not null default 0,
  created_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  sent_at timestamptz,
  error_message text,
  created_at timestamptz not null default now()
);

create table if not exists public.vo_notification_recipients (
  id uuid primary key default gen_random_uuid(),
  notification_id uuid not null references public.vo_notifications(id) on delete cascade,
  student_id uuid not null references public.profiles(id) on delete cascade,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'failed', 'skipped')),
  error_message text,
  sent_at timestamptz,
  unique (notification_id, student_id)
);

create index if not exists academic_subjects_dept_sem_idx
  on public.academic_subjects (department_id, semester);
create index if not exists academic_attendance_subject_idx
  on public.academic_attendance (subject_id);
create index if not exists academic_marks_subject_idx
  on public.academic_marks (subject_id);
create index if not exists vo_audit_log_created_idx
  on public.vo_audit_log (created_at desc);
create index if not exists vo_notifications_status_idx
  on public.vo_notifications (status, created_at desc);

alter table public.academic_subjects enable row level security;
alter table public.academic_attendance enable row level security;
alter table public.academic_marks enable row level security;
alter table public.vo_audit_log enable row level security;
alter table public.vo_content_drafts enable row level security;
alter table public.vo_notifications enable row level security;
alter table public.vo_notification_recipients enable row level security;

-- Staff/HOD/principal/admin can manage academic + VO tables via service role in server fns.
-- Authenticated students may read only their own attendance/marks.

drop policy if exists academic_attendance_student_read on public.academic_attendance;
create policy academic_attendance_student_read
  on public.academic_attendance for select
  to authenticated
  using (
    student_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'student'
        and p.approval_status = 'approved'
    )
  );

drop policy if exists academic_marks_student_read on public.academic_marks;
create policy academic_marks_student_read
  on public.academic_marks for select
  to authenticated
  using (
    student_id = auth.uid()
    and exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role = 'student'
        and p.approval_status = 'approved'
    )
  );

drop policy if exists academic_subjects_staff_read on public.academic_subjects;
create policy academic_subjects_staff_read
  on public.academic_subjects for select
  to authenticated
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid()
        and p.role in ('admin', 'principal', 'hod', 'staff')
    )
  );

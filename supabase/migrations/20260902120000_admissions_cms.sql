-- Admissions CMS: JKBOTE-backed fields, programmes, eligibility groups, and placeholder cleanup.

alter table public.admission_cycles
  add column if not exists strip_text text not null default 'Admissions are conducted through the Jammu & Kashmir Board of Technical Education (JKBOTE).',
  add column if not exists apply_url text not null default 'https://admission.jkbote.ac.in/',
  add column if not exists apply_label text not null default 'Apply Online',
  add column if not exists fee_amount text not null default '₹2,155 + applicable insurance fee per annum',
  add column if not exists notice_url text not null default '/notices#admissions',
  add column if not exists notice_label text not null default 'View Admission Notice',
  add column if not exists eligibility_intro text not null default 'Eligibility depends on the diploma programme selected and the requirements prescribed by the J&K Board of Technical Education.',
  add column if not exists eligibility_note text not null default 'There is no upper age bar for admission to polytechnic courses, subject to the applicable admission rules.',
  add column if not exists documents_note text not null default 'Document requirements may vary according to the admission notification and category claimed. Always check the latest JKBOTE instructions before submitting the application.',
  add column if not exists programmes_note text not null default 'Total sanctioned intake: 240 seats.';

alter table public.admission_documents
  add column if not exists detail text not null default '';

alter table public.admission_dates
  alter column date_value set default 'To be notified';

create table if not exists public.admission_programmes (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  name text not null,
  credential text not null default 'Diploma',
  duration text not null default '3 Years',
  seats int not null default 30,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admission_eligibility_groups (
  id uuid primary key default gen_random_uuid(),
  cycle_id uuid not null references public.admission_cycles (id) on delete cascade,
  heading text not null,
  body text not null default '',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists admission_programmes_updated_at on public.admission_programmes;
create trigger admission_programmes_updated_at before update on public.admission_programmes
  for each row execute function public.set_updated_at();

drop trigger if exists admission_eligibility_groups_updated_at on public.admission_eligibility_groups;
create trigger admission_eligibility_groups_updated_at before update on public.admission_eligibility_groups
  for each row execute function public.set_updated_at();

alter table public.admission_programmes enable row level security;
alter table public.admission_eligibility_groups enable row level security;

drop policy if exists "Public read admission_programmes" on public.admission_programmes;
create policy "Public read admission_programmes" on public.admission_programmes for select using (
  is_active = true and exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);

drop policy if exists "Public read admission_eligibility_groups" on public.admission_eligibility_groups;
create policy "Public read admission_eligibility_groups" on public.admission_eligibility_groups for select using (
  exists (select 1 from public.admission_cycles c where c.id = cycle_id and c.is_active = true)
);

drop policy if exists "Admin read all admission_programmes" on public.admission_programmes;
create policy "Admin read all admission_programmes" on public.admission_programmes for select using (public.is_admin());

drop policy if exists "Admin read all admission_eligibility_groups" on public.admission_eligibility_groups;
create policy "Admin read all admission_eligibility_groups" on public.admission_eligibility_groups for select using (public.is_admin());

drop policy if exists "Admin write admission_programmes" on public.admission_programmes;
create policy "Admin write admission_programmes" on public.admission_programmes for all using (public.is_admin()) with check (public.is_admin());

drop policy if exists "Admin write admission_eligibility_groups" on public.admission_eligibility_groups;
create policy "Admin write admission_eligibility_groups" on public.admission_eligibility_groups for all using (public.is_admin()) with check (public.is_admin());

update public.admission_cycles set
  title = coalesce(nullif(title, ''), 'Admissions 2026'),
  intro = 'Admission information for diploma programmes at Government Polytechnic for Women, Srinagar, including eligibility, application procedure, documents, merit and important admission updates.',
  strip_text = 'Admissions are conducted through the Jammu & Kashmir Board of Technical Education (JKBOTE).',
  apply_url = 'https://admission.jkbote.ac.in/',
  apply_label = 'Apply Online',
  fee_amount = '₹2,155 + applicable insurance fee per annum',
  fee_note = 'Fee shown is indicative and should be verified against the latest official admission notification / institute instructions.',
  notice_url = '/notices#admissions',
  notice_label = 'View Admission Notice',
  eligibility_intro = 'Eligibility depends on the diploma programme selected and the requirements prescribed by the J&K Board of Technical Education.',
  eligibility_note = 'There is no upper age bar for admission to polytechnic courses, subject to the applicable admission rules.',
  documents_note = 'Document requirements may vary according to the admission notification and category claimed. Always check the latest JKBOTE instructions before submitting the application.',
  programmes_note = 'Total sanctioned intake: 240 seats.'
where is_active = true
  and (
    intro ilike 'Everything you need to apply%'
    or fee_note ilike '%[ADD%'
    or fee_note ilike '%published in the official admission notification%'
    or apply_url = 'https://admission.jkbote.ac.in/'
  );

delete from public.admission_steps;
delete from public.admission_documents;
delete from public.admission_dates;
delete from public.admission_faqs;
delete from public.admission_programmes;
delete from public.admission_eligibility_groups;

insert into public.admission_steps (cycle_id, step_number, title, description, sort_order)
select c.id, s.step_number, s.title, s.description, s.step_number
from public.admission_cycles c,
(values
  (1, 'Check Eligibility', 'Confirm that you meet the qualification and domicile requirements for your chosen diploma programme.'),
  (2, 'Register Online', 'Create an applicant account and complete the online application through the JKBOTE admission portal.'),
  (3, 'Select Programme', 'Choose the eligible programme(s) according to the options available in the official admission notification.'),
  (4, 'Upload Documents', 'Upload the required certificates and photograph in the prescribed format.'),
  (5, 'Submit & Verify', 'Review all details carefully, pay the applicable online application fee, and submit the form before the notified deadline.'),
  (6, 'Merit & Admission', 'JKBOTE prepares the merit list on the basis of the qualifying examination and recommends candidates for admission according to the applicable rules and available seats.')
) as s(step_number, title, description);

insert into public.admission_documents (cycle_id, label, detail, sort_order)
select c.id, d.label, d.detail, d.sort_order
from public.admission_cycles c,
(values
  ('Domicile Certificate', '', 1),
  ('Qualifying Examination Marks Certificate', '10th for regular diploma programmes / 12th Medical for MLT', 2),
  ('Matriculation / Date of Birth Certificate', '', 3),
  ('Valid Category Certificate, if applicable', '', 4),
  ('Sports Certificate, if applicable', '', 5),
  ('TFW / Income-related certificate, if applicable', '', 6),
  ('Recent Passport-size Photograph', '', 7)
) as d(label, detail, sort_order);

insert into public.admission_dates (cycle_id, label, date_value, sort_order)
select c.id, d.label, d.date_value, d.sort_order
from public.admission_cycles c,
(values
  ('Admission Notification', 'To be notified', 1),
  ('Online Application Opens', 'To be notified', 2),
  ('Application Last Date', 'To be notified', 3),
  ('Merit List', 'To be notified', 4),
  ('Admission / Joining', 'To be notified', 5)
) as d(label, date_value, sort_order);

insert into public.admission_faqs (cycle_id, question, answer, sort_order)
select c.id, f.question, f.answer, f.sort_order
from public.admission_cycles c,
(values
  ('Who can apply for diploma programmes?', 'Eligible candidates who meet the prescribed educational and domicile requirements can apply through the JKBOTE admission process.', 1),
  ('What is the minimum qualification?', 'For most diploma programmes, candidates must have passed 10th/Matriculation with at least 35% marks. Medical Lab Technology requires 12th in the Medical stream with at least 35% marks.', 2),
  ('How are candidates selected?', 'JKBOTE prepares the merit list based on the qualifying examination and applicable admission rules.', 3),
  ('Where do I apply?', 'Applications are submitted online through the official JKBOTE admission portal.', 4),
  ('Is there an upper age limit?', 'No upper age bar is prescribed for admission to polytechnic courses, subject to applicable rules.', 5)
) as f(question, answer, sort_order);

insert into public.admission_programmes (cycle_id, name, credential, duration, seats, sort_order, is_active)
select c.id, p.name, 'Diploma', '3 Years', 30, p.sort_order, true
from public.admission_cycles c,
(values
  ('Computer Engineering', 1),
  ('Electronics & Communication Engineering', 2),
  ('Medical Lab Technology', 3),
  ('Office Management & Computer Applications', 4),
  ('Travel & Tourism', 5),
  ('Food Technology', 6),
  ('Garment Technology', 7),
  ('Textile Technology', 8)
) as p(name, sort_order);

insert into public.admission_eligibility_groups (cycle_id, heading, body, sort_order)
select c.id, g.heading, g.body, g.sort_order
from public.admission_cycles c,
(values
  (
    'General diploma programmes',
    E'Passed Secondary School Examination (10th/Matriculation or equivalent) from a recognised board with at least 35% marks.\n\nCandidates must fulfil the applicable domicile requirements of the UT of Jammu & Kashmir or UT of Ladakh.',
    1
  ),
  (
    'Medical Lab Technology',
    'Passed 12th examination in the Medical stream with at least 35% marks.',
    2
  )
) as g(heading, body, sort_order);

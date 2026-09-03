-- Admissions IA: student-journey copy, programme categories/order, assistant CTA.

alter table public.admission_cycles
  add column if not exists assistant_title text not null default 'Need Help With Admission?',
  add column if not exists assistant_body text not null default 'Ask GPW Assistant about eligibility, programmes, documents, fees or the application process.',
  add column if not exists assistant_label text not null default 'Ask GPW Assistant';

alter table public.admission_programmes
  add column if not exists category text not null default '',
  add column if not exists slug text not null default '',
  add column if not exists badge text not null default '',
  add column if not exists badge_note text not null default '';

alter table public.admission_dates
  alter column date_value set default 'To be announced';

update public.admission_cycles set
  title = coalesce(nullif(title, ''), 'Admissions 2026'),
  intro = 'Explore diploma programmes, eligibility, application steps, required documents and important admission updates at Government Polytechnic for Women, Srinagar.',
  strip_text = 'Admissions are conducted through J&K Board of Technical Education.',
  apply_url = coalesce(nullif(apply_url, ''), 'https://admission.jkbote.ac.in/'),
  apply_label = coalesce(nullif(apply_label, ''), 'Apply Online'),
  fee_note = 'Fee and other charges are subject to the latest official notification.',
  notice_label = 'View Latest Admission Notice',
  eligibility_intro = 'Eligibility depends on the programme you choose. Check the applicable qualification before starting your application.',
  eligibility_note = 'Always verify the latest JKBOTE admission notification before applying.',
  documents_note = 'Document requirements may vary according to the latest admission notification and category claimed.',
  programmes_note = 'Government Polytechnic for Women, Srinagar offers eight three-year diploma programmes. Explore the programmes below before checking eligibility and applying.',
  assistant_title = 'Need Help With Admission?',
  assistant_body = 'Ask GPW Assistant about eligibility, programmes, documents, fees or the application process.',
  assistant_label = 'Ask GPW Assistant'
where is_active = true;

delete from public.admission_steps;
delete from public.admission_documents;
delete from public.admission_dates;
delete from public.admission_programmes;
delete from public.admission_eligibility_groups;

insert into public.admission_steps (cycle_id, step_number, title, description, sort_order)
select c.id, s.step_number, s.title, s.description, s.step_number
from public.admission_cycles c,
(values
  (1, 'Check Eligibility', 'Choose a programme and confirm that you meet its eligibility requirements.'),
  (2, 'Apply Online', 'Complete the application through the official JKBOTE admission portal.'),
  (3, 'Upload Documents', 'Submit the required certificates and photograph in the prescribed format.'),
  (4, 'Review & Submit', 'Check your information carefully and submit the application before the official deadline.'),
  (5, 'Merit & Admission', 'Follow the official JKBOTE merit and admission process.')
) as s(step_number, title, description);

insert into public.admission_documents (cycle_id, label, detail, sort_order)
select c.id, d.label, d.detail, d.sort_order
from public.admission_cycles c,
(values
  ('Qualifying examination marks certificate', '', 1),
  ('Date of birth / Matriculation certificate', '', 2),
  ('Domicile certificate', '', 3),
  ('Valid category certificate, if applicable', '', 4),
  ('Recent passport-size photograph', '', 5),
  ('Sports certificate, if applicable', '', 6),
  ('TFW / income-related certificate, if applicable', '', 7)
) as d(label, detail, sort_order);

insert into public.admission_dates (cycle_id, label, date_value, sort_order)
select c.id, d.label, d.date_value, d.sort_order
from public.admission_cycles c,
(values
  ('Admission Notification', 'To be announced', 1),
  ('Application Opens', 'To be announced', 2),
  ('Application Deadline', 'To be announced', 3),
  ('Merit / Admission Updates', 'As notified by JKBOTE', 4)
) as d(label, date_value, sort_order);

insert into public.admission_programmes (
  cycle_id, name, credential, duration, seats, category, slug, badge, badge_note, sort_order, is_active
)
select c.id, p.name, 'Diploma', '3 Years', 30, p.category, p.slug, p.badge, p.badge_note, p.sort_order, true
from public.admission_cycles c,
(values
  ('Computer Engineering', 'TECHNICAL', 'computer-engineering', '', '', 1),
  ('Electronics & Communication Engineering', 'TECHNICAL', 'electronics-communication-engineering', '', '', 2),
  ('Textile Technology', 'APPLIED TECHNOLOGY', 'textile-technology', '', '', 3),
  ('Garment Technology', 'APPLIED TECHNOLOGY', 'garment-technology', '', '', 4),
  ('Food Technology', 'APPLIED TECHNOLOGY', 'food-technology', '', '', 5),
  ('Office Management & Computer Applications', 'COMPUTER APPLICATIONS', 'office-management-computer-applications', '', '', 6),
  ('Travel & Tourism', 'PROFESSIONAL STUDIES', 'travel-tourism', '', '', 7),
  ('Medical Lab Technology', 'MEDICAL', 'medical-lab-technology', '12th Medical', 'Different eligibility applies', 8)
) as p(name, category, slug, badge, badge_note, sort_order);

insert into public.admission_eligibility_groups (cycle_id, heading, body, sort_order)
select c.id, g.heading, g.body, g.sort_order
from public.admission_cycles c,
(values
  (
    'General diploma programmes',
    'Passed 10th / Matriculation or equivalent with the prescribed minimum qualification requirements.',
    1
  ),
  (
    'Medical Lab Technology',
    'Passed 12th in the Medical stream with the prescribed minimum qualification requirements.',
    2
  )
) as g(heading, body, sort_order);

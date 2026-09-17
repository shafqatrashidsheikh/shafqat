 
insert into public.admission_dates (cycle_id, label, date_value, sort_order)
select c.id, d.label, d.date_value, d.sort_order
from public.admission_cycles c,
(values
  ('Admission Notification', 'To be announced', 1),
  ('Application Opens', 'To be announced', 2),
  ('Application Deadline', 'To be announced', 3),
  ('Merit / Admission Updates', 'As notified by JKBOTE', 4)
) as d(label, date_value, sort_order)
where c.year = 2026 and c.is_active = true;

insert into public.admission_faqs (cycle_id, question, answer, sort_order)
select c.id, f.question, f.answer, f.sort_order
from public.admission_cycles c,
(values
  ('Who can apply for diploma programmes?', 'Eligible candidates who meet the prescribed educational and domicile requirements can apply through the JKBOTE admission process.', 1),
  ('What is the minimum qualification?', 'For most diploma programmes, candidates must have passed 10th/Matriculation with at least 35% marks. Medical Lab Technology requires 12th in the Medical stream with at least 35% marks.', 2),
  ('How are candidates selected?', 'JKBOTE prepares the merit list based on the qualifying examination and applicable admission rules.', 3),
  ('Where do I apply?', 'Applications are submitted online through the official JKBOTE admission portal.', 4),
  ('Is there an upper age limit?', 'No upper age bar is prescribed for admission to polytechnic courses, subject to applicable rules.', 5)
) as f(question, answer, sort_order)
where c.year = 2026 and c.is_active = true;

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
) as p(name, category, slug, badge, badge_note, sort_order)
where c.year = 2026 and c.is_active = true;

insert into public.admission_eligibility_groups (cycle_id, heading, body, sort_order)
select c.id, g.heading, g.body, g.sort_order
from public.admission_cycles c,
(values
  (
    'Regular Diploma',
    $elig$10th Based
Minimum 35% in Class 10th
Applies to regular 3-year diploma programmes except Medical Lab Technology.$elig$,
    1
  ),
  (
    'Medical Lab Technology',
    $elig$12th Medical
Minimum 35% in Class 12th
12th Medical stream is required for MLT.$elig$,
    2
  ),
  (
    'Lateral Entry',
    $elig$Direct 3rd Semester
10+2 / 2-Year ITI
Entry to the 2nd year is subject to relevant discipline/trade and current JKBOTE rules.
10+2: Class 12th with the required relevant subjects for the chosen diploma discipline.
ITI: Class 10th plus a 2-year ITI course in a relevant or allied trade.
Minimum qualifying marks and discipline-specific requirements are as prescribed in the current JKBOTE Lateral Entry admission notification.$elig$,
    3
  )
) as g(heading, body, sort_order)
where c.year = 2026 and c.is_active = true;

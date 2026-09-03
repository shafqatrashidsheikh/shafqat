-- Eligibility hierarchy: Regular Diploma (10th / 35%), MLT (12th Medical / 35%), Lateral Entry.

update public.admission_cycles set
  eligibility_intro = 'Choose the entry route that matches your qualification.',
  eligibility_note = 'Always verify the latest JKBOTE admission notification for course-specific subjects, lateral-entry discipline mapping, dates and other conditions.'
where is_active = true;

delete from public.admission_eligibility_groups;

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
) as g(heading, body, sort_order);

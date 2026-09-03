-- Seed GPW Srinagar CMS data (from src/lib/site-data.ts + routes)
-- Run after migration: supabase db reset  OR  psql -f supabase/seed.sql

-- Departments
insert into public.departments (slug, name, summary, sort_order) values
  ('computer-engineering', 'Computer Engineering', 'Build practical skills in programming, computer systems, software development, networking and modern digital technologies.', 1),
  ('electronics-communication-engineering', 'Electronics & Communication Engineering', 'Learn electronic circuits, communication systems, digital electronics, instrumentation and practical electronic technologies.', 2),
  ('garment-technology', 'Garment Technology', 'Develop practical expertise in garment production, apparel design, textile handling, pattern making and modern garment manufacturing.', 3),
  ('textile-technology', 'Textile Technology', 'Explore textile materials, textile production processes, fabric technology, testing and modern textile manufacturing practices.', 4),
  ('office-management-computer-applications', 'Office Management & Computer Applications', 'Develop professional skills in office administration, computer applications, documentation, communication and modern workplace practices.', 5),
  ('food-technology', 'Food Technology', 'Learn food processing, preservation, quality control, food safety and practical techniques used in the food industry.', 6),
  ('medical-lab-technology', 'Medical Lab Technology', 'Gain practical knowledge of laboratory procedures, diagnostic testing, sample handling and basic clinical laboratory techniques.', 7),
  ('travel-tourism', 'Travel & Tourism', 'Develop skills in tourism operations, travel services, hospitality, customer relations, itinerary planning and destination management.', 8);

-- Programs
insert into public.programs (department_id, name, dept_label, duration, eligibility, seats, stream, overview, sort_order)
select d.id, p.name, p.dept_label, p.duration, p.eligibility, p.seats, p.stream, p.overview, p.sort_order
from (values
  ('computer-engineering', 'Computer Engineering', 'Computer Engineering', '3 Years', '10th Pass', null, 'Engineering & Technology', 'Build practical skills in programming, computer systems, software development, networking and modern digital technologies.', 1),
  ('electronics-communication-engineering', 'Electronics & Communication Engineering', 'Electronics & Communication Engineering', '3 Years', '10th Pass', null, 'Engineering & Technology', 'Learn electronic circuits, communication systems, digital electronics, instrumentation and practical electronic technologies.', 2),
  ('garment-technology', 'Garment Technology', 'Garment Technology', '3 Years', '10th Pass', null, 'Engineering & Technology', 'Develop practical expertise in garment production, apparel design, textile handling, pattern making and modern garment manufacturing.', 3),
  ('textile-technology', 'Textile Technology', 'Textile Technology', '3 Years', '10th Pass', null, 'Engineering & Technology', 'Explore textile materials, textile production processes, fabric technology, testing and modern textile manufacturing practices.', 4),
  ('office-management-computer-applications', 'Office Management & Computer Applications', 'OMCA', '3 Years', '10th Pass', null, 'Management & Services', 'Develop professional skills in office administration, computer applications, documentation, communication and modern workplace practices.', 5),
  ('food-technology', 'Food Technology', 'Food Technology', '3 Years', '10th Pass', null, 'Engineering & Technology', 'Learn food processing, preservation, quality control, food safety and practical techniques used in the food industry.', 6),
  ('medical-lab-technology', 'Medical Lab Technology', 'MLT', '3 Years', '12th Pass', null, 'Applied / Health Sciences', 'Gain practical knowledge of laboratory procedures, diagnostic testing, sample handling and basic clinical laboratory techniques.', 7),
  ('travel-tourism', 'Travel & Tourism', 'Travel & Tourism', '3 Years', '10th Pass', null, 'Management & Services', 'Develop skills in tourism operations, travel services, hospitality, customer relations, itinerary planning and destination management.', 8)
) as p(slug, name, dept_label, duration, eligibility, seats, stream, overview, sort_order)
join public.departments d on d.slug = p.slug;

-- Notices / announcements
insert into public.notices (title, category, tag, published_at, priority, file_label, is_pinned, sort_order) values
  ('Diploma admissions 2026 — counselling schedule published', 'Admissions', 'Admission', '2026-08-12', 'Urgent', 'PDF · 240 KB', true, 1),
  ('Odd semester practical examination date sheet', 'Examination', 'Examination', '2026-08-05', 'Important', 'PDF · 180 KB', false, 2),
  ('Tender notice for laboratory equipment procurement', 'Tenders', 'Tender', '2026-07-29', 'General', 'PDF · 320 KB', false, 3),
  ('Anti-ragging committee constitution and helpline', 'Circulars', 'Circular', '2026-07-21', 'Important', 'PDF · 96 KB', false, 4),
  ('Scholarship application window for eligible students', 'Notices', 'Notice', '2026-07-10', 'General', 'PDF · 150 KB', false, 5),
  ('Academic calendar for the session 2026–27', 'Academics', 'Academics', '2026-07-01', 'General', 'PDF · 210 KB', false, 6);

-- Events
insert into public.events (title, event_date, venue, description, sort_order) values
  ('Orientation for new diploma entrants', 'August 2026', 'Main Auditorium', 'Welcome session for newly admitted diploma students.', 1),
  ('Technical workshop series — Electronics & Computing', 'September 2026', 'Department Labs', 'Hands-on workshops across electronics and computing departments.', 2),
  ('Industry interaction & career guidance session', 'October 2026', 'Seminar Hall', 'Guest sessions with industry professionals and placement guidance.', 3);

-- Homepage stats
insert into public.institute_stats (value, label, prefix, suffix, sort_order) values
  (1986, 'Established', '', '', 1),
  (8, 'Diploma Programmes', '', '', 2),
  (240, 'Sanctioned Seats', '', '', 3),
  (3, 'Diploma Duration', '', ' Years', 4);

-- Spotlights
insert into public.institute_spotlights (title, subtitle, link_path, sort_order) values
  ('Admissions', 'Pathways to join GPW Srinagar', '/admissions', 1),
  ('Academics', 'Diploma programs & departments', '/academics', 2),
  ('Campus', 'Labs, workshops & student life', '/campus', 3),
  ('Updates', 'Notices, exams & announcements', '/notices', 4);

-- Academic units
insert into public.academic_units (title, subtitle, link_path, sort_order) values
  ('Departments', 'Specialized teaching units', '/academics', 1),
  ('Programs', 'Three-year diploma courses', '/academics', 2),
  ('Laboratories', 'Hands-on technical practice', '/campus', 3),
  ('Facilities', 'Library, workshop & campus', '/campus', 4);

-- Home FAQs
insert into public.home_faqs (question, answer, sort_order) values
  ('Who can apply for diploma programs?', 'Women candidates who meet the eligibility published in the official admission notification for each program.', 1),
  ('What is the duration of diploma courses?', 'Most diploma programs are three-year full-time courses combining classroom instruction with laboratory practice.', 2),
  ('Where can I find examination and result notices?', 'All examination schedules, results and circulars are published on the Notices page as they are released by the institute.', 3),
  ('How do I contact the institute for admissions queries?', 'Use the Contact page for official phone and email channels, or visit the Admissions page for process details.', 4);

-- Admissions cycle 2026
insert into public.admission_cycles (
  year, title, intro, strip_text, apply_url, apply_label,
  fee_amount, fee_note, notice_url, notice_label,
  eligibility_intro, eligibility_note, documents_note, programmes_note,
  assistant_title, assistant_body, assistant_label, is_active
)
values (
  2026,
  'Admissions 2026',
  'Explore diploma programmes, eligibility, application steps, required documents and important admission updates at Government Polytechnic for Women, Srinagar.',
  'Admissions are conducted through J&K Board of Technical Education.',
  'https://admission.jkbote.ac.in/',
  'Apply Online',
  '₹2,155 + applicable insurance fee per annum',
  'Fee and other charges are subject to the latest official notification.',
  '/notices#admissions',
  'View Latest Admission Notice',
  'Choose the entry route that matches your qualification.',
  'Always verify the latest JKBOTE admission notification for course-specific subjects, lateral-entry discipline mapping, dates and other conditions.',
  'Document requirements may vary according to the latest admission notification and category claimed.',
  'Government Polytechnic for Women, Srinagar offers eight three-year diploma programmes. Explore the programmes below before checking eligibility and applying.',
  'Need Help With Admission?',
  'Ask GPW Assistant about eligibility, programmes, documents, fees or the application process.',
  'Ask GPW Assistant',
  true
);

insert into public.admission_steps (cycle_id, step_number, title, description, sort_order)
select c.id, s.step_number, s.title, s.description, s.step_number
from public.admission_cycles c,
(values
  (1, 'Check Eligibility', 'Choose a programme and confirm that you meet its eligibility requirements.'),
  (2, 'Apply Online', 'Complete the application through the official JKBOTE admission portal.'),
  (3, 'Upload Documents', 'Submit the required certificates and photograph in the prescribed format.'),
  (4, 'Review & Submit', 'Check your information carefully and submit the application before the official deadline.'),
  (5, 'Merit & Admission', 'Follow the official JKBOTE merit and admission process.')
) as s(step_number, title, description)
where c.year = 2026 and c.is_active = true;

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
) as d(label, detail, sort_order)
where c.year = 2026 and c.is_active = true;

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

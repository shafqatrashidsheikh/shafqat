-- Allow "New" priority for current JKBOTE notices and replace demo rows
-- with verified 2026 notifications relevant to GPW Srinagar.

alter table public.notices
  drop constraint if exists notices_priority_check;

alter table public.notices
  add constraint notices_priority_check
  check (priority in ('Urgent', 'Important', 'General', 'New'));

delete from public.notices;

insert into public.notices (
  title, category, tag, published_at, priority, file_label, file_url, is_pinned, is_published, sort_order
) values
  ('Notice for Backlog 2026 Practical Examination SCVT (Draughtsman Civil)', 'Examination', 'Examination', '2026-09-08', 'New', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1VbfduIj88HAj3QyBsgaMqXwJyX3TtbaQ/view?usp=sharing', true, true, 1),
  ('Notice for Upload of Recent Passport-Size Photograph for Diploma Certificate (NEP 2020 Pass-Outs Only)', 'Academics', 'Academic', '2026-09-02', 'New', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1r9sZy0_2Ot7LZQu2AwGvRZWPGaegX0F3/view?usp=sharing', true, true, 2),
  ('Online Registration Forms for Newly Admitted Students Session 2026–2027 — First Semester and Lateral Entry (3rd Semester)', 'Admissions', 'Admission', '2026-09-01', 'New', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1EZPv1y0D0uF4pi9J0iJL_ax0zF73xx60/view?usp=sharing', true, true, 3),
  ('Re-Evaluation Result of 2nd and 4th Semester — Session MJ26', 'Examination', 'Examination', '2026-08-28', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1mm5dRPPxwjyUtikgVk5ngz-pdv70u-7v/view?usp=sharing', false, true, 4),
  ('Notice for Declaration of Result — SCVT Annual Examination Session 2026', 'Examination', 'Examination', '2026-08-27', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1_6QfSP2cmJisKzHbeyQMpnKbZcIqDL7H/view?usp=sharing', false, true, 5),
  ('Selection List of Lateral Entry Admissions 2026', 'Admissions', 'Admission', '2026-08-12', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1n6p9_HJFk6H2i_rjpx_asPKWxU5jI2Rs/view?usp=sharing', false, true, 6),
  ('Extension of Online Applications under Lateral Entry System in 3rd Semester — Diploma Courses 2026', 'Admissions', 'Admission', '2026-07-31', 'General', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1ZMbg5fYr4ajab7q99633rc6L1aDGCLD0/view?usp=sharing', false, true, 7),
  ('Date Sheet for SCVT Annual Examination Session 2026', 'Examination', 'Examination', '2026-07-28', 'General', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1qMsyzFUN-uJZl8SE-27vCmlUoR0ErWSt/view?usp=sharing', false, true, 8),
  ('Declaration of 2nd and 4th Semester Diploma Examination Results — Session May–June 2026', 'Examination', 'Examination', '2026-07-25', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/15BxTnjahI4TuXgwtgqRndFOOzmBdT96V/view?usp=sharing', false, true, 9),
  ('Admission Notice under Lateral Entry System in 3rd Semester — Diploma Courses 2026', 'Admissions', 'Admission', '2026-07-06', 'General', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1WdYUwnE4mse8GwJOAljVjEYxb7vXBkgV/view?usp=sharing', false, true, 10),
  ('Provisional Selection List of Admission in Polytechnic Colleges in J&K and Ladakh 2026', 'Admissions', 'Admission', '2026-06-18', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1u4x8sUyOCZxzTjZ_FMZPtv4IakP3CQTg/view?usp=sharing', false, true, 11),
  ('Provisional Merit List for Admission in Polytechnic Colleges 2026', 'Admissions', 'Admission', '2026-06-15', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/14x9GSll_VxGL2X2zr19M1Uh-9A56Ihou/view?usp=sharing', false, true, 12),
  ('Extension of Last Date for Admission to Three-Year Diploma Polytechnic Courses 2026, including Medical Lab Technology', 'Admissions', 'Admission', '2026-06-13', 'General', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1EoD7egpGCQRKSBz3hZQA5tQVNDsI6OSZ/view?usp=sharing', false, true, 13),
  ('Admission Notification for Three-Year Diploma Polytechnic Courses 2026, including Diploma in Medical Lab Technology', 'Admissions', 'Admission', '2026-03-31', 'Important', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1zU2aiwvudAtLT8IdU-GfQ8ThxYNp7qpX/view?usp=sharing', false, true, 14),
  ('Notice for Online Examination Forms — Semester Examinations Session MJ26', 'Examination', 'Examination', '2026-03-25', 'General', 'Official notice · JKBOTE', 'https://drive.google.com/file/d/1b-lIOjGNHSxDL1uEgaqVulVmamtk3fql/view?usp=sharing', false, true, 15);

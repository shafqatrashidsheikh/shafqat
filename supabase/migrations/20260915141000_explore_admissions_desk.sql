-- Admissions explore card: admission desk visual
update public.explore_cards
set
  image_key = 'admissions-desk',
  image_alt = 'Admission desk at Government Polytechnic for Women, Srinagar — a counsellor helping an applicant complete her admission form',
  image_position = 'right',
  updated_at = now()
where slug = 'admissions';

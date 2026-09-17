-- Placement explore card: career guidance visual on the right
update public.explore_cards
set
  image_key = 'placement-career-guidance',
  image_alt = 'Placement and career guidance at Government Polytechnic for Women, Srinagar — student interview and career counselling session',
  image_position = 'right',
  updated_at = now()
where slug = 'placement';

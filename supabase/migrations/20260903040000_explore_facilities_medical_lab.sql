-- Facilities Explore card: laboratory practical photograph, text left / image right.
update public.explore_cards
set
  image_key = 'medical-lab',
  image_alt = 'Students in a laboratory practical session at Government Polytechnic for Women, Srinagar',
  image_position = 'right'
where slug = 'facilities';

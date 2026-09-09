-- Facilities Explore card: laboratory microscope photograph, text left / image right.
update public.explore_cards
set
  image_key = 'microscope-lab',
  image_alt = 'Students using a microscope during a laboratory practical at Government Polytechnic for Women, Srinagar',
  image_position = 'right'
where slug = 'facilities';

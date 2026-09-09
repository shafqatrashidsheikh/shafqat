-- About explore card: campus entrance photo on the right
update public.explore_cards
set
  image_key = 'campus-entrance',
  image_alt = 'Entrance of Government Polytechnic for Women, Srinagar, Bemina',
  image_position = 'right',
  updated_at = now()
where slug = 'about';

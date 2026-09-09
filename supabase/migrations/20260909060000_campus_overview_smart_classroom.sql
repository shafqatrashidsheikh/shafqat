-- Campus overview right image: smart classroom photograph.
update public.campus_gallery_items
set
  image_asset_key = 'smart-classroom-students',
  alt = 'Students in a smart classroom session at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 1200
where sort_order = 2;

-- Campus overview right image: computer laboratory photograph.
update public.campus_gallery_items
set
  image_asset_key = 'computer-lab-students',
  alt = 'Students working in the computer laboratory at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 1200
where sort_order = 2;

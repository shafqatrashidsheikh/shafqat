-- Campus overview pair: student laboratory and library photographs.
update public.campus_gallery_items
set
  image_asset_key = 'electronics-lab-students',
  alt = 'Students working on electronics practicals in the laboratory at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 1200
where sort_order = 1;

update public.campus_gallery_items
set
  image_asset_key = 'library-students',
  alt = 'Students studying in the library at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 1200
where sort_order = 2;

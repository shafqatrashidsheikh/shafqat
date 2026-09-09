-- Campus gallery pair: lawn and walkway photographs.
update public.campus_gallery_items
set
  image_asset_key = 'campus-building-lawn',
  alt = 'Campus lawn and academic building at Government Polytechnic for Women, Srinagar',
  width = 1200,
  height = 1600
where sort_order = 3;

update public.campus_gallery_items
set
  image_asset_key = 'campus-building-walkway',
  alt = 'Walkway toward the main building at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 1200
where sort_order = 4;

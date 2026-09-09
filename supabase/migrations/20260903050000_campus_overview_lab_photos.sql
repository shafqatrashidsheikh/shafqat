-- Campus overview pair: full campus photographs, shown complete in the UI.
update public.campus_gallery_items
set
  image_asset_key = 'campus-walkway',
  alt = 'Walkway toward the main building at Government Polytechnic for Women, Srinagar',
  width = 1600,
  height = 900
where sort_order = 1;

update public.campus_gallery_items
set
  image_asset_key = 'campus-lawn',
  alt = 'Campus lawn and academic building at Government Polytechnic for Women, Srinagar',
  width = 1200,
  height = 1600
where sort_order = 2;

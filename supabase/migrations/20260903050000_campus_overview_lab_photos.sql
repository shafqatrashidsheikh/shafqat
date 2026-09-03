-- Campus overview pair: laboratory practical photographs.
update public.campus_gallery_items
set
  image_asset_key = 'science-lab',
  alt = 'Students examining laboratory samples at Government Polytechnic for Women, Srinagar'
where sort_order = 1;

update public.campus_gallery_items
set
  image_asset_key = 'microscope-lab',
  alt = 'Students using a microscope in a laboratory at Government Polytechnic for Women, Srinagar'
where sort_order = 2;

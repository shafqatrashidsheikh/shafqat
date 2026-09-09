-- Align Updates navigation and events with verified GPW Srinagar data.
-- Removes invented campus events and points header/footer links to /updates/*.

update public.header_nav_groups
set to_path = '/updates/news'
where label = 'Updates';

update public.header_nav_items
set to_path = case label
  when 'Latest News' then '/updates/news'
  when 'Notices' then '/updates/notices'
  when 'Events' then '/updates/events'
  when 'Tenders / Important Circulars' then '/updates/circulars'
  when 'Admission Notices' then '/updates/notices#admissions'
  when 'Academic Calendar' then '/updates/notices#academics'
  when 'Curriculum & Syllabus' then '/updates/notices'
  when 'Examination' then '/updates/notices#examination'
  when 'Results' then '/updates/notices#examination'
  else to_path
end
where label in (
  'Latest News',
  'Notices',
  'Events',
  'Tenders / Important Circulars',
  'Admission Notices',
  'Academic Calendar',
  'Curriculum & Syllabus',
  'Examination',
  'Results'
);

update public.nav_links
set href = case
  when label = 'Updates / Notices' then '/updates/notices'
  when label = 'Notices' then '/updates/notices'
  when label in ('Examination', 'Results') then '/updates/notices#examination'
  when label = 'Academic Calendar' then '/updates/notices#academics'
  when label = 'Tenders' then '/updates/circulars#tenders'
  when label = 'Updates' then '/updates/news'
  else href
end
where href like '/notices%'
   or label in ('Updates / Notices', 'Notices', 'Examination', 'Results', 'Academic Calendar', 'Tenders', 'Updates');

delete from public.events;

insert into public.events (title, event_date, venue, description, is_published, sort_order)
values (
  'Industry MoUs for Travel, Tourism and Hospitality Training',
  '16 Jun 2026',
  'Government Polytechnic for Women, Srinagar',
  'Government Polytechnic for Women, Srinagar signed Memorandums of Understanding to strengthen industry–academia collaboration in travel, tourism and hospitality training with Travel Agents Association of India (J&K Chapter), Radisson Hotels, and Ecotourism Association of Kashmir.',
  true,
  1
);

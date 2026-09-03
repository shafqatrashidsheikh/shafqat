-- Extended CMS: department detail fields, site settings, navigation, campus, principal, about

alter table public.departments
  add column if not exists overview text not null default '',
  add column if not exists category_label text not null default '',
  add column if not exists duration text not null default '3 Years',
  add column if not exists eligibility text not null default '10th Pass',
  add column if not exists program_type text not null default 'Diploma Programme',
  add column if not exists stream text not null default 'Engineering & Technology',
  add column if not exists icon text not null default 'monitor',
  add column if not exists has_departmental_labs boolean not null default true,
  add column if not exists career_areas jsonb not null default '[]'::jsonb,
  add column if not exists image_asset_key text,
  add column if not exists image_alt text not null default '';

create table if not exists public.site_settings (
  setting_key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.principal_profile (
  id text primary key default 'default',
  name text not null default '',
  role text not null default 'Principal',
  institute text not null default '',
  portrait_asset_key text,
  portrait_alt text not null default '',
  preview text not null default '',
  message_paragraphs jsonb not null default '[]'::jsonb,
  is_published boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.about_blocks (
  block_key text primary key,
  title text not null default '',
  body text not null default '',
  image_asset_key text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.nav_links (
  id uuid primary key default gen_random_uuid(),
  link_group text not null,
  label text not null,
  href text not null default '/',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.header_nav_groups (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  to_path text not null default '/',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.header_nav_items (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.header_nav_groups (id) on delete cascade,
  label text not null,
  to_path text not null default '/',
  is_primary boolean not null default false,
  coming_soon boolean not null default false,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campus_gallery_items (
  id uuid primary key default gen_random_uuid(),
  image_asset_key text not null,
  alt text not null default '',
  width int,
  height int,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.campus_facility_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger site_settings_updated_at before update on public.site_settings
  for each row execute function public.set_updated_at();

create trigger principal_profile_updated_at before update on public.principal_profile
  for each row execute function public.set_updated_at();

create trigger about_blocks_updated_at before update on public.about_blocks
  for each row execute function public.set_updated_at();

create trigger nav_links_updated_at before update on public.nav_links
  for each row execute function public.set_updated_at();

create trigger header_nav_groups_updated_at before update on public.header_nav_groups
  for each row execute function public.set_updated_at();

create trigger header_nav_items_updated_at before update on public.header_nav_items
  for each row execute function public.set_updated_at();

create trigger campus_gallery_items_updated_at before update on public.campus_gallery_items
  for each row execute function public.set_updated_at();

create trigger campus_facility_items_updated_at before update on public.campus_facility_items
  for each row execute function public.set_updated_at();

alter table public.site_settings enable row level security;
alter table public.principal_profile enable row level security;
alter table public.about_blocks enable row level security;
alter table public.nav_links enable row level security;
alter table public.header_nav_groups enable row level security;
alter table public.header_nav_items enable row level security;
alter table public.campus_gallery_items enable row level security;
alter table public.campus_facility_items enable row level security;

-- Public read (published/active only)
create policy "Public read site_settings"
  on public.site_settings for select using (true);

create policy "Public read principal published"
  on public.principal_profile for select using (is_published = true);

create policy "Public read about blocks"
  on public.about_blocks for select using (is_active = true);

create policy "Public read nav links"
  on public.nav_links for select using (is_active = true);

create policy "Public read header nav groups"
  on public.header_nav_groups for select using (is_active = true);

create policy "Public read header nav items"
  on public.header_nav_items for select using (is_active = true);

create policy "Public read campus gallery"
  on public.campus_gallery_items for select using (is_active = true);

create policy "Public read campus facilities"
  on public.campus_facility_items for select using (is_active = true);

-- Admin full access
create policy "Admin write site_settings"
  on public.site_settings for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all principal"
  on public.principal_profile for select using (public.is_admin());

create policy "Admin write principal"
  on public.principal_profile for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin write about blocks"
  on public.about_blocks for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all about blocks"
  on public.about_blocks for select using (public.is_admin());

create policy "Admin write nav links"
  on public.nav_links for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all nav links"
  on public.nav_links for select using (public.is_admin());

create policy "Admin write header nav groups"
  on public.header_nav_groups for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all header nav groups"
  on public.header_nav_groups for select using (public.is_admin());

create policy "Admin write header nav items"
  on public.header_nav_items for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all header nav items"
  on public.header_nav_items for select using (public.is_admin());

create policy "Admin write campus gallery"
  on public.campus_gallery_items for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all campus gallery"
  on public.campus_gallery_items for select using (public.is_admin());

create policy "Admin write campus facilities"
  on public.campus_facility_items for all using (public.is_admin()) with check (public.is_admin());

create policy "Admin read all campus facilities"
  on public.campus_facility_items for select using (public.is_admin());

-- Seed institute settings
insert into public.site_settings (setting_key, value) values
  ('institute', '{
    "name": "Government Polytechnic for Women, Srinagar",
    "shortName": "GPW Srinagar",
    "brandMark": "GPWS",
    "established": "1986",
    "tagline": "Empowering women through quality technical education, practical learning and career-focused skills.",
    "address": "Government Polytechnic for Women, Bemina, Srinagar, Jammu & Kashmir",
    "phone": "0194-2491176",
    "email": "wpolysgr@yahoo.co.in",
    "mapEmbedUrl": "https://www.google.com/maps?q=34.078611,74.763056&hl=en&z=16&output=embed",
    "mapLink": "https://www.google.com/maps/search/?api=1&query=Government+Polytechnic+for+Women+Bemina+Srinagar"
  }'::jsonb)
on conflict (setting_key) do nothing;

insert into public.principal_profile (id, name, role, institute, portrait_asset_key, portrait_alt, preview, message_paragraphs) values
  ('default',
   'Er. Imtiyaz Ahmad Shaw',
   'Principal',
   'Government Polytechnic for Women, Srinagar',
   'principal-imtiyaz-shaw',
   'Er. Imtiyaz Ahmad Shaw, Principal, Government Polytechnic for Women, Srinagar',
   'At Government Polytechnic for Women, Srinagar, our focus is on developing technical competence, practical skills and confidence among our students.',
   '[
     "At Government Polytechnic for Women, Srinagar, our focus is on developing technical competence, practical skills and confidence among our students. We encourage our students to learn beyond the classroom, participate in skill-development and innovation activities, and prepare themselves for meaningful careers and entrepreneurship.",
     "Our aim is to provide an environment where every student can develop her abilities, strengthen her technical skills and move forward with confidence.",
     "We remain committed to practical laboratory training, workshops and guided learning that connect classroom instruction with workplace requirements. We expect every student to approach her studies with discipline, sincerity and a sense of responsibility befitting a government technical institution."
   ]'::jsonb)
on conflict (id) do nothing;

insert into public.about_blocks (block_key, title, body, image_asset_key, sort_order) values
  ('history', 'History', 'The institute was established in 1986 to widen access to technical education for women in the region.', null, 1),
  ('vision', 'Vision', 'To be a leading centre of technical education for women in the region.', null, 2),
  ('mission', 'Mission', 'Quality instruction, practical skill and industry readiness for every student.', null, 3),
  ('values', 'Core Values', 'Integrity, inclusion, curiosity and service to the community.', null, 4),
  ('about_intro', 'About intro', 'Established in 1986, the institute delivers three-year diploma education in engineering and technology exclusively for women in the Kashmir valley.', 'campus-summer', 0)
on conflict (block_key) do nothing;

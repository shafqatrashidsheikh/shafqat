-- Editable page sections + explore carousel (CMA / CDA)

create table public.page_sections (
  section_key text primary key,
  eyebrow text,
  title text not null default '',
  body text not null default '',
  cta_label text,
  cta_href text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.explore_cards (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  category text not null default '',
  title text not null,
  description text not null default '',
  cta text not null default '',
  href text not null default '/',
  image_key text not null default 'campus-main',
  image_alt text not null default '',
  image_position text not null default 'left' check (image_position in ('left', 'right')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_priority boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger page_sections_updated_at before update on public.page_sections
  for each row execute function public.set_updated_at();

create trigger explore_cards_updated_at before update on public.explore_cards
  for each row execute function public.set_updated_at();

alter table public.page_sections enable row level security;
alter table public.explore_cards enable row level security;

create policy "Public read page sections"
  on public.page_sections for select
  using (is_active = true);

create policy "Public read explore cards"
  on public.explore_cards for select
  using (is_active = true);

create policy "Admin write page sections"
  on public.page_sections for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin write explore cards"
  on public.explore_cards for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin read all page sections"
  on public.page_sections for select
  using (public.is_admin());

create policy "Admin read all explore cards"
  on public.explore_cards for select
  using (public.is_admin());

-- Seed homepage + site sections
insert into public.page_sections (section_key, eyebrow, title, body, cta_label, cta_href, sort_order) values
  ('hero', 'Established 1986', 'Government Polytechnic for Women, Srinagar', 'Empowering women through quality technical education, practical learning and career-focused skills.', null, null, 1),
  ('home_about', 'About GPW Srinagar', 'Empowering Women Through Technical Education', 'Established in 1986, Government Polytechnic for Women, Srinagar is a government technical institution dedicated to providing women with accessible, practical and career-oriented technical education. Located at Bemina, Srinagar, the institute offers three-year diploma programmes across engineering, technology and applied fields, with an emphasis on practical learning and skill development.', 'Learn More', '/about', 2),
  ('admissions_cta', 'Admissions', 'Start Your Journey at GPW Srinagar', 'Explore eligibility, the admission process and key dates. Detailed rules and documents are available on the admissions page.', 'View Admissions', '/admissions', 3),
  ('student_life', 'Student Life', 'Campus activities and learning beyond class', 'Technical activities, workshops and campus events that support practical learning and student engagement.', 'Explore student life', '/campus', 4),
  ('placement_blurb', 'Placement & Careers', 'From classroom to career', 'The Training & Placement Cell supports students with skill training, internships, career counselling and recruitment opportunities.', 'View placement details', '/placements', 5),
  ('institute', null, 'Government Polytechnic for Women, Srinagar', 'Government Polytechnic for Women, Bemina, Srinagar, Jammu & Kashmir', null, null, 6)
on conflict (section_key) do nothing;

insert into public.explore_cards (slug, category, title, description, cta, href, image_key, image_alt, image_position, sort_order, is_priority) values
  ('about', 'Institution', 'About the Institute', 'History, vision and the institutional profile of GPW Srinagar.', 'Discover Our Story', '/about', 'campus-entrance', 'Entrance of Government Polytechnic for Women, Srinagar, Bemina', 'left', 1, true),
  ('academics', 'Academics', 'Academics', 'Diploma programs, departments and practical laboratory learning.', 'Explore Academics', '/academics', 'computer-lab', 'Students working in the computer laboratory at Government Polytechnic for Women, Srinagar', 'right', 2, true),
  ('facilities', 'Facilities', 'Laboratories & Facilities', 'Workshops, laboratories, library and campus facilities for practical learning.', 'Explore Facilities', '/campus', 'microscope-lab', 'Students using a microscope during a laboratory practical at Government Polytechnic for Women, Srinagar', 'right', 3, false),
  ('admissions', 'Admissions', 'Admissions', 'Eligibility, process, important dates and how to apply.', 'Admission Information', '/admissions', 'college-hero', 'GPW Srinagar campus — start your journey here', 'right', 4, false),
  ('placement', 'Careers', 'Placement & Careers', 'Training, internships and career development for graduating students.', 'Explore Careers', '/placements', 'campus-summer', 'Training and career development at GPW Srinagar', 'left', 5, false)
on conflict (slug) do nothing;

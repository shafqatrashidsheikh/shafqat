-- Production portal: ensure GPW departments exist + tighten student profile RLS

insert into public.departments (slug, name, summary, sort_order, is_active) values
  ('computer-engineering', 'Computer Engineering', 'Build practical skills in programming, computer systems, software development, networking and modern digital technologies.', 1, true),
  ('electronics-communication-engineering', 'Electronics & Communication Engineering', 'Learn electronic circuits, communication systems, digital electronics, instrumentation and practical electronic technologies.', 2, true),
  ('garment-technology', 'Garment Technology', 'Develop practical expertise in garment production, apparel design, textile handling, pattern making and modern garment manufacturing.', 3, true),
  ('textile-technology', 'Textile Technology', 'Explore textile materials, textile production processes, fabric technology, testing and modern textile manufacturing practices.', 4, true),
  ('office-management-computer-applications', 'Office Management & Computer Applications', 'Develop professional skills in office administration, computer applications, documentation, communication and modern workplace practices.', 5, true),
  ('food-technology', 'Food Technology', 'Learn food processing, preservation, quality control, food safety and practical techniques used in the food industry.', 6, true),
  ('medical-lab-technology', 'Medical Lab Technology', 'Gain practical knowledge of laboratory procedures, diagnostic testing, sample handling and basic clinical laboratory techniques.', 7, true),
  ('travel-tourism', 'Travel & Tourism', 'Develop skills in tourism operations, travel services, hospitality, customer relations, itinerary planning and destination management.', 8, true)
on conflict (slug) do update set
  name = excluded.name,
  summary = excluded.summary,
  sort_order = excluded.sort_order,
  is_active = true;

-- Students may only update onboarding fields while pending profile / review / rejected
drop policy if exists "Students update own profile for onboarding" on public.profiles;

create policy "Students update own profile for onboarding"
  on public.profiles for update
  using (
    auth.uid() = id
    and role = 'student'
    and approval_status in ('pending_profile', 'pending_review', 'rejected')
  )
  with check (
    auth.uid() = id
    and role = 'student'
    and approval_status in ('pending_profile', 'pending_review', 'rejected')
  );

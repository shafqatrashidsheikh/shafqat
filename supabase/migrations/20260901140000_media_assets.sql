-- Media library: metadata table + Content-GPWS storage policies

create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  asset_key text unique,
  storage_bucket text not null default 'Content-GPWS',
  storage_path text not null unique,
  public_url text not null,
  original_filename text not null default '',
  mime_type text not null,
  media_kind text not null check (media_kind in ('image', 'video', 'pdf', 'other')),
  folder text not null default 'images',
  title text not null default '',
  alt_text text not null default '',
  byte_size bigint,
  tags text[] not null default '{}',
  uploaded_by uuid references public.profiles (id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_media_assets_kind on public.media_assets (media_kind) where is_active;
create index idx_media_assets_folder on public.media_assets (folder);
create index idx_media_assets_key on public.media_assets (asset_key) where asset_key is not null;

create trigger media_assets_updated_at before update on public.media_assets
  for each row execute function public.set_updated_at();

alter table public.media_assets enable row level security;

create policy "Public read active media"
  on public.media_assets for select
  using (is_active = true);

create policy "Admin read all media"
  on public.media_assets for select
  using (public.is_admin());

create policy "Admin write media"
  on public.media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

-- Ensure bucket exists (user may have created it manually — upsert settings)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'Content-GPWS',
  'Content-GPWS',
  true,
  52428800,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/gif',
    'image/svg+xml',
    'video/mp4',
    'video/webm',
    'video/quicktime',
    'application/pdf'
  ]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Storage object policies for Content-GPWS
create policy "Public read Content-GPWS"
  on storage.objects for select
  using (bucket_id = 'Content-GPWS');

create policy "Admin insert Content-GPWS"
  on storage.objects for insert
  with check (bucket_id = 'Content-GPWS' and public.is_admin());

create policy "Admin update Content-GPWS"
  on storage.objects for update
  using (bucket_id = 'Content-GPWS' and public.is_admin());

create policy "Admin delete Content-GPWS"
  on storage.objects for delete
  using (bucket_id = 'Content-GPWS' and public.is_admin());

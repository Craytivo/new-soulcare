create table if not exists public.content_assets (
  source_id text primary key,
  source_type text not null,
  storage_bucket text not null,
  storage_path text not null,
  public_url text,
  original_filename text,
  mime_type text,
  size bigint,
  migrated_at timestamptz not null default now()
);

alter table public.content_assets enable row level security;

insert into storage.buckets (id, name, public)
values
  ('site-assets', 'site-assets', true),
  ('resource-files', 'resource-files', true)
on conflict (id) do update set public = excluded.public;

create policy "Public site assets are readable"
  on storage.objects for select
  using (bucket_id = 'site-assets');

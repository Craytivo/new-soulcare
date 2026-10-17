-- Supabase content and waitlist foundation.
-- JSONB keeps the first import flexible; normalize high-traffic records later.
create extension if not exists pgcrypto;

create table if not exists public.content_documents (
  id text primary key,
  content_type text not null,
  slug text,
  data jsonb not null default '{}'::jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists content_documents_type_idx on public.content_documents (content_type);
create index if not exists content_documents_slug_idx on public.content_documents (slug);

create table if not exists public.waitlist_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text not null default 'shop',
  status text not null default 'active',
  user_agent text,
  submitted_count integer not null default 1,
  last_submitted_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

alter table public.content_documents enable row level security;
alter table public.waitlist_signups enable row level security;

create policy "Published content is public"
  on public.content_documents for select
  using (published_at is not null and published_at <= now());

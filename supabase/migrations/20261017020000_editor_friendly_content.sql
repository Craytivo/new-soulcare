-- Editor-friendly Supabase layer.
-- content_documents remains the canonical import/content store. These tables and
-- views expose the fields that are edited most often without breaking the app's
-- existing JSONB content flow.

create table if not exists public.content_type_labels (
  content_type text primary key,
  display_name text not null,
  description text,
  sort_order integer not null default 100
);

insert into public.content_type_labels (content_type, display_name, description, sort_order)
values
  ('homePage', 'Homepage', 'Homepage hero and supporting content', 10),
  ('teamMember', 'Team members', 'Clinicians and operations staff', 20),
  ('servicePage', 'Service pages', 'Individual counselling service pages', 30),
  ('services', 'Services directory', 'Services directory content', 31),
  ('blogPost', 'Notes', 'Educational notes and articles', 40),
  ('resource', 'Resources', 'Downloadable resources and guides', 50),
  ('workshop', 'Workshops', 'Upcoming and recorded workshops', 60),
  ('aboutPage', 'About page', 'About page content', 70),
  ('coreValuesPage', 'Core pillars', 'Core values and pillars', 80),
  ('faqPage', 'FAQs', 'Frequently asked questions', 90),
  ('contactPage', 'Contact page', 'Contact page content', 100),
  ('internApplicationPage', 'Intern application', 'Intern application content', 110),
  ('termsOfUsePage', 'Terms of use', 'Legal terms', 120),
  ('privacyPolicyPage', 'Privacy policy', 'Privacy policy content', 130)
on conflict (content_type) do update set
  display_name = excluded.display_name,
  description = excluded.description,
  sort_order = excluded.sort_order;

create table if not exists public.team_profiles (
  id text primary key references public.content_documents(id) on delete cascade,
  slug text not null unique,
  name text not null,
  credentials text,
  role text not null default '',
  image jsonb,
  bio jsonb not null default '[]'::jsonb,
  specialties text[] not null default '{}'::text[],
  areas_of_focus text[] not null default '{}'::text[],
  best_fit_for text,
  client_types text[] not null default '{}'::text[],
  languages text[] not null default '{}'::text[],
  session_formats text[] not null default '{}'::text[],
  approaches text[] not null default '{}'::text[],
  staff_category text not null default 'clinician'
    check (staff_category in ('clinician', 'operations')),
  accepts_bookings boolean not null default false,
  virtual_available boolean not null default false,
  in_person_available boolean not null default false,
  directory_visible boolean not null default true,
  sort_order integer not null default 100,
  source_updated_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists team_profiles_category_idx
  on public.team_profiles (staff_category, sort_order, name);
create index if not exists team_profiles_directory_idx
  on public.team_profiles (directory_visible, accepts_bookings);

create or replace function public.jsonb_text_array(value jsonb)
returns text[]
language sql
immutable
as $$
  select coalesce(array_agg(item order by item), '{}'::text[])
  from jsonb_array_elements_text(coalesce(value, '[]'::jsonb)) as entry(item);
$$;

create or replace function public.sync_team_profile_from_document()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  document jsonb := new.data;
  profile_slug text := coalesce(document->'slug'->>'current', new.slug, new.id);
  role_text text := coalesce(document->>'role', '');
  category_text text := lower(coalesce(document->>'staffCategory', document->>'department', role_text));
begin
  if new.content_type <> 'teamMember' then
    return new;
  end if;

  insert into public.team_profiles (
    id, slug, name, credentials, role, image, bio, specialties, areas_of_focus,
    best_fit_for, client_types, languages, session_formats, approaches,
    staff_category, accepts_bookings, virtual_available, in_person_available,
    directory_visible, sort_order, source_updated_at, updated_at
  )
  values (
    new.id,
    profile_slug,
    coalesce(document->>'name', 'Unnamed team member'),
    nullif(document->>'credentials', ''),
    role_text,
    document->'image',
    coalesce(document->'bio', '[]'::jsonb),
    public.jsonb_text_array(document->'specialties'),
    public.jsonb_text_array(document->'areasOfFocus'),
    nullif(document->>'bestFitFor', ''),
    public.jsonb_text_array(document->'clientTypes'),
    public.jsonb_text_array(document->'languages'),
    public.jsonb_text_array(document->'sessionFormats'),
    public.jsonb_text_array(document->'approaches'),
    case when category_text like '%operation%' then 'operations' else 'clinician' end,
    coalesce((document->>'acceptsBookings')::boolean, false),
    coalesce((document->>'virtualAvailable')::boolean, false),
    coalesce((document->>'inPersonAvailable')::boolean, false),
    coalesce((document->>'directoryVisible')::boolean, true),
    coalesce((document->>'sortOrder')::integer, 100),
    new.updated_at,
    now()
  )
  on conflict (id) do update set
    slug = excluded.slug,
    name = excluded.name,
    credentials = excluded.credentials,
    role = excluded.role,
    image = excluded.image,
    bio = excluded.bio,
    specialties = excluded.specialties,
    areas_of_focus = excluded.areas_of_focus,
    best_fit_for = excluded.best_fit_for,
    client_types = excluded.client_types,
    languages = excluded.languages,
    session_formats = excluded.session_formats,
    approaches = excluded.approaches,
    staff_category = excluded.staff_category,
    accepts_bookings = excluded.accepts_bookings,
    virtual_available = excluded.virtual_available,
    in_person_available = excluded.in_person_available,
    directory_visible = excluded.directory_visible,
    sort_order = excluded.sort_order,
    source_updated_at = excluded.source_updated_at,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_team_profile_after_document_change on public.content_documents;
create trigger sync_team_profile_after_document_change
after insert or update of content_type, slug, data, updated_at on public.content_documents
for each row execute function public.sync_team_profile_from_document();

create or replace function public.sync_document_from_team_profile()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- The document trigger creates/refreshes the profile. Do not write back during
  -- that nested operation; only direct editor changes should update the document.
  if pg_trigger_depth() > 1 then
    return new;
  end if;

  update public.content_documents
  set
    slug = new.slug,
    data = data || jsonb_build_object(
      'name', new.name,
      'credentials', new.credentials,
      'role', new.role,
      'image', new.image,
      'bio', new.bio,
      'specialties', new.specialties,
      'areasOfFocus', new.areas_of_focus,
      'bestFitFor', new.best_fit_for,
      'clientTypes', new.client_types,
      'languages', new.languages,
      'sessionFormats', new.session_formats,
      'approaches', new.approaches,
      'staffCategory', new.staff_category,
      'acceptsBookings', new.accepts_bookings,
      'virtualAvailable', new.virtual_available,
      'inPersonAvailable', new.in_person_available,
      'directoryVisible', new.directory_visible,
      'sortOrder', new.sort_order,
      'slug', jsonb_build_object('current', new.slug)
    ),
    updated_at = now()
  where id = new.id;

  return new;
end;
$$;

drop trigger if exists sync_document_after_team_profile_change on public.team_profiles;
create trigger sync_document_after_team_profile_change
after update of slug, name, credentials, role, image, bio, specialties, areas_of_focus,
  best_fit_for, client_types, languages, session_formats, approaches, staff_category,
  accepts_bookings, virtual_available, in_person_available, directory_visible, sort_order
on public.team_profiles
for each row execute function public.sync_document_from_team_profile();

-- Backfill profiles that were imported before this migration was applied.
update public.content_documents
set data = data
where content_type = 'teamMember';

create or replace view public.team_directory
with (security_invoker = true)
as
select
  profile.id,
  profile.slug,
  profile.name,
  profile.credentials,
  profile.role,
  profile.image,
  profile.specialties,
  profile.areas_of_focus,
  profile.best_fit_for,
  profile.client_types,
  profile.languages,
  profile.session_formats,
  profile.approaches,
  profile.staff_category,
  profile.accepts_bookings,
  profile.virtual_available,
  profile.in_person_available,
  case
    when profile.staff_category = 'operations' then 'Operations'
    when profile.accepts_bookings then 'Accepting clients'
    else 'Currently full'
  end as availability_label,
  profile.sort_order
from public.team_profiles as profile
join public.content_documents as document on document.id = profile.id
where profile.directory_visible = true
  and document.published_at is not null
  and document.published_at <= now();

create or replace view public.content_catalog
with (security_invoker = true)
as
select
  document.id,
  document.content_type,
  coalesce(labels.display_name, document.content_type) as content_type_label,
  document.slug,
  coalesce(document.data->>'title', document.data->>'name', document.slug, document.id) as display_title,
  document.published_at,
  document.created_at,
  document.updated_at
from public.content_documents as document
left join public.content_type_labels as labels using (content_type);

create or replace view public.media_library
with (security_invoker = true)
as
select
  source_id,
  source_type,
  storage_bucket,
  storage_path,
  split_part(storage_path, '/', 1) as folder,
  original_filename,
  mime_type,
  size,
  public_url,
  migrated_at
from public.content_assets;

alter table public.content_type_labels enable row level security;
alter table public.team_profiles enable row level security;

grant select on public.content_type_labels to anon, authenticated;
grant select on public.team_profiles to anon, authenticated;
grant select on public.team_directory to authenticated;
grant select on public.content_catalog to authenticated;
grant select on public.media_library to authenticated;

drop policy if exists "Public content type labels are readable" on public.content_type_labels;
create policy "Public content type labels are readable"
  on public.content_type_labels for select using (true);

drop policy if exists "Visible team profiles are readable" on public.team_profiles;
create policy "Visible team profiles are readable"
  on public.team_profiles for select
  using (
    directory_visible = true
    and exists (
      select 1
      from public.content_documents as document
      where document.id = team_profiles.id
        and document.published_at is not null
        and document.published_at <= now()
    )
  );

comment on table public.team_profiles is 'Editor-friendly team fields synced from content_documents teamMember records.';
comment on column public.team_profiles.staff_category is 'Use clinician for care providers and operations for non-clinical staff.';
comment on column public.team_profiles.directory_visible is 'Controls whether this person appears in the public team directory.';
comment on view public.team_directory is 'Readable public-facing team directory with availability labels.';
comment on view public.content_catalog is 'Human-friendly index of all imported content records.';
comment on view public.media_library is 'Human-friendly index of migrated Supabase Storage assets.';

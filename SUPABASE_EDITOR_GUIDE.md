# Supabase editor guide

The migration [`20261017020000_editor_friendly_content.sql`](./supabase/migrations/20261017020000_editor_friendly_content.sql) adds a friendlier editing layer without removing the existing `content_documents` or `content_assets` tables.

## What the new objects are for

| Object                | Use it for                                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `team_profiles`       | Editing names, roles, availability, specialties, client types, languages, formats, and directory visibility. |
| `team_directory`      | Reading the public-ready team list with a calculated availability label.                                     |
| `content_catalog`     | Finding imported content by readable content type and title.                                                 |
| `media_library`       | Finding migrated files by folder, filename, bucket, and public URL.                                          |
| `content_type_labels` | Keeping the dashboard's content categories readable and ordered.                                             |

## Recommended editing workflow

1. Run the migration in Supabase SQL Editor.
2. Open `team_profiles` in Table Editor for day-to-day team updates.
3. Use `staff_category = 'operations'` for staff such as Davene who do not provide counselling.
4. Use `accepts_bookings = false` for clinicians who are currently full.
5. Use `directory_visible = false` when someone should be hidden without deleting their record.
6. Keep `content_documents` as the source for long-form page content and imported Portable Text.
7. Keep `content_assets` as the source for migrated file records. Use `media_library` when locating an asset.

Changes to a `teamMember` row in `content_documents` automatically refresh the matching `team_profiles` row. This means the existing content migration and organization scripts remain compatible.

## Useful checks

```sql
select name, staff_category, role, accepts_bookings, directory_visible
from public.team_profiles
order by staff_category, sort_order, name;

select display_title, content_type_label, slug, published_at
from public.content_catalog
order by content_type_label, display_title;

select folder, original_filename, storage_path, public_url
from public.media_library
order by folder, original_filename;
```

The application does not need to change immediately because it still reads the existing content API shape. The normalized layer is available for safer manual editing now, and it can become the application read source later if desired.

# Supabase and Vercel setup

The app now uses Supabase for published content and waitlist signups. The project URL is already configured locally for `ltpntnfaamtjfustkuwh`. It is a standard Next.js project for Vercel; there is no provider-specific form or function setup required.

## 1. Create the Supabase project

1. Go to [supabase.com](https://supabase.com), create a project, and choose a strong database password.
2. In **Project Settings → API**, copy:
   - **Project URL** → `SUPABASE_URL`
   - **Publishable key / anon key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Service role key** → `SUPABASE_SERVICE_ROLE_KEY`
3. Keep the service-role key private. It is used only by the server-side waitlist route.

## 2. Confirm the tables

The tables have already been created in Supabase. Use **Table Editor** to confirm they exist; only run the migration SQL below if one is missing.

In Supabase, open **SQL Editor → New query**, paste the contents of [supabase/migrations/20261017000000_initial_schema.sql](./supabase/migrations/20261017000000_initial_schema.sql), and click **Run**.

This creates:

- `content_documents`: published page, team, service, blog, workshop, FAQ, and resource documents stored as JSONB.
- `waitlist_signups`: email signups with duplicate-email protection and submission counts.

The public key can read only rows whose `published_at` is set and has passed. The service-role key bypasses RLS inside the server route.

## 3. Local environment variables

The local [.env.local](./.env.local) file has been created with the supplied values. It is ignored by Git and must never be committed. The expected variable names are:

```text
SUPABASE_URL=https://ltpntnfaamtjfustkuwh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-or-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-server-only-service-role-key
```

Then install dependencies and start the app:

```bash
npm ci
npm run dev
```

## 4. Load your site content

The page code expects each `content_documents.data` value to retain the existing document shape. At minimum, each row needs:

```sql
insert into public.content_documents
  (id, content_type, slug, data, published_at)
values
  (
    'home-page',
    'homePage',
    null,
    '{"_id":"home-page","_type":"homePage","isActive":true}'::jsonb,
    now()
  );
```

For a slugged document, store both the indexed `slug` column and the nested value used by the page components:

```sql
insert into public.content_documents
  (id, content_type, slug, data, published_at)
values
  (
    'team-jessica',
    'teamMember',
    'jessica-robinson-grant',
    '{"_id":"team-jessica","_type":"teamMember","slug":{"current":"jessica-robinson-grant"},"name":"Jessica Robinson Grant"}'::jsonb,
    now()
  );
```

Import your complete content before switching production traffic. The app queries these `content_type` values: `homePage`, `siteSettings`, `teamMember`, `services`, `servicePage`, `blogPost`, `workshop`, `aboutPage`, `areasPage`, `coreValuesPage`, `faqPage`, `contactPage`, `internApplicationPage`, `privacyPolicyPage`, `termsOfUsePage`, `accessibilityPage`, and `resource`.

For images and downloadable files, create a **public** Storage bucket such as `site-assets`, upload the files, and put the resulting public URL in the document data, for example:

```json
{
  "_type": "image",
  "url": "https://your-project-ref.supabase.co/storage/v1/object/public/site-assets/team/jessica.jpg",
  "alt": "Jessica Robinson Grant"
}
```

## 5. Configure Vercel

1. Import the Git repository into Vercel.
2. Choose **Next.js** when prompted.
3. In **Project Settings → Environment Variables**, add all three Supabase variables for **Production**, **Preview**, and **Development**.
4. Redeploy after saving the variables.

The checked-in [vercel.json](./vercel.json) uses `npm ci` and `npm run build`. No extra server, function, or rewrite configuration is needed.

## 6. Verify the migration

- Open the deployed homepage and one slugged page.
- Submit the waitlist form once, then submit the same email again. Confirm one row exists in `waitlist_signups` and `submitted_count` increased.
- In Supabase Table Editor, confirm only intended content rows have `published_at` set.
- In Vercel, check the deployment logs for missing environment variables or Supabase request errors.

## 7. Import the CLI export

The archive at `sanity-backup.tar.gz` was inspected successfully. It contains 301 source documents, 54 image files, and 8 other files. The repository now includes a dry-run-first importer at [migrate-content-export.mjs](./scripts/migrate-content-export.mjs).

First open [20261017010000_content_assets.sql](./supabase/migrations/20261017010000_content_assets.sql), copy its SQL contents, paste that SQL into Supabase **SQL Editor → New query**, and click **Run**. Do not paste the file path itself:

```text
supabase/migrations/20261017010000_content_assets.sql
```

Then run a dry run locally:

```bash
npm run migrate:content -- --archive=sanity-backup.tar.gz
```

The default is intentionally conservative:

- Imports non-draft content documents.
- Imports only assets referenced by those documents.
- Excludes the 250 exported waitlist records.
- Excludes draft documents.
- Performs no Supabase writes.

After reviewing the counts, apply the content and asset migration:

```bash
npm run migrate:content -- --archive=sanity-backup.tar.gz --apply
```

Only use these options if you explicitly want them:

```bash
--include-drafts
--include-waitlist
```

The importer uploads images to `site-assets`, files to `resource-files`, replaces asset references with Supabase Storage URLs, and upserts documents in batches. Keep the archive and service-role key out of Git. The importer is a one-time migration tool and can be removed after the import is verified.

To limit an import to selected content types and only upload the assets referenced by those documents, pass a comma-separated `--types` filter. For example, `--types=resource` selects resource documents only. Review the dry-run counts before applying; applying this filter still upserts the selected resource records.

## 8. Organize migrated Supabase assets

The migrated assets have been cleaned in Supabase. All 29 rows in `content_assets` now use readable paths grouped by purpose:

- `team/<member>-portrait.<ext>`
- `blog/<slug>-image.<ext>`
- `resources/<slug>.<ext>` and `resources/<slug>-image.<ext>`
- `site/homepage-hero.<ext>`, `site/about-image.<ext>`, and other site assets

All document URLs were updated to the new paths. The original storage objects were intentionally preserved so the change can be rolled back safely. After the deployed site has been verified, the old objects under the former migration paths can be deleted from Storage manually.

The repeatable organizer is [organize-supabase-content.mjs](./scripts/organize-supabase-content.mjs). It is dry-run-first:

```bash
npm run organize:content
npm run organize:content -- --apply
```

Do not run `--apply` again unless you intend to reorganize paths; it is not needed for normal content editing.

#!/usr/bin/env node

import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('.env.local') })

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...value] = arg.replace(/^--/, '').split('=')
    return [key, value.join('=') || true]
  })
)

const archivePath = path.resolve(String(args.archive || 'sanity-backup.tar.gz'))
const apply = args.apply === true
const includeDrafts = args['include-drafts'] === true
const includeWaitlist = args['include-waitlist'] === true
const contentTypes = args.types
  ? new Set(
      String(args.types)
        .split(',')
        .map((type) => type.trim())
        .filter(Boolean)
    )
  : null
const imageBucket = String(args['image-bucket'] || 'site-assets')
const fileBucket = String(args['file-bucket'] || 'resource-files')

if (!fs.existsSync(archivePath)) {
  console.error(`Archive not found: ${archivePath}`)
  process.exit(1)
}

const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (apply && (!supabaseUrl || !serviceRoleKey)) {
  console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required with --apply.')
  process.exit(1)
}

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'soulcare-content-'))

try {
  execFileSync('tar', ['-xzf', archivePath, '-C', tempDir], { stdio: 'ignore' })
  const exportRoot = fs
    .readdirSync(tempDir, { withFileTypes: true })
    .find((entry) => entry.isDirectory())
  if (!exportRoot) throw new Error('The archive does not contain an export directory.')

  const exportDir = path.join(tempDir, exportRoot.name)
  const documents = fs
    .readFileSync(path.join(exportDir, 'data.ndjson'), 'utf8')
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => JSON.parse(line))
  const assets = JSON.parse(fs.readFileSync(path.join(exportDir, 'assets.json'), 'utf8'))
  const assetFiles = indexAssetFiles(exportDir)
  const assetRows = new Map()
  const unresolvedAssets = new Set()

  const contentDocuments = []
  const waitlistDocuments = []

  for (const document of documents) {
    if (!includeDrafts && document._id?.startsWith('drafts.')) continue
    if (document._type?.startsWith('sanity.')) continue

    if (document._type === 'waitlistSignup') {
      if (includeWaitlist) waitlistDocuments.push(document)
      continue
    }
    if (contentTypes && !contentTypes.has(document._type)) continue

    const data = transformAssets(document, {
      exportDir,
      assetFiles,
      assets,
      assetRows,
      unresolvedAssets,
      imageBucket,
      fileBucket,
      publicUrl: (bucket, storagePath) =>
        `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`,
    })

    contentDocuments.push({
      id: document._id,
      content_type: document._type,
      slug: typeof data.slug?.current === 'string' ? data.slug.current : null,
      data,
      published_at: getPublishedAt(data),
      updated_at: data._updatedAt || data._createdAt || new Date().toISOString(),
    })
  }

  console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}`)
  console.log(`Documents selected: ${contentDocuments.length}`)
  if (contentTypes) console.log(`Content types included: ${[...contentTypes].join(', ')}`)
  console.log(`Waitlist records selected: ${waitlistDocuments.length}`)
  console.log(`Assets discovered: ${assetRows.size}`)
  console.log(`Unresolved assets: ${unresolvedAssets.size}`)
  console.log('Document types:')
  for (const [type, count] of countBy(contentDocuments, 'content_type'))
    console.log(`  ${type}: ${count}`)

  if (!apply) {
    console.log('\nDry run only. Re-run with --apply after running the asset-table migration.')
    process.exit(0)
  }

  for (const asset of assetRows.values()) {
    await uploadAsset(asset, { supabaseUrl, serviceRoleKey })
    await upsertRows('content_assets', [assetRow(asset)], {
      supabaseUrl,
      serviceRoleKey,
      conflictTarget: 'source_id',
    })
  }

  await upsertRows('content_documents', contentDocuments, { supabaseUrl, serviceRoleKey })

  if (includeWaitlist && waitlistDocuments.length > 0) {
    await upsertRows(
      'waitlist_signups',
      waitlistDocuments.map((document) => ({
        email: document.email,
        first_name: document.firstName || null,
        source: document.source || 'migration',
        status: document.status || 'active',
        user_agent: document.userAgent || null,
        submitted_count: document.submittedCount || 1,
        last_submitted_at:
          document.lastSubmittedAt || document._updatedAt || new Date().toISOString(),
        created_at: document.createdAt || document._createdAt || new Date().toISOString(),
      })),
      { supabaseUrl, serviceRoleKey, conflictTarget: 'email' }
    )
  }

  console.log('Migration completed.')
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true })
}

function indexAssetFiles(exportDir) {
  const result = new Map()
  for (const directory of ['images', 'files']) {
    const directoryPath = path.join(exportDir, directory)
    if (!fs.existsSync(directoryPath)) continue
    for (const file of fs.readdirSync(directoryPath)) {
      const hash = path.parse(file).name.split('-')[0]
      result.set(`${directory}:${hash}`, path.join(directoryPath, file))
    }
  }
  return result
}

function transformAssets(value, context) {
  if (Array.isArray(value)) return value.map((item) => transformAssets(item, context))
  if (!value || typeof value !== 'object') return value

  if (typeof value._sanityAsset === 'string') {
    const match = value._sanityAsset.match(/^(image|file)@file:\/\/\.\/(images|files)\/(.+)$/)
    if (match) {
      const [, sourceType, directory, filename] = match
      const localPath = path.join(context.exportDir, directory, filename)
      const transformed = replaceAsset(value, sourceType, localPath, filename, context)
      const { url, ...container } = transformed
      const hash = path.parse(filename).name.split('-')[0]
      const assetId = `${sourceType}-${hash}`
      const assetMetadata = context.assets[assetId] || {}

      return {
        ...container,
        asset: {
          ...(sourceType === 'image'
            ? { _ref: assetId }
            : {
                _id: assetId,
                originalFilename: assetMetadata.originalFilename || filename,
                size:
                  assetMetadata.size ??
                  (fs.existsSync(localPath) ? fs.statSync(localPath).size : undefined),
              }),
          _type: 'reference',
          url,
        },
      }
    }
  }

  if (value.asset?._ref && /^(image|file)-/.test(value.asset._ref)) {
    const [sourceType, hash] = value.asset._ref.split('-')
    const localPath = context.assetFiles.get(
      `${sourceType === 'image' ? 'images' : 'files'}:${hash}`
    )
    if (localPath)
      return {
        ...value,
        asset: replaceAsset(value.asset, sourceType, localPath, path.basename(localPath), context),
      }
  }

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => [key, transformAssets(child, context)])
  )
}

function replaceAsset(value, sourceType, localPath, filename, context) {
  const bucket = sourceType === 'image' ? context.imageBucket : context.fileBucket
  const storagePath = `migration/${filename}`
  const sourceId = `${sourceType}:${filename}`
  if (!fs.existsSync(localPath)) context.unresolvedAssets.add(sourceId)
  else if (!context.assetRows.has(sourceId)) {
    context.assetRows.set(sourceId, {
      source_id: sourceId,
      source_type: sourceType,
      storage_bucket: bucket,
      storage_path: storagePath,
      public_url: sourceType === 'image' ? context.publicUrl(bucket, storagePath) : null,
      original_filename: filename,
      mime_type: mimeType(filename),
      size: fs.statSync(localPath).size,
      localPath,
    })
  }

  const next = { ...value }
  delete next._sanityAsset
  if (sourceType === 'image') next.url = context.publicUrl(bucket, storagePath)
  else next.url = context.publicUrl(bucket, storagePath)
  return next
}

function getPublishedAt(document) {
  if (document.isPublished === false) return null
  return document.publishedAt || document._updatedAt || document._createdAt || null
}

function mimeType(filename) {
  const extension = path.extname(filename).toLowerCase()
  return (
    {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.pdf': 'application/pdf',
    }[extension] || 'application/octet-stream'
  )
}

function assetRow(asset) {
  const row = { ...asset }
  delete row.localPath
  return row
}

function countBy(rows, key) {
  const counts = new Map()
  for (const row of rows) counts.set(row[key], (counts.get(row[key]) || 0) + 1)
  return counts
}

async function uploadAsset(asset, config) {
  const body = fs.readFileSync(asset.localPath)
  const response = await fetch(
    `${config.supabaseUrl}/storage/v1/object/${asset.storage_bucket}/${asset.storage_path}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        'Content-Type': asset.mime_type,
        'x-upsert': 'true',
      },
      body,
    }
  )
  if (!response.ok)
    throw new Error(`Asset upload failed for ${asset.original_filename}: ${await response.text()}`)
}

async function upsertRows(table, rows, config) {
  for (let index = 0; index < rows.length; index += 50) {
    const batch = rows.slice(index, index + 50)
    const conflict = config.conflictTarget || 'id'
    const response = await fetch(`${config.supabaseUrl}/rest/v1/${table}?on_conflict=${conflict}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.serviceRoleKey}`,
        apikey: config.serviceRoleKey,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(batch),
    })
    if (!response.ok) throw new Error(`${table} import failed: ${await response.text()}`)
  }
}

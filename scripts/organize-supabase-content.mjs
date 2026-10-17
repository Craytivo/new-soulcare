#!/usr/bin/env node

import path from 'node:path'
import dotenv from 'dotenv'

dotenv.config({ path: path.resolve('.env.local') })

const args = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const [key, ...value] = arg.replace(/^--/, '').split('=')
    return [key, value.join('=') || true]
  })
)

const apply = args.apply === true
const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required in .env.local.')
}

const headers = {
  Authorization: `Bearer ${serviceRoleKey}`,
  apikey: serviceRoleKey,
}

const legacyPathMap = {
  '72de4ea99be8db68dbae02022b0e459c130d65d8-1280x853.webp': 'blog/what-self-care-actually-looks-like-image.webp',
  '1a06f1106461e5e6e07182aa0cd0ad3ca7005040.pdf': 'resources/a-b-c-thought-record.pdf',
  '3d351483cc078fe53679e52a85aeee078a002066-400x300.png': 'resources/a-b-c-thought-record-image.png',
  '4d85d462ff89068de4dfa983075d628b8ab7eab7-1280x853.webp': 'blog/breaking-the-myth-self-care-self-indulgence-image.webp',
  'f07ca9e5607909bef91aef2a115e10e2546fa003-1280x850.webp': 'blog/what-they-see-vs-what-you-re-actually-navigating-image.webp',
  '882be9daf7b23832b14702ba2726982ef76d7a5b-1254x836.webp': 'blog/i-m-fine-vs-actually-managing-stress-a-reality-check-image.webp',
  '0b5342837ad5cfb7d72e7201feae38cc32687918-1280x851.webp': 'blog/demystifying-therapy-overcoming-fears-of-starting-your-journey-image.webp',
  '5fbc4a1c60b672baa933783278ab8a9858775889-1280x853.webp': 'blog/4-effective-coping-strategies-for-seasonal-affective-disorder-image.webp',
  'b423dc0f35f3cdecd6a456cff2cf025d0c4eef0b-3648x5472.jpg': 'team/baraka-mwangi-portrait.jpg',
  'e85d9eee05af2602439ed82f01162ed483734698-838x560.webp': 'blog/recognizing-your-fight-language-how-you-handle-conflict-matters-image.webp',
  'bb543e6d8701e8503f95e5345b46fb53dce52f84-4480x6720.jpg': 'blog/grief-and-loneliness-during-the-holidays-finding-connection-and-joy-image.jpg',
  'ec7183758dbed0994c4e9e2caf11d4a2a4211801-3648x5472.jpg': 'team/khadian-williams-portrait.jpg',
  '5ea1d69cb6e688771419edb855749e2a66395dcb-3648x5472.jpg': 'site/about-image.jpg',
  '22e55ee19004134457e689052a2dd7f51d0945fc-3648x5472.jpg': 'site/about-image-2.jpg',
  '95d6afd21052fe52e4b21b015fc0fb1c4c1cb7f0-3648x5472.jpg': 'team/jessica-robinson-grant-portrait.jpg',
  'f1ae80075011a0ffa3e03a29575dd6ada5928dd4-3648x5472.jpg': 'team/nigel-miller-portrait.jpg',
  'f03fa666cd334d626e80c95b2700fa7f1fd14b51-3648x5472.jpg': 'team/natalie-willis-portrait.jpg',
  '3a34ded7a831ec7bea98c51c728347e5a0de9900-4000x6000.jpg': 'blog/reframing-seasonal-depression-navigating-the-darker-days-with-hope-image.jpg',
  '27988bb6b995ba7e82351ed8a63f06ed76b54fda-1280x853.webp': 'blog/food-for-thought-how-nutrition-impacts-mental-health-image.webp',
  '6a60a3b70d389a8a2fd581f7121b3c6dd31ea00e.png': 'resources/pause-method-emotional-de-escalation.png',
  '4984bceaa507e0556e54109ec8a8aedf4af3a2be-400x300.png': 'resources/pause-method-emotional-de-escalation-image.png',
  '26f6cbda117051ee9fa5ec470312f046999830ba.png': 'resources/emotional-regulation-guide.png',
  '5e64682ad0eecba3f32518c5c08e4a33b7aa52fc-400x300.png': 'resources/emotional-regulation-guide-image.png',
  '262fc88022e7faad12cdaa62e174c8a9850026b2.pdf': 'resources/reframing-anxious-thoughts.pdf',
  '768028b6a36c101fe57c54c73e23812e28c5e96f-400x300.png': 'resources/reframing-anxious-thoughts-image.png',
  '4ec72e7ef1231c57b8c27b1606efa8a3a069bf3f-3648x5472.jpg': 'team/oluseye-olumide-portrait.jpg',
  'de04f9eb304ffec2747ff0500817f595e0d34d20-2480x1540.jpg': 'site/homepage-hero.jpg',
  'ad52ba1edfeed155a358f1f2c9e3479894357432-3648x5472.jpg': 'team/davene-harris-portrait.jpg',
  'f8a42206ee5767f0c5155e3e6793044549dd8875-3648x1949.jpg': 'site/core-values.jpg',
}

const [assets, documents] = await Promise.all([
  getRows('content_assets', 'select=*'),
  getRows('content_documents', 'select=id,content_type,slug,data'),
])

const plans = []
const usedPaths = new Set()

for (const asset of assets) {
  const oldUrl = asset.public_url || publicUrl(asset.storage_bucket, asset.storage_path)
  const legacyFilename = asset.source_id.split(':').slice(1).join(':')
  const legacyUrl = publicUrl(asset.storage_bucket, `migration/${legacyFilename}`)
  const owner = documents.find((document) =>
    containsUrl(document.data, oldUrl) || containsUrl(document.data, legacyUrl) || containsUrl(document.data, legacyFilename)
  )
  const extension = extensionFor(asset.original_filename || asset.storage_path)
  const nextPath = legacyPathMap[legacyFilename] || uniquePath(buildPath(asset, owner, extension), usedPaths)
  usedPaths.add(nextPath)
  const nextUrl = publicUrl(asset.storage_bucket, nextPath)

  plans.push({ asset, owner, oldUrl, legacyUrl, nextPath, nextUrl })
}

console.log(`Mode: ${apply ? 'APPLY' : 'DRY RUN'}`)
console.log(`Assets found: ${assets.length}`)
console.log(`Documents found: ${documents.length}`)
console.log(`Assets with document owners: ${plans.filter((plan) => plan.owner).length}`)
console.log('Planned storage organization:')
for (const plan of plans) {
  const ownerLabel = plan.owner ? `${plan.owner.content_type}/${plan.owner.slug || plan.owner.id}` : 'unassigned'
  console.log(`  ${plan.asset.storage_path} -> ${plan.nextPath} (${ownerLabel})`)
}

if (!apply) {
  console.log('\nDry run only. Re-run with --apply to copy assets, update references, and keep the old paths as a rollback.')
  process.exit(0)
}

for (const plan of plans) {
  if (plan.oldUrl !== plan.nextUrl) {
    await copyAsset(plan.asset, plan.nextPath)
  }

  await patchAssetRow(plan.asset, plan.nextPath, plan.nextUrl, friendlyFilename(plan))
}

  for (const document of documents) {
    let nextData = document.data
    for (const plan of plans) {
      nextData = replaceUrl(nextData, plan.oldUrl, plan.nextUrl)
      nextData = replaceUrl(nextData, plan.legacyUrl, plan.nextUrl)
      nextData = replaceUrl(nextData, publicUrl(plan.asset.storage_bucket, plan.nextPath), plan.nextUrl)
    }

  if (JSON.stringify(nextData) !== JSON.stringify(document.data)) {
    await patchDocument(document.id, nextData)
  }
}

console.log('\nCleanup complete. New paths and document references are active; old storage objects were preserved for rollback.')

function publicUrl(bucket, storagePath) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`
}

async function getRows(table, query) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${table}?${query}`, { headers })
  if (!response.ok) throw new Error(`${table} read failed: ${await response.text()}`)
  return response.json()
}

async function copyAsset(asset, destinationPath) {
  const sourceUrl = publicUrl(asset.storage_bucket, asset.storage_path)
  const download = await fetch(sourceUrl, { headers })
  if (!download.ok) throw new Error(`Could not read ${asset.storage_bucket}/${asset.storage_path}: ${await download.text()}`)

  const body = Buffer.from(await download.arrayBuffer())
  const upload = await fetch(`${supabaseUrl}/storage/v1/object/${asset.storage_bucket}/${destinationPath}`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': asset.mime_type || 'application/octet-stream',
      'x-upsert': 'true',
    },
    body,
  })

  if (!upload.ok) throw new Error(`Could not write ${destinationPath}: ${await upload.text()}`)
}

async function patchAssetRow(asset, storagePath, url, originalFilename) {
  const response = await fetch(`${supabaseUrl}/rest/v1/content_assets?source_id=eq.${encodeURIComponent(asset.source_id)}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ storage_path: storagePath, public_url: url, original_filename: originalFilename }),
  })
  if (!response.ok) throw new Error(`Could not update content_assets for ${asset.source_id}: ${await response.text()}`)
}

async function patchDocument(id, data) {
  const response = await fetch(`${supabaseUrl}/rest/v1/content_documents?id=eq.${encodeURIComponent(id)}`, {
    method: 'PATCH',
    headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify({ data }),
  })
  if (!response.ok) throw new Error(`Could not update content_documents ${id}: ${await response.text()}`)
}

function buildPath(asset, owner, extension) {
  const type = owner?.content_type || asset.source_type
  const slug = cleanSegment(owner?.slug || asset.original_filename?.replace(/\.[^.]+$/, '') || asset.source_id)
  const folder = type === 'teamMember' ? 'team' : type === 'blogPost' ? 'blog' : type === 'workshop' ? 'workshops' : type === 'resource' ? 'resources' : 'site'
  const suffix = asset.source_type === 'file' ? '' : type === 'teamMember' ? '-portrait' : '-image'
  return `${folder}/${slug}${suffix}${extension}`
}

function friendlyFilename(plan) {
  return plan.nextPath.split('/').pop()
}

function uniquePath(candidate, used) {
  const extension = path.extname(candidate)
  const stem = candidate.slice(0, -extension.length)
  let result = candidate
  let index = 2
  while (used.has(result)) result = `${stem}-${index++}${extension}`
  used.add(result)
  return result
}

function extensionFor(filename) {
  const extension = path.extname(filename || '').toLowerCase()
  return extension || '.bin'
}

function cleanSegment(value) {
  return String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 90) || 'asset'
}

function containsUrl(value, url) {
  if (typeof value === 'string') return value === url || value.includes(url)
  if (Array.isArray(value)) return value.some((item) => containsUrl(item, url))
  if (value && typeof value === 'object') return Object.values(value).some((item) => containsUrl(item, url))
  return false
}

function replaceUrl(value, oldUrl, nextUrl) {
  if (typeof value === 'string') return value.split(oldUrl).join(nextUrl)
  if (Array.isArray(value)) return value.map((item) => replaceUrl(item, oldUrl, nextUrl))
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, replaceUrl(item, oldUrl, nextUrl)]))
  return value
}

'use client'

import { Resource } from '@/lib/content'
import { urlFor } from '@/lib/content'
import Image from 'next/image'
import GatedDownloadButton from './GatedDownloadButton'

const forcedGatedResourceMarkers = [
  'sc thought record form',
  'reframing anxious thoughts',
  'pause method - emotional de-escalation',
  'emotional regulation guide',
]

function normalizeForMatch(value?: string) {
  return (value || '').toLowerCase().replace(/\s+/g, ' ').trim()
}

function isForcedGatedResource(resource: Resource) {
  const title = normalizeForMatch(resource.title)
  const originalFilename = normalizeForMatch(resource.pdfFile?.asset?.originalFilename)
  const imageAlt = normalizeForMatch(resource.previewImage?.alt)

  return forcedGatedResourceMarkers.some(
    (marker) =>
      title.includes(marker) || originalFilename.includes(marker) || imageAlt.includes(marker)
  )
}

function getResourceImageAlt(resource: Resource) {
  const trimmedAlt = resource.previewImage?.alt?.trim()
  return trimmedAlt || `${resource.title} resource preview`
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

interface ResourceCardProps {
  resource: Resource
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const isGated = Boolean(resource.requiresEmailGate || isForcedGatedResource(resource))

  return (
    <article className="group h-full overflow-hidden rounded-2xl bg-white ring-1 ring-charcoal/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-clay/30">
      {resource.previewImage?.asset && (
        <div className="w-full">
          <Image
            src={urlFor(resource.previewImage).width(600).height(450).auto().url()}
            alt={getResourceImageAlt(resource)}
            width={600}
            height={450}
            className="h-auto w-full"
            quality={85}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {!resource.previewImage?.asset && resource.pdfFile?.asset?.url && (
        <div className="relative flex h-56 items-center justify-center overflow-hidden bg-gradient-to-br from-sand to-cream">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-clay/20 to-clay/10">
              <svg className="h-8 w-8 text-clay" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-charcoal">PDF Document</span>
            {resource.pdfFile?.asset?.size && (
              <div className="mt-1 text-xs text-charcoal/60">
                {formatFileSize(resource.pdfFile.asset.size)}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="p-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {resource.category && (
            <span className="rounded-full border border-sand/50 bg-sand/50 px-2.5 py-1 text-xs font-medium text-charcoal">
              {resource.category}
            </span>
          )}
          {isGated && (
            <span className="rounded-full bg-bark px-2.5 py-1 text-xs font-medium text-cream">
              Email required
            </span>
          )}
          {resource.pdfFile?.asset?.size && (
            <span className="rounded-full bg-charcoal/5 px-2.5 py-1 text-xs font-medium text-charcoal/70">
              {formatFileSize(resource.pdfFile.asset.size)}
            </span>
          )}
        </div>

        <h3 className="mb-3 font-heading text-lg font-semibold leading-tight text-charcoal">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-charcoal/80">
            {resource.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-clay to-bark shadow-md">
              <span className="text-xs font-bold text-cream">SC</span>
            </div>
            <div>
              <p className="text-xs font-medium text-charcoal">Soul Care Counselling</p>
              <p className="text-xs text-charcoal/60">Professional Resources</p>
            </div>
          </div>

          {resource.pdfFile?.asset?.url && (
            <GatedDownloadButton
              requiresEmailGate={isGated}
              downloadUrl={resource.pdfFile.asset.url}
              fileName={resource.pdfFile.asset.originalFilename}
              resourceTitle={resource.title}
              resourceSlug={resource.slug.current}
              className="inline-flex items-center rounded-lg bg-clay px-3 py-2 text-sm font-semibold text-cream shadow-md transition-all duration-300 hover:scale-105 hover:bg-bark hover:shadow-lg"
            />
          )}
        </div>
      </div>
    </article>
  )
}

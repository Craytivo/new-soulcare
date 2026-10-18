'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Resource } from '@/lib/content'
import GatedDownloadButton from './GatedDownloadButton'
import { urlFor } from '@/lib/content'
import Image from 'next/image'

const categories = [
  'All Resources',
  'Worksheets',
  'Guides',
  'Assessment Tools',
  'Self-Care',
  'Trauma Resources',
  'Spiritual Care',
]

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

// Inline ResourceCard component with enhanced design
function InlineResourceCard({ resource }: { resource: Resource }) {
  const isGated = Boolean(resource.requiresEmailGate || isForcedGatedResource(resource))
  const downloadUrl = resource.pdfFile?.asset?.url

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-charcoal/10 bg-white transition-colors focus-within:border-clay/50 hover:border-clay/40">
      {/* Image Container with Badges */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-sand/30">
        {resource.previewImage?.asset ? (
          <>
            <Image
              src={urlFor(resource.previewImage).width(600).height(450).auto().url()}
              alt={getResourceImageAlt(resource)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              loading="lazy"
            />
            {/* Gradient overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-100 md:from-charcoal/20 md:opacity-0" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sand to-cream">
            <div className="px-4 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-clay/20 to-clay/10 md:mb-3 md:h-16 md:w-16 md:rounded-xl">
                <svg
                  className="h-6 w-6 text-clay md:h-8 md:w-8"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <span className="text-xs font-semibold text-charcoal md:text-sm">PDF</span>
              {resource.pdfFile?.asset?.size && (
                <div className="mt-0.5 text-[10px] text-charcoal/60 md:mt-1 md:text-xs">
                  {formatFileSize(resource.pdfFile.asset.size)}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Top-left badges overlay */}
        <div className="absolute left-2 top-2 flex flex-wrap gap-1 md:left-3 md:top-3 md:gap-1.5">
          {resource.category && (
            <span className="rounded bg-white/95 px-1.5 py-0.5 text-[10px] font-medium text-charcoal shadow-sm ring-1 ring-charcoal/10 backdrop-blur-sm md:px-2 md:py-1 md:text-xs">
              {resource.category}
            </span>
          )}
          {!isGated && (
            <span className="flex items-center gap-0.5 rounded bg-clay/95 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm backdrop-blur-sm md:gap-1 md:px-2 md:py-1 md:text-xs">
              <svg
                className="h-2.5 w-2.5 md:h-3 md:w-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              Free
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-grow flex-col p-5">
        <h3 className="mb-2 line-clamp-2 font-heading text-lg font-semibold leading-tight text-bark transition-colors duration-200 group-hover:text-clay">
          {resource.title}
        </h3>

        {resource.description && (
          <p className="mb-4 line-clamp-3 flex-grow text-sm leading-6 text-charcoal/70">
            {resource.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-3 border-t border-charcoal/10 pt-4">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center bg-sand">
              <span className="text-[10px] font-bold text-bark">SC</span>
            </div>
            {resource.pdfFile?.asset?.size && (
              <span className="flex items-center gap-1 text-xs text-charcoal/50">
                <svg
                  className="h-2.5 w-2.5 md:h-3 md:w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {formatFileSize(resource.pdfFile.asset.size)}
              </span>
            )}
          </div>

          {downloadUrl ? (
            <GatedDownloadButton
              requiresEmailGate={isGated}
              downloadUrl={downloadUrl}
              fileName={resource.pdfFile.asset.originalFilename}
              resourceTitle={resource.title}
              resourceSlug={resource.slug.current}
              className="inline-flex min-h-10 shrink-0 items-center bg-clay px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-bark sm:text-sm"
            />
          ) : (
            <span className="max-w-28 text-right text-xs leading-4 text-charcoal/45">
              File temporarily unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  )
}

interface FeaturedResourceCardProps {
  resource: Resource
}

function FeaturedResourceCard({ resource }: FeaturedResourceCardProps) {
  const isGated = Boolean(resource.requiresEmailGate || isForcedGatedResource(resource))
  const downloadUrl = resource.pdfFile?.asset?.url

  return (
    <div className="group overflow-hidden border border-charcoal/10 bg-white transition-colors hover:border-clay/40">
      <div className="md:grid md:grid-cols-2 md:gap-0">
        {resource.previewImage?.asset && (
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-sand/30 md:aspect-[4/3]">
            <Image
              src={urlFor(resource.previewImage).width(800).height(600).auto().url()}
              alt={getResourceImageAlt(resource)}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
              quality={90}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent md:from-charcoal/30" />
            {/* Featured Badge */}
            <div className="absolute left-3 top-3 md:left-4 md:top-4">
              <span className="inline-flex items-center gap-1 rounded bg-clay px-2 py-1 text-xs font-semibold text-white shadow-md md:px-3 md:py-1.5 md:text-sm md:shadow-lg">
                <svg className="h-3 w-3 md:h-4 md:w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Featured
              </span>
            </div>
            {/* Category & Free badges */}
            <div className="absolute right-3 top-3 flex flex-col items-end gap-1.5 md:right-4 md:top-4 md:gap-2">
              {resource.category && (
                <span className="rounded bg-white/95 px-2 py-0.5 text-[10px] font-medium text-charcoal shadow-sm ring-1 ring-charcoal/10 backdrop-blur-sm md:px-2.5 md:py-1 md:text-xs">
                  {resource.category}
                </span>
              )}
              {!isGated && (
                <span className="inline-flex items-center gap-1 rounded bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-clay shadow-sm ring-1 ring-charcoal/10 backdrop-blur-sm md:px-2.5 md:py-1 md:text-xs">
                  <svg
                    className="h-2.5 w-2.5 md:h-3 md:w-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  Free
                </span>
              )}
            </div>
          </div>
        )}
        {!resource.previewImage?.asset && resource.pdfFile?.asset?.url && (
          <div className="relative flex h-80 items-center justify-center overflow-hidden bg-gradient-to-br from-sand to-cream md:aspect-[4/3] md:h-auto">
            <div className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-clay/20 to-clay/10">
                <svg className="h-12 w-12 text-clay" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <span className="text-lg font-semibold text-charcoal">PDF Document</span>
              {resource.pdfFile?.asset?.size && (
                <div className="mt-2 text-sm text-charcoal/60">
                  {formatFileSize(resource.pdfFile.asset.size)}
                </div>
              )}
            </div>
          </div>
        )}
        <div
          className={`p-5 sm:p-6 md:p-8 ${!resource.previewImage?.asset ? 'md:col-span-2' : ''}`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 md:mb-3">
            {isGated && (
              <span className="rounded-full bg-bark px-2 py-0.5 text-[10px] font-medium text-cream md:px-3 md:py-1 md:text-xs">
                Email required
              </span>
            )}
            {resource.pdfFile?.asset?.size && (
              <span className="flex items-center gap-1 rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] font-medium text-charcoal/60 md:px-3 md:py-1 md:text-xs">
                <svg
                  className="h-2.5 w-2.5 md:h-3 md:w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {formatFileSize(resource.pdfFile.asset.size)}
              </span>
            )}
          </div>

          <h3 className="mb-2 font-heading text-lg font-bold leading-tight text-charcoal transition-colors duration-200 group-hover:text-clay md:mb-3 md:text-2xl">
            {resource.title}
          </h3>

          {resource.description && (
            <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-charcoal/75 md:mb-6 md:line-clamp-3 md:text-base">
              {resource.description}
            </p>
          )}

          <div className="flex flex-col justify-between gap-3 border-t border-charcoal/5 pt-3 sm:flex-row sm:items-center md:pt-4">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-clay to-bark shadow-sm md:h-10 md:w-10 md:shadow-md">
                <span className="text-[10px] font-bold text-cream md:text-xs">SC</span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-charcoal md:text-sm">
                  Soul Care Counselling
                </p>
                <p className="text-[10px] text-charcoal/50 md:text-xs">Professional Resources</p>
              </div>
            </div>

            {downloadUrl ? (
              <GatedDownloadButton
                requiresEmailGate={isGated}
                downloadUrl={downloadUrl}
                fileName={resource.pdfFile.asset.originalFilename}
                resourceTitle={resource.title}
                resourceSlug={resource.slug.current}
                className="inline-flex min-h-11 w-full items-center justify-center bg-clay px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-bark sm:w-auto"
              />
            ) : (
              <span className="text-xs text-charcoal/45">File temporarily unavailable</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ResourcesClientProps {
  allResources: Resource[]
  featuredResources: Resource[]
}

export default function ResourcesClient({ allResources, featuredResources }: ResourcesClientProps) {
  const [selectedCategory, setSelectedCategory] = useState('All Resources')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredResources = useMemo(() => {
    let filtered = allResources

    // Filter by category (case-insensitive)
    if (selectedCategory !== 'All Resources') {
      filtered = filtered.filter((resource) => {
        const resourceCategory = resource.category?.toLowerCase().trim()
        const selectedCategoryLower = selectedCategory.toLowerCase().trim()
        return resourceCategory === selectedCategoryLower
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description?.toLowerCase().includes(query) ||
          resource.category?.toLowerCase().includes(query) ||
          resource.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [allResources, selectedCategory, searchQuery])

  const filteredFeaturedResources = useMemo(() => {
    let filtered = featuredResources

    // Filter by category (case-insensitive and partial match)
    if (selectedCategory !== 'All Resources') {
      filtered = filtered.filter((resource) => {
        const resourceCategory = resource.category?.toLowerCase().trim()
        const selectedCategoryLower = selectedCategory.toLowerCase().trim()

        // Exact match or partial match
        return (
          resourceCategory === selectedCategoryLower ||
          resourceCategory?.includes(selectedCategoryLower) ||
          selectedCategoryLower.includes(resourceCategory)
        )
      })
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description?.toLowerCase().includes(query) ||
          resource.category?.toLowerCase().includes(query) ||
          resource.tags?.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [featuredResources, selectedCategory, searchQuery])

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  return (
    <>
      {/* Search and Filter Header */}
      <section className="border-y border-charcoal/10 bg-cream py-4">
        {/* Search Bar */}
        <div className="mb-3 md:mb-4">
          <div className="relative max-w-2xl">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-4 w-4 text-charcoal/40 md:h-5 md:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              aria-label="Search resources"
              placeholder="Search resources..."
              className="w-full border border-charcoal/20 bg-white py-2.5 pl-9 pr-10 text-sm text-charcoal placeholder-charcoal/40 transition-all duration-200 focus:border-clay/50 focus:outline-none focus:ring-2 focus:ring-clay/50 md:py-3 md:text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                aria-label="Clear search"
              >
                <svg
                  className="h-4 w-4 text-charcoal/40 transition-colors hover:text-charcoal/60 md:h-5 md:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter - Horizontal scroll on mobile */}
        <div className="relative">
          <div className="scrollbar-hide -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 md:-mx-10 md:px-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`flex-shrink-0 whitespace-nowrap border px-3 py-1.5 text-xs font-medium transition-all duration-150 md:px-4 md:py-2 md:text-sm ${
                  category === selectedCategory
                    ? 'border-charcoal bg-charcoal text-white hover:bg-bark'
                    : 'border-charcoal/10 bg-white text-charcoal/80 hover:border-clay/40 hover:bg-sand/50 hover:text-charcoal'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
          {/* Fade indicators for scroll */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-cream/95 to-transparent md:hidden" />
        </div>

        {/* Results Counter */}
        <div className="mt-2 flex items-center justify-between md:mt-3">
          <p className="text-xs text-charcoal/70 md:text-sm">
            {searchQuery &&
              `Found ${filteredResources.length} result${filteredResources.length !== 1 ? 's' : ''}`}
            {!searchQuery &&
              selectedCategory === 'All Resources' &&
              `${allResources.length} resources`}
            {!searchQuery &&
              selectedCategory !== 'All Resources' &&
              `${filteredResources.length} ${selectedCategory.toLowerCase()}`}
          </p>
          {(searchQuery || selectedCategory !== 'All Resources') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All Resources')
              }}
              className="text-xs text-clay transition-colors hover:text-clay/80 md:text-sm"
            >
              Clear
            </button>
          )}
        </div>
      </section>

      {allResources.length === 0 ? (
        <section className="mt-16">
          <div className="py-16 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-sand">
              <svg
                className="h-10 w-10 text-charcoal/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-charcoal">No resources yet</h3>
            <p className="mx-auto mb-8 max-w-md text-charcoal/70">
              We&apos;re preparing helpful resources to share with you. Check back soon for
              worksheets, guides, and therapeutic materials.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="https://thesoulcarecounsellor.janeapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-lg bg-clay px-6 py-3 font-semibold text-cream shadow-lg transition-all duration-300 hover:bg-bark hover:shadow-xl"
              >
                Book a Free Consultation
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-full bg-white px-6 py-3 font-semibold text-charcoal ring-1 ring-charcoal/10 transition-all duration-300 hover:bg-sand/50 hover:ring-clay/30"
              >
                Contact Our Team
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <>
          {/* Featured Resources */}
          {filteredFeaturedResources.length > 0 && (
            <section className="mt-8 md:mt-12">
              <div className="mb-4 flex items-center justify-between md:mb-8">
                <h2 className="font-heading text-xl font-semibold text-bark md:text-3xl">
                  {selectedCategory === 'All Resources'
                    ? 'Featured'
                    : `Featured ${selectedCategory}`}
                </h2>
                <div className="flex items-center gap-1.5 text-clay">
                  <svg className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-sm font-medium md:text-base">Featured</span>
                </div>
              </div>
              <div className="space-y-6 md:space-y-8">
                {filteredFeaturedResources.map((resource) => (
                  <FeaturedResourceCard key={resource._id} resource={resource} />
                ))}
              </div>
            </section>
          )}

          {/* All Resources Grid */}
          <section className="mt-10 md:mt-16">
            <h2 className="mb-4 font-heading text-xl font-bold text-charcoal md:mb-8 md:text-3xl">
              {selectedCategory === 'All Resources' ? 'All Resources' : `All ${selectedCategory}`}
            </h2>
            {filteredResources.filter((resource) => !resource.isFeatured).length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 lg:gap-8">
                {filteredResources
                  .filter((resource) => !resource.isFeatured)
                  .map((resource) => (
                    <InlineResourceCard key={resource._id} resource={resource} />
                  ))}
              </div>
            ) : (
              <div className="py-8 text-center md:py-12">
                <p className="text-sm text-charcoal/70 md:text-base">
                  No {selectedCategory.toLowerCase()} available yet. Check back soon!
                </p>
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}

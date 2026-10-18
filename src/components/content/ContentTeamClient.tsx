'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowRight,
  Check,
  ChevronDown,
  MapPin,
  Search,
  SlidersHorizontal,
  Users,
  Video,
  X,
} from 'lucide-react'
import { extractBioText } from '@/lib/portable-text'
import { urlFor } from '@/lib/content'
import { getLocalTeamImage } from '@/lib/team-images'
import type { TeamMember } from '@/lib/content'

interface TeamFilter {
  key: string
  label: string
  count: number
}

type SortOption = 'recommended' | 'name'

const MATCHING_NEEDS = [
  {
    key: 'anxiety-stress',
    label: 'Anxiety & stress',
    description: 'Find support for worry, overwhelm, and emotional regulation.',
    terms: ['anxiety', 'stress'],
  },
  {
    key: 'relationships',
    label: 'Relationships',
    description: 'Support for connection, communication, and family life.',
    terms: ['relationship', 'couples', 'family'],
  },
  {
    key: 'trauma',
    label: 'Trauma & healing',
    description: 'Trauma-informed care for experiences that still feel present.',
    terms: ['trauma', 'spiritual abuse'],
  },
  {
    key: 'transitions',
    label: 'Grief & life transitions',
    description: 'Care for change, loss, identity, and starting again.',
    terms: ['grief', 'life transition', 'depression'],
  },
  {
    key: 'youth',
    label: 'Youth & family support',
    description: 'A thoughtful fit for young people and their families.',
    terms: ['youth', 'family'],
  },
  {
    key: 'affordable',
    label: 'Affordable therapy',
    description: 'Explore lower-cost counselling options where available.',
    terms: ['affordable therapy'],
  },
] as const

function uniqueLabels(
  teamMembers: TeamMember[],
  field: 'clientTypes' | 'languages' | 'sessionFormats'
) {
  return Array.from(
    new Set(
      teamMembers
        .flatMap((member) => member[field] ?? [])
        .map((value) => value.trim())
        .filter(Boolean)
    )
  ).sort((a, b) => a.localeCompare(b))
}

const ALL_FILTER: TeamFilter = {
  key: 'all',
  label: 'All clinicians',
  count: 0,
}

const PRIORITY_SPECIALTIES = [
  'Anxiety',
  'Depression',
  'Trauma',
  'Couples',
  'Youth',
  'Family',
  "Women's mental health",
  "Men's mental health",
  'Stress management',
  'Postpartum Mental Health',
  'Affordable therapy',
  'Bilingual',
]

const normalize = (value: string) =>
  value
    .replace(/[â€™â€˜â€›`Â´]/g, "'")
    .normalize('NFKD')
    .replace(/[’‘`´]/g, "'")
    .replace(/[–—]/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

function getFilters(teamMembers: TeamMember[]): TeamFilter[] {
  const specialtyMap = new Map<string, TeamFilter>()

  teamMembers.forEach((member) => {
    member.specialties?.forEach((specialty) => {
      const label = specialty.trim()
      if (!label) return

      const key = normalize(label)
      const existing = specialtyMap.get(key)

      specialtyMap.set(key, {
        key,
        label: existing?.label ?? label,
        count: (existing?.count ?? 0) + 1,
      })
    })
  })

  const priority = new Map(
    PRIORITY_SPECIALTIES.map((specialty, index) => [normalize(specialty), index])
  )

  return [
    { ...ALL_FILTER, count: teamMembers.length },
    ...Array.from(specialtyMap.values()).sort((a, b) => {
      const priorityA = priority.get(a.key) ?? Number.POSITIVE_INFINITY
      const priorityB = priority.get(b.key) ?? Number.POSITIVE_INFINITY

      if (priorityA !== priorityB) return priorityA - priorityB
      if (b.count !== a.count) return b.count - a.count

      return a.label.localeCompare(b.label)
    }),
  ]
}

function getImageUrl(member: TeamMember, featured = false) {
  const localImage = getLocalTeamImage(member)
  if (localImage) return localImage
  if (!member.image) return '/assets/img/team/placeholder.webp'

  try {
    return featured
      ? urlFor(member.image).width(720).fit('max').url()
      : urlFor(member.image).width(160).height(160).fit('max').url()
  } catch {
    return '/assets/img/team/placeholder.webp'
  }
}

function getBestFitFor(member: TeamMember) {
  if (member.bestFitFor?.trim()) return member.bestFitFor.trim()
  if (member.areasOfFocus?.length) {
    return `Support for ${member.areasOfFocus.slice(0, 3).join(', ')}.`
  }
  const bio = extractBioText(member.bio).trim()
  return bio ? `${bio.split(/(?<=[.!?])\s+/)[0]}` : 'A thoughtful, collaborative approach to care.'
}

function getMemberMeta(member: TeamMember) {
  const format = member.sessionFormats?.[0] ?? (member.virtualAvailable ? 'Virtual' : null)
  const clientType = member.clientTypes?.[0] ?? 'Individuals'
  return [
    format,
    clientType,
    member.acceptsBookings ? 'Accepting clients' : 'Currently full',
  ].filter(Boolean)
}

function isOperationsMember(member: TeamMember) {
  return (
    `${member.name} ${member.role} ${member.slug.current}`.toLowerCase().includes('davene') ||
    normalize(member.role).includes('operations')
  )
}

function memberSearchText(member: TeamMember) {
  return normalize(
    [
      member.name,
      member.credentials,
      member.role,
      extractBioText(member.bio),
      ...(member.specialties ?? []),
      ...(member.areasOfFocus ?? []),
      ...(member.clientTypes ?? []),
      ...(member.languages ?? []),
      ...(member.sessionFormats ?? []),
      ...(member.approaches ?? []),
      member.bestFitFor,
    ]
      .filter(Boolean)
      .join(' ')
  )
}

function FilterSelect({
  label,
  icon,
  value,
  onChange,
  options,
}: {
  label: string
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  options: string[]
}) {
  return (
    <label className="relative block">
      <span className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
        {icon}
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={options.length === 0}
        className="h-12 w-full appearance-none border border-charcoal/15 bg-white px-4 pr-10 text-sm font-semibold text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25 disabled:cursor-not-allowed disabled:text-charcoal/40"
      >
        <option value="all">All {label.toLowerCase()}s</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute bottom-4 right-3 h-4 w-4 text-charcoal/45" />
    </label>
  )
}

export default function ContentTeamClient({
  teamMembers,
  featured = false,
}: {
  teamMembers: TeamMember[]
  featured?: boolean
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('all')
  const [clientType, setClientType] = useState('all')
  const [format, setFormat] = useState('all')
  const [acceptingOnly, setAcceptingOnly] = useState(false)
  const [sortOrder, setSortOrder] = useState<SortOption>('recommended')
  const [guidedNeed, setGuidedNeed] = useState('all')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)

  const clinicalMembers = useMemo(
    () => teamMembers.filter((member) => !isOperationsMember(member)),
    [teamMembers]
  )
  const operationsMembers = useMemo(
    () => teamMembers.filter((member) => isOperationsMember(member)),
    [teamMembers]
  )
  const filters = useMemo(() => getFilters(clinicalMembers), [clinicalMembers])
  const quickFilters = filters.filter((filter) => filter.key !== 'all').slice(0, 8)
  const clientTypes = useMemo(() => uniqueLabels(clinicalMembers, 'clientTypes'), [clinicalMembers])
  const formats = useMemo(() => uniqueLabels(clinicalMembers, 'sessionFormats'), [clinicalMembers])
  const guidedNeedCounts = useMemo(
    () =>
      new Map(
        MATCHING_NEEDS.map((need) => [
          need.key,
          clinicalMembers.filter((member) => {
            const text = memberSearchText(member)
            return need.terms.some((term) => text.includes(normalize(term)))
          }).length,
        ])
      ),
    [clinicalMembers]
  )

  const filteredMembers = useMemo(() => {
    const searchTerms = normalize(searchQuery).split(' ').filter(Boolean)
    const selectedNeed = MATCHING_NEEDS.find((need) => need.key === guidedNeed)

    return clinicalMembers.filter((member) => {
      const searchableText = memberSearchText(member)

      const matchesSearch = searchTerms.every((term) => searchableText.includes(term))

      const matchesFilter =
        activeFilter === 'all' ||
        member.specialties?.some((specialty) => normalize(specialty) === activeFilter)

      const matchesClientType =
        clientType === 'all' ||
        member.clientTypes?.some((value) => normalize(value) === normalize(clientType))
      const matchesFormat =
        format === 'all' ||
        member.sessionFormats?.some((value) => normalize(value) === normalize(format))
      const matchesAvailability = !acceptingOnly || member.acceptsBookings
      const matchesGuidedNeed =
        !selectedNeed || selectedNeed.terms.some((term) => searchableText.includes(normalize(term)))

      return (
        matchesSearch &&
        matchesFilter &&
        matchesClientType &&
        matchesFormat &&
        matchesAvailability &&
        matchesGuidedNeed
      )
    })
  }, [clinicalMembers, searchQuery, activeFilter, clientType, format, acceptingOnly, guidedNeed])

  const sortedMembers = useMemo(() => {
    if (sortOrder === 'name')
      return [...filteredMembers].sort((a, b) => a.name.localeCompare(b.name))

    const sourceOrder = new Map(clinicalMembers.map((member, index) => [member._id, index]))
    const priority = (member: TeamMember) => {
      const identity = `${member.name} ${member.slug.current}`.toLowerCase()
      if (identity.includes('jessica')) return 0
      if (identity.includes('nigel')) return 1
      return 2
    }

    return [...filteredMembers].sort((a, b) => {
      const priorityDifference = priority(a) - priority(b)
      if (priorityDifference !== 0) return priorityDifference
      return (sourceOrder.get(a._id) ?? 0) - (sourceOrder.get(b._id) ?? 0)
    })
  }, [filteredMembers, sortOrder, clinicalMembers])

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeFilter !== 'all' ||
    clientType !== 'all' ||
    format !== 'all' ||
    acceptingOnly ||
    guidedNeed !== 'all'

  const resetFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
    setClientType('all')
    setFormat('all')
    setAcceptingOnly(false)
    setGuidedNeed('all')
    setExpandedMemberId(null)
  }

  const activeFilterChips = [
    guidedNeed !== 'all'
      ? {
          key: 'guidedNeed',
          label: MATCHING_NEEDS.find((need) => need.key === guidedNeed)?.label ?? 'Guided match',
          clear: () => setGuidedNeed('all'),
        }
      : null,
    activeFilter !== 'all'
      ? {
          key: 'specialty',
          label: filters.find((filter) => filter.key === activeFilter)?.label ?? 'Specialty',
          clear: () => setActiveFilter('all'),
        }
      : null,
    clientType !== 'all'
      ? { key: 'clientType', label: clientType, clear: () => setClientType('all') }
      : null,
    format !== 'all' ? { key: 'format', label: format, clear: () => setFormat('all') } : null,
    acceptingOnly
      ? { key: 'availability', label: 'Accepting clients', clear: () => setAcceptingOnly(false) }
      : null,
  ].filter(Boolean) as Array<{ key: string; label: string; clear: () => void }>

  return (
    <section id="team" data-featured={featured ? 'true' : 'false'} className="mt-14 md:mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              Our Team
            </span>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-bark md:text-3xl">
              Warm, culturally responsive clinicians
            </h2>
            <p className="mt-3 text-charcoal/80">
              Faith-informed and evidence-based care. Filter by focus area to find the right support
              more quickly.
            </p>
          </header>

          <div className="inline-flex items-center gap-2 self-start border border-charcoal/10 bg-white px-4 py-2 text-sm font-semibold text-bark lg:self-auto">
            <span aria-live="polite">{filteredMembers.length}</span>
            <span className="font-normal text-charcoal/60">
              {filteredMembers.length === 1 ? 'clinician available' : 'clinicians available'}
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden border border-charcoal/10 bg-white md:mt-9">
          <div className="bg-charcoal px-5 py-6 text-white sm:px-7">
            <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay/90">
                  Find your fit
                </p>
                <h3 className="mt-1 font-heading text-2xl font-semibold">
                  Start with what you need
                </h3>
              </div>
              <p className="max-w-md text-sm leading-relaxed text-white/65">
                Explore clinicians by focus, client type, and availability.
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-7">
            <div>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-clay">
                    Start with a need
                  </p>
                  <h4 className="mt-1 font-heading text-lg font-semibold text-charcoal">
                    What are you looking for support with?
                  </h4>
                </div>
                <p className="max-w-sm text-xs leading-relaxed text-charcoal/55">
                  Choose the closest fit and we’ll surface clinicians whose experience may align.
                </p>
              </div>
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1" aria-label="Guided care needs">
                <button
                  type="button"
                  onClick={() => setGuidedNeed('all')}
                  aria-pressed={guidedNeed === 'all'}
                  className={`shrink-0 border px-3.5 py-2 text-xs font-semibold transition ${guidedNeed === 'all' ? 'border-charcoal bg-charcoal text-white' : 'border-charcoal/10 bg-white text-charcoal hover:border-clay/50 hover:bg-sand/45'}`}
                >
                  All clinicians{' '}
                  <span className="ml-1 text-[10px] opacity-60">{clinicalMembers.length}</span>
                </button>
                {MATCHING_NEEDS.map((need) => {
                  const count = guidedNeedCounts.get(need.key) ?? 0
                  return (
                    <button
                      key={need.key}
                      type="button"
                      onClick={() => setGuidedNeed(need.key)}
                      disabled={count === 0}
                      aria-pressed={guidedNeed === need.key}
                      className={`shrink-0 border px-3.5 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-35 ${guidedNeed === need.key ? 'border-clay bg-clay/10 text-charcoal ring-1 ring-clay/30' : 'border-charcoal/10 bg-white text-charcoal hover:border-clay/50 hover:bg-sand/45'}`}
                    >
                      {need.label}{' '}
                      <span className="ml-1 text-[10px] text-charcoal/45">{count}</span>
                    </button>
                  )
                })}
              </div>
              {guidedNeed !== 'all' && (
                <p
                  key={guidedNeed}
                  className="team-fade-in mt-3 text-xs leading-relaxed text-charcoal/60"
                >
                  {MATCHING_NEEDS.find((need) => need.key === guidedNeed)?.description}
                </p>
              )}
            </div>

            <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto]">
              <label htmlFor="teamSearch" className="relative block">
                <span className="sr-only">Search clinicians</span>
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
                <input
                  id="teamSearch"
                  type="search"
                  placeholder="Search by name, specialty, or approach"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="h-13 w-full border border-charcoal/15 bg-cream/35 pl-11 pr-10 text-sm text-charcoal outline-none transition placeholder:text-charcoal/45 focus:border-clay focus:bg-white focus:ring-2 focus:ring-clay/25"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/45 hover:bg-sand/70"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </label>
              <label className="relative block min-w-[190px]">
                <span className="sr-only">Sort clinicians</span>
                <select
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value as SortOption)}
                  className="h-13 w-full appearance-none border border-charcoal/15 bg-white px-4 pr-10 text-sm font-semibold text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/25"
                >
                  <option value="recommended">Recommended first</option>
                  <option value="name">Name A–Z</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
              </label>
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal/55">
                Specialty
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Specialty filters">
                {[filters[0], ...quickFilters].map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    onClick={() => setActiveFilter(filter.key)}
                    aria-pressed={activeFilter === filter.key}
                    className={`shrink-0 border border-charcoal/10 px-3.5 py-2 text-xs font-semibold transition ${activeFilter === filter.key ? 'bg-charcoal text-white' : 'bg-white text-charcoal hover:bg-sand'}`}
                  >
                    {filter.label}
                    <span
                      className={`ml-1.5 ${activeFilter === filter.key ? 'text-white/65' : 'text-charcoal/45'}`}
                    >
                      {filter.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-charcoal/10 pt-4">
              <button
                type="button"
                onClick={() => setShowAdvancedFilters((value) => !value)}
                aria-expanded={showAdvancedFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal transition hover:text-clay"
              >
                <SlidersHorizontal className="h-4 w-4 text-clay" /> More filters
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`}
                />
              </button>
              {(clientType !== 'all' || format !== 'all' || acceptingOnly) && (
                <span className="text-xs text-clay">Refined search</span>
              )}
            </div>

            {showAdvancedFilters && (
              <div className="team-fade-in grid gap-5 border-b border-charcoal/10 pb-5 md:grid-cols-3">
                <FilterSelect
                  label="Client type"
                  icon={<Users className="h-4 w-4" />}
                  value={clientType}
                  onChange={setClientType}
                  options={clientTypes}
                />
                <FilterSelect
                  label="Session format"
                  icon={<Video className="h-4 w-4" />}
                  value={format}
                  onChange={setFormat}
                  options={formats}
                />
                <button
                  type="button"
                  onClick={() => setAcceptingOnly((value) => !value)}
                  aria-pressed={acceptingOnly}
                  className={`flex h-12 items-center justify-between border px-4 text-left text-sm font-semibold transition ${acceptingOnly ? 'border-clay bg-clay/10 text-charcoal' : 'border-charcoal/15 bg-white text-charcoal hover:border-clay/50'}`}
                >
                  <span className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-clay" /> Accepting new clients
                  </span>
                  <span
                    className={`h-5 w-5 rounded-full border ${acceptingOnly ? 'border-charcoal bg-charcoal' : 'border-charcoal/20'}`}
                  />
                </button>
              </div>
            )}

            {activeFilterChips.length > 0 && (
              <div
                className="team-fade-in flex flex-wrap items-center gap-2 border-b border-charcoal/10 pb-4"
                aria-label="Active filters"
              >
                <span className="mr-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal/45">
                  Active
                </span>
                {activeFilterChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex items-center gap-1.5 bg-charcoal px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-bark"
                    aria-label={`Remove ${chip.label} filter`}
                  >
                    {chip.label}
                    <X className="h-3 w-3 text-white/65" />
                  </button>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-charcoal/10 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="text-charcoal/65">
                <span className="font-semibold text-charcoal">{filteredMembers.length}</span>{' '}
                {filteredMembers.length === 1 ? 'clinician' : 'clinicians'} match your search
              </p>
              <div className="flex items-center gap-3">
                {hasActiveFilters && <span className="text-xs text-clay">Filters active</span>}
                <button
                  type="button"
                  onClick={resetFilters}
                  disabled={!hasActiveFilters}
                  className="font-semibold text-charcoal underline decoration-charcoal/25 underline-offset-4 transition hover:text-clay disabled:pointer-events-none disabled:opacity-35"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>
        </div>

        {sortedMembers.length > 0 ? (
          <ul
            role="list"
            className="team-grid mt-8 grid auto-rows-fr grid-cols-1 items-stretch gap-5 sm:grid-cols-2 md:mt-10 md:gap-7 xl:grid-cols-3 xl:gap-8"
          >
            {sortedMembers.map((member, index) => {
              const specialties = Array.isArray(member.specialties) ? member.specialties : []
              const areasOfFocus = Array.isArray(member.areasOfFocus) ? member.areasOfFocus : []
              const isExpanded = expandedMemberId === member._id
              const bestFitFor = getBestFitFor(member)
              const languages = Array.isArray(member.languages) ? member.languages : []
              const sessionFormats = Array.isArray(member.sessionFormats)
                ? member.sessionFormats
                : []
              const approaches = Array.isArray(member.approaches) ? member.approaches : []
              const memberMeta = getMemberMeta(member)
              const offersAffordableTherapy = specialties.some(
                (specialty) => normalize(specialty) === 'affordable therapy'
              )
              const operationsMember = isOperationsMember(member)

              return (
                <li
                  key={member._id}
                  className="team-card team-fade-in h-full"
                  style={{ animationDelay: `${Math.min(index, 8) * 55}ms` }}
                >
                  <article
                    className={`group flex h-full min-h-[35rem] flex-col overflow-hidden border border-charcoal/10 bg-white transition-colors duration-200 hover:border-clay/45 ${isExpanded ? 'ring-2 ring-clay/30' : ''}`}
                  >
                    <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-sand">
                      <Image
                        src={getImageUrl(member, true)}
                        alt={member.name}
                        className="h-full w-full object-cover"
                        width={720}
                        height={640}
                        loading="lazy"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 border border-charcoal/10 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal">
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${member.acceptsBookings ? 'bg-emerald-600' : 'bg-charcoal/35'}`}
                        />
                        {operationsMember
                          ? 'Operations team'
                          : member.acceptsBookings
                            ? 'Accepting clients'
                            : 'Currently full'}
                      </div>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col gap-4 p-5 sm:p-6">
                      <div className="min-w-0">
                        <h3 className="line-clamp-2 font-heading text-xl font-semibold leading-tight text-charcoal transition-colors group-hover:text-bark">
                          {member.name}
                        </h3>
                        {member.credentials && (
                          <p className="mt-1 truncate text-sm font-medium text-charcoal/65">
                            {member.credentials}
                          </p>
                        )}
                        <p className="mt-1 line-clamp-2 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                          {member.role}
                        </p>
                        <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-charcoal/55">
                          {memberMeta.map((item, metaIndex) => (
                            <span key={item} className="inline-flex items-center gap-2">
                              <span>{item}</span>
                              {metaIndex < memberMeta.length - 1 && (
                                <span className="text-clay/60">·</span>
                              )}
                            </span>
                          ))}
                        </p>
                        {!member.acceptsBookings && (
                          <span className="mt-2 inline-flex bg-sand/55 px-2.5 py-1 text-[11px] font-semibold text-charcoal/65">
                            Not accepting clients
                          </span>
                        )}
                      </div>

                      {!operationsMember && (
                        <p className="text-charcoal/76 line-clamp-3 min-h-[5.25rem] border-l-2 border-clay/45 pl-3 text-sm leading-relaxed">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
                            Best fit for
                          </span>
                          {bestFitFor}
                        </p>
                      )}

                      {offersAffordableTherapy && (
                        <span className="-mt-2 inline-flex w-fit items-center border border-clay/20 bg-clay/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-bark">
                          Affordable therapy program
                        </span>
                      )}

                      <div>
                        {specialties.length > 0 && (
                          <div className="flex min-h-[3.5rem] flex-wrap content-start gap-1.5">
                            {specialties.slice(0, 3).map((specialty) => (
                              <span
                                key={specialty}
                                className="text-charcoal/72 border border-charcoal/5 bg-cream px-2.5 py-1 text-[11px] font-semibold"
                              >
                                {specialty}
                              </span>
                            ))}
                            {specialties.length > 3 && (
                              <span className="border border-charcoal/10 bg-white px-2.5 py-1 text-xs font-medium text-charcoal/55">
                                +{specialties.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="team-fade-in space-y-3 border-t border-charcoal/10 pt-4 text-sm">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-clay">
                            More about their practice
                          </p>
                          {areasOfFocus.length > 0 && (
                            <div>
                              <p className="font-semibold text-charcoal">Practice focus</p>
                              <p className="mt-1 leading-relaxed text-charcoal/70">
                                {areasOfFocus.join(' · ')}
                              </p>
                            </div>
                          )}
                          <div className="grid gap-2 text-sm text-charcoal/70 sm:grid-cols-2">
                            <p>
                              <span className="font-semibold text-charcoal">Status:</span>{' '}
                              {operationsMember
                                ? 'Operations team'
                                : member.acceptsBookings
                                  ? 'Accepting clients'
                                  : 'Currently full'}
                            </p>
                            {languages.length > 0 && (
                              <p>
                                <span className="font-semibold text-charcoal">Languages:</span>{' '}
                                {languages.join(', ')}
                              </p>
                            )}
                            {sessionFormats.length > 0 && (
                              <p className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-clay" />
                                <span>{sessionFormats.join(' · ')}</span>
                              </p>
                            )}
                            {approaches.length > 0 && (
                              <p className="sm:col-span-2">
                                <span className="font-semibold text-charcoal">Approach:</span>{' '}
                                {approaches.slice(0, 3).join(', ')}
                              </p>
                            )}
                          </div>
                          {member.socialLinks && member.socialLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {member.socialLinks.map((socialLink) => (
                                <a
                                  key={`${member._id}-${socialLink.url}`}
                                  href={socialLink.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="border border-charcoal/10 bg-cream px-3 py-1.5 text-xs font-semibold text-bark transition hover:bg-sand"
                                >
                                  {socialLink.label || socialLink.type}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex shrink-0 flex-col gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setExpandedMemberId(isExpanded ? null : member._id)}
                          className="inline-flex w-full items-center justify-center border border-charcoal/15 px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:border-clay/40 hover:bg-cream/50"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Hide practice details' : 'See practice details'}
                        </button>
                        <Link
                          href={`/about/${member.slug.current}`}
                          className="inline-flex w-full items-center justify-between bg-charcoal px-4 py-3 text-sm font-semibold text-white transition hover:bg-bark focus:outline-none focus:ring-2 focus:ring-bark/30 focus:ring-offset-2"
                        >
                          View profile
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </li>
              )
            })}
          </ul>
        ) : (
          <div className="mt-8 border-y border-charcoal/10 bg-white p-8 text-center">
            <h3 className="font-heading text-xl font-semibold text-charcoal">
              No clinicians match those filters
            </h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/70">
              Try a broader specialty or clear the search to see the full team.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex h-10 items-center justify-center rounded-lg bg-charcoal px-4 text-sm font-semibold text-white transition hover:bg-bark"
            >
              Show all clinicians
            </button>
          </div>
        )}

        {operationsMembers.length > 0 && (
          <section
            className="mt-20 border-t border-charcoal/10 pt-10"
            aria-labelledby="operations-heading"
          >
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-clay">
                Leadership & operations
              </p>
              <h3
                id="operations-heading"
                className="mt-2 font-heading text-2xl font-semibold text-charcoal"
              >
                The people behind your care
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                Meet the team members who help make Soul Care welcoming, organized, and connected.
              </p>
            </div>
            <ul role="list" className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {operationsMembers.map((member) => (
                <li key={member._id}>
                  <article className="flex items-center gap-4 border border-charcoal/10 bg-white p-4">
                    <Image
                      src={getImageUrl(member, true)}
                      alt={member.name}
                      width={112}
                      height={112}
                      className="h-24 w-24 shrink-0 object-cover"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <h4 className="font-heading text-lg font-semibold text-charcoal">
                        {member.name}
                      </h4>
                      {member.credentials && (
                        <p className="mt-0.5 text-xs font-medium text-charcoal/60">
                          {member.credentials}
                        </p>
                      )}
                      <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
                        {member.role}
                      </p>
                      <Link
                        href={`/about/${member.slug.current}`}
                        className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-bark hover:text-clay"
                      >
                        Meet {member.name.split(' ')[0]} <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  )
}

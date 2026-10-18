'use client'

import { useMemo, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Check, ChevronDown, MapPin, Search, Users, Video, X } from 'lucide-react'
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

function isOperationsMember(member: TeamMember) {
  return (
    `${member.name} ${member.role} ${member.slug.current}`.toLowerCase().includes('davene') ||
    normalize(member.role).includes('operations')
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
        className="h-12 w-full appearance-none rounded-xl border border-charcoal/15 bg-white px-4 pr-10 text-sm font-semibold text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25 disabled:cursor-not-allowed disabled:text-charcoal/40"
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
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null)

  const filters = useMemo(() => getFilters(teamMembers), [teamMembers])
  const quickFilters = filters.filter((filter) => filter.key !== 'all').slice(0, 8)
  const clientTypes = useMemo(() => uniqueLabels(teamMembers, 'clientTypes'), [teamMembers])
  const formats = useMemo(() => uniqueLabels(teamMembers, 'sessionFormats'), [teamMembers])

  const filteredMembers = useMemo(() => {
    const searchTerms = normalize(searchQuery).split(' ').filter(Boolean)

    return teamMembers.filter((member) => {
      const bioText = extractBioText(member.bio)
      const searchableText = normalize(
        [
          member.name,
          member.credentials,
          member.role,
          bioText,
          ...(member.specialties ?? []),
          ...(member.areasOfFocus ?? []),
          ...(member.clientTypes ?? []),
          ...(member.languages ?? []),
          ...(member.sessionFormats ?? []),
          member.bestFitFor,
        ]
          .filter(Boolean)
          .join(' ')
      )

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

      return (
        matchesSearch && matchesFilter && matchesClientType && matchesFormat && matchesAvailability
      )
    })
  }, [teamMembers, searchQuery, activeFilter, clientType, format, acceptingOnly])

  const sortedMembers = useMemo(() => {
    if (sortOrder === 'name')
      return [...filteredMembers].sort((a, b) => a.name.localeCompare(b.name))

    const sourceOrder = new Map(teamMembers.map((member, index) => [member._id, index]))
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
  }, [filteredMembers, sortOrder, teamMembers])

  const hasActiveFilters =
    Boolean(searchQuery) ||
    activeFilter !== 'all' ||
    clientType !== 'all' ||
    format !== 'all' ||
    acceptingOnly

  const resetFilters = () => {
    setSearchQuery('')
    setActiveFilter('all')
    setClientType('all')
    setFormat('all')
    setAcceptingOnly(false)
    setExpandedMemberId(null)
  }

  return (
    <section id="team" data-featured={featured ? 'true' : 'false'} className="mt-14 md:mt-20">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <header className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-sand/70 px-3 py-1 text-[11px] uppercase tracking-[.22em] text-charcoal/80 ring-1 ring-charcoal/10">
              Our Team
            </span>
            <h2 className="mt-3 font-heading text-2xl font-bold text-charcoal md:text-3xl">
              Warm, culturally responsive clinicians
            </h2>
            <p className="mt-3 text-charcoal/80">
              Faith-informed and evidence-based care. Filter by focus area to find the right support
              more quickly.
            </p>
          </header>

          <div className="inline-flex items-center gap-2 self-start rounded-full bg-charcoal px-4 py-2 text-sm font-semibold text-white lg:self-auto">
            <span aria-live="polite">{filteredMembers.length}</span>
            <span className="font-normal text-white/70">
              {filteredMembers.length === 1 ? 'clinician available' : 'clinicians available'}
            </span>
          </div>
        </div>

        <div className="mt-8 overflow-hidden rounded-2xl border border-charcoal/10 bg-white shadow-elevation-2 md:mt-9">
          <div className="bg-[#29251f] px-5 py-6 text-white sm:px-7">
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
                  className="h-13 w-full rounded-xl border border-charcoal/15 bg-cream/35 pl-11 pr-10 text-sm text-charcoal outline-none transition placeholder:text-charcoal/45 focus:border-clay focus:bg-white focus:ring-2 focus:ring-clay/25"
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
                  className="h-13 w-full appearance-none rounded-xl border border-charcoal/15 bg-white px-4 pr-10 text-sm font-semibold text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/25"
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
                    className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-semibold transition ${activeFilter === filter.key ? 'bg-charcoal text-white' : 'bg-cream text-charcoal hover:bg-sand'}`}
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

            <div className="grid gap-5 border-t border-charcoal/10 pt-5 md:grid-cols-3">
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
                className={`flex h-12 items-center justify-between rounded-xl border px-4 text-left text-sm font-semibold transition ${acceptingOnly ? 'border-clay bg-clay/10 text-charcoal' : 'border-charcoal/15 bg-white text-charcoal hover:border-clay/50'}`}
              >
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-clay" /> Accepting new clients
                </span>
                <span
                  className={`h-5 w-5 rounded-full border ${acceptingOnly ? 'border-charcoal bg-charcoal' : 'border-charcoal/20'}`}
                />
              </button>
            </div>

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
            className="team-grid mt-8 grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 md:mt-10 md:gap-7 xl:grid-cols-3 xl:gap-8"
          >
            {sortedMembers.map((member) => {
              const specialties = Array.isArray(member.specialties) ? member.specialties : []
              const areasOfFocus = Array.isArray(member.areasOfFocus) ? member.areasOfFocus : []
              const isExpanded = expandedMemberId === member._id
              const bestFitFor = getBestFitFor(member)
              const languages = Array.isArray(member.languages) ? member.languages : []
              const sessionFormats = Array.isArray(member.sessionFormats)
                ? member.sessionFormats
                : []
              const operationsMember = isOperationsMember(member)

              return (
                <li key={member._id} className="team-card h-full">
                  <article
                    className={`group flex min-h-[35rem] flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition duration-200 shadow-elevation-1 hover:-translate-y-1 hover:border-clay/45 hover:shadow-elevation-3 ${isExpanded ? 'ring-2 ring-clay/30' : ''}`}
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
                      <div className="absolute left-4 top-4 z-10 inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal shadow-md ring-1 ring-charcoal/20">
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
                        {!member.acceptsBookings && (
                          <span className="mt-2 inline-flex rounded-full bg-sand/55 px-2.5 py-1 text-[11px] font-semibold text-charcoal/65">
                            Not accepting clients
                          </span>
                        )}
                      </div>

                      {!operationsMember && (
                        <p className="text-charcoal/76 border-l-2 border-clay/45 pl-3 text-sm leading-relaxed">
                          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.16em] text-clay">
                            Best fit for
                          </span>
                          {bestFitFor}
                        </p>
                      )}

                      <div>
                        {specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {specialties.slice(0, 3).map((specialty) => (
                              <span
                                key={specialty}
                                className="text-charcoal/72 rounded-full bg-cream px-2.5 py-1 text-[11px] font-semibold ring-1 ring-charcoal/5"
                              >
                                {specialty}
                              </span>
                            ))}
                            {specialties.length > 3 && (
                              <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-charcoal/55 ring-1 ring-charcoal/10">
                                +{specialties.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="space-y-3 border-t border-charcoal/10 pt-4 text-sm">
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
                          </div>
                          {member.socialLinks && member.socialLinks.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {member.socialLinks.map((socialLink) => (
                                <a
                                  key={`${member._id}-${socialLink.url}`}
                                  href={socialLink.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-full bg-cream px-3 py-1.5 text-xs font-semibold text-bark transition hover:bg-sand"
                                >
                                  {socialLink.label || socialLink.type}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="mt-auto flex flex-col gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setExpandedMemberId(isExpanded ? null : member._id)}
                          className="inline-flex w-full items-center justify-center rounded-xl border border-charcoal/15 px-4 py-2.5 text-sm font-semibold text-charcoal transition hover:border-clay/40 hover:bg-cream/50"
                          aria-expanded={isExpanded}
                        >
                          {isExpanded ? 'Hide practice details' : 'See practice details'}
                        </button>
                        <Link
                          href={`/about/${member.slug.current}`}
                          className="inline-flex w-full items-center justify-between rounded-xl bg-charcoal px-4 py-3 text-sm font-semibold text-white transition hover:bg-bark focus:outline-none focus:ring-2 focus:ring-bark/30 focus:ring-offset-2"
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
          <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white p-8 text-center shadow-elevation-1">
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
      </div>
    </section>
  )
}

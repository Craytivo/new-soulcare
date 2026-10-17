'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react'
import { motion } from 'framer-motion'
import { extractBioText } from '@/lib/portable-text'
import { urlFor } from '@/lib/content'
import type { TeamMember } from '@/lib/content'

interface TeamFilter {
  key: string
  label: string
  count: number
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
  if (!member.image) return '/assets/img/team/placeholder.webp'

  try {
    return featured
      ? urlFor(member.image).width(720).fit('max').url()
      : urlFor(member.image).width(160).height(160).fit('max').url()
  } catch {
    return '/assets/img/team/placeholder.webp'
  }
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

  const filters = useMemo(() => getFilters(teamMembers), [teamMembers])
  const activeFilterOption = filters.find((filter) => filter.key === activeFilter) ?? filters[0]
  const quickFilters = filters.filter((filter) => filter.key !== 'all').slice(0, 6)

  const filteredMembers = useMemo(() => {
    const searchLower = normalize(searchQuery)

    return teamMembers.filter((member) => {
      const bioText = extractBioText(member.bio)
      const searchableValues = [
        member.name,
        member.credentials,
        member.role,
        bioText,
        ...(member.specialties ?? []),
        ...(member.areasOfFocus ?? []),
      ]

      const matchesSearch =
        !searchLower ||
        searchableValues.some((value) => value && normalize(value).includes(searchLower))

      const matchesFilter =
        activeFilter === 'all' ||
        member.specialties?.some((specialty) => normalize(specialty) === activeFilter)

      return matchesSearch && matchesFilter
    })
  }, [teamMembers, searchQuery, activeFilter])

  const hasActiveFilters = Boolean(searchQuery) || activeFilter !== 'all'

  return (
    <section id="team" className="mt-14 md:mt-20">
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

          <div className="flex items-center gap-3 text-sm text-charcoal/70">
            <span className="font-semibold text-charcoal">{filteredMembers.length}</span>
            <span>{filteredMembers.length === 1 ? 'clinician' : 'clinicians'} in view</span>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-charcoal/10 bg-white/85 p-4 backdrop-blur shadow-elevation-2 sm:p-5 md:mt-9">
          <div className="grid gap-3 lg:grid-cols-[minmax(260px,1fr)_minmax(260px,340px)_auto] lg:items-center">
            <label htmlFor="teamSearch" className="sr-only">
              Search team
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
              <input
                id="teamSearch"
                type="search"
                placeholder="Search by name, specialty, or approach"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-11 w-full rounded-lg border border-charcoal/15 bg-white pl-9 pr-10 text-sm text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                autoComplete="off"
                aria-label="Search team members by name, specialty, credential, or approach"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-charcoal/45 transition hover:bg-sand/70 hover:text-charcoal"
                  aria-label="Clear team search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <label htmlFor="teamFilter" className="sr-only">
              Filter team by specialty
            </label>
            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
              <select
                id="teamFilter"
                value={activeFilter}
                onChange={(event) => setActiveFilter(event.target.value)}
                className="h-11 w-full appearance-none rounded-lg border border-charcoal/15 bg-white pl-9 pr-10 text-sm font-semibold text-charcoal outline-none transition focus:border-clay focus:ring-2 focus:ring-clay/25"
                aria-label="Filter team by specialty"
              >
                {filters.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label} ({filter.count})
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
            </div>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
              }}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-charcoal/15 px-4 text-sm font-semibold text-charcoal transition hover:border-bark/30 hover:bg-sand/60 disabled:pointer-events-none disabled:opacity-45"
              disabled={!hasActiveFilters}
            >
              Reset
            </button>
          </div>

          <div className="mt-3 flex flex-col gap-3 border-t border-charcoal/10 pt-3 md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 items-center gap-2 text-sm text-charcoal/70">
              <span className="shrink-0 rounded-full bg-cream px-3 py-1 font-semibold text-charcoal ring-1 ring-charcoal/10">
                {activeFilterOption?.label ?? 'All clinicians'}
              </span>
              <span className="truncate">
                {hasActiveFilters
                  ? 'Showing the best matches for your selection'
                  : 'Choose a focus area or search directly'}
              </span>
            </div>

            <div
              className="-mx-2 flex gap-2 overflow-x-auto px-2 py-1 md:max-w-[52%] md:justify-end"
              aria-label="Popular specialty filters"
            >
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                  activeFilter === 'all'
                    ? 'bg-charcoal text-white ring-charcoal'
                    : 'bg-white text-charcoal ring-charcoal/15 hover:bg-sand/60'
                }`}
                aria-pressed={activeFilter === 'all'}
              >
                All
              </button>
              {quickFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  onClick={() => setActiveFilter(filter.key)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition ${
                    activeFilter === filter.key
                      ? 'bg-charcoal text-white ring-charcoal'
                      : 'bg-white text-charcoal ring-charcoal/15 hover:bg-sand/60'
                  }`}
                  aria-pressed={activeFilter === filter.key}
                >
                  {filter.label}
                  <span
                    className={
                      activeFilter === filter.key ? 'ml-1 text-white/70' : 'ml-1 text-charcoal/45'
                    }
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <ul
            role="list"
            className={`stagger-grid mt-8 grid items-stretch gap-5 sm:grid-cols-1 md:mt-10 md:grid-cols-2 md:gap-7 lg:grid-cols-3 ${featured ? 'xl:grid-cols-3 xl:gap-8' : 'xl:grid-cols-4 xl:gap-8'}`}
          >
            {filteredMembers.map((member, index) => {
              const specialties = Array.isArray(member.specialties) ? member.specialties : []

              return (
                <motion.li
                  key={member._id}
                  className="team-card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.18 }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(index * 0.04, 0.24),
                    ease: 'easeOut',
                  }}
                >
                  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-charcoal/10 bg-white transition duration-200 shadow-elevation-1 hover:-translate-y-0.5 hover:border-clay/35 hover:shadow-elevation-3">
                    {featured && (
                      <div className="relative overflow-hidden bg-sand">
                        <Image
                          src={getImageUrl(member, true)}
                          alt={member.name}
                          className="h-auto w-full object-contain"
                          width={720}
                          height={900}
                          loading="lazy"
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        />
                      </div>
                    )}
                    <div className={`flex flex-1 flex-col ${featured ? 'p-6 sm:p-7' : 'p-5'}`}>
                      <div
                        className={featured ? 'flex items-start gap-4' : 'flex items-start gap-4'}
                      >
                        {!featured && (
                          <Image
                            src={getImageUrl(member)}
                            alt={member.name}
                            className="h-16 w-16 flex-shrink-0 rounded-xl bg-sand object-contain ring-1 ring-charcoal/10"
                            width={64}
                            height={64}
                            loading="lazy"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-heading text-base font-semibold leading-tight text-charcoal transition-colors group-hover:text-bark">
                            {member.name}
                          </h3>
                          {member.credentials && (
                            <p className="mt-1 text-sm font-medium text-charcoal/65">
                              {member.credentials}
                            </p>
                          )}
                          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                            {member.role}
                          </p>
                          {!member.acceptsBookings && (
                            <span className="mt-2 inline-flex rounded-full bg-sand/55 px-2.5 py-1 text-[11px] font-semibold text-charcoal/65">
                              Not accepting clients
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-charcoal/76 mt-4 line-clamp-4 text-sm leading-relaxed">
                        {extractBioText(member.bio) || 'Professional bio coming soon.'}
                      </p>

                      {specialties.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-1.5">
                          {specialties.slice(0, 3).map((specialty) => (
                            <span
                              key={specialty}
                              className="text-charcoal/72 rounded-full bg-cream px-2.5 py-1 text-xs font-medium ring-1 ring-charcoal/5"
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

                      <div className="mt-auto pt-5">
                        <Link
                          href={`/about/${member.slug.current}`}
                          className="inline-flex w-full items-center justify-between rounded-lg border border-clay/30 bg-clay/10 px-3.5 py-2.5 text-sm font-semibold text-bark transition hover:border-bark/35 hover:bg-bark/10 focus:outline-none focus:ring-2 focus:ring-bark/30 focus:ring-offset-2"
                        >
                          View profile
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                </motion.li>
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
              onClick={() => {
                setSearchQuery('')
                setActiveFilter('all')
              }}
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

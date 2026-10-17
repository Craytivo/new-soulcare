'use client'

import { useState, useMemo, useEffect } from 'react'
import type { TypedObject } from '@portabletext/types'
import PortableText from '@/components/PortableText'
import Image from 'next/image'
import Link from 'next/link'
import { getTeamMembers } from '@/lib/content-queries'
import { extractBioText } from '@/lib/portable-text'

interface TeamMember {
  _id: string
  name: string
  credentials?: string
  role: string
  image?: {
    asset?: {
      _ref: string
    }
  }
  bio?: TypedObject[] // Portable Text array
  status?: string
  specialties?: string[]
  slug?: { current: string }
}

export default function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  // Removed unused loading state
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [activeFilter, setActiveFilter] = useState<string>('All Team Members')

  useEffect(() => {
    async function fetchData() {
      const data = await getTeamMembers()
      setTeamMembers(data as TeamMember[])
    }
    fetchData()
  }, [])

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member: TeamMember) => {
      const searchLower = searchQuery.toLowerCase()
      // Search bio text if it's an array of blocks (Portable Text)
      const bioText = extractBioText(member.bio)
      const matchesSearch =
        !searchQuery ||
        member.name.toLowerCase().includes(searchLower) ||
        (member.credentials || '').toLowerCase().includes(searchLower) ||
        member.role.toLowerCase().includes(searchLower) ||
        bioText.toLowerCase().includes(searchLower) ||
        (member.specialties || []).some((specialty: string) =>
          specialty.toLowerCase().includes(searchLower)
        )
      const matchesFilter =
        activeFilter === 'All Team Members' ||
        (member.specialties || []).some(
          (s: string) => s.trim().toLowerCase() === activeFilter.trim().toLowerCase()
        )
      return matchesSearch && matchesFilter
    })
  }, [searchQuery, activeFilter, teamMembers])

  // Collect all specialties from team members (case-insensitive, trimmed, but display original)
  const specialtyMap = new Map<string, string>() // normalized -> original
  teamMembers.forEach((member: TeamMember) => {
    ;(member.specialties || []).forEach((spec: string) => {
      const normalized = spec.trim().toLowerCase()
      if (!specialtyMap.has(normalized)) {
        specialtyMap.set(normalized, spec.trim())
      }
    })
  })
  const filters = [
    {
      key: 'All Team Members',
      label: 'All Team Members',
      count: teamMembers.length,
    },
    ...Array.from(specialtyMap.entries()).map(([normalized, original]) => ({
      key: original,
      label: original,
      count: teamMembers.filter((m) =>
        (m.specialties || []).some((s) => s.trim().toLowerCase() === normalized)
      ).length,
    })),
  ]

  return (
    <section className="py-8">
      <header>
        <h2 className="mb-2 text-3xl font-bold text-bark">Meet Our Team</h2>
        <p className="mb-6 text-lg text-charcoal/80">
          Our diverse team of Christian therapists and staff are dedicated to holistic, culturally
          responsive care.
        </p>
      </header>

      {/* Toolbar: dropdown on mobile, tabs on desktop */}
      <div className="sticky top-0 z-10 mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-white/90 py-3 shadow-sm backdrop-blur-md">
        <label htmlFor="teamSearch" className="sr-only">
          Search team
        </label>
        <input
          id="teamSearch"
          type="search"
          placeholder="Search by name, specialty, credential, or approach..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-md border border-charcoal/20 bg-white px-3 py-2 text-sm outline-none ring-0 focus:border-clay sm:w-80"
          autoComplete="off"
          aria-label="Search team members by name, specialty, credential, or approach"
        />
        {/* Dropdown for filters on mobile */}
        <div className="mt-3 block w-full md:hidden">
          <select
            value={activeFilter}
            onChange={(e) => setActiveFilter(e.target.value)}
            className="w-full rounded-md border border-charcoal/20 bg-white px-3 py-2 text-sm font-semibold text-bark focus:border-clay focus:ring-2 focus:ring-clay/40"
            aria-label="Filter team by specialty"
            id="teamFilter"
          >
            {filters.map((filter) => (
              <option key={String(filter.key)} value={String(filter.key)}>
                {String(filter.label)} {filter.count > 0 ? `(${filter.count})` : ''}
              </option>
            ))}
          </select>
        </div>
        {/* Tabs for filters on desktop */}
        <div className="hidden flex-wrap gap-2 md:flex" aria-label="Filter tags">
          {filters.map((filter) => (
            <button
              key={String(filter.key)}
              type="button"
              aria-label={`Filter by ${String(filter.label)}`}
              onClick={() => setActiveFilter(String(filter.key))}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setActiveFilter(String(filter.key))
                }
              }}
              className={`rounded-full border px-4 py-2 text-xs font-semibold shadow-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-bark/40 focus:ring-offset-2 ${
                activeFilter === filter.key
                  ? 'scale-105 border-clay bg-clay text-white ring-2 ring-clay/30 hover:bg-bark'
                  : 'border-charcoal/10 bg-white text-charcoal hover:scale-105 hover:bg-sand/60'
              } `}
              aria-pressed={activeFilter === filter.key}
              style={{ minWidth: 120 }}
            >
              <span className="font-bold tracking-wide text-bark">{String(filter.label)}</span>
              {filter.count > 0 && (
                <span className="ml-2 rounded-full bg-bark/20 px-2 py-0.5 text-[11px] font-semibold text-bark">
                  {filter.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <ul
        role="list"
        className="mt-8 grid items-stretch gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      >
        {filteredMembers.map((member: TeamMember) => (
          <li key={member._id} className="team-card">
            <article className="flex h-full flex-col justify-between rounded-3xl bg-white/95 shadow-xl ring-2 ring-clay/10 transition-all duration-200 hover:-translate-y-1 hover:scale-[1.03] hover:shadow-2xl">
              <div className="p-6 pb-2">
                <div className="mb-3 flex items-center gap-4">
                  <Image
                    src={
                      member.image && member.image.asset
                        ? `/api/content-image?imageId=${member.image.asset._ref}`
                        : '/assets/img/team/placeholder.webp'
                    }
                    alt={member.name}
                    className="h-16 w-16 rounded-full object-cover shadow-md ring-2 ring-clay/30"
                    width={64}
                    height={64}
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-bold leading-tight text-bark drop-shadow-sm">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-clay/80">{member.credentials}</p>
                    <p className="text-xs font-medium text-charcoal/70">{member.role}</p>
                    {member.status && (
                      <p className="mt-1 text-xs font-semibold text-bark/60">{member.status}</p>
                    )}
                  </div>
                </div>
                <div className="mt-2 text-[15px] font-medium leading-relaxed text-charcoal/90">
                  {Array.isArray(member.bio) && member.bio.length > 0 ? (
                    <PortableText value={member.bio as TypedObject[]} />
                  ) : (
                    <span className="italic text-charcoal/60">Professional bio coming soon.</span>
                  )}
                </div>
              </div>
              <div className="team-cta mt-4 px-6 pb-6" style={{ minHeight: '3.5rem' }}>
                <Link
                  href={`/${member.slug?.current || ''}`}
                  className="cta-label block rounded-full bg-clay px-5 py-2 text-center text-base font-bold text-white shadow-md transition-colors duration-150 hover:bg-bark"
                  style={{
                    display: '-webkit-box',
                    WebkitBoxOrient: 'vertical',
                    WebkitLineClamp: 2,
                    overflow: 'hidden',
                  }}
                >
                  View Profile
                </Link>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  )
}

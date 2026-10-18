import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react'
import { getAboutPage, getTeamMembers } from '@/lib/content-queries'
import { urlForImage, type AboutPage, type TeamMember } from '@/lib/content'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import { getLocalTeamImage } from '@/lib/team-images'

function getImagePosition(image: NonNullable<AboutPage['hero']['backgroundImage']>) {
  const hotspot = image.hotspot
  if (hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number') {
    return `${hotspot.x * 100}% ${hotspot.y * 100}%`
  }

  return '50% 22%'
}

function isOperationsMember(member: TeamMember) {
  return /operations|manager|admin/i.test(member.role)
}

function TeamRoster({ members }: { members: TeamMember[] }) {
  const clinicians = members.filter((member) => !isOperationsMember(member))
  const operations = members.filter(isOperationsMember)

  const renderMember = (member: TeamMember) => (
    <li key={member._id} className="border-t border-charcoal/10 py-5 first:border-t-0 first:pt-0">
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-sand">
          <Image
            src={
              getLocalTeamImage(member) ??
              urlForImage(member.image, { width: 112, height: 112, fit: 'crop' }).url()
            }
            alt={member.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <Link
            href={`/about/${member.slug.current}`}
            className="group inline-flex items-center gap-1 font-heading text-lg font-semibold text-bark hover:text-clay"
          >
            {member.name}
            <ArrowUpRight className="h-4 w-4 opacity-0 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
          </Link>
          <p className="mt-1 text-sm text-charcoal/65">
            {[member.credentials, member.role].filter(Boolean).join(' · ')}
          </p>
        </div>
        <span
          className={`hidden shrink-0 text-right text-[0.65rem] font-semibold uppercase tracking-[0.15em] sm:block ${member.acceptsBookings ? 'text-clay' : 'text-charcoal/45'}`}
        >
          {member.acceptsBookings ? 'Accepting clients' : 'By referral or inquiry'}
        </span>
      </div>
      {member.specialties?.length || member.languages?.length || member.sessionFormats?.length ? (
        <details className="group/details mt-4 pl-[4.5rem]">
          <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-clay marker:hidden">
            More about their work
            <ChevronDown className="h-3.5 w-3.5 transition-transform group-open/details:rotate-180" />
          </summary>
          <div className="mt-3 grid gap-3 text-sm leading-6 text-charcoal/70 sm:grid-cols-3">
            {member.specialties?.length ? (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-charcoal/45">
                  Focus
                </p>
                <p>{member.specialties.slice(0, 4).join(', ')}</p>
              </div>
            ) : null}
            {member.languages?.length ? (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-charcoal/45">
                  Languages
                </p>
                <p>{member.languages.join(', ')}</p>
              </div>
            ) : null}
            {member.sessionFormats?.length ? (
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-charcoal/45">
                  Format
                </p>
                <p>{member.sessionFormats.join(', ')}</p>
              </div>
            ) : null}
          </div>
        </details>
      ) : null}
    </li>
  )

  return (
    <section className="sm:py-18 border-y border-charcoal/10 py-14" aria-labelledby="team-heading">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
            The people behind the care
          </p>
          <h2
            id="team-heading"
            className="mt-3 max-w-md font-heading text-3xl font-semibold leading-tight text-bark sm:text-4xl"
          >
            A thoughtful team, never a crowded directory.
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-charcoal/70">
            Get to know the clinicians and people who make Soul Care feel personal from the first
            conversation.
          </p>
        </div>

        <div>
          {clinicians.length > 0 && (
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                Clinical team
              </p>
              <ul>{clinicians.map(renderMember)}</ul>
            </div>
          )}
          {operations.length > 0 && (
            <div className="mt-10 border-t border-charcoal/10 pt-8">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                Operations
              </p>
              <ul>{operations.map(renderMember)}</ul>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default async function ContentAboutPage() {
  const [pageData, teamMembers] = await Promise.all([getAboutPage(), getTeamMembers()])

  if (!pageData) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8">
        <p className="text-charcoal/70">No content available for this page.</p>
      </div>
    )
  }

  const portableTextComponents = {
    block: {
      normal: (props: { children?: React.ReactNode }) => (
        <p className="text-charcoal/78 mb-4 max-w-2xl text-[0.98rem] leading-7">{props.children}</p>
      ),
      h3: (props: { children?: React.ReactNode }) => (
        <h3 className="mb-3 mt-7 font-heading text-xl font-semibold text-bark">{props.children}</h3>
      ),
    },
    list: {
      bullet: (props: { children?: React.ReactNode }) => (
        <ul className="mb-4 space-y-2">{props.children}</ul>
      ),
    },
    listItem: {
      bullet: (props: { children?: React.ReactNode }) => (
        <li className="flex gap-3 text-sm leading-6 text-charcoal/75">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
          <span>{props.children}</span>
        </li>
      ),
    },
  }

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-6 sm:px-8 sm:pb-14 lg:px-12 lg:pt-10">
        <div className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative aspect-[4/3] min-h-72 lg:aspect-auto lg:min-h-[34rem]">
            {pageData.hero.backgroundImage ? (
              <Image
                src={urlForImage(pageData.hero.backgroundImage, {
                  width: 1600,
                  height: 1200,
                  fit: 'crop',
                }).url()}
                alt={pageData.hero.backgroundImage.alt || pageData.hero.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
                style={{ objectPosition: getImagePosition(pageData.hero.backgroundImage) }}
              />
            ) : null}
            <div
              className="absolute inset-0 bg-gradient-to-tr from-charcoal/30 to-transparent"
              aria-hidden="true"
            />
          </div>
          <div className="flex flex-col justify-end p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {pageData.hero.badge}
            </p>
            <h1 className="mt-4 max-w-xl font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {pageData.hero.title}
            </h1>
            <div className="mt-7 flex flex-wrap gap-4">
              <Link
                href="#our-story"
                className="group inline-flex items-center px-1 py-3 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 hover:text-white"
              >
                Begin with our story
                <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-charcoal/75 sm:ml-auto sm:mr-8 sm:max-w-xl sm:text-right">
          {pageData.hero.description}
        </p>
      </section>

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <section
          id="our-story"
          className="sm:py-18 grid gap-8 border-t border-charcoal/10 py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
          aria-labelledby="story-heading"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              01 · Our story
            </p>
            <h2
              id="story-heading"
              className="mt-3 max-w-sm font-heading text-3xl font-semibold leading-tight text-bark sm:text-4xl"
            >
              Care that makes room for the whole person.
            </h2>
          </div>
          <div>
            <p className="max-w-2xl font-heading text-2xl font-semibold leading-tight text-bark sm:text-3xl">
              {pageData.welcome.title}
            </p>
            <details className="group mt-6 border-t border-charcoal/10 pt-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-clay marker:hidden">
                Read our story
                <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
              </summary>
              <div className="mt-6">
                <PortableText
                  value={pageData.welcome.content as import('@portabletext/types').TypedObject[]}
                  components={portableTextComponents}
                />
              </div>
            </details>
          </div>
        </section>

        <section
          className="sm:py-18 border-y border-charcoal/10 py-14"
          aria-labelledby="pillars-heading"
        >
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                02 · Our approach
              </p>
              <h2
                id="pillars-heading"
                className="mt-3 font-heading text-3xl font-semibold text-bark sm:text-4xl"
              >
                {pageData.pillars.title}
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-charcoal/65">
              A few principles that quietly shape every conversation.
            </p>
          </div>
          <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
            {pageData.pillars.pillarList.map((pillar, index) => (
              <details key={`${pillar.order}-${pillar.title}`} className="group py-5 sm:py-6">
                <summary className="flex cursor-pointer list-none items-center gap-5 marker:hidden">
                  <span className="font-mono text-xs text-clay/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="flex-1 font-heading text-xl font-semibold text-bark sm:text-2xl">
                    {pillar.title}
                  </h3>
                  <ChevronDown className="h-5 w-5 text-clay transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-4 max-w-2xl pl-9 text-sm leading-7 text-charcoal/70 sm:text-base">
                  {pillar.description}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section
          className="sm:py-18 grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:gap-20"
          aria-labelledby="founder-heading"
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-sand lg:mx-0">
            {pageData.director.image ? (
              <Image
                src={urlForImage(pageData.director.image, {
                  width: 720,
                  height: 900,
                  fit: 'crop',
                }).url()}
                alt={pageData.director.image.alt || pageData.director.name}
                fill
                sizes="(max-width: 1024px) 100vw, 35vw"
                className="object-cover"
              />
            ) : null}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              03 · The founder
            </p>
            <h2
              id="founder-heading"
              className="mt-3 font-heading text-3xl font-semibold text-bark sm:text-4xl"
            >
              {pageData.director.name}
            </h2>
            <p className="mt-2 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal/55">
              {[pageData.director.credentials, pageData.director.badge].filter(Boolean).join(' · ')}
            </p>
            <div className="mt-7 max-w-2xl space-y-4 text-[0.98rem] leading-7 text-charcoal/75">
              {pageData.director.description
                .split(/\n{2,}/)
                .slice(0, 2)
                .map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
            {pageData.director.quote ? (
              <blockquote className="mt-7 border-l-2 border-clay pl-5 font-serif text-xl italic leading-8 text-bark/80">
                &ldquo;{pageData.director.quote}&rdquo;
              </blockquote>
            ) : null}
            <Link
              href="/about/jessica-robinson-grant"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold text-clay hover:text-bark"
            >
              Meet {pageData.director.name.split(' ')[0]}
              <ArrowUpRight className="h-4 w-4 transition group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        <TeamRoster members={teamMembers} />

        <section className="sm:py-18 py-14" aria-labelledby="next-step-heading">
          <div className="bg-charcoal px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                A thoughtful next step
              </p>
              <h2
                id="next-step-heading"
                className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
              >
                {pageData.cta.title}
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/70">{pageData.cta.description}</p>
            </div>
            <Link
              href="/contact"
              className="group mt-7 inline-flex shrink-0 items-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark lg:mt-0"
            >
              Contact our team
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

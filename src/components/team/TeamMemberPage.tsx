import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronRight } from 'lucide-react'
import { PortableText } from '@portabletext/react'

interface TeamMemberData {
  name: string
  credentials?: string
  role: string
  image: string
  heroImage: string
  portraitImage: string
  secondaryImage?: string
  bio: unknown[]
  specialties: string[]
  areasOfFocus: string[]
  bestFitFor?: string
  clientTypes?: string[]
  languages?: string[]
  sessionFormats?: string[]
  approaches?: string[]
  socialLinks?: {
    label: string
    url: string
    type: 'instagram' | 'website' | 'other'
  }[]
  acceptsBookings?: boolean
}

interface TeamMemberPageProps {
  member: TeamMemberData
}

const richTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-charcoal/78 mb-5 text-[1rem] leading-8">{children}</p>
    ),
    h3: ({ children }: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-9 font-heading text-xl font-semibold text-bark">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <ul className="mb-5 space-y-2">{children}</ul>
    ),
    number: ({ children }: { children?: React.ReactNode }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: { children?: React.ReactNode }) => (
      <li className="flex gap-3 text-[0.98rem] leading-7 text-charcoal/75">
        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
        <span>{children}</span>
      </li>
    ),
  },
}

function FactGroup({ label, values }: { label: string; values?: string[] }) {
  if (!values?.length) return null

  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-charcoal/45">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-charcoal/75">{values.join(' · ')}</p>
    </div>
  )
}

export default function TeamMemberPage({ member }: TeamMemberPageProps) {
  const isOperations = /operations|manager|admin/i.test(member.role)
  const isAvailable = !isOperations && member.acceptsBookings !== false
  const portraitSrc = member.portraitImage || member.image
  const secondaryVisual = member.secondaryImage
  const hasProfileDetails = Boolean(
    member.areasOfFocus?.length ||
    member.languages?.length ||
    member.sessionFormats?.length ||
    member.approaches?.length
  )

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8 sm:pb-20 lg:px-12 lg:pt-10">
        <Link
          href="/about#team-heading"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-bark/65 transition hover:text-bark"
        >
          <ArrowLeft className="h-4 w-4 transition group-hover:-translate-x-1" aria-hidden="true" />
          Back to the team
        </Link>

        <section className="mt-7 grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative aspect-[4/3] min-h-72 bg-sand lg:aspect-auto lg:min-h-[34rem]">
            {portraitSrc ? (
              <>
                <Image
                  src={portraitSrc}
                  alt={`Portrait of ${member.name}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover object-top"
                />
                <div
                  className="absolute inset-0 bg-gradient-to-tr from-charcoal/30 to-transparent"
                  aria-hidden="true"
                />
              </>
            ) : null}
          </div>

          <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12 xl:p-16">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                {isOperations ? 'Operations team' : 'Clinical team'}
              </p>
              <h1 className="mt-4 max-w-xl text-balance font-heading text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">
                {member.name}
              </h1>
              <p className="mt-4 text-base leading-7 text-white/70">
                {[member.credentials, member.role].filter(Boolean).join(' · ')}
              </p>
            </div>

            <div className="mt-12 flex items-center gap-3 border-t border-white/15 pt-5 text-xs font-semibold uppercase tracking-[0.16em]">
              <span className={`h-2 w-2 rounded-full ${isAvailable ? 'bg-clay' : 'bg-white/35'}`} />
              <span className="text-white/70">
                {isOperations
                  ? 'Supporting the care team'
                  : isAvailable
                    ? 'Accepting clients'
                    : 'Currently full'}
              </span>
            </div>
          </div>
        </section>

        <section
          className="grid gap-10 border-b border-charcoal/10 py-12 sm:py-16 lg:grid-cols-[1.25fr_0.75fr] lg:gap-20"
          aria-labelledby="fit-heading"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              01 · A thoughtful fit
            </p>
            <h2
              id="fit-heading"
              className="mt-4 max-w-2xl font-heading text-3xl font-semibold leading-tight text-bark sm:text-4xl"
            >
              {member.bestFitFor ||
                `A collaborative approach shaped around ${member.name.split(' ')[0]}'s clients.`}
            </h2>
            {!isOperations && member.clientTypes?.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {member.clientTypes.map((clientType) => (
                  <span
                    key={clientType}
                    className="inline-flex items-center gap-2 border border-charcoal/10 bg-white px-3 py-2 text-xs font-semibold text-bark/70"
                  >
                    <Check className="h-3.5 w-3.5 text-clay" aria-hidden="true" />
                    {clientType}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          {hasProfileDetails ? (
            <div className="grid content-start gap-6 border-l border-charcoal/10 pl-6 sm:grid-cols-2 lg:grid-cols-1">
              <FactGroup label="Focus areas" values={member.areasOfFocus} />
              <FactGroup label="Languages" values={member.languages} />
              <FactGroup label="Session format" values={member.sessionFormats} />
              <FactGroup label="Approach" values={member.approaches} />
            </div>
          ) : null}
        </section>

        <section
          className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20"
          aria-labelledby="about-member-heading"
        >
          <article>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              02 · The conversation
            </p>
            <h2
              id="about-member-heading"
              className="mt-4 font-heading text-3xl font-semibold text-bark sm:text-4xl"
            >
              About {member.name.split(' ')[0]}
            </h2>
            <div className="mt-7">
              <PortableText
                value={member.bio as import('@portabletext/types').TypedObject[]}
                components={richTextComponents}
              />
            </div>
          </article>

          <aside className="lg:pt-14">
            {member.specialties.length ? (
              <div className="border-t border-charcoal/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                  Specialties
                </p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                  {member.specialties.map((specialty) => (
                    <span key={specialty} className="text-sm text-bark/75">
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
            {member.socialLinks?.length ? (
              <div className="mt-8 border-t border-charcoal/10 pt-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-charcoal/45">
                  Connect
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {member.socialLinks.map((link) => (
                    <a
                      key={`${link.type}-${link.url}`}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-clay hover:text-bark"
                    >
                      {link.label || link.type}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
          </aside>
        </section>

        {secondaryVisual ? (
          <figure className="relative overflow-hidden bg-sand">
            <div className="relative h-48 sm:h-64 lg:h-80">
              <Image
                src={secondaryVisual}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-top saturate-[0.9]"
                loading="lazy"
              />
            </div>
          </figure>
        ) : null}

        <section className="py-12 sm:py-16" aria-labelledby="next-step-heading">
          <div className="bg-charcoal px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                A thoughtful next step
              </p>
              <h2
                id="next-step-heading"
                className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
              >
                Looking for the right next step?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-white/70">
                Connect with our team to talk through what you need and find a way forward.
              </p>
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-0">
              <Link
                href="/contact"
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
              >
                Contact our team
                <ArrowRight
                  className="h-4 w-4 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/about#team-heading"
                className="group inline-flex min-h-12 items-center gap-2 px-1 py-3 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                Meet the team
                <ChevronRight
                  className="h-4 w-4 transition group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

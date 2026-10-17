'use client'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Hero from '../components/Hero'
import HeroContent from '../components/home/HeroContent'
import ContentTeamClient from '../components/ContentTeamClient'
import type { TeamMember, HomePage, Services } from '@/lib/content'

interface HomeClientProps {
  teamMembers: TeamMember[]
  homePageData: HomePage | null
  servicesData: Services | null
}

export default function HomeClient({ teamMembers, homePageData, servicesData }: HomeClientProps) {
  const services = (servicesData?.servicesList ?? [])
    .filter(
      (service) =>
        service.isActive && !/parent[\s-]*coach/i.test(service.title + ' ' + service.slug.current)
    )
    .slice(0, 3)

  return (
    <div className="relative left-1/2 right-1/2 -my-12 -ml-[50vw] -mr-[50vw] w-screen bg-cream">
      <Hero homePageData={homePageData} />
      <HeroContent homePageData={homePageData} />

      <section
        className="bg-cream px-5 pb-8 pt-16 sm:px-8 sm:pb-10 md:pb-10 md:pt-20 lg:px-10"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bark/65">
                Care that meets you where you are
              </p>
              <h2
                id="services-heading"
                className="mt-2 max-w-2xl font-heading text-3xl font-semibold text-charcoal sm:text-4xl"
              >
                Explore how we can support you
              </h2>
            </div>
            <Link
              href="/services"
              className="group inline-flex min-h-11 items-center gap-2 self-start font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay sm:self-auto"
            >
              View all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {services.length > 0 ? (
            <div className="mt-8 grid gap-4 md:grid-cols-3 md:gap-5">
              {services.map((service) => {
                const learnMore = service.buttons?.learnMore
                const href = learnMore?.show && learnMore.url ? learnMore.url : '/services'
                const cardContent = (
                  <>
                    <h3 className="font-heading text-xl font-semibold text-bark">
                      {service.title}
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-charcoal/75">
                      {service.description}
                    </p>
                    <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-bark">
                      Learn more
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </>
                )
                const className =
                  'group flex min-h-56 flex-col rounded-2xl border border-charcoal/10 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-clay/40 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-clay'

                return learnMore?.external ? (
                  <a
                    key={service.slug.current}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={className}
                  >
                    {cardContent}
                  </a>
                ) : (
                  <Link key={service.slug.current} href={href} className={className}>
                    {cardContent}
                  </Link>
                )
              })}
            </div>
          ) : (
            <p className="mt-6 text-charcoal/75">
              Discover individual and virtual counselling options on our services page.
            </p>
          )}
        </div>
      </section>

      <section className="bg-cream">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-4 sm:px-8 md:px-10 md:pb-16 md:pt-6 lg:pb-20 xl:px-12">
          <ContentTeamClient teamMembers={teamMembers} featured />
        </div>
      </section>
    </div>
  )
}

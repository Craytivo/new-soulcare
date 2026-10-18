import type { Metadata } from 'next'

export const revalidate = 300
import ContentServices from '@/components/ContentServices'
import { getServicesPage } from '@/lib/content-queries'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import ConsultationCta from '@/components/cta/ConsultationCta'

export const metadata: Metadata = {
  title: 'Services | Soul Care Counselling',
  description:
    'Faith-centered, culturally sensitive therapy. Virtual across Canada. Explore individual therapy, affordable therapy, and group therapy.',
}

export default async function ServicesPage() {
  const servicesPageData = await getServicesPage()

  // Return fallback if no data
  if (!servicesPageData) {
    return (
      <EmptyState
        title="Services page content not found."
        description="Service information is being prepared."
        action={
          <Link href="/contact" className="ui-btn-primary">
            Contact our team
          </Link>
        }
      />
    )
  }

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-10 pt-6 sm:px-8 sm:pb-14 lg:px-12 lg:pt-10">
        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-end p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {servicesPageData.hero.badge}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {servicesPageData.hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {servicesPageData.hero.description}
            </p>
            <Link
              href="#available-services"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-white/80 underline decoration-white/35 underline-offset-4 transition hover:text-white"
            >
              Explore our services
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            {servicesPageData.hero.priceHighlight ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
                  {servicesPageData.hero.priceHighlight.text}
                </p>
                <p className="mt-3 font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
                  {servicesPageData.hero.priceHighlight.price}
                </p>
                <p className="mt-2 text-sm text-white/65">
                  {servicesPageData.hero.priceHighlight.suffix}
                </p>
              </div>
            ) : (
              <p className="max-w-md font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Care that makes room for the whole person.
              </p>
            )}
            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Getting started
              </p>
              <p className="mt-2 text-sm leading-6 text-white/75">
                Not sure what fits? Our team can help you find a thoughtful next step.
              </p>
              <Link
                href="/contact"
                className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-white"
              >
                Talk with our team
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 border-b border-charcoal/10 py-10 sm:grid-cols-[0.7fr_1.3fr] sm:items-center sm:gap-16 sm:py-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              A considered place to begin
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-bark sm:text-3xl">
              Care for where you are.
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-charcoal/70">
            Prefer to start with practical tools first? Visit our{' '}
            <Link
              href="/resources"
              className="font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
            >
              resources library
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            . If you have questions about fit or next steps,{' '}
            <Link
              href="/contact"
              className="font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
            >
              contact our team
              <ArrowUpRight className="ml-1 inline h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            .
          </p>
        </section>

        <ContentServices servicesData={servicesPageData} />

        {servicesPageData.cta.external ? (
          <section className="py-12 sm:py-16" aria-label="Book a consultation">
            <ConsultationCta
              title={servicesPageData.cta.title}
              description={servicesPageData.cta.description}
              buttonText={servicesPageData.cta.buttonText}
              bookingUrl={servicesPageData.cta.buttonUrl}
              variant="bark"
              trackingLocation="services-bottom"
              className="!mt-0 !rounded-none !bg-charcoal !shadow-none !ring-0"
            />
          </section>
        ) : (
          <section className="py-12 sm:py-16" aria-labelledby="services-cta-heading">
            <div className="bg-charcoal px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  A thoughtful next step
                </p>
                <h2
                  id="services-cta-heading"
                  className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
                >
                  {servicesPageData.cta.title}
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-white/70">
                  {servicesPageData.cta.description}
                </p>
              </div>
              <Link
                href={servicesPageData.cta.buttonUrl}
                className="group mt-7 inline-flex min-h-12 shrink-0 items-center justify-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark lg:mt-0"
              >
                {servicesPageData.cta.buttonText}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

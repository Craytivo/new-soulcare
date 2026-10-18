import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import type { Service, Services } from '@/lib/content'
import { urlFor } from '@/lib/content'
import { getServices } from '@/lib/content-queries'

function formatPricing(service: Service) {
  if (!service.pricing || service.pricing.displayType === 'hidden') {
    return null
  }

  switch (service.pricing.displayType) {
    case 'custom':
      return service.pricing.customText || null
    case 'perSession':
      return `${service.pricing.currency || '$'}${service.pricing.amount} ${service.pricing.suffix || 'per session'}`
    case 'package':
      return `${service.pricing.currency || '$'}${service.pricing.amount} ${service.pricing.suffix || `for ${service.pricing.packageSessions ?? ''} sessions`}`
    default:
      return null
  }
}

function ServiceLink({ service, type }: { service: Service; type: 'learnMore' | 'bookNow' }) {
  const button = service.buttons?.[type]
  if (!button?.show || !button.url) return null

  const label = button.text || (type === 'learnMore' ? 'Learn more' : 'Book now')
  const external = 'external' in button && button.external === true
  const className =
    type === 'learnMore'
      ? 'group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay'
      : 'group inline-flex min-h-11 items-center gap-2 bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-bark'
  const icon = type === 'learnMore' ? ArrowUpRight : ArrowRight
  const Icon = icon
  const content = (
    <>
      {label}
      <Icon
        className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </>
  )

  return external || type === 'bookNow' ? (
    <a href={button.url} target="_blank" rel="noopener noreferrer" className={className}>
      {content}
    </a>
  ) : (
    <Link href={button.url} className={className}>
      {content}
    </Link>
  )
}

export default async function ContentServices({
  servicesData: initialServicesData,
}: {
  servicesData?: Services | null
}) {
  const servicesData = initialServicesData ?? (await getServices())
  const activeServices = (servicesData?.servicesList ?? []).filter(
    (service) =>
      service.isActive &&
      !/parent[\s-]*coach/i.test(service.title + ' ' + (service.slug?.current ?? ''))
  )

  if (activeServices.length === 0) {
    return (
      <section
        id="available-services"
        className="sm:py-18 border-y border-charcoal/10 py-14"
        aria-labelledby="services-heading"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
            01 · Ways we can help
          </p>
          <h2
            id="services-heading"
            className="mt-3 font-heading text-3xl font-semibold text-bark sm:text-4xl"
          >
            Thoughtful support, shaped around you.
          </h2>
          <p className="mt-5 text-sm text-charcoal/70">
            Service information is being prepared. Please contact our team to explore your options.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="available-services"
      className="sm:py-18 border-y border-charcoal/10 py-14"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              01 · Ways we can help
            </p>
            <h2
              id="services-heading"
              className="mt-3 max-w-2xl font-heading text-3xl font-semibold text-bark sm:text-4xl"
            >
              Thoughtful support, shaped around you.
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-charcoal/65">
            Explore the options below and choose the kind of care that feels right for you.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {activeServices.map((service, index) => {
            const pricing = formatPricing(service)

            return (
              <article
                key={service.slug.current}
                className="flex flex-col border border-charcoal/10 bg-white"
              >
                {service.image ? (
                  <div className="relative aspect-[16/9] bg-sand">
                    <Image
                      src={urlFor(service.image).width(900).height(506).fit('crop').url()}
                      alt={service.image.alt || service.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}

                <div className="flex flex-1 flex-col p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                      {String(index + 1).padStart(2, '0')} · Service
                    </p>
                    {pricing ? (
                      <p className="shrink-0 text-right text-sm font-semibold text-bark">
                        {pricing}
                      </p>
                    ) : null}
                  </div>
                  <h3 className="mt-3 font-heading text-2xl font-semibold text-bark">
                    {service.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-charcoal/75">{service.description}</p>

                  {service.features?.length ? (
                    <ul className="mt-5 space-y-2 border-t border-charcoal/10 pt-5">
                      {service.features.slice(0, 3).map((feature) => (
                        <li
                          key={feature}
                          className="flex items-start gap-2.5 text-sm leading-6 text-charcoal/70"
                        >
                          <Check className="mt-1 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 pt-6">
                    <ServiceLink service={service} type="learnMore" />
                    <ServiceLink service={service} type="bookNow" />
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

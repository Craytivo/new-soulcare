import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getServicePage } from '@/lib/content-queries'

interface ContentServicePageProps {
  slug: string
}

type ServiceCta = {
  text: string
  url: string
  external: boolean
}

type Section = {
  _key?: string
  _type: string
  title?: string
  content?: unknown[]
  items?: Array<{ label?: string; value?: string }> | string[]
  description?: string
  note?: string
  primaryButton?: ServiceCta
  secondaryButton?: ServiceCta
}

export default async function ContentServicePage({ slug }: ContentServicePageProps) {
  const page = await getServicePage(slug)
  if (!page) {
    notFound()
  }

  const renderCtaButton = (cta: ServiceCta, variant: 'primary' | 'secondary') => {
    const className =
      variant === 'primary'
        ? 'group inline-flex min-h-12 items-center justify-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark'
        : 'group inline-flex min-h-12 items-center gap-2 px-1 py-3 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white'

    const content = (
      <>
        {cta.text}
        {variant === 'primary' ? (
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        ) : (
          <ArrowUpRight
            className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        )}
      </>
    )

    return cta.external ? (
      <a href={cta.url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    ) : (
      <Link href={cta.url} className={className}>
        {content}
      </Link>
    )
  }

  const textSectionComponents = {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="leading-7 text-charcoal/75">{children}</p>
      ),
      h3: ({ children }: { children?: React.ReactNode }) => (
        <h3 className="pt-2 font-heading text-lg font-semibold text-bark md:text-xl">{children}</h3>
      ),
      h4: ({ children }: { children?: React.ReactNode }) => (
        <h4 className="pt-1 font-heading text-base font-semibold text-bark">{children}</h4>
      ),
    },
    list: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <ul className="space-y-2.5">{children}</ul>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <ol className="list-decimal space-y-2.5 pl-6">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({ children }: { children?: React.ReactNode }) => (
        <li className="flex items-start gap-3 leading-relaxed text-charcoal/75">
          <span className="mt-2 inline-block h-2 w-2 shrink-0 rounded-full bg-clay" />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="pl-1 leading-relaxed text-charcoal/75">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-charcoal">{children}</strong>
      ),
    },
  }

  const renderSection = (section: Section, index: number) => {
    const sectionKey = section._key || `${section._type}-${section.title || 'section'}`
    const number = String(index + 1).padStart(2, '0')
    const heading = (
      <>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
          {number} · Service details
        </p>
        <h2 className="mt-3 font-heading text-2xl font-semibold leading-tight text-bark sm:text-3xl">
          {section.title}
        </h2>
      </>
    )

    switch (section._type) {
      case 'textSection': {
        const content = Array.isArray(section.content)
          ? section.content.filter(
              (block): block is import('@portabletext/types').TypedObject =>
                typeof block === 'object' && block !== null && '_type' in block
            )
          : []

        return (
          <section
            key={sectionKey}
            className="grid gap-6 border-b border-charcoal/10 py-12 sm:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
          >
            <div>{heading}</div>
            <div className="space-y-4 text-base leading-7">
              <PortableText components={textSectionComponents} value={content} />
            </div>
          </section>
        )
      }

      case 'detailsSection': {
        const isSingleSession = page.slug?.current === 'single-session'
        const isAffordable = page.slug?.current === 'affordable'
        const items = Array.isArray(section.items) ? section.items : []
        const visibleItems = items.filter((item) => {
          const label =
            typeof item === 'string' ? item.toLowerCase() : (item.label?.toLowerCase() ?? '')
          const isPrice = label.includes('cost') || label.includes('price') || label.includes('fee')
          return !isPrice || isSingleSession || isAffordable
        })

        return (
          <section
            key={sectionKey}
            className="grid gap-6 border-b border-charcoal/10 py-12 sm:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
          >
            <div>{heading}</div>
            <dl className="grid content-start gap-x-8 sm:grid-cols-2">
              {visibleItems.map((item) => {
                const label = typeof item === 'string' ? item : (item.label ?? item.value ?? '')
                let value = typeof item === 'string' ? item : (item.value ?? item.label ?? '')
                const labelLower = typeof item === 'string' ? '' : (item.label?.toLowerCase() ?? '')

                if (
                  isSingleSession &&
                  (labelLower.includes('cost') ||
                    labelLower.includes('price') ||
                    labelLower.includes('fee'))
                ) {
                  value = '$20.00 per session'
                }

                return (
                  <div
                    key={`${label}-${value}`}
                    className="border-t border-charcoal/10 py-4 first:border-t-0"
                  >
                    <dt className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal/50">
                      {label}
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-bark">{value}</dd>
                  </div>
                )
              })}
            </dl>
          </section>
        )
      }

      case 'listSection': {
        const items = Array.isArray(section.items)
          ? section.items.filter((item): item is string => typeof item === 'string')
          : []

        return (
          <section
            key={sectionKey}
            className="grid gap-6 border-b border-charcoal/10 py-12 sm:py-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20"
          >
            <div>{heading}</div>
            <div>
              <ul className="divide-y divide-charcoal/10 border-y border-charcoal/10">
                {items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 py-4 text-sm leading-6 text-charcoal/75"
                  >
                    <Check className="mt-1 h-4 w-4 shrink-0 text-clay" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              {section.note ? (
                <p className="mt-4 text-sm leading-6 text-charcoal/60">{section.note}</p>
              ) : null}
            </div>
          </section>
        )
      }

      case 'ctaSection':
        return (
          <section key={sectionKey} className="py-10 sm:py-12">
            <div className="bg-charcoal px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  {number} · A next step
                </p>
                <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
                  {section.title}
                </h2>
                {section.description ? (
                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-white/70">
                    {section.description}
                  </p>
                ) : null}
              </div>
              {section.primaryButton || section.secondaryButton ? (
                <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 lg:mt-0">
                  {section.primaryButton ? renderCtaButton(section.primaryButton, 'primary') : null}
                  {section.secondaryButton
                    ? renderCtaButton(section.secondaryButton, 'secondary')
                    : null}
                </div>
              ) : null}
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <Link
          href="/services"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-bark/65 transition hover:text-bark"
        >
          <ArrowLeft
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
          All services
        </Link>

        <section className="mt-7 grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {page.badge}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {page.mainTitle}
            </h1>
            <p className="mt-5 max-w-2xl whitespace-pre-line text-base leading-7 text-white/75 sm:text-lg">
              {page.heroDescription}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
              {renderCtaButton(page.primaryCta, 'primary')}
              {renderCtaButton(page.secondaryCta, 'secondary')}
            </div>
          </div>

          <div className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            {page.quote ? (
              <blockquote>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                  A word to carry with you
                </p>
                <p className="mt-4 font-serif text-xl italic leading-8 text-white/85 sm:text-2xl">
                  &ldquo;{page.quote.text}&rdquo;
                </p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-clay">
                  {page.quote.attribution}
                </footer>
              </blockquote>
            ) : (
              <p className="max-w-md font-heading text-2xl font-semibold leading-tight text-white sm:text-3xl">
                Thoughtful care, shaped around your story.
              </p>
            )}
            <div className="mt-8 border-t border-white/15 pt-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Not sure where to begin?
              </p>
              <Link
                href="/contact"
                className="group mt-3 inline-flex items-center gap-2 text-sm font-semibold text-clay transition hover:text-white"
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

        <div>{page.sections.map((section, index) => renderSection(section, index))}</div>

        <section className="border-t border-charcoal/10 py-10" aria-label="Continue exploring">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-heading text-xl font-semibold text-bark">
                Exploring your options?
              </p>
              <p className="mt-1 text-sm leading-6 text-charcoal/65">
                Browse our services or reach out if you would like help choosing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                href="/services"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
              >
                All services
                <ArrowLeft
                  className="h-4 w-4 transition-transform group-hover:-translate-x-1"
                  aria-hidden="true"
                />
              </Link>
              <Link
                href="/contact"
                className="group inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
              >
                Contact our team
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
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

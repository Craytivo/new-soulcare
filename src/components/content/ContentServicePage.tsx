import { getServicePage } from '@/lib/content-queries'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'

interface ContentServicePageProps {
  slug: string
}

export default async function ContentServicePage({ slug }: ContentServicePageProps) {
  const page = await getServicePage(slug)
  if (!page) {
    notFound()
  }

  const renderCtaButton = (
    cta: { text: string; url: string; external: boolean },
    className: string
  ) => {
    if (cta.external) {
      return (
        <a href={cta.url} target="_blank" rel="noopener noreferrer" className={className}>
          {cta.text}
        </a>
      )
    } else {
      return (
        <Link href={cta.url} className={className}>
          {cta.text}
        </Link>
      )
    }
  }

  const textSectionComponents = {
    block: {
      normal: ({ children }: { children?: React.ReactNode }) => (
        <p className="leading-relaxed">{children}</p>
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
        <li className="flex items-start gap-3 leading-relaxed">
          <span className="mt-2 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-bark" />
          <span>{children}</span>
        </li>
      ),
      number: ({ children }: { children?: React.ReactNode }) => (
        <li className="pl-1 leading-relaxed">{children}</li>
      ),
    },
    marks: {
      strong: ({ children }: { children?: React.ReactNode }) => (
        <strong className="font-semibold text-charcoal">{children}</strong>
      ),
    },
  }

  type Section = {
    _key?: string
    _type: string
    title?: string
    content?: unknown[]
    items?: Array<{ label?: string; value?: string }> | string[]
    description?: string
    note?: string
    primaryButton?: { text: string; url: string; external: boolean }
    secondaryButton?: { text: string; url: string; external: boolean }
  }
  const renderSection = (section: Section) => {
    const sectionKey = section._key || `${section._type}-${section.title || 'section'}`
    switch (section._type) {
      case 'textSection':
        return (
          <section key={sectionKey} className="mx-auto mt-12 max-w-3xl">
            <h2 className="font-heading text-2xl font-bold text-charcoal md:text-3xl">
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 text-charcoal/90">
              <PortableText
                components={textSectionComponents}
                value={
                  Array.isArray(section.content)
                    ? section.content.filter(
                        (block): block is import('@portabletext/types').TypedObject =>
                          typeof block === 'object' && block !== null && '_type' in block
                      )
                    : []
                }
              />
            </div>
          </section>
        )

      case 'detailsSection':
        const isSingleSession = page.slug?.current === 'single-session'
        const isAffordable = page.slug?.current === 'affordable'
        return (
          <section key={sectionKey} className="mx-auto mt-12 max-w-5xl">
            <h2 className="font-heading text-2xl font-bold text-charcoal md:text-3xl">
              {section.title}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {(section.items as Array<{ label: string; value: string }> | string[])
                .filter((item: { label?: string; value?: string } | string) => {
                  const label = typeof item === 'string' ? item : (item.label?.toLowerCase() ?? '')
                  if (label.includes('cost') || label.includes('price') || label.includes('fee')) {
                    return isSingleSession || isAffordable
                  }
                  return true
                })
                .map((item: { label?: string; value?: string } | string) => {
                  let value = typeof item === 'string' ? item : (item.value ?? item.label)
                  if (
                    isSingleSession &&
                    typeof item !== 'string' &&
                    (item.label?.toLowerCase().includes('cost') ||
                      item.label?.toLowerCase().includes('price') ||
                      item.label?.toLowerCase().includes('fee'))
                  ) {
                    value = '$20.00 per session'
                  }
                  return (
                    <div
                      key={`${typeof item === 'string' ? item : `${item.label}-${item.value}`}`}
                      className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-charcoal/10"
                    >
                      <dt className="font-semibold">
                        {typeof item === 'string' ? item : (item.label ?? item.value)}
                      </dt>
                      <dd className="mt-1 text-charcoal/90">{value}</dd>
                    </div>
                  )
                })}
            </div>
          </section>
        )

      case 'listSection':
        return (
          <section key={sectionKey} className="mx-auto mt-12 max-w-5xl">
            <h2 className="font-heading text-2xl font-bold text-charcoal md:text-3xl">
              {section.title}
            </h2>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {(section.items as string[]).map((item: string) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2.5 w-2.5 rounded-full bg-bark"></span>
                  {item}
                </li>
              ))}
            </ul>
            {section.note && <p className="mt-6 text-sm text-charcoal/75">{section.note}</p>}
          </section>
        )

      case 'ctaSection':
        return (
          <section key={sectionKey} className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-xl bg-bark p-6 text-cream ring-1 ring-cream/15">
              <h3 className="font-heading text-xl font-bold md:text-2xl">{section.title}</h3>
              {section.description && (
                <p className="mt-2 whitespace-pre-line text-cream/90">{section.description}</p>
              )}
              <div className="mt-5 flex flex-wrap gap-3">
                {section.primaryButton &&
                  renderCtaButton(
                    section.primaryButton,
                    'inline-flex items-center justify-center rounded-lg bg-clay px-5 py-2.5 font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/10 transition hover:bg-clay/90'
                  )}
                {section.secondaryButton &&
                  renderCtaButton(
                    section.secondaryButton,
                    'inline-flex items-center justify-center rounded-lg bg-sand px-5 py-2.5 font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/10 transition hover:bg-sand/90'
                  )}
              </div>
            </div>
          </section>
        )

      default:
        return null
    }
  }

  return (
    <>
      {/* Page Hero */}
      <section className="mx-auto max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-sand/70 px-3 py-1 text-[11px] uppercase tracking-[.22em] text-charcoal/80 ring-1 ring-charcoal/10">
          {page.badge}
        </span>
        <h1 className="mt-3 font-heading text-3xl font-bold text-charcoal md:text-4xl">
          {page.mainTitle}
        </h1>

        {page.quote && (
          <blockquote className="mt-6 border-l-4 border-clay pl-4 italic text-charcoal/90">
            &quot;{page.quote.text}&quot;
            <span className="font-semibold not-italic"> {page.quote.attribution}</span>
          </blockquote>
        )}

        <div className="mt-6 whitespace-pre-line leading-relaxed text-charcoal/90">
          {page.heroDescription}
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          {renderCtaButton(
            page.primaryCta,
            'inline-flex items-center justify-center rounded-lg bg-clay px-5 py-2.5 font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/10 transition hover:bg-clay/90'
          )}
          {renderCtaButton(
            page.secondaryCta,
            'inline-flex items-center justify-center rounded-lg bg-sand px-5 py-2.5 font-semibold text-charcoal shadow-sm ring-1 ring-charcoal/10 transition hover:bg-sand/90'
          )}
        </div>
      </section>

      {/* Render all sections */}
      {page.sections.map((section) => renderSection(section))}
    </>
  )
}

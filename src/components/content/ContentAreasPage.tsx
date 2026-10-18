import { getAreasPage } from '@/lib/content-queries'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'

export default async function ContentAreasPage() {
  const pageData = await getAreasPage()
  if (!pageData) {
    return (
      <div className="py-12 text-center text-charcoal/60">No content available for this page.</div>
    )
  }

  const portableTextComponents = {
    block: {
      h3: (props: { children?: React.ReactNode }) => (
        <h3 className="mb-2 font-heading text-lg font-semibold text-charcoal">{props.children}</h3>
      ),
      h4: (props: { children?: React.ReactNode }) => (
        <h4 className="mb-1.5 font-heading text-base font-semibold text-charcoal/90">
          {props.children}
        </h4>
      ),
      normal: (props: { children?: React.ReactNode }) => (
        <p className="mb-3 leading-relaxed text-charcoal/75">{props.children}</p>
      ),
    },
    list: {
      bullet: (props: { children?: React.ReactNode }) => (
        <ul className="mb-4 space-y-1.5">{props.children}</ul>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <ol className="mb-4 list-decimal space-y-1.5 pl-5">{props.children}</ol>
      ),
    },
    listItem: {
      bullet: (props: { children?: React.ReactNode }) => (
        <li className="flex items-start gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay" />
          <span className="leading-relaxed text-charcoal/75">{props.children}</span>
        </li>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <li className="leading-relaxed text-charcoal/75">{props.children}</li>
      ),
    },
  }

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {pageData.hero.badge || 'Areas of focus'}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {pageData.hero.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {pageData.hero.description}
            </p>
          </div>
          <nav
            className="border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12"
            aria-label="Areas of focus"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Explore areas
            </p>
            <ol className="mt-4 divide-y divide-white/10">
              {pageData.areas.map((area, index) => (
                <li key={area.slug.current}>
                  <a
                    href={`#${area.slug.current}`}
                    className="group flex min-h-12 items-center gap-3 py-2 text-sm text-white/80 transition hover:text-white"
                  >
                    <span className="font-mono text-xs text-clay/80">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1">{area.title}</span>
                    <ArrowRight
                      className="h-4 w-4 text-clay transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </section>

        <section className="border-b border-charcoal/10 py-10 sm:py-12">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
            Thoughtful, individualized care
          </p>
          <h2 className="mt-3 max-w-2xl font-heading text-2xl font-semibold leading-tight text-bark sm:text-3xl">
            Wherever you are starting from, there is room to begin.
          </h2>
        </section>

        <section aria-label="Areas of focus">
          <div className="divide-y divide-charcoal/10 border-b border-charcoal/10">
            {pageData.areas.map((area, index) => (
              <details
                key={area.slug.current}
                id={area.slug.current}
                className="group scroll-mt-24 py-5 sm:py-7"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center gap-4 marker:hidden">
                  <span className="font-mono text-xs text-clay/80">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 font-heading text-xl font-semibold text-bark sm:text-2xl">
                    {area.title}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 text-clay transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>
                <div className="mt-5 grid gap-4 border-t border-charcoal/10 pt-5 sm:ml-10 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.45fr)] sm:gap-10">
                  <PortableText
                    value={area.content as import('@portabletext/types').TypedObject[]}
                    components={portableTextComponents}
                  />
                  <p className="border-l-2 border-clay/60 pl-4 font-serif text-base italic leading-7 text-bark/70">
                    Care is collaborative and shaped around your story.
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {pageData.cta ? (
          <section className="py-12 sm:py-16" aria-labelledby="areas-cta-heading">
            <div className="bg-charcoal px-6 py-10 text-white sm:px-10 sm:py-12 lg:flex lg:items-end lg:justify-between lg:gap-10 lg:px-14">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  A thoughtful next step
                </p>
                <h2
                  id="areas-cta-heading"
                  className="mt-3 font-heading text-3xl font-semibold sm:text-4xl"
                >
                  {pageData.cta.title}
                </h2>
                <p className="mt-4 max-w-xl leading-7 text-white/70">{pageData.cta.description}</p>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 lg:mt-0">
                {pageData.cta.external ? (
                  <a
                    href={pageData.cta.buttonLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-12 items-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
                  >
                    {pageData.cta.buttonText}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <Link
                    href={pageData.cta.buttonLink}
                    className="group inline-flex min-h-12 items-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
                  >
                    {pageData.cta.buttonText}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                )}
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 items-center px-1 py-3 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white"
                >
                  Contact our team
                </Link>
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  )
}

import { getCoreValuesPage } from '@/lib/content-queries'
import { urlFor, type CoreValuesPage } from '@/lib/content'
import Image from 'next/image'
import Link from 'next/link'

function getHeroImagePosition(image: CoreValuesPage['hero']['image']) {
  const hotspot = image.hotspot
  if (hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number') {
    return `${hotspot.x * 100}% ${hotspot.y * 100}%`
  }

  return '50% 28%'
}

export default async function ContentCoreValuesPage() {
  const page = await getCoreValuesPage()

  if (!page) {
    return (
      <div className="py-12 text-center">
        <p className="text-charcoal/60">Core pillars page not found.</p>
      </div>
    )
  }

  const renderCtaButton = () => {
    if (page.cta.external) {
      return (
        <a
          href={page.cta.buttonLink}
          target="_blank"
          rel="noopener noreferrer"
          className="ui-btn ui-btn-primary"
        >
          {page.cta.buttonText}
        </a>
      )
    } else {
      return (
        <Link href={page.cta.buttonLink} className="ui-btn ui-btn-primary">
          {page.cta.buttonText}
        </Link>
      )
    }
  }

  return (
    <div className="-mx-4 -my-12 bg-cream">
      <section className="relative isolate overflow-hidden bg-charcoal text-white lg:flex lg:min-h-[min(62vw,calc(100svh-5rem))] lg:items-end">
        {page.hero.image && (
          <div className="relative aspect-[124/77] w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
            <Image
              src={urlFor(page.hero.image).width(2200).height(1400).quality(92).url()}
              alt={page.hero.image.alt || page.hero.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: getHeroImagePosition(page.hero.image) }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-charcoal lg:from-transparent lg:from-45% lg:via-charcoal/55 lg:via-70% lg:to-charcoal"
            />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-14 lg:px-12 lg:pb-10 lg:pt-0 xl:pb-12">
          <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10 xl:gap-14">
            <div className="lg:col-span-6 xl:col-span-7">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm">
                {page.hero.badge}
              </p>
              <h1 className="max-w-4xl text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[2.6rem] xl:text-5xl">
                {page.hero.title}
              </h1>
            </div>
            <div className="mt-6 lg:col-span-6 lg:mt-0 xl:col-span-5">
              <p className="max-w-xl text-base leading-7 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] sm:text-lg">
                {page.hero.description}
              </p>
              <div className="mt-6 flex">{renderCtaButton()}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
        <div className="mb-8 max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-clay">
            What guides our care
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-bark sm:text-4xl">
            The pillars beneath our work
          </h2>
          <p className="mt-4 text-base leading-7 text-charcoal/75">
            Each principle shapes how we listen, support, and walk alongside the people we serve.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {page.values.map(
            (value: { title: string; description: string; order: number }, index) => (
              <article
                key={`${value.order}-${value.title}`}
                className="group min-h-64 rounded-3xl border border-charcoal/10 bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-clay/35 hover:shadow-md md:p-7"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs font-semibold tracking-[0.18em] text-clay/70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span
                    className="h-2 w-2 rounded-full bg-clay/60 transition group-hover:bg-clay"
                    aria-hidden="true"
                  />
                </div>
                <h2 className="mt-10 font-heading text-xl font-semibold tracking-tight text-bark md:text-2xl">
                  {value.title}
                </h2>
                <div className="mt-3 h-px w-12 bg-clay/60" aria-hidden="true" />
                <p className="mt-4 whitespace-pre-line text-[0.98rem] leading-7 text-charcoal/75">
                  {value.description}
                </p>
              </article>
            )
          )}
        </div>
      </section>

      <section className="mx-5 mb-12 rounded-3xl bg-charcoal p-7 text-white shadow-lg sm:mx-8 sm:mb-16 sm:p-10 lg:mx-auto lg:max-w-7xl lg:p-12">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">
              A thoughtful next step
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
              {page.cta.title}
            </h3>
            <p className="mt-3 leading-7 text-white/75">{page.cta.description}</p>
          </div>
          <div className="shrink-0">{renderCtaButton()}</div>
        </div>
      </section>
    </div>
  )
}

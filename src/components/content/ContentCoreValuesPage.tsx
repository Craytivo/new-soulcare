import { getCoreValuesPage } from '@/lib/content-queries'
import { urlFor } from '@/lib/content'
import Image from 'next/image'
import Link from 'next/link'

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
    <>
      {/* Page hero with image */}
      <section className="relative overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 grid items-center gap-8 px-6 py-10 md:grid-cols-2 md:px-10 md:py-14">
          {/* LEFT: Text */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-[11px] uppercase tracking-[.22em] ring-1 ring-cream/30">
              {page.hero.badge}
            </span>
            <h1 className="mt-3 font-heading text-3xl font-bold md:text-4xl">{page.hero.title}</h1>
            <p className="mt-3 max-w-3xl text-cream/85">{page.hero.description}</p>
          </div>

          {/* RIGHT: Image */}
          {page.hero.image && (
            <div className="relative overflow-hidden rounded-xl shadow-lg ring-1 ring-cream/15">
              <Image
                src={urlFor(page.hero.image).url()}
                alt={page.hero.image.alt || page.hero.title}
                width={620}
                height={310}
                className="block h-full w-full object-cover"
                priority
              />
            </div>
          )}
        </div>
      </section>

      {/* Values */}
      <section className="mt-14 rounded-2xl bg-sand/40 p-4 ring-1 ring-charcoal/10 md:mt-16 md:p-6">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {page.values.map((value: { title: string; description: string; order: number }) => (
            <article key={`${value.order}-${value.title}`} className="ui-card p-6 md:p-7">
              <h2 className="font-heading text-xl font-semibold tracking-tight md:text-2xl">
                {value.title}
              </h2>
              <div className="mt-3 h-px w-12 bg-clay/60" aria-hidden="true"></div>
              <p className="mt-4 whitespace-pre-line text-[1rem] leading-7 text-charcoal/85 md:text-[1.02rem]">
                {value.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 rounded-2xl bg-sand p-6 ring-1 ring-charcoal/10 md:mt-20 md:p-8">
        <div className="grid gap-6 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h3 className="font-heading text-xl font-semibold md:text-2xl">{page.cta.title}</h3>
            <p className="mt-2 text-charcoal/80">{page.cta.description}</p>
          </div>
          <div className="md:justify-self-end">{renderCtaButton()}</div>
        </div>
      </section>
    </>
  )
}

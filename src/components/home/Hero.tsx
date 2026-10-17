import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/content'
import type { HomePage } from '@/lib/content'

interface HeroProps {
  homePageData: HomePage | null
}

type HeroButton = {
  text: string
  url: string
  external: boolean
}

function HeroButtonLink({
  button,
  variant,
}: {
  button: HeroButton
  variant: 'primary' | 'secondary'
}) {
  const className =
    variant === 'primary'
      ? 'group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-clay px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-bark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto'
      : 'inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/70 bg-charcoal/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto'

  const content = (
    <>
      {button.text}
      {variant === 'primary' && (
        <ArrowRight
          className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      )}
    </>
  )

  if (button.external) {
    return (
      <a href={button.url} target="_blank" rel="noopener noreferrer" className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link href={button.url} className={className}>
      {content}
    </Link>
  )
}

export default function Hero({ homePageData }: HeroProps) {
  if (!homePageData?.hero) {
    return (
      <section className="flex min-h-[60svh] items-center justify-center bg-gradient-to-br from-sand to-cream px-5 text-center">
        <div className="text-bark/70">
          <p className="text-lg font-semibold">Homepage content is being prepared</p>
          <p className="mt-2 text-sm">
            Please check back soon for updates.
          </p>
        </div>
      </section>
    )
  }

  const heroData = homePageData.hero
  const backgroundImageSrc = heroData.backgroundImage
    ? urlFor(heroData.backgroundImage).quality(90).url()
    : null
  const backgroundImageAlt = heroData.backgroundImage?.alt || 'Soul Care Counselling'

  return (
    <section
      aria-labelledby="homepage-hero-heading"
      className="relative isolate w-full overflow-hidden bg-charcoal text-white lg:flex lg:h-[min(62vw,calc(100svh-5rem))] lg:min-h-[560px] lg:items-end"
    >
      {/* Team photo: shown at its natural ratio on small screens, full-bleed on large screens.
          Faces sit in the upper half of the photo, so text stays in the bottom band. */}
      {backgroundImageSrc && (
        <div className="relative aspect-[124/77] w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
          <Image
            src={backgroundImageSrc}
            alt={backgroundImageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-charcoal lg:from-transparent lg:from-50% lg:via-charcoal/55 lg:via-70% lg:to-charcoal"
          />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-14 lg:px-12 lg:pb-10 lg:pt-0 xl:pb-12">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10 xl:gap-14">
          <div className="lg:col-span-6 xl:col-span-7">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm">
              Soul Care Christian Counselling
            </p>
            <h1
              id="homepage-hero-heading"
              className="text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[2.6rem] xl:text-5xl"
            >
              {heroData.mainHeading}{' '}
              <span className="text-[#e7c49a]">{heroData.highlightText}</span>
            </h1>
            <p className="mt-4 text-sm leading-6 text-white/75">
              Faith-centred care. Culturally responsive support. Virtual counselling across Canada.
            </p>
          </div>
          <div className="mt-6 lg:col-span-6 lg:mt-0 xl:col-span-5">
            <p className="text-base leading-7 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)]">
              {heroData.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <HeroButtonLink button={heroData.ctaButtons.primaryButton} variant="primary" />
              <HeroButtonLink button={heroData.ctaButtons.secondaryButton} variant="secondary" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

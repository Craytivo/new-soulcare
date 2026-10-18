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
      : 'group inline-flex min-h-12 w-full items-center justify-center gap-2 px-1 py-3 text-sm font-semibold text-white underline decoration-white/45 underline-offset-4 transition hover:text-clay hover:decoration-clay focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white sm:w-auto'

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
          <p className="mt-2 text-sm">Please check back soon for updates.</p>
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
            className="absolute inset-0 lg:bg-gradient-to-b lg:from-transparent lg:from-45% lg:via-charcoal/45 lg:via-70% lg:to-charcoal"
          />
        </div>
      )}

      <div className="relative mx-auto w-full max-w-7xl px-5 pb-9 pt-5 sm:px-8 sm:pb-11 lg:px-12 lg:pb-12 lg:pt-0">
        <div className="max-w-6xl lg:flex lg:items-end lg:justify-between lg:gap-12">
          <div className="max-w-3xl">
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
              Soul Care Christian Counselling
            </p>
            <h1
              id="homepage-hero-heading"
              className="text-balance font-heading text-3xl font-semibold leading-[1.06] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-4xl lg:text-[2.55rem] xl:text-5xl"
            >
              {heroData.mainHeading}{' '}
              <span className="text-[#e7c49a]">{heroData.highlightText}</span>
            </h1>
          </div>
          <div className="mt-4 flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:gap-5 lg:mb-1 lg:mt-0 lg:shrink-0">
            <HeroButtonLink button={heroData.ctaButtons.primaryButton} variant="primary" />
            <HeroButtonLink button={heroData.ctaButtons.secondaryButton} variant="secondary" />
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

interface ReadyToHealCTAProps {
  title?: string
  description?: string
  buttonText?: string
  buttonLink?: string
  isExternal?: boolean
  secondaryButtonText?: string
  secondaryButtonLink?: string
}

export default function ReadyToHealCTA({
  title = 'Ready to Begin Healing?',
  description = 'Take the first step towards a more peaceful, authentic life. Our compassionate team is here to support your journey.',
  buttonText = 'Book Your First Session',
  buttonLink = '/contact',
  isExternal = false,
  secondaryButtonText = 'Learn More',
  secondaryButtonLink = '/areas',
}: ReadyToHealCTAProps) {
  const PrimaryButton = isExternal ? 'a' : Link
  const SecondaryButton = Link

  return (
    <section className="mb-0">
      {/* Decorative top gradient */}
      <div className="mb-16 h-px bg-gradient-to-r from-transparent via-clay/40 to-transparent md:mb-20" />

      <div className="relative overflow-hidden rounded-3xl">
        {/* Background with subtle gradient */}
        <div className="from-clay/12 via-sand/8 absolute inset-0 bg-gradient-to-br to-cream opacity-40" />

        {/* Subtle decorative elements */}
        <div className="from-clay/8 absolute right-0 top-0 -mr-48 -mt-48 h-96 w-96 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 -mb-36 -ml-36 h-72 w-72 rounded-full bg-gradient-to-tr from-sand/10 to-transparent blur-3xl" />

        {/* Content */}
        <div className="relative z-10 px-6 py-16 text-center md:px-10 md:py-20 lg:py-24">
          {/* Icon accent above heading */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay/10 ring-1 ring-clay/25">
              <svg
                className="h-6 w-6 text-clay"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>

          {/* Main heading */}
          <h2 className="mb-5 font-heading text-3xl font-bold leading-tight tracking-tight text-bark md:text-4xl lg:text-5xl">
            {title}
          </h2>

          {/* Divider */}
          <div className="mb-6 flex justify-center">
            <div className="h-1 w-12 rounded-full bg-gradient-to-r from-clay/0 via-clay to-clay/0" />
          </div>

          {/* Description */}
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-charcoal/80 md:text-xl">
            {description}
          </p>

          {/* CTA Buttons - stacked on mobile, side-by-side on larger screens */}
          <div className="mx-auto flex max-w-md flex-col items-center justify-center gap-4 sm:max-w-none sm:flex-row">
            {isExternal ? (
              <a
                href={buttonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-8 py-4 font-semibold text-cream ring-1 ring-clay/40 transition-all shadow-elevation-2 hover:bg-bark hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:ring-offset-2 sm:w-auto"
              >
                {buttonText}
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            ) : (
              <Link
                href={buttonLink}
                className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-clay px-8 py-4 font-semibold text-cream ring-1 ring-clay/40 transition-all shadow-elevation-2 hover:bg-bark hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:ring-offset-2 sm:w-auto"
              >
                {buttonText}
                <svg
                  className="h-5 w-5 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            )}

            <SecondaryButton
              href={secondaryButtonLink}
              className="inline-flex w-full items-center justify-center rounded-xl border border-charcoal/15 bg-white/70 px-8 py-4 font-semibold text-charcoal/75 ring-1 ring-charcoal/10 backdrop-blur-sm transition-all hover:border-charcoal/25 hover:bg-white/90 hover:ring-charcoal/15 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:ring-offset-2 sm:w-auto"
            >
              {secondaryButtonText}
            </SecondaryButton>
          </div>

          {/* Trust statement */}
          <p className="mt-8 text-sm font-medium tracking-wide text-charcoal/60">
            ðŸ’™ Your wellbeing is our priority. Every session is confidential and tailored to you.
          </p>
        </div>
      </div>
    </section>
  )
}

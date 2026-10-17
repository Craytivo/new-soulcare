import Link from 'next/link'

interface NextStepCTAProps {
  joinTeamTitle?: string
  joinTeamDescription?: string
}

export default function NextStepCTA({
  joinTeamTitle = 'Ready to Take the Next Step?',
  joinTeamDescription = "Whether you're seeking therapy, exploring an internship, or have questions about our services, we're here to support you.",
}: NextStepCTAProps) {
  return (
    <section className="mb-0">
      {/* Decorative top divider */}
      <div className="mb-16 h-px bg-gradient-to-r from-transparent via-clay/40 to-transparent md:mb-20" />

      {/* Main CTA Container */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Background with subtle gradient and patterns */}
        <div className="absolute inset-0 bg-gradient-to-br from-sand/40 via-cream/20 to-clay/10 opacity-60" />

        {/* Decorative geometric elements */}
        <div className="from-clay/8 absolute -right-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-br to-transparent blur-3xl" />
        <div className="from-sand/8 absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr to-transparent blur-3xl" />

        {/* Grid background pattern */}
        <div className="absolute inset-0 opacity-[0.015] [background-image:linear-gradient(0deg,transparent_24%,rgba(196,154,108,.05)_25%,rgba(196,154,108,.05)_26%,transparent_27%,transparent_74%,rgba(196,154,108,.05)_75%,rgba(196,154,108,.05)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(196,154,108,.05)_25%,rgba(196,154,108,.05)_26%,transparent_27%,transparent_74%,rgba(196,154,108,.05)_75%,rgba(196,154,108,.05)_76%,transparent_77%,transparent)] [background-size:50px_50px]" />

        {/* Content */}
        <div className="relative z-10 px-6 py-16 md:px-12 md:py-24">
          <div className="mx-auto max-w-4xl">
            {/* Section heading with icon */}
            <div className="mb-8 flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-clay to-clay/70 shadow-elevation-2">
                  <svg
                    className="h-6 w-6 text-cream"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-bark md:text-4xl">
                  {joinTeamTitle}
                </h2>
              </div>
            </div>

            {/* Decorative divider */}
            <div className="mb-8 h-1 w-16 rounded-full bg-gradient-to-r from-clay to-clay/0" />

            {/* Description */}
            <p className="mb-12 max-w-2xl text-lg leading-relaxed text-charcoal/85 md:text-xl">
              {joinTeamDescription}
            </p>

            {/* Three-column action grid */}
            <div className="grid gap-5 md:grid-cols-3 md:gap-6">
              {/* Action 1: Book Therapy */}
              <div className="group rounded-2xl border border-charcoal/10 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/30 hover:bg-white/80 hover:shadow-elevation-2">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-clay/10 ring-1 ring-clay/30">
                  <svg
                    className="h-5 w-5 text-clay"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading font-semibold text-bark">Begin Therapy</h3>
                <p className="mb-4 text-sm leading-relaxed text-charcoal/70">
                  Schedule your first session and start your healing journey.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-0 text-sm font-semibold text-clay transition-colors hover:text-bark group-hover:gap-1"
                >
                  Book now
                  <svg
                    className="h-4 w-4 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Action 2: Clinical Internship */}
              <div className="group rounded-2xl border border-charcoal/10 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/30 hover:bg-white/80 hover:shadow-elevation-2">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-clay/10 ring-1 ring-clay/30">
                  <svg
                    className="h-5 w-5 text-clay"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6.253v13m0-13C6.5 6.253 3 9.756 3 12.253v13m0 0c5.5 0 9 3.503 9 6.256V19.253m0-13c5.5 0 9 3.756 9 9v4m0-4v6m0 0c-5.5 2.753-9 6.256-9 6.256"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading font-semibold text-bark">Become an Intern</h3>
                <p className="mb-4 text-sm leading-relaxed text-charcoal/70">
                  Join our team as a clinical intern and gain meaningful experience.
                </p>
                <Link
                  href="/intern-application"
                  className="inline-flex items-center gap-0 text-sm font-semibold text-clay transition-colors hover:text-bark group-hover:gap-1"
                >
                  Apply today
                  <svg
                    className="h-4 w-4 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>

              {/* Action 3: Get in Touch */}
              <div className="group rounded-2xl border border-charcoal/10 bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-clay/30 hover:bg-white/80 hover:shadow-elevation-2">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-clay/10 ring-1 ring-clay/30">
                  <svg
                    className="h-5 w-5 text-clay"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="mb-2 font-heading font-semibold text-bark">Ask a Question</h3>
                <p className="mb-4 text-sm leading-relaxed text-charcoal/70">
                  Have questions? Our team is here to help and support you.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-0 text-sm font-semibold text-clay transition-colors hover:text-bark group-hover:gap-1"
                >
                  Contact us
                  <svg
                    className="h-4 w-4 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Trust message */}
            <div className="mt-12 border-t border-charcoal/10 pt-10">
              <p className="text-center text-sm font-medium tracking-wide text-charcoal/60">
                ðŸ’™ Every step matters. We&apos;re here to meet you with compassion and expertise.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

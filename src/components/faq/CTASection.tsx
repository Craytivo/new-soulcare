import Link from 'next/link'

interface CTASectionProps {
  icon: 'question' | 'mail'
}

export default function CTASection({ icon }: CTASectionProps) {
  const icons = {
    question: (
      <svg
        className="h-5 w-5 text-clay"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      </svg>
    ),
    mail: (
      <svg
        className="h-5 w-5 text-clay"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75a2.25 2.25 0 012.25-2.25h15a2.25 2.25 0 012.25 2.25z"
        />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9 6 9-6" />
      </svg>
    ),
  }

  return (
    <section className="bg-charcoal px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div className="mb-6 md:mb-0">
          <div className="mb-3">{icons[icon]}</div>
          <h3 className="mb-2 font-heading text-xl font-semibold tracking-tight text-white md:text-2xl">
            Still have questions?
          </h3>
          <p className="leading-relaxed text-white/70">
            We&apos;re happy to help. Book a free consultation or reach out to our team â€” no
            pressure, just support.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <a
            href="https://thesoulcarecounsellor.janeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center justify-center bg-clay px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-bark"
          >
            Book a Free Consultation
          </a>
          <Link
            href="/contact"
            className="inline-flex min-h-11 items-center justify-center border border-white/20 px-5 py-3 text-sm font-semibold text-white/75 transition-colors hover:border-white/50 hover:text-white"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  )
}

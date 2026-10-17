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
    <section className="mt-16 rounded-2xl bg-gradient-to-br from-sand/60 to-sand/40 p-8 ring-1 ring-charcoal/5 backdrop-blur-sm md:p-10">
      <div className="md:grid md:grid-cols-2 md:items-center md:gap-10">
        <div className="mb-6 md:mb-0">
          <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-clay/15">
            {icons[icon]}
          </div>
          <h3 className="mb-2 font-heading text-xl font-semibold tracking-tight md:text-2xl">
            Still have questions?
          </h3>
          <p className="leading-relaxed text-charcoal/75">
            We&apos;re happy to help. Book a free consultation or reach out to our team â€” no
            pressure, just support.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <a
            href="https://thesoulcarecounsellor.janeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
          >
            Book a Free Consultation
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-medium text-charcoal/70 ring-1 ring-charcoal/10 transition-colors hover:bg-charcoal/5"
          >
            Contact Our Team
          </Link>
        </div>
      </div>
    </section>
  )
}

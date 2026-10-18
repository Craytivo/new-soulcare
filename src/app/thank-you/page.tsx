import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Calendar, BookOpen, Home, ArrowRight } from 'lucide-react'
import EditorialPageHero from '@/components/ui/EditorialPageHero'

export const metadata: Metadata = {
  title: 'Thank You | Soul Care Counselling',
  description:
    'Thank you for connecting with Soul Care Counselling. Your request has been received and your follow-up resources are on the way.',
}

export default function ThankYouPage() {
  const bookingUrl =
    process.env.NEXT_PUBLIC_JANEAPP_BOOKING_URL || 'https://thesoulcarecounsellor.janeapp.com'

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <section className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <EditorialPageHero
          eyebrow="Connection successful"
          title="You’re all set. Your journey begins now."
          description="You will receive your resource and follow-up emails shortly. Take your time, and when you feel ready, you can book a consultation at your own pace."
          aside={
            <div className="flex items-start gap-4">
              <CheckCircle className="mt-1 h-7 w-7 shrink-0 text-clay" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Request received
                </p>
                <p className="mt-3 font-heading text-2xl font-semibold text-white">
                  Thank you for reaching out.
                </p>
                <p className="mt-3 text-sm leading-6 text-white/70">
                  We’ll be in touch soon. You can explore next steps whenever you’re ready.
                </p>
              </div>
            </div>
          }
        />

        <div className="mt-8 grid gap-5 border-b border-charcoal/10 pb-10 md:grid-cols-2 md:gap-6">
          <div className="group border border-charcoal/10 bg-white p-6 transition-colors hover:border-clay/40 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-sand text-bark">
                <Calendar className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-semibold text-bark">
                  Book a Consultation
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  Speak with a counselor who understands your journey. Available at times that work
                  for you.
                </p>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition-colors hover:text-clay"
                >
                  Schedule Now
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </a>
              </div>
            </div>
          </div>

          <div className="group border border-charcoal/10 bg-white p-6 transition-colors hover:border-clay/40 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-sand text-bark">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-xl font-semibold text-bark">Explore Resources</h2>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/70">
                  Access our library of support materials, guides, and self-care resources.
                </p>
                <Link
                  href="/resources"
                  className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition-colors hover:text-clay"
                >
                  Browse Resources
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-charcoal/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-charcoal/70">
            No rush. Take your time and return when you feel ready.
          </p>
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <Link
              href="/"
              className="inline-flex min-h-10 items-center gap-2 border border-charcoal/10 bg-white px-3 py-2 font-semibold text-bark transition-colors hover:border-clay/40"
            >
              <Home className="h-4 w-4 text-clay" />
              Return Home
            </Link>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center border border-charcoal/10 bg-white px-3 py-2 font-semibold text-bark transition-colors hover:border-clay/40"
            >
              Have Questions?
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

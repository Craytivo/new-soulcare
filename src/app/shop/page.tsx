import type { Metadata } from 'next'
import Link from 'next/link'
import WaitlistForm from '@/components/forms/WaitlistForm'
import EditorialPageHero from '@/components/ui/EditorialPageHero'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Shop - Soul Care Counselling',
  description: 'Our shop is coming soon. Join the waitlist to be notified when it launches.',
}

export default function ShopPage() {
  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <EditorialPageHero
          eyebrow="Coming soon"
          title="A little something for your wellbeing."
          description="We are building the Soul Care shop and will share updates as soon as it is ready. Join the waitlist to hear when it launches."
          aside={
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Be the first to know
              </p>
              <p className="mt-3 font-heading text-2xl font-semibold text-white">
                Thoughtful tools are on the way.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Sign up for a launch update. We will only email you about the shop.
              </p>
            </>
          }
        >
          <div className="mt-7 max-w-lg">
            <WaitlistForm />
          </div>
        </EditorialPageHero>

        <section className="grid gap-6 border-y border-charcoal/10 py-10 sm:py-12 md:grid-cols-[1fr_auto] md:items-center md:gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              Need support now?
            </p>
            <h2 className="mt-3 font-heading text-xl font-semibold text-bark md:text-2xl">
              Need support right now?
            </h2>
            <p className="mt-2 text-sm leading-7 text-charcoal/75">
              While the shop is in progress, you can still access support through counselling and
              our free resource library.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://thesoulcarecounsellor.janeapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center justify-center bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-bark"
            >
              Book Consultation
            </a>
            <Link
              href="/resources"
              className="inline-flex min-h-11 items-center justify-center border border-charcoal/15 bg-white px-5 py-3 text-sm font-semibold text-bark transition hover:border-clay/40"
            >
              View Resources
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}

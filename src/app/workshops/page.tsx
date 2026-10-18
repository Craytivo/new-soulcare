import type { Metadata } from 'next'

export const revalidate = 300
import ContentWorkshops from '@/components/ContentWorkshops'
import EditorialPageHero from '@/components/ui/EditorialPageHero'

export const metadata: Metadata = {
  title: 'Wellness Webinars â€” Soul Care Counselling',
  description:
    'Find recordings of our free monthly wellness webinars, packed with valuable insights and practical tips from our dedicated therapists.',
}

export default function WorkshopsPage() {
  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <EditorialPageHero
          eyebrow="Wellness webinar recordings"
          title="Learn and reflect at your own pace."
          description="Missed our free monthly webinars? Explore past virtual sessions for practical insights from our counselling team."
          aside={
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                On demand
              </p>
              <p className="mt-3 font-heading text-2xl font-semibold text-white">
                Revisit the conversations that matter.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Watch recordings and find ideas to support wellbeing in everyday life.
              </p>
            </>
          }
        />

        {/* Workshops from Content */}
        <ContentWorkshops />

        {/* YouTube Playlist Section */}
        <section className="grid gap-8 border-y border-charcoal/10 py-10 sm:py-12 md:grid-cols-2 md:items-center md:gap-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              More to explore
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
              Watch Our Workshop Playlist
            </h2>
            <p className="mt-3 text-sm leading-7 text-charcoal/75">
              Catch up on past workshops and Soul Care Conversations on our YouTube playlist.
            </p>
            <a
              href="https://www.youtube.com/playlist?list=PLlhZux5jyaC8Cv3SjYpvauGPC-hyWiN3P"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-11 items-center justify-center bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-bark"
            >
              View the Workshop Playlist on YouTube
            </a>
          </div>
          <div className="min-w-0">
            <iframe
              src="https://www.youtube.com/embed/videoseries?list=PLlhZux5jyaC8Cv3SjYpvauGPC-hyWiN3P"
              title="Soul Care Workshops Playlist"
              width="560"
              height="315"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full border border-charcoal/10"
            ></iframe>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 sm:py-14">
          <div className="bg-charcoal px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                A thoughtful next step
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
                Ready to begin your healing journey?
              </h2>
              <p className="mt-3 leading-7 text-white/70">
                Book a free consultation to explore how our faith-centered approach can support your
                growth.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <a
                href="https://thesoulcarecounsellor.janeapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-12 items-center justify-center bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
              >
                Book a Free Consultation
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

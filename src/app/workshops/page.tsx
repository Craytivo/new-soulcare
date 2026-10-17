import type { Metadata } from 'next'

export const revalidate = 300
import ContentWorkshops from '@/components/ContentWorkshops'

export const metadata: Metadata = {
  title: 'Wellness Webinars â€” Soul Care Counselling',
  description:
    'Find recordings of our free monthly wellness webinars, packed with valuable insights and practical tips from our dedicated therapists.',
}

export default function WorkshopsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-[11px] uppercase tracking-[.22em] ring-1 ring-cream/30">
            Wellness Webinar Recordings
          </span>
          <h1 className="mt-3 font-heading text-3xl font-bold md:text-4xl">
            Wellness Webinar Recordings
          </h1>
          <p className="mt-3 max-w-3xl text-cream/85">
            Missed our free monthly webinars? Below, you&apos;ll find recordings of all previous
            virtual webinars, each packed with valuable insights and practical tips from our
            dedicated therapists.
          </p>
        </div>
      </section>

      {/* Workshops from Content */}
      <ContentWorkshops />

      {/* YouTube Playlist Section */}
      <section className="mt-16 rounded-2xl bg-sand p-6 ring-1 ring-charcoal/10 md:p-8">
        <div className="mx-auto max-w-2xl text-center">
          <h3 className="mb-3 font-heading text-xl font-semibold md:text-2xl">
            Watch Our Workshop Playlist
          </h3>
          <p className="mb-6 text-charcoal/80">
            Catch up on past workshops and Soul Care Conversations on our YouTube playlist.
          </p>
          <a
            href="https://www.youtube.com/playlist?list=PLlhZux5jyaC8Cv3SjYpvauGPC-hyWiN3P"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md bg-clay px-6 py-3 text-lg font-semibold text-charcoal ring-1 ring-charcoal/10 hover:bg-clay/90"
          >
            View the Workshop Playlist on YouTube
          </a>
          <div className="mt-8 flex justify-center">
            <iframe
              width="360"
              height="203"
              src="https://www.youtube.com/embed/videoseries?list=PLlhZux5jyaC8Cv3SjYpvauGPC-hyWiN3P"
              title="Soul Care Workshops Playlist"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl border border-charcoal/10 shadow-lg"
            ></iframe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-16 rounded-2xl bg-bark p-6 text-cream ring-1 ring-cream/15 md:p-8">
        <div className="grid gap-6 md:grid-cols-3 md:items-center">
          <div className="md:col-span-2">
            <h3 className="font-heading text-xl font-semibold md:text-2xl">
              Ready to begin your healing journey?
            </h3>
            <p className="mt-2 text-cream/85">
              Book a free consultation to explore how our faith-centered approach can support your
              growth.
            </p>
          </div>
          <div className="md:justify-self-end">
            <a
              href="https://thesoulcarecounsellor.janeapp.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-clay px-5 py-2.5 font-semibold text-charcoal ring-1 ring-charcoal/10 hover:bg-clay/90"
            >
              Book a Free Consultation
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

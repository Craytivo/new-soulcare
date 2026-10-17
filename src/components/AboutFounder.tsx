import Link from 'next/link'
import Image from 'next/image'

export default function AboutFounder() {
  return (
    <section className="section-spacing section-padding">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-12 md:grid-cols-2 lg:gap-20">
          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-sand/50">
            <Image
              src="/images/jessica-robinson-grant.jpg"
              alt="Jessica Robinson-Grant, Founder"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col space-y-6">
            <div>
              <span className="label-text mb-4 block">About the Founder</span>
              <h2 className="heading-lg text-charcoal">
                <Link
                  href="/about/jessica-robinson-grant"
                  className="decoration-clay/50 decoration-2 underline-offset-4 transition-all hover:underline"
                >
                  Jessica Robinson-Grant
                </Link>
              </h2>
              <p className="body-text-large mt-4">Founder & Clinical Director</p>
            </div>

            <div className="body-text space-y-4">
              <p>
                Jessica founded Soul Care Christian Counselling with a vision to provide
                faith-centered, culturally sensitive therapy that honors both psychological
                expertise and spiritual values.
              </p>
              <p>
                With over a decade of clinical experience, she brings a unique blend of professional
                training and compassionate care to every session. Her approach integrates
                evidence-based therapeutic techniques with a deep understanding of how faith and
                mental health intersect.
              </p>
              <p>
                She believes that everyone deserves access to quality mental health support that
                respects their whole selfâ€”mind, body, and spirit.
              </p>
            </div>

            <Link
              href="/about/jessica-robinson-grant"
              className="group inline-flex items-center font-semibold text-charcoal transition-colors duration-200 hover:text-clay"
            >
              Read Jessica&apos;s full story
              <svg
                className="ml-2 h-4 w-4 transform transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

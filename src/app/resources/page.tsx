import type { Metadata } from 'next'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Free Mental Health Resources | Soul Care Counselling',
  description:
    'Download free worksheets, guides, and therapeutic materials for trauma healing, anxiety, depression, and spiritual care. Professional resources from certified Christian counsellors.',
  keywords:
    'free mental health resources, therapy worksheets, anxiety resources, trauma worksheets, christian counselling resources, self-care guides',
  openGraph: {
    title: 'Free Mental Health Resources | Soul Care Counselling',
    description:
      'Download free worksheets, guides, and therapeutic materials to support your mental health journey.',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mental Health Resources | Soul Care Counselling',
    description:
      'Download free worksheets, guides, and therapeutic materials to support your mental health journey.',
  },
  alternates: {
    canonical: '/resources',
  },
}

import { getResources, getFeaturedResources } from '@/lib/content-queries'
import ResourcesClient from '@/components/resources/ResourcesClient'
import ConsultationCta from '@/components/cta/ConsultationCta'
import ResourceLeadForm from '@/components/forms/ResourceLeadForm'
import Link from 'next/link'

export default async function ResourcesPage() {
  const [allResources, featuredResources] = await Promise.all([
    getResources(),
    getFeaturedResources(),
  ])

  // Calculate resource stats
  const totalResources = allResources.length
  const categoryCount = new Set(allResources.map((r) => r.category).filter(Boolean)).size

  // Generate structured data for resources
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Free Mental Health Resources | Soul Care Counselling',
    description:
      'Download free worksheets, guides, and therapeutic materials for trauma healing, anxiety, depression, and spiritual care.',
    url: 'https://thesoulcarecounsellor.com/resources',
    provider: {
      '@type': 'Organization',
      name: 'Soul Care Counselling',
      url: 'https://thesoulcarecounsellor.com',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Free Mental Health Resources',
      itemListElement: allResources.slice(0, 10).map((resource, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'DigitalDocument',
          name: resource.title,
          description: resource.description,
          encodingFormat: 'application/pdf',
          author: {
            '@type': 'Organization',
            name: 'Soul Care Counselling',
          },
        },
      })),
    },
  }

  return (
    <>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Enhanced Hero Section */}
      <section className="relative overflow-hidden rounded-xl bg-bark text-cream ring-1 ring-cream/15 md:rounded-2xl">
        {/* Animated gradient background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <div
            className="absolute -right-8 -top-8 h-40 w-40 animate-pulse rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl md:-right-12 md:-top-12 md:h-56 md:w-56"
            style={{ animationDuration: '4s' }}
          ></div>
          <div
            className="absolute -bottom-8 -left-8 h-32 w-32 animate-pulse rounded-full bg-gradient-to-tr from-cream/10 to-clay/20 blur-2xl md:-bottom-12 md:-left-12 md:h-48 md:w-48"
            style={{ animationDuration: '5s', animationDelay: '1s' }}
          ></div>
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-clay/10 via-transparent to-cream/5 blur-3xl md:h-96 md:w-96"></div>
        </div>

        <div className="relative z-10 px-5 py-8 sm:px-6 sm:py-10 md:px-10 md:py-16 lg:px-12 lg:py-20">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1.5 text-[11px] uppercase tracking-[.22em] ring-1 ring-cream/30 backdrop-blur-sm">
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5S19.832 5.477 21 6.253v13C19.832 18.477 18.246 18 16.5 18s-3.332.477-4.5 1.253"
                />
              </svg>
              Free Downloads
            </span>

            <h1 className="mt-4 text-balance font-heading text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
              Your Mental Health <span className="text-clay">Resource Library</span>
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-cream/85 md:text-xl">
              Professional worksheets, guides, and tools designed by certified Christian counsellors
              to support your healing journey.
            </p>

            {/* Value Props */}
            <div className="mt-5 flex flex-wrap gap-2 md:mt-6 md:gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-sm md:gap-2 md:px-4 md:py-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay md:h-5 md:w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap text-xs text-cream/80 md:text-sm">
                  Clinically-Tested
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-sm md:gap-2 md:px-4 md:py-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay md:h-5 md:w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="whitespace-nowrap text-xs text-cream/80 md:text-sm">
                  Faith-Centered
                </span>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur-sm md:gap-2 md:px-4 md:py-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay md:h-5 md:w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="whitespace-nowrap text-xs text-cream/80 md:text-sm">
                  Free Download
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Resources with Filter and Search */}
      <section className="mt-8">
        <p className="mb-6 text-sm text-charcoal/75">
          Looking for deeper support as you apply these tools? Explore our{' '}
          <Link
            href="/services"
            className="underline decoration-charcoal/30 hover:decoration-charcoal"
          >
            counselling services
          </Link>{' '}
          or{' '}
          <Link
            href="/contact"
            className="underline decoration-charcoal/30 hover:decoration-charcoal"
          >
            speak with our team
          </Link>
          .
        </p>

        <ResourcesClient allResources={allResources} featuredResources={featuredResources} />
      </section>

      {/* Enhanced Newsletter Signup */}
      <section className="mt-12 rounded-xl bg-gradient-to-br from-sand/60 to-sand/40 p-5 ring-1 ring-charcoal/5 backdrop-blur-sm md:mt-16 md:rounded-2xl md:p-8 lg:p-10">
        <div className="md:grid md:grid-cols-2 md:items-center md:gap-8 lg:gap-10">
          <div className="mb-5 md:mb-0">
            <h3 className="mb-2 font-heading text-xl font-bold tracking-tight text-charcoal md:mb-3 md:text-2xl lg:text-3xl">
              Get New Resources First
            </h3>
            <p className="mb-4 leading-relaxed text-charcoal/75">
              Join our wellness community and receive exclusive worksheets, seasonal guides, and
              therapeutic tools delivered to your inbox.
            </p>
            {/* Value Proposition Bullets */}
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Instant access to all free resources
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                New tools delivered monthly
              </li>
              <li className="flex items-center gap-2">
                <svg
                  className="h-4 w-4 flex-shrink-0 text-clay"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Unsubscribe anytimeâ€”no spam
              </li>
            </ul>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-charcoal/10 md:rounded-xl md:p-6">
            <ResourceLeadForm />
          </div>
        </div>
      </section>

      <ConsultationCta
        title="Ready for personalized support?"
        description="If these resources resonate with you, a consultation can help you choose the right next step in a supportive, no-pressure way."
        trackingLocation="resources-bottom"
        variant="bark"
      />
    </>
  )
}

import type { Metadata } from 'next'
import { ArrowRight, Download } from 'lucide-react'
import Link from 'next/link'
import ConsultationCta from '@/components/cta/ConsultationCta'
import ResourceLeadForm from '@/components/forms/ResourceLeadForm'
import ResourcesClient from '@/components/resources/ResourcesClient'
import { getFeaturedResources, getResources } from '@/lib/content-queries'

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
      'Download free worksheets, guides, and therapeutic tools to support your mental health journey.',
    type: 'website',
    locale: 'en_CA',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Mental Health Resources | Soul Care Counselling',
    description:
      'Download free worksheets, guides, and therapeutic tools to support your mental health journey.',
  },
  alternates: {
    canonical: '/resources',
  },
}

export default async function ResourcesPage() {
  const [allResources, featuredResources] = await Promise.all([
    getResources(),
    getFeaturedResources(),
  ])

  const totalResources = allResources.length
  const categoryCount = new Set(allResources.map((resource) => resource.category).filter(Boolean))
    .size

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
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              Free downloads
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              Your mental health resource library.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              Practical worksheets, guides, and therapeutic tools to support your healing journey.
            </p>
            <Link
              href="#resource-library"
              className="group mt-7 inline-flex min-h-11 items-center gap-2 self-start text-sm font-semibold text-white/80 underline decoration-white/35 underline-offset-4 transition hover:text-white"
            >
              Browse resources
              <ArrowRight
                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
          <div className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              The library
            </p>
            <p className="mt-3 font-heading text-4xl font-semibold text-white">
              {totalResources}
              <span className="ml-2 text-2xl text-white/70">resources</span>
            </p>
            <p className="mt-2 text-sm text-white/65">
              Across {categoryCount} topics, ready to explore at your own pace.
            </p>
            <div className="mt-7 border-t border-white/15 pt-5">
              <div className="flex items-center gap-3">
                <Download className="h-5 w-5 text-clay" aria-hidden="true" />
                <p className="text-sm leading-6 text-white/75">
                  Downloadable tools and gentle guidance, whenever you need them.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="resource-library" className="py-10 sm:py-12">
          <div className="mb-7 grid gap-4 border-b border-charcoal/10 pb-7 sm:grid-cols-[0.7fr_1.3fr] sm:items-end sm:gap-12">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                Browse and download
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
                Tools for your journey.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-charcoal/70">
              Looking for deeper support as you apply these tools? Explore our{' '}
              <Link
                href="/services"
                className="font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
              >
                counselling services
              </Link>{' '}
              or{' '}
              <Link
                href="/contact"
                className="font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
              >
                speak with our team
              </Link>
              .
            </p>
          </div>
          <ResourcesClient allResources={allResources} featuredResources={featuredResources} />
        </section>

        <section className="border-y border-charcoal/10 py-10 sm:py-12">
          <div className="md:grid md:grid-cols-2 md:items-center md:gap-8 lg:gap-10">
            <div className="mb-5 md:mb-0">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                Stay connected
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold tracking-tight text-bark sm:text-3xl">
                Get new resources first.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-charcoal/75">
                Join our wellness community and receive exclusive worksheets, seasonal guides, and
                therapeutic tools delivered to your inbox.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-charcoal/70">
                <li>Instant access to free resources</li>
                <li>New tools delivered monthly</li>
                <li>Unsubscribe anytime</li>
              </ul>
            </div>
            <div className="border border-charcoal/10 bg-white p-5 sm:p-6">
              <ResourceLeadForm />
            </div>
          </div>
        </section>

        <section className="py-12 sm:py-16">
          <ConsultationCta
            title="Ready for personalized support?"
            description="If these resources resonate with you, a consultation can help you choose the right next step in a supportive, no-pressure way."
            trackingLocation="resources-bottom"
            variant="bark"
            className="!mt-0 !rounded-none !bg-charcoal !shadow-none !ring-0"
          />
        </section>
      </div>
    </div>
  )
}

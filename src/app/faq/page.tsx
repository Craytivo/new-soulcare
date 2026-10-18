import type { Metadata } from 'next'
import { getFAQPage } from '@/lib/content-queries'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'
import EditorialPageHero from '@/components/ui/EditorialPageHero'
import { FAQSection, CTASection } from '@/components/faq'

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getFAQPage()

  return {
    title: pageData?.title
      ? `${pageData.title} | Soul Care Counselling`
      : 'FAQs | Soul Care Counselling',
    description:
      pageData?.metaDescription ||
      'Frequently Asked Questions about Soul Care Counselling services.',
    alternates: { canonical: '/faq' },
    openGraph: {
      title: pageData?.title
        ? `${pageData.title} | Soul Care Counselling`
        : 'FAQs | Soul Care Counselling',
      description:
        pageData?.metaDescription ||
        'Frequently Asked Questions about Soul Care Counselling services.',
      url: 'https://thesoulcarecounsellor.ca/faq',
      siteName: 'Soul Care Counselling',
      locale: 'en_CA',
      type: 'website',
    },
  }
}

export const revalidate = 300

export default async function FAQPage() {
  const pageData = await getFAQPage()

  if (!pageData) {
    return (
      <EmptyState
        title="FAQ page content not found."
        description="Frequently asked questions are being prepared."
        action={
          <Link href="/contact" className="ui-btn-primary">
            Return to the FAQ page
          </Link>
        }
      />
    )
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: pageData.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }

  const categories = ['Sessions', 'Pricing', 'Policies']
  const third = Math.ceil(pageData.faqs.length / 3)
  const faqGroups = [
    { title: 'Sessions', id: 'faq-sessions', faqs: pageData.faqs.slice(0, third), startIndex: 0 },
    {
      title: 'Pricing',
      id: 'faq-pricing',
      faqs: pageData.faqs.slice(third, third * 2),
      startIndex: third,
    },
    {
      title: 'Policies',
      id: 'faq-policies',
      faqs: pageData.faqs.slice(third * 2),
      startIndex: third * 2,
    },
  ]

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <EditorialPageHero
          eyebrow={pageData.hero.badge}
          title={pageData.hero.heading}
          description={pageData.hero.description}
          aside={
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Frequently asked
              </p>
              <p className="mt-3 font-heading text-2xl font-semibold text-white">
                Clear answers, at your pace.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Browse questions about sessions, pricing, and what to expect.
              </p>
            </>
          }
        />

        {/* Quick-nav category pills */}
        <section className="mt-8 border-y border-charcoal/10 py-5">
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <a
                key={cat}
                href={`#faq-${cat.toLowerCase()}`}
                className="inline-flex min-h-10 items-center border border-charcoal/10 bg-white px-3 py-2 text-sm font-medium text-charcoal/80 transition hover:border-clay/40 hover:text-bark"
              >
                {cat}
              </a>
            ))}
          </div>
        </section>

        {/* FAQ Sections */}
        <div className="divide-y divide-charcoal/10">
          {faqGroups.map((group) => (
            <FAQSection key={group.id} {...group} />
          ))}
        </div>

        <div className="py-10 sm:py-14">
          <CTASection icon="question" />
        </div>
      </div>
    </div>
  )
}

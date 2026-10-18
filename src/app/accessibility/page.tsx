import type { Metadata } from 'next'
import { getAccessibilityPage } from '@/lib/content-queries'
import { PortableText } from '@portabletext/react'
import EditorialPageHero from '@/components/ui/EditorialPageHero'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Accessibility - Soul Care Counselling',
  description:
    'Accessibility statement for Soul Care Counselling - Learn how we ensure our website and services are accessible to all users.',
}

export default async function AccessibilityPage() {
  const pageData = await getAccessibilityPage()
  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <EditorialPageHero
          eyebrow="Our commitment"
          title={pageData?.title || 'Accessibility'}
          aside={
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                Access matters
              </p>
              <p className="mt-3 font-heading text-2xl font-semibold text-white">
                Care and information should be accessible.
              </p>
              <p className="mt-3 text-sm leading-6 text-white/70">
                Read our accessibility statement and contact us if you need assistance.
              </p>
            </>
          }
        />
        <div className="prose prose-lg mt-10 max-w-4xl border-t border-charcoal/10 pt-8">
          {pageData?.content && <PortableText value={pageData.content} />}
        </div>
      </div>
    </div>
  )
}

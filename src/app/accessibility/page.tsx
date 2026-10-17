import type { Metadata } from 'next'
import { getAccessibilityPage } from '@/lib/content-queries'
import { PortableText } from '@portabletext/react'

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Accessibility - Soul Care Counselling',
  description:
    'Accessibility statement for Soul Care Counselling - Learn how we ensure our website and services are accessible to all users.',
}

export default async function AccessibilityPage() {
  const pageData = await getAccessibilityPage()
  return (
    <div className="mx-auto max-w-4xl">
      <section className="relative mb-12 overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            {pageData?.title || 'Accessibility'}
          </h1>
        </div>
      </section>
      <div className="prose prose-lg max-w-none">
        {pageData?.content && <PortableText value={pageData.content} />}
      </div>
    </div>
  )
}

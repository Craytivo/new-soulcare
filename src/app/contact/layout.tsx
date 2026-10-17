import type { Metadata } from 'next'
import { getContactPage } from '@/lib/content-queries'

export async function generateMetadata(): Promise<Metadata> {
  try {
    const pageData = await getContactPage()

    return {
      title: pageData?.seo.metaTitle || 'Soul Care â€” Contact',
      description:
        pageData?.seo.metaDescription ||
        'Contact Soul Care Christian Counselling. Book a free consultation, send a message, or reach us by email.',
    }
  } catch (error) {
    console.error('Error generating contact page metadata:', error)
    return {
      title: 'Soul Care â€” Contact',
      description:
        'Contact Soul Care Christian Counselling. Book a free consultation, send a message, or reach us by email.',
    }
  }
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children
}

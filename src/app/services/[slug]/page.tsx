import type { Metadata } from 'next'
import ContentServicePage from '@/components/ContentServicePage'
import { getServicePage } from '@/lib/content-queries'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const serviceData = await getServicePage(slug)
  if (!serviceData) {
    return {
      title: 'Service Not Found | Soul Care Counselling',
    }
  }
  return {
    title: `${serviceData.title} | Soul Care Counselling`,
    description: 'Faith-centered, culturally sensitive therapy. Virtual across Canada.',
  }
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params
  return <ContentServicePage slug={slug} />
}

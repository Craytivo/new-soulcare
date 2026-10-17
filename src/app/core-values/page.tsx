import type { Metadata } from 'next'
import ContentCoreValuesPage from '@/components/ContentCoreValuesPage'

export const metadata: Metadata = {
  title: 'Soul Care — Core Pillars',
  description:
    'Our core pillars: Mindfullness, Body care, Spiritual Care, Self-Love and Acceptance, and Community.',
}

export default function CoreValuesPage() {
  return <ContentCoreValuesPage />
}

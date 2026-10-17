import type { Metadata } from 'next'
import ContentAreasPage from '@/components/ContentAreasPage'

export const metadata: Metadata = {
  title: 'Soul Care - Areas of Focus',
  description:
    'Trauma, Life Transition, Identity, Relationships, Anxiety, Depression, and Stress Management.',
}

export default function AreasPage() {
  return <ContentAreasPage />
}

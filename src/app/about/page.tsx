import type { Metadata } from 'next'
import ContentAboutPage from '@/components/ContentAboutPage'

export const metadata: Metadata = {
  title: 'Soul Care - About Us',
  description:
    'About Soul Care Counselling - faith-centered, culturally responsive therapy. Our mission, pillars, and team.',
}

export default function AboutPage() {
  return <ContentAboutPage />
}

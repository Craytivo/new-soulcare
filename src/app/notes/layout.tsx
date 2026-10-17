import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Notes from Soul Care - Soul Care Counselling',
  description:
    'Insights, reflections, and guidance from our team of Christian counselors. Explore faith-centered perspectives on mental health, healing, and personal growth.',
}

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return children
}

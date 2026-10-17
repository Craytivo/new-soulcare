import { Suspense } from 'react'
import { getBlogPosts, getFeaturedBlogPosts } from '@/lib/content-queries'
import NotesClient from './NotesClient'
import LoadingState from '@/components/ui/LoadingState'

// ISR with tag revalidation for Content-driven content
export const revalidate = 300

// This is now a Server Component that fetches data on the server
export default async function NotesPage() {
  // Fetch data on the server (no CORS issues)
  const [allPosts, featuredPosts] = await Promise.all([getBlogPosts(), getFeaturedBlogPosts()])

  return (
    <Suspense fallback={<LoadingState message="Loading notes..." />}>
      <NotesClient allPosts={allPosts} featuredPosts={featuredPosts} />
    </Suspense>
  )
}

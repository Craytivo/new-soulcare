import { notFound } from 'next/navigation'
import { getTeamMember, getTeamMembers } from '@/lib/content-queries'
import { urlForImage } from '@/lib/content'
import TeamMemberPage from '@/components/team/TeamMemberPage'

interface TeamMemberPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static pages for all team members at build time
export async function generateStaticParams() {
  const members = await getTeamMembers()
  return members.map((member) => ({
    slug: member.slug.current,
  }))
}

export default async function TeamMemberRoute({ params }: TeamMemberPageProps) {
  const { slug } = await params
  const member = await getTeamMember(slug)

  if (!member) {
    notFound()
  }

  // Convert Content types to component types
  const memberData = {
    ...member,
    image: member.image ? urlForImage(member.image, { fit: 'crop' }).url() : '',
    heroImage: member.image
      ? urlForImage(member.image, { width: 1200, height: 600, fit: 'crop' }).url()
      : '',
    portraitImage: member.image
      ? urlForImage(member.image, { width: 365, height: 365, fit: 'crop' }).url()
      : '',
    bio: member.bio as unknown[],
    specialties: member.specialties || [],
    areasOfFocus: member.areasOfFocus || [],
    socialLinks: member.socialLinks || [],
  }

  return <TeamMemberPage member={memberData} />
}

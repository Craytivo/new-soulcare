import { notFound } from 'next/navigation'
import { getTeamMember, getTeamMembers } from '@/lib/content-queries'
import { urlForImage } from '@/lib/content'
import { getLocalTeamImage } from '@/lib/team-images'
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
    image:
      getLocalTeamImage(member) ??
      (member.image ? urlForImage(member.image, { fit: 'crop' }).url() : ''),
    heroImage:
      getLocalTeamImage(member) ??
      (member.image
        ? urlForImage(member.image, { width: 1200, height: 600, fit: 'crop' }).url()
        : ''),
    secondaryImage: member.secondaryImage
      ? urlForImage(member.secondaryImage, { width: 900, height: 600, fit: 'crop' }).url()
      : '',
    portraitImage:
      getLocalTeamImage(member) ??
      (member.image
        ? urlForImage(member.image, { width: 365, height: 365, fit: 'crop' }).url()
        : ''),
    bio: member.bio as unknown[],
    specialties: member.specialties || [],
    areasOfFocus: member.areasOfFocus || [],
    bestFitFor: member.bestFitFor || '',
    clientTypes: member.clientTypes || [],
    languages: member.languages || [],
    sessionFormats: member.sessionFormats || [],
    approaches: member.approaches || [],
    socialLinks: member.socialLinks || [],
  }

  return <TeamMemberPage member={memberData} />
}

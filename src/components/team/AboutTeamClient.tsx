'use client'
import ContentTeamClient from '@/components/ContentTeamClient'
import type { TeamMember } from '@/lib/content'

export default function AboutTeamClient({ teamMembers }: { teamMembers: TeamMember[] }) {
  return <ContentTeamClient teamMembers={teamMembers} />
}

import type { TeamMember } from './content'

const LOCAL_TEAM_IMAGES: Record<string, string> = {
  baraka: '/assets/img/team/Baraka.jpg',
  davene: '/assets/img/team/Davene.jpg',
  jessica: '/assets/img/team/Jessica.jpg',
  khadian: '/assets/img/team/Khadian(1).jpg',
  natalie: '/assets/img/team/Natalie.jpg',
  nigel: '/assets/img/team/Nigel(1).jpg',
  oluseye: '/assets/img/team/Oluseye(1).jpg',
  rushaunna: '/assets/img/team/Rushaunna Griffith.jpg',
}

export function getLocalTeamImage(member: Pick<TeamMember, 'name' | 'slug'>) {
  const identity = `${member.name} ${member.slug.current}`.toLowerCase()
  const match = Object.entries(LOCAL_TEAM_IMAGES).find(([key]) => identity.includes(key))
  return match?.[1] ?? null
}

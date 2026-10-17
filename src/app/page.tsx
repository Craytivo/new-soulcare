export const revalidate = 300
import { getTeamMembers, getHomePage, getServices } from '../lib/content-queries'
import HomeClient from './HomeClient'

export default async function Home() {
  const [teamMembers, homePageData, servicesData] = await Promise.all([
    getTeamMembers(),
    getHomePage(),
    getServices(),
  ])

  return (
    <HomeClient teamMembers={teamMembers} homePageData={homePageData} servicesData={servicesData} />
  )
}

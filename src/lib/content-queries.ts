import { contentFetch } from './content'
import { cache } from 'react'
import type { TypedObject } from '@portabletext/types'
import type {
  TeamMember,
  Workshop,
  Service,
  ServicePage,
  CoreValuesPage,
  AboutPage,
  AreasPage,
  BlogPost,
  SiteSettings,
  HomePage,
  Services,
  InternApplicationPage,
  FAQPage,
  ContactPage,
  Resource,
} from './content'

const BASE_TAG = 'content'
const DEFAULT_REVALIDATE = 300

type QueryParams = Record<string, unknown>
interface LegalPage {
  _id: string
  _type: 'privacyPolicyPage' | 'termsOfUsePage' | 'accessibilityPage'
  title?: string
  content?: TypedObject[]
  summary?: string | string[]
  effectiveDate?: string
  _updatedAt?: string
}

async function fetchContentQuery<T>(
  query: string,
  options?: { params?: QueryParams; tags?: string[]; revalidate?: number | false }
): Promise<T> {
  return contentFetch<T>({
    query,
    params: options?.params,
    tags: [BASE_TAG, ...(options?.tags ?? [])],
    revalidate: options?.revalidate ?? DEFAULT_REVALIDATE,
  })
}

async function fetchContentQuerySafe<T>(
  query: string,
  fallback: T,
  options?: { params?: QueryParams; tags?: string[]; revalidate?: number | false }
): Promise<T> {
  try {
    return await fetchContentQuery<T>(query, options)
  } catch (error) {
    console.error(
      `[content] Query failed${options?.tags?.length ? ` for ${options.tags.join(', ')}` : ''}. Using fallback data.`,
      error
    )
    return fallback
  }
}

const imageProjection = `{
  asset { _ref, _type },
  alt,
  crop,
  hotspot
}`

const JESSICA_TEAM_MATCH = `(slug.current == "jessica-robinson-grant" || name in ["Jessica Robinson Grant", "Jessica Robinson-Grant"])`
const NIGEL_TEAM_MATCH = `(slug.current in ["nigel", "nigel-bucknor", "nigel-miller"] || name in ["Nigel", "Nigel Bucknor"])`
const DAVENE_TEAM_MATCH = `(slug.current in ["davene", "davene-harris", "davene-miller"] || name match "Davene*")`

// Discontinued services, hidden from listings and detail pages
const DISCONTINUED_SERVICE_MATCH = `slug.current in ["single-session"]`
const teamMemberProjection = `{
  _id,
  _type,
  name,
  credentials,
  "role": select(
    ${NIGEL_TEAM_MATCH} => "Director of Therapist Development",
    role
  ),
  image ${imageProjection},
  secondaryImage ${imageProjection},
  bio,
  specialties,
  areasOfFocus,
  bestFitFor,
  clientTypes,
  languages,
  sessionFormats,
  approaches,
  virtualAvailable,
  inPersonAvailable,
  socialLinks,
  acceptsBookings,
  slug
}`

// Privacy Policy Page
export async function getPrivacyPolicyPage() {
  return fetchContentQuerySafe<LegalPage | null>(
    `*[_type == "privacyPolicyPage"] | order(_updatedAt desc)[0]`,
    null,
    { tags: ['privacy-policy-page'] }
  )
}

// Terms of Use Page
export async function getTermsOfUsePage() {
  return fetchContentQuerySafe<LegalPage | null>(
    `*[_type == "termsOfUsePage"] | order(_updatedAt desc)[0]`,
    null,
    { tags: ['terms-of-use-page'] }
  )
}

// Accessibility Page
export async function getAccessibilityPage() {
  return fetchContentQuerySafe<LegalPage | null>(
    `*[_type == "accessibilityPage"] | order(_updatedAt desc)[0]`,
    null,
    { tags: ['accessibility-page'] }
  )
}

// Team Members
export async function getTeamMembers(): Promise<TeamMember[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "teamMember" && !(slug.current == "princeton-owusu" || name match "Princeton*")] | order(
        select(
          ${JESSICA_TEAM_MATCH} => 0,
          ${NIGEL_TEAM_MATCH} => 1,
          ${DAVENE_TEAM_MATCH} => 3,
          2
        ) asc,
        name asc
      ) ${teamMemberProjection}
    `,
    [],
    { tags: ['team-members'] }
  )
}

export async function getTeamMember(slug: string): Promise<TeamMember | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "teamMember" && slug.current == $slug && !(slug.current == "princeton-owusu" || name match "Princeton*")][0] ${teamMemberProjection}
    `,
    null,
    { params: { slug }, tags: ['team-members', `team-member:${slug}`] }
  )
}

// Workshops
export async function getWorkshops(): Promise<Workshop[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "workshop"] | order(date desc, _createdAt desc) {
        _id,
        _type,
        title,
        description,
        date,
        time,
        duration,
        instructor,
        instructorRole,
        price,
        isRecorded,
        videoUrl,
        thumbnail ${imageProjection},
        content,
        slug
      }
    `,
    [],
    { tags: ['workshops'] }
  )
}

// Services - Unified query
export async function getServices(): Promise<Services | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "services" && isActive == true] | order(_updatedAt desc)[0] {
        _id,
        _type,
        _updatedAt,
        title,
        metaDescription,
        hero {
          badge,
          heading,
          description,
          priceHighlight {
            text,
            price,
            suffix
          }
        },
        servicesList[!(${DISCONTINUED_SERVICE_MATCH})] {
          title,
          slug,
          description,
          image ${imageProjection},
          features,
          pricing {
            displayType,
            customText,
            amount,
            currency,
            suffix,
            packageSessions
          },
          buttons {
            learnMore {
              show,
              text,
              url,
              external
            },
            bookNow {
              show,
              text,
              url
            }
          },
          isActive
        },
        cta {
          title,
          description,
          buttonText,
          buttonUrl,
          external
        },
        isActive
      }
    `,
    null,
    { tags: ['services'] }
  )
}

export async function getService(slug: string): Promise<Service | null> {
  if (/parent[\s-]*coach/i.test(slug)) return null
  const servicesData = await getServices()
  return (
    servicesData?.servicesList?.find(
      (service) =>
        service.slug?.current === slug &&
        service.isActive &&
        !/single-session/i.test(service.slug.current)
    ) ?? null
  )
}

// Blog Posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "blogPost" && isPublished == true] | order(publishedAt desc) {
        _id,
        _type,
        title,
        excerpt,
        slug,
        featuredImage ${imageProjection},
        publishedAt,
        category,
        tags,
        readingTime,
        isFeatured
      }
    `,
    [],
    { tags: ['blog-posts'] }
  )
}

export const getBlogPost = cache(async (slug: string): Promise<BlogPost | null> => {
  return fetchContentQuerySafe(
    `
      *[_type == "blogPost" && slug.current == $slug && isPublished == true][0] {
        _id,
        _type,
        title,
        excerpt,
        slug,
        content,
        featuredImage ${imageProjection},
        publishedAt,
        isPublished,
        category,
        tags,
        readingTime,
        isFeatured,
        seoTitle,
        seoDescription,
        relatedPosts[]-> {
          _id,
          _type,
          title,
          slug
        },
        callToAction {
          text,
          link,
          type
        }
      }
    `,
    null,
    { params: { slug }, tags: ['blog-posts', `blog-post:${slug}`] }
  )
})

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "blogPost" && isPublished == true && isFeatured == true] | order(publishedAt desc)[0...3] {
        _id,
        _type,
        title,
        excerpt,
        slug,
        featuredImage ${imageProjection},
        publishedAt,
        category,
        tags,
        readingTime,
        isFeatured
      }
    `,
    [],
    { tags: ['blog-posts'] }
  )
}

export async function getBlogPostsByCategory(category: string): Promise<BlogPost[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "blogPost" && isPublished == true && category == $category] | order(publishedAt desc) {
        _id,
        _type,
        title,
        excerpt,
        slug,
        featuredImage ${imageProjection},
        publishedAt,
        category,
        tags,
        readingTime
      }
    `,
    [],
    { params: { category }, tags: ['blog-posts', `blog-category:${category}`] }
  )
}

export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "blogPost" && isPublished == true && $tag in tags] | order(publishedAt desc) {
        _id,
        _type,
        title,
        excerpt,
        slug,
        featuredImage ${imageProjection},
        publishedAt,
        category,
        tags,
        readingTime
      }
    `,
    [],
    { params: { tag }, tags: ['blog-posts', `blog-tag:${tag}`] }
  )
}

// Core Values Page
export async function getCoreValuesPage(): Promise<CoreValuesPage | null> {
  const page = await fetchContentQuerySafe<CoreValuesPage | null>(
    `
      *[_type == "coreValuesPage" && isActive == true][0] {
        _id,
        _type,
        title,
        metaDescription,
        hero {
          badge,
          title,
          description,
          image ${imageProjection}
        },
        values[] | order(order asc) {
          title,
          description,
          order
        },
        cta {
          title,
          description,
          buttonText,
          buttonLink,
          external
        },
        isActive
      }
    `,
    null,
    { tags: ['core-values-page'] }
  )

  return page || null
}

// About Page
export async function getAboutPage(): Promise<AboutPage | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "aboutPage"][0] {
        _id,
        _type,
        hero {
          badge,
          title,
          description,
          backgroundImage ${imageProjection},
          featuredImage ${imageProjection}
        },
        welcome {
          title,
          content
        },
        pillars {
          title,
          pillarList[] {
            title,
            description
          }
        },
        director {
          badge,
          name,
          credentials,
          description,
          quote,
          image ${imageProjection},
          bookingLink,
          bookingText,
          psychologyTodayImage ${imageProjection},
          psychologyTodayLink
        },
        cta {
          title,
          description,
          buttonText,
          buttonLink,
          external
        }
      }
    `,
    null,
    { tags: ['about-page'] }
  )
}

// Areas Page
export async function getAreasPage(): Promise<AreasPage | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "areasPage"][0] {
        _id,
        _type,
        hero {
          badge,
          title,
          description
        },
        areas[] | order(order asc) {
          title,
          slug,
          content,
          order
        },
        cta {
          title,
          description,
          buttonText,
          buttonLink,
          external
        }
      }
    `,
    null,
    { tags: ['areas-page'] }
  )
}

// Service Pages
export async function getServicePages(): Promise<ServicePage[]> {
  const pages = await fetchContentQuerySafe<ServicePage[]>(
    `
      *[_type == "servicePage" && isActive == true] | order(title asc) {
        _id,
        _type,
        title,
        slug,
        metaDescription,
        badge,
        mainTitle,
        heroDescription,
        quote,
        primaryCta,
        secondaryCta,
        sections,
        isActive
      }
    `,
    [],
    { tags: ['service-pages'] }
  )

  return pages.filter(
    (page) => !/parent[\s-]*coach/i.test(page.title + ' ' + (page.slug?.current ?? ''))
  )
}

export async function getServicePage(slug: string): Promise<ServicePage | null> {
  if (/parent[\s-]*coach/i.test(slug)) return null
  const page = await fetchContentQuerySafe<ServicePage | null>(
    `
      *[_type == "servicePage" && slug.current == $slug && isActive == true][0] {
        _id,
        _type,
        title,
        slug,
        metaDescription,
        badge,
        mainTitle,
        heroDescription,
        quote,
        primaryCta,
        secondaryCta,
        sections,
        isActive
      }
    `,
    null,
    { params: { slug }, tags: ['service-pages', `service-page:${slug}`] }
  )

  return page || null
}

// Site Settings
export async function getSiteSettings(): Promise<SiteSettings | null> {
  const settings = await fetchContentQuerySafe<SiteSettings | null>(
    `
      *[_type == "siteSettings"][0] {
        _id,
        _type,
        siteTitle,
        siteDescription,
        contactEmail,
        contactPhone,
        address,
        logo ${imageProjection},
        heroTitle,
        heroSubtitle,
        heroImage ${imageProjection},
        socialLinks
      }
    `,
    null,
    { tags: ['site-settings'] }
  )

  return settings || null
}

// Homepage
export async function getHomePage(): Promise<HomePage | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "homePage" && isActive == true][0] {
        _id,
        _type,
        title,
        metaDescription,
        hero {
          mainHeading,
          highlightText,
          description,
          backgroundImage ${imageProjection},
          features[] | order(order asc) {
            text,
            icon,
            order
          },
          quote {
            text,
            author
          },
          ctaButtons {
            primaryButton {
              text,
              url,
              external
            },
            secondaryButton {
              text,
              url,
              external
            }
          }
        },
        isActive
      }
    `,
    null,
    { tags: ['home-page'] }
  )
}

// Services Page (now integrated with Services)
export async function getServicesPage(): Promise<Services | null> {
  return getServices()
}

// Intern Application Page
export const getInternApplicationPage = cache(async (): Promise<InternApplicationPage | null> => {
  return fetchContentQuerySafe(
    `
      *[_type == "internApplicationPage"][0] {
        _id,
        _type,
        title,
        metaDescription,
        hero {
          badge,
          heading,
          description
        },
        formFields {
          fileUploadNote,
          formQuestions[] {
            _key,
            fieldType,
            label,
            placeholder,
            required,
            options[] {
              value,
              label
            }
          }
        },
        sidebar {
          aboutSection {
            title,
            benefits
          },
          questionsSection {
            title,
            description,
            contactEmail
          }
        }
      }
    `,
    null,
    { tags: ['intern-application-page'] }
  )
})

// FAQ Page
export const getFAQPage = cache(async (): Promise<FAQPage | null> => {
  return fetchContentQuerySafe(
    `
      *[_type == "faqPage" && isActive == true][0] {
        _id,
        _type,
        title,
        metaDescription,
        hero {
          badge,
          heading,
          description
        },
        faqs[] | order(order asc) {
          question,
          answer,
          order
        },
        isActive
      }
    `,
    null,
    { tags: ['faq-page'] }
  )
})

// Contact Page
export const getContactPage = cache(async (): Promise<ContactPage | null> => {
  return fetchContentQuerySafe(
    `
      *[_type == "contactPage"][0] {
        _id,
        _type,
        title,
        hero {
          badge,
          heading,
          description,
          emailButtonText,
          consultationButtonText
        },
        contactForm {
          heading,
          fields {
            fullNameLabel,
            fullNamePlaceholder,
            emailLabel,
            emailPlaceholder,
            phoneLabel,
            phonePlaceholder,
            subjectLabel,
            subjectPlaceholder,
            messageLabel,
            messagePlaceholder
          },
          consentText,
          submitButtonText,
          crisisNotice
        },
        contactInfo {
          quickContact {
            heading,
            emailLabel,
            emailAddress,
            phoneLabel,
            phoneNumber,
            bookingLabel,
            bookingText,
            bookingUrl
          },
          hours {
            heading,
            schedule[] {
              days,
              hours
            },
            note
          }
        },
        finalCta {
          heading,
          description,
          buttonText,
          buttonUrl
        },
        seo {
          metaTitle,
          metaDescription
        }
      }
    `,
    null,
    { tags: ['contact-page'] }
  )
})

// Resources
export async function getResources(): Promise<Resource[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "resource" && isPublished == true] | order(publishedAt desc) {
        _id,
        _type,
        _updatedAt,
        title,
        description,
        slug,
        previewImage ${imageProjection},
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename,
            size
          }
        },
        category,
        tags,
        isPublished,
        isFeatured,
        requiresEmailGate,
        publishedAt,
        fileSize
      }
    `,
    [],
    { tags: ['resources'] }
  )
}

export async function getResource(slug: string): Promise<Resource | null> {
  return fetchContentQuerySafe(
    `
      *[_type == "resource" && slug.current == $slug && isPublished == true][0] {
        _id,
        _type,
        _updatedAt,
        title,
        description,
        slug,
        previewImage ${imageProjection},
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename,
            size
          }
        },
        category,
        tags,
        isPublished,
        isFeatured,
        requiresEmailGate,
        publishedAt,
        fileSize
      }
    `,
    null,
    { params: { slug }, tags: ['resources', `resource:${slug}`] }
  )
}

export async function getFeaturedResources(): Promise<Resource[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "resource" && isPublished == true && isFeatured == true] | order(publishedAt desc)[0...3] {
        _id,
        _type,
        _updatedAt,
        title,
        description,
        slug,
        previewImage ${imageProjection},
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename,
            size
          }
        },
        category,
        tags,
        requiresEmailGate,
        publishedAt,
        fileSize
      }
    `,
    [],
    { tags: ['resources'] }
  )
}

export async function getResourcesByCategory(category: string): Promise<Resource[]> {
  return fetchContentQuerySafe(
    `
      *[_type == "resource" && isPublished == true && category == $category] | order(publishedAt desc) {
        _id,
        _type,
        title,
        description,
        slug,
        previewImage ${imageProjection},
        pdfFile {
          asset-> {
            _id,
            url,
            originalFilename,
            size
          }
        },
        category,
        tags,
        requiresEmailGate,
        publishedAt,
        fileSize
      }
    `,
    [],
    { params: { category }, tags: ['resources', `resource-category:${category}`] }
  )
}

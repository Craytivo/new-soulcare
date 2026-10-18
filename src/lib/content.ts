export type ContentImageSource = ContentImage | string | { url?: string }

type ContentFetchParams = Record<string, unknown>

interface ContentFetchOptions {
  query: string
  params?: ContentFetchParams
  tags?: string[]
  revalidate?: number | false
}

class ContentImageBuilder {
  private imageUrl: string

  constructor(source: ContentImageSource) {
    this.imageUrl = getImageUrl(source)
  }

  width(value: number) {
    this.imageUrl = addImageParam(this.imageUrl, 'width', value)
    return this
  }
  height(value: number) {
    this.imageUrl = addImageParam(this.imageUrl, 'height', value)
    return this
  }
  fit(value: string) {
    this.imageUrl = addImageParam(this.imageUrl, 'fit', value)
    return this
  }
  quality(value: number) {
    this.imageUrl = addImageParam(this.imageUrl, 'quality', value)
    return this
  }
  auto() {
    return this
  }
  url() {
    return this.imageUrl
  }
}

function getImageUrl(source: ContentImageSource): string {
  if (typeof source === 'string') return source
  if ('url' in source && source.url) return source.url
  if ('asset' in source && source.asset && 'url' in source.asset) return String(source.asset.url)
  return '/placeholder-image.svg'
}

function addImageParam(url: string, key: string, value: number | string) {
  if (!url.startsWith('http')) return url
  return `${url}${url.includes('?') ? '&' : '?'}${key}=${encodeURIComponent(value)}`
}

export async function contentFetch<T>({
  query,
  params = {},
  revalidate = 300,
}: ContentFetchOptions) {
  const url = process.env.SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) throw new Error('Supabase content is not configured.')

  const typeMatch = query.match(/_type\s*==\s*"([^"]+)"/)
  const contentType = typeMatch?.[1]
  if (!contentType) throw new Error('Content query is missing a content type.')

  const search = new URLSearchParams({
    select: 'data',
    content_type: `eq.${contentType}`,
    published_at: 'not.is.null',
    order: 'updated_at.desc',
  })
  if (typeof params.slug === 'string') search.set('slug', `eq.${params.slug}`)

  const response = await fetch(`${url.replace(/\/$/, '')}/rest/v1/content_documents?${search}`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    next: { revalidate: revalidate === false ? 0 : revalidate },
  })
  if (!response.ok) throw new Error(`Supabase content request failed (${response.status}).`)

  const documents = (await response.json()) as Array<{ data: T }>
  let values = documents.map((document) => document.data)
  if (typeof params.category === 'string') {
    values = values.filter((value) => (value as { category?: string }).category === params.category)
  }
  if (typeof params.tag === 'string') {
    values = values.filter((value) =>
      (value as { tags?: string[] }).tags?.includes(params.tag as string)
    )
  }
  if (query.includes('isFeatured == true')) {
    values = values.filter((value) => (value as { isFeatured?: boolean }).isFeatured === true)
  }
  if (query.includes('isPublished == true')) {
    values = values.filter((value) => (value as { isPublished?: boolean }).isPublished === true)
  }
  if (query.includes('isActive == true')) {
    values = values.filter((value) => (value as { isActive?: boolean }).isActive === true)
  }
  return (query.includes('[0]') ? (values[0] ?? null) : values) as T
}

export function urlFor(source: ContentImageSource) {
  return new ContentImageBuilder(source)
}

export function urlForImage(
  source: ContentImageSource,
  options?: { width?: number; height?: number; fit?: string }
) {
  let image = new ContentImageBuilder(source)
  if (options?.width) image = image.width(options.width)
  if (options?.height) image = image.height(options.height)
  if (options?.fit) image = image.fit(options.fit)
  return image
}

// Type definitions
export interface ContentImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
    url?: string
  }
  hotspot?: {
    x: number
    y: number
    height: number
    width: number
  }
  crop?: {
    top: number
    bottom: number
    left: number
    right: number
  }
}

export interface TeamMember {
  _id: string
  _type: 'teamMember'
  name: string
  credentials?: string
  role: string
  image: ContentImage
  bio: unknown[]
  specialties?: string[]
  areasOfFocus?: string[]
  bestFitFor?: string
  clientTypes?: string[]
  languages?: string[]
  sessionFormats?: string[]
  virtualAvailable?: boolean
  inPersonAvailable?: boolean
  socialLinks?: Array<{
    label: string
    url: string
    type: 'instagram' | 'website' | 'other'
  }>
  acceptsBookings: boolean
  slug: {
    current: string
  }
}

export interface Workshop {
  _id: string
  _type: 'workshop'
  title: string
  description: string
  instructor: string
  instructorRole?: string
  date?: string
  time?: string
  duration?: string
  price?: string
  registrationLink?: string
  videoUrl?: string
  isRecorded: boolean
  thumbnail?: ContentImage
  content?: unknown[]
  slug: {
    current: string
  }
}

export interface Service {
  _id?: string
  title: string
  description: string
  slug: {
    current: string
  }
  image?: ContentImage & {
    alt?: string
  }
  features?: string[]
  pricing?: {
    displayType: 'custom' | 'perSession' | 'package' | 'hidden'
    customText?: string
    amount?: number
    currency?: string
    suffix?: string
    packageSessions?: number
  }
  buttons?: {
    learnMore?: {
      show: boolean
      text?: string
      url?: string
      external?: boolean
    }
    bookNow?: {
      show: boolean
      text?: string
      url?: string
    }
  }
  isActive: boolean
}

export interface Services {
  _id: string
  _type: 'services'
  title: string
  metaDescription?: string
  hero: {
    badge: string
    heading: string
    description: string
    priceHighlight?: {
      text: string
      price: string
      suffix: string
    }
  }
  servicesList: Service[]
  cta: {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
    external: boolean
  }
  isActive: boolean
}

export interface BlogPost {
  _id: string
  _type: 'blogPost'
  title: string
  excerpt: string
  slug: {
    current: string
  }
  content: unknown[]
  featuredImage?: ContentImage & {
    alt?: string
    caption?: string
  }
  publishedAt: string
  isPublished: boolean
  category: string
  tags?: string[]
  readingTime?: number
  isFeatured: boolean
  seoTitle?: string
  seoDescription?: string
  relatedPosts?: Array<{
    _id: string
    _type: 'reference'
    _ref: string
    title?: string
    slug?: { current: string }
  }>
  callToAction?: {
    text: string
    link: string
    type: 'consultation' | 'learn-more' | 'contact' | 'custom'
  }
}

export interface ServicePage {
  _id: string
  _type: 'servicePage'
  title: string
  slug: {
    current: string
  }
  metaDescription: string
  badge: string
  mainTitle: string
  heroDescription: string
  quote?: {
    text: string
    attribution: string
  }
  primaryCta: {
    text: string
    url: string
    external: boolean
  }
  secondaryCta: {
    text: string
    url: string
    external: boolean
  }
  sections: Array<{
    _type: 'textSection' | 'detailsSection' | 'listSection' | 'ctaSection'
    title: string
    content?: unknown[]
    items?:
      | Array<{
          label: string
          value: string
        }>
      | string[]
    description?: string
    note?: string
    primaryButton?: {
      text: string
      url: string
      external: boolean
    }
    secondaryButton?: {
      text: string
      url: string
      external: boolean
    }
  }>
  isActive: boolean
}

export interface CoreValuesPage {
  _id: string
  _type: 'coreValuesPage'
  title: string
  metaDescription: string
  hero: {
    badge: string
    title: string
    description: string
    image: ContentImage & {
      alt?: string
    }
  }
  values: Array<{
    title: string
    description: string
    order: number
  }>
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    external: boolean
  }
  isActive: boolean
}

export interface AboutPage {
  _id: string
  _type: 'aboutPage'
  title: string
  metaDescription: string
  hero: {
    badge: string
    title: string
    description: string
    backgroundImage?: ContentImage & {
      alt?: string
    }
    featuredImage?: ContentImage & {
      alt?: string
    }
  }
  welcome: {
    title: string
    content: unknown[] // Portable Text content
  }
  pillars: {
    title: string
    pillarList: Array<{
      title: string
      description: string
      order: number
    }>
  }
  director: {
    badge: string
    name: string
    credentials?: string
    description: string
    quote?: string
    image?: ContentImage & {
      alt?: string
    }
    bookingLink?: string
    bookingText?: string
    psychologyTodayImage?: ContentImage & {
      alt?: string
    }
    psychologyTodayLink?: string
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    external: boolean
  }
  isActive: boolean
}

export interface SiteSettings {
  _id: string
  _type: 'siteSettings'
  siteTitle: string
  siteDescription: string
  contactEmail: string
  contactPhone?: string
  address?: string
  logo?: ContentImage
  heroTitle?: string
  heroSubtitle?: string
  heroImage?: ContentImage
  socialLinks?: Array<{
    platform: string
    url: string
  }>
}

export interface AreasPage {
  _id: string
  _type: 'areasPage'
  hero: {
    badge?: string
    title: string
    description: string
  }
  areas: Array<{
    title: string
    slug: {
      current: string
    }
    content: unknown[] // Portable Text
    order: number
  }>
  cta?: {
    title: string
    description: string
    buttonText: string
    buttonLink: string
    external: boolean
  }
}

export interface HomePage {
  _id: string
  _type: 'homePage'
  title: string
  metaDescription?: string
  hero: {
    mainHeading: string
    highlightText: string
    description: string
    backgroundImage: ContentImage & {
      alt: string
    }
    features: Array<{
      text: string
      icon: 'lock' | 'mapPin' | 'globe' | 'graduationCap'
      order: number
    }>
    quote: {
      text: string
      author: string
    }
    ctaButtons: {
      primaryButton: {
        text: string
        url: string
        external: boolean
      }
      secondaryButton: {
        text: string
        url: string
        external: boolean
      }
    }
  }
  isActive: boolean
}

export interface ServicesPage {
  _id: string
  _type: 'servicesPage'
  title: string
  metaDescription?: string
  hero: {
    badge: string
    heading: string
    description: string
    priceHighlight?: {
      text: string
      price: string
      suffix: string
    }
  }
  cta: {
    title: string
    description: string
    buttonText: string
    buttonUrl: string
    external: boolean
  }
  isActive: boolean
}

export interface InternApplicationPage {
  _id: string
  _type: 'internApplicationPage'
  title: string
  metaDescription?: string
  acceptingApplications: boolean
  hero: {
    badge: string
    heading: string
    description: string[]
  }
  formFields: {
    fileUploadNote: string
    formQuestions: Array<{
      _key: string
      fieldType: 'text' | 'textarea' | 'email' | 'tel' | 'file' | 'checkbox' | 'select'
      label: string
      placeholder?: string
      required: boolean
      options?: Array<{
        value: string
        label: string
      }>
    }>
  }
  sidebar: {
    aboutSection: {
      title: string
      benefits: string[]
    }
    questionsSection: {
      title: string
      description: string
      contactEmail: string
    }
  }
}

export interface FAQPage {
  _id: string
  _type: 'faqPage'
  title: string
  metaDescription?: string
  hero: {
    badge: string
    heading: string
    description: string
  }
  faqs: Array<{
    question: string
    answer: string
    order: number
  }>
  isActive: boolean
}

export interface ContactPage {
  _id: string
  _type: 'contactPage'
  title: string
  hero: {
    badge: string
    heading: string
    description: string
    emailButtonText: string
    consultationButtonText: string
  }
  contactForm: {
    heading: string
    fields: {
      fullNameLabel: string
      fullNamePlaceholder: string
      emailLabel: string
      emailPlaceholder: string
      phoneLabel: string
      phonePlaceholder: string
      subjectLabel: string
      subjectPlaceholder: string
      messageLabel: string
      messagePlaceholder: string
    }
    consentText: string
    submitButtonText: string
    crisisNotice: string
  }
  contactInfo: {
    quickContact: {
      heading: string
      emailLabel: string
      emailAddress: string
      phoneLabel: string
      phoneNumber: string
      bookingLabel: string
      bookingText: string
      bookingUrl: string
    }
    hours: {
      heading: string
      schedule: Array<{
        days: string
        hours: string
      }>
      note: string
    }
  }
  finalCta: {
    heading: string
    description: string
    buttonText: string
    buttonUrl: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
  }
}

export interface Resource {
  _id: string
  _type: 'resource'
  _updatedAt?: string
  title: string
  description: string
  slug: {
    current: string
  }
  previewImage: ContentImage & {
    alt: string
  }
  pdfFile: {
    asset: {
      _id: string
      url: string
      originalFilename: string
      size: number
    }
  }
  category: string
  tags?: string[]
  isPublished: boolean
  isFeatured: boolean
  requiresEmailGate?: boolean
  publishedAt?: string
  fileSize?: number
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getBlogPost, getBlogPosts } from '@/lib/content-queries'
import { urlFor, type ContentImageSource } from '@/lib/content'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    return {
      title: 'Post Not Found | Soul Care Counselling',
      description: 'The requested blog post could not be found.',
    }
  }

  return {
    title: post.seoTitle || `${post.title} | Soul Care Counselling`,
    description: post.seoDescription || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: ['Soul Care Counselling'],
      images: post.featuredImage
        ? [{ url: urlFor(post.featuredImage).width(1200).height(630).url() }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage
        ? [urlFor(post.featuredImage).width(1200).height(630).url()]
        : undefined,
    },
  }
}

// Generate static paths for published blog posts
export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug.current,
  }))
}

// Map Content categories to display categories
const categoryMap: Record<string, string> = {
  'trauma-healing': 'Trauma & Healing',
  'faith-spirituality': 'Spiritual Care',
  relationships: 'Relationships',
  'anxiety-depression': 'Anxiety & Depression',
  'self-care': 'Self-Care',
  'mental-health': 'Mental Health',
  'addiction-recovery': 'Addiction & Recovery',
  'family-parenting': 'Family & Parenting',
  'professional-development': 'Professional Development',
  community: 'Community',
}

// Custom components for PortableText
const portableTextComponents = {
  types: {
    image: ({ value }: { value: ContentImageSource & { alt?: string; caption?: string } }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).url()}
          alt={value.alt || 'Blog post image'}
          width={800}
          height={400}
          className="w-full rounded-lg object-cover"
        />
        {value.caption && (
          <p className="mt-2 text-center text-sm italic text-charcoal/60">{value.caption}</p>
        )}
      </div>
    ),
  },
  marks: {
    link: ({
      children,
      value,
    }: {
      children: React.ReactNode
      value?: { href: string; blank?: boolean }
    }) => {
      // value is optional per PortableTextMarkComponentProps
      const href = value?.href ?? '#'
      const blank = value?.blank ?? false
      return (
        <a
          href={href}
          target={blank ? '_blank' : '_self'}
          rel={blank ? 'noopener noreferrer' : undefined}
          className="text-clay underline transition-colors hover:text-clay/80"
        >
          {children}
        </a>
      )
    },
    internalLink: ({
      children,
      value,
    }: {
      children: React.ReactNode
      value?: { reference?: { _type?: string; slug?: { current?: string } } }
    }) => {
      // value is optional per PortableTextMarkComponentProps
      const ref = value?.reference
      const href =
        ref?._type === 'blogPost'
          ? `/notes/${ref.slug?.current}`
          : ref?._type === 'teamMember'
            ? `/${ref.slug?.current}`
            : '#'
      return (
        <Link href={href} className="text-clay underline transition-colors hover:text-clay/80">
          {children}
        </Link>
      )
    },
  },
  block: {
    h2: (props: { children?: React.ReactNode }) => (
      <h2 className="mb-4 mt-8 font-heading text-2xl font-semibold text-charcoal">
        {props.children}
      </h2>
    ),
    h3: (props: { children?: React.ReactNode }) => (
      <h3 className="mb-3 mt-6 font-heading text-xl font-semibold text-charcoal">
        {props.children}
      </h3>
    ),
    h4: (props: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-4 font-heading text-lg font-semibold text-charcoal">
        {props.children}
      </h4>
    ),
    blockquote: (props: { children?: React.ReactNode }) => (
      <blockquote className="my-6 rounded-r-lg border-l-4 border-clay bg-sand/30 py-2 pl-6 italic text-charcoal/90">
        {props.children}
      </blockquote>
    ),
    normal: (props: { children?: React.ReactNode }) => (
      <p className="mb-4 leading-relaxed text-charcoal/90">{props.children}</p>
    ),
  },
  list: {
    bullet: (props: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-inside list-disc space-y-2 text-charcoal/90">{props.children}</ul>
    ),
    number: (props: { children?: React.ReactNode }) => (
      <ol className="mb-4 list-inside list-decimal space-y-2 text-charcoal/90">{props.children}</ol>
    ),
  },
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPost(slug)

  if (!post) {
    notFound()
  }

  const publishedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <>
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-charcoal/60">
          <li>
            <Link href="/" className="transition-colors hover:text-charcoal">
              Home
            </Link>
          </li>
          <li className="before:mx-2 before:content-['/']">
            <Link href="/notes" className="transition-colors hover:text-charcoal">
              Notes
            </Link>
          </li>
          <li className="text-charcoal before:mx-2 before:content-['/']">{post.title}</li>
        </ol>
      </nav>

      <article className="mx-auto max-w-4xl">
        {/* Article Header */}
        <header className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full bg-sand px-3 py-1 text-sm font-medium text-charcoal">
              {categoryMap[post.category] || post.category}
            </span>
            <span className="text-sm text-charcoal/60">{post.readingTime} min read</span>
            {post.tags && post.tags.length > 0 && (
              <div className="ml-2 hidden items-center gap-1 sm:flex">
                {post.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white px-2 py-1 text-xs text-charcoal/70 ring-1 ring-charcoal/10"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <h1 className="mb-4 font-heading text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <p className="mb-6 text-lg leading-relaxed text-charcoal/80 md:text-xl">{post.excerpt}</p>

          <div className="flex items-center justify-between border-t border-charcoal/10 py-4">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay font-bold text-cream">
                SC
              </div>
              <div>
                <p className="font-semibold text-charcoal">Soul Care Counselling</p>
                <p className="text-sm text-charcoal/60">Professional Counselling Services</p>
              </div>
            </div>
            <time className="text-sm text-charcoal/60">{publishedDate}</time>
          </div>
        </header>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <div className="relative h-64 overflow-hidden rounded-2xl md:h-96">
              <Image
                src={urlFor(post.featuredImage).width(1200).height(600).url()}
                alt={post.featuredImage.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {post.featuredImage.caption && (
              <p className="mt-3 text-center text-sm italic text-charcoal/60">
                {post.featuredImage.caption}
              </p>
            )}
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <PortableText
            value={post.content as import('@portabletext/types').TypedObject[]}
            components={portableTextComponents}
          />
        </div>

        {/* Call to Action */}
        {post.callToAction && (
          <div className="mt-12 rounded-2xl bg-sand p-6 ring-1 ring-charcoal/10">
            <div className="text-center">
              <h3 className="mb-3 font-heading text-xl font-semibold">
                Ready to take the next step?
              </h3>
              <p className="mb-4 text-charcoal/80">
                Our team is here to support you on your journey toward healing and growth.
              </p>
              <a
                href={post.callToAction.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-clay px-6 py-3 font-semibold text-charcoal ring-1 ring-charcoal/10 transition-colors hover:bg-clay/90"
              >
                {post.callToAction.text || 'Book a Free Consultation'}
              </a>
            </div>
          </div>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="mt-16">
            <h3 className="mb-6 font-heading text-2xl font-semibold">Related Posts</h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {post.relatedPosts.slice(0, 3).map((relatedPost) => (
                <article
                  key={relatedPost._id}
                  className="overflow-hidden rounded-xl bg-white ring-1 ring-charcoal/10 transition-all duration-200 hover:ring-clay/30"
                >
                  <div className="p-6">
                    <h4 className="mb-2 font-heading text-lg font-semibold">
                      <Link
                        href={`/notes/${relatedPost.slug?.current}`}
                        className="transition-colors hover:text-clay"
                      >
                        {relatedPost.title}
                      </Link>
                    </h4>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="mt-12 border-t border-charcoal/10 pt-8">
          <Link
            href="/notes"
            className="inline-flex items-center gap-2 text-charcoal/70 transition-colors hover:text-charcoal"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to all posts
          </Link>
        </div>
      </article>
    </>
  )
}

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from '@portabletext/react'
import { getBlogPost, getBlogPosts } from '@/lib/content-queries'
import { urlFor, type ContentImageSource } from '@/lib/content'
import EditorialPageHero from '@/components/ui/EditorialPageHero'

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
          className="w-full object-cover"
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
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <nav className="mb-5">
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

        <article>
          <EditorialPageHero
            eyebrow={categoryMap[post.category] || post.category}
            title={post.title}
            description={post.excerpt}
            aside={
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                  Notes from Soul Care
                </p>
                <p className="mt-3 font-heading text-2xl font-semibold text-white">
                  Soul Care Counselling
                </p>
                <p className="mt-2 text-sm text-white/70">{post.readingTime} min read</p>
                <time dateTime={post.publishedAt} className="mt-1 text-sm text-white/60">
                  {publishedDate}
                </time>
                {post.tags?.length ? (
                  <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 border-t border-white/15 pt-4">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-xs text-white/60">
                        #{tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </>
            }
          />

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="mx-auto mt-8 max-w-5xl">
              <div className="relative h-64 overflow-hidden border border-charcoal/10 bg-sand md:h-[32rem]">
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
          <div className="prose prose-lg mx-auto mt-10 max-w-3xl border-t border-charcoal/10 pt-8">
            <PortableText
              value={post.content as import('@portabletext/types').TypedObject[]}
              components={portableTextComponents}
            />
          </div>

          {/* Call to Action */}
          {post.callToAction && (
            <div className="mx-auto mt-12 max-w-3xl border-y border-charcoal/10 py-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                  A thoughtful next step
                </p>
                <h2 className="mt-3 font-heading text-xl font-semibold text-bark">
                  Ready to take the next step?
                </h2>
                <p className="mt-3 text-sm leading-7 text-charcoal/75">
                  Our team is here to support you on your journey toward healing and growth.
                </p>
                <a
                  href={post.callToAction.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center justify-center bg-clay px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-bark"
                >
                  {post.callToAction.text || 'Book a Free Consultation'}
                </a>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {post.relatedPosts && post.relatedPosts.length > 0 && (
            <section className="mt-12 border-t border-charcoal/10 py-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                Keep exploring
              </p>
              <h2 className="mb-6 mt-3 font-heading text-2xl font-semibold text-bark">
                Related posts
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {post.relatedPosts.slice(0, 3).map((relatedPost) => (
                  <article
                    key={relatedPost._id}
                    className="overflow-hidden border border-charcoal/10 bg-white transition-colors hover:border-clay/40"
                  >
                    <div className="p-5">
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
          <div className="mt-8 border-t border-charcoal/10 pt-6">
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
      </div>
    </div>
  )
}

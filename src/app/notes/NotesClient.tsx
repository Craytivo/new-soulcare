'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { urlFor } from '@/lib/content'
import type { BlogPost } from '@/lib/content'

const categories = [
  'All Posts',
  'Mental Health',
  'Trauma & Healing',
  'Faith & Spirituality',
  'Relationships',
  'Anxiety & Depression',
  'Addiction & Recovery',
  'Family & Parenting',
  'Self-Care',
  'Professional Development',
  'Community',
]

// Map Content categories to display categories
const categoryMap: Record<string, string> = {
  'mental-health': 'Mental Health',
  'trauma-healing': 'Trauma & Healing',
  'faith-spirituality': 'Faith & Spirituality',
  relationships: 'Relationships',
  'anxiety-depression': 'Anxiety & Depression',
  'addiction-recovery': 'Addiction & Recovery',
  'family-parenting': 'Family & Parenting',
  'self-care': 'Self-Care',
  'professional-development': 'Professional Development',
  community: 'Community',
}

// Reverse map for filtering
const reverseCategoryMap: Record<string, string> = {
  'Mental Health': 'mental-health',
  'Trauma & Healing': 'trauma-healing',
  'Faith & Spirituality': 'faith-spirituality',
  Relationships: 'relationships',
  'Anxiety & Depression': 'anxiety-depression',
  'Addiction & Recovery': 'addiction-recovery',
  'Family & Parenting': 'family-parenting',
  'Self-Care': 'self-care',
  'Professional Development': 'professional-development',
  Community: 'community',
}

interface NotesClientProps {
  allPosts: BlogPost[]
  featuredPosts: BlogPost[]
}

function formatDate(value: string, short = false) {
  return new Date(value).toLocaleDateString('en-US', {
    year: short ? undefined : 'numeric',
    month: short ? 'short' : 'long',
    day: 'numeric',
  })
}

export default function NotesClient({ allPosts, featuredPosts }: NotesClientProps) {
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(allPosts)
  const [selectedCategory, setSelectedCategory] = useState('All Posts')

  useEffect(() => {
    if (selectedCategory === 'All Posts') {
      setFilteredPosts(allPosts)
    } else {
      const contentCategory = reverseCategoryMap[selectedCategory]
      setFilteredPosts(allPosts.filter((post) => post.category === contentCategory))
    }
  }, [selectedCategory, allPosts])

  const featuredPost = featuredPosts[0]
  const latestNonFeatured = filteredPosts.filter((post) => !post.isFeatured)

  const categoryCount = useMemo(() => {
    if (selectedCategory === 'All Posts') return allPosts.length
    return filteredPosts.length
  }, [allPosts.length, filteredPosts.length, selectedCategory])

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              Notes from Soul Care
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              Insights for your journey.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
              Explore faith-centered perspectives on mental health, healing, and personal growth
              from our counselling team.
            </p>
          </div>
          <div className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              From the journal
            </p>
            <p className="mt-3 font-heading text-4xl font-semibold text-white">
              {allPosts.length}
              <span className="ml-2 text-2xl text-white/70">articles</span>
            </p>
            <p className="mt-2 text-sm leading-6 text-white/70">
              Across {categories.length - 1} topics to explore at your own pace.
            </p>
            <div className="mt-7 border-t border-white/15 pt-5 text-sm text-white/60">
              {featuredPosts.length} editor&apos;s picks · {categoryCount} in this view
            </div>
          </div>
        </section>

        <section className="mt-8 border-y border-charcoal/10 py-5 sm:py-6">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-clay">Browse</p>
                <h2 className="mt-1 font-heading text-xl font-semibold text-bark sm:text-2xl">
                  Browse by Category
                </h2>
              </div>
              <div className="flex items-center gap-2">
                {selectedCategory !== 'All Posts' && (
                  <button
                    onClick={() => setSelectedCategory('All Posts')}
                    className="inline-flex min-h-10 items-center justify-center border border-charcoal/10 bg-white px-3 py-2 text-sm font-semibold text-bark transition hover:border-clay/40"
                  >
                    Clear
                  </button>
                )}
                <span className="text-xs font-medium text-charcoal/60">{categoryCount} posts</span>
              </div>
            </div>

            {/* Mobile/Tablet filter (kept as-is) */}
            <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-center lg:hidden">
              <label htmlFor="notes-category" className="sr-only">
                Filter notes by category
              </label>
              <select
                id="notes-category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-charcoal/20 bg-white px-3 py-2.5 text-sm font-medium text-charcoal outline-none focus:border-clay focus:ring-2 focus:ring-clay/40"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <p className="text-xs text-charcoal/60 sm:text-sm">
                Showing: <span className="font-semibold text-charcoal/80">{selectedCategory}</span>
              </p>
            </div>

            {/* Desktop filter rail */}
            <div className="mt-4 hidden lg:block">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => {
                  const isActive = category === selectedCategory
                  const count =
                    category === 'All Posts'
                      ? allPosts.length
                      : allPosts.filter((post) => post.category === reverseCategoryMap[category])
                          .length

                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium ring-1 transition-colors ${
                        isActive
                          ? 'bg-charcoal text-white ring-charcoal'
                          : 'bg-white text-charcoal/80 ring-charcoal/10 hover:bg-sand hover:ring-charcoal/20'
                      }`}
                    >
                      <span>{category}</span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs ${isActive ? 'bg-charcoal/15' : 'bg-charcoal/10'}`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>

        {featuredPost && (
          <section className="border-b border-charcoal/10 py-10 sm:py-14">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                01 · Editor&apos;s pick
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
                Featured article
              </h2>
            </div>
            <article className="overflow-hidden border border-charcoal/10 bg-white">
              <div className="md:grid md:grid-cols-12 md:gap-0">
                {featuredPost.featuredImage && (
                  <div className="relative h-64 md:col-span-5 md:h-full">
                    <Image
                      src={urlFor(featuredPost.featuredImage).width(900).height(700).url()}
                      alt={featuredPost.featuredImage.alt || featuredPost.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 100vw, 42vw"
                    />
                  </div>
                )}
                <div
                  className={`p-5 sm:p-6 md:p-8 ${featuredPost.featuredImage ? 'md:col-span-7' : 'md:col-span-12'}`}
                >
                  <div className="mb-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                      {categoryMap[featuredPost.category] || featuredPost.category}
                    </span>
                    <span className="text-sm text-charcoal/60">
                      {featuredPost.readingTime} min read
                    </span>
                    <span className="text-sm text-charcoal/50">
                      {formatDate(featuredPost.publishedAt)}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl font-semibold leading-tight sm:text-2xl">
                    <Link
                      href={`/notes/${featuredPost.slug.current}`}
                      className="transition-colors hover:text-clay"
                    >
                      {featuredPost.title}
                    </Link>
                  </h3>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-charcoal/85 sm:text-base">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-6">
                    <Link
                      href={`/notes/${featuredPost.slug.current}`}
                      className="group inline-flex min-h-11 w-full items-center justify-center gap-2 bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-bark sm:w-auto"
                    >
                      Read Featured Article
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          </section>
        )}

        <section className="py-10 sm:py-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                02 · Keep exploring
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
                Latest posts
              </h2>
            </div>
            <p className="text-sm text-charcoal/65">
              {selectedCategory === 'All Posts' ? 'All categories' : selectedCategory} |{' '}
              {latestNonFeatured.length} posts
            </p>
          </div>

          {latestNonFeatured.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
              {latestNonFeatured.map((post) => (
                <article
                  key={post._id}
                  className="group overflow-hidden border border-charcoal/10 bg-white transition-colors hover:border-clay/40"
                >
                  {post.featuredImage && (
                    <div className="relative h-52 overflow-hidden">
                      <Image
                        src={urlFor(post.featuredImage).width(640).height(420).url()}
                        alt={post.featuredImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5 sm:p-6">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                        {categoryMap[post.category] || post.category}
                      </span>
                      <span className="text-xs text-charcoal/60">{post.readingTime} min read</span>
                    </div>
                    <h3 className="font-heading text-base font-semibold leading-snug sm:text-lg">
                      <Link
                        href={`/notes/${post.slug.current}`}
                        className="transition-colors hover:text-clay"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-charcoal/85">
                      {post.excerpt}
                    </p>
                    <div className="mt-5 flex items-center justify-between">
                      <p className="text-xs font-medium text-charcoal/65">Soul Care Counselling</p>
                      <span className="text-xs text-charcoal/55">
                        {formatDate(post.publishedAt, true)}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="border-y border-charcoal/10 bg-white px-5 py-10 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-sand">
                <svg
                  className="h-8 w-8 text-charcoal/60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="mb-2 font-heading text-lg font-semibold text-charcoal">
                No posts in this category yet
              </h3>
              <p className="mx-auto mb-6 max-w-md text-charcoal/70">
                Try another category, or explore all posts while we continue publishing new content.
              </p>
              <button
                onClick={() => setSelectedCategory('All Posts')}
                className="inline-flex min-h-11 items-center justify-center bg-clay px-4 py-2 text-sm font-semibold text-white transition hover:bg-bark"
              >
                View All Posts
              </button>
            </div>
          )}
        </section>

        <section className="border-y border-charcoal/10 py-10 sm:py-12">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              Stay connected
            </p>
            <h2 className="mt-3 font-heading text-xl font-semibold text-bark sm:text-2xl">
              Stay Connected
            </h2>
            <p className="mt-3 text-sm leading-7 text-charcoal/75">
              Get the latest insights and encouragement delivered to your inbox.
            </p>
            <div className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="min-h-11 flex-1 border border-charcoal/20 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-clay"
              />
              <button className="min-h-11 bg-clay px-6 py-2 text-sm font-semibold text-white transition-colors hover:bg-bark">
                Subscribe
              </button>
            </div>
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="bg-charcoal px-6 py-8 text-white sm:px-8 sm:py-10 lg:flex lg:items-end lg:justify-between lg:gap-10">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                A thoughtful next step
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold sm:text-3xl">
                Ready to begin your healing journey?
              </h2>
              <p className="mt-3 leading-7 text-white/70">
                Book a free consultation to explore how our faith-centered approach can support your
                growth.
              </p>
            </div>
            <div className="mt-6 lg:mt-0">
              <a
                href="https://thesoulcarecounsellor.janeapp.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
              >
                Book a Free Consultation
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

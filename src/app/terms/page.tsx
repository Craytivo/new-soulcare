import type { Metadata } from 'next'
import { getTermsOfUsePage } from '@/lib/content-queries'
import { PortableText } from '@portabletext/react'
import PrintButton from '@/components/PrintButton'
import Link from 'next/link'
import LegalTOC from '@/components/LegalTOC'

// Simple slugify for headings -> anchor ids
const slugify = (text?: string) =>
  (text || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

function extractHeadings(content: unknown[] | undefined) {
  if (!Array.isArray(content)) return []
  const headings: { id: string; text: string; level: number }[] = []
  for (const block of content) {
    if (typeof block !== 'object' || block === null) continue
    type BlockChild = { text?: string }
    type BlockLike = { _type?: string; style?: string; children?: BlockChild[] }
    const maybeBlock = block as BlockLike
    if (maybeBlock._type !== 'block') continue
    const style = maybeBlock.style || 'normal'
    if (style === 'h2' || style === 'h3') {
      const children = Array.isArray(maybeBlock.children) ? maybeBlock.children : []
      const text = children.map((c: BlockChild) => c.text || '').join('') || ''
      const id = slugify(text)
      headings.push({ id, text, level: style === 'h2' ? 2 : 3 })
    }
  }
  return headings
}

const portableTextComponents = {
  block: {
    h2: (props: { children?: React.ReactNode }) => {
      const text = String(props.children || '')
      return (
        <h2
          id={slugify(text)}
          className="mb-4 mt-12 font-heading text-3xl font-bold leading-tight text-bark md:text-4xl"
        >
          {props.children}
        </h2>
      )
    },
    h3: (props: { children?: React.ReactNode }) => {
      const text = String(props.children || '')
      return (
        <h3
          id={slugify(text)}
          className="mb-3 mt-8 font-heading text-xl font-semibold leading-tight text-bark md:text-2xl"
        >
          {props.children}
        </h3>
      )
    },
    h4: (props: { children?: React.ReactNode }) => (
      <h4 className="mb-2 mt-6 font-heading text-lg font-semibold text-bark">{props.children}</h4>
    ),
    normal: (props: { children?: React.ReactNode }) => (
      <p className="mb-6 max-w-none text-base leading-relaxed text-charcoal/90 md:text-lg md:leading-loose">
        {props.children}
      </p>
    ),
    blockquote: (props: { children?: React.ReactNode }) => (
      <blockquote className="my-6 border-l-4 border-clay pl-4 italic text-charcoal/80">
        {props.children}
      </blockquote>
    ),
  },
  list: {
    bullet: (props: { children?: React.ReactNode }) => (
      <ul className="mb-4 list-disc pl-6 text-charcoal/90">{props.children}</ul>
    ),
    number: (props: { children?: React.ReactNode }) => (
      <ol className="mb-4 list-decimal pl-6 text-charcoal/90">{props.children}</ol>
    ),
  },
  listItem: {
    bullet: (props: { children?: React.ReactNode }) => <li className="mb-2">{props.children}</li>,
    number: (props: { children?: React.ReactNode }) => <li className="mb-2">{props.children}</li>,
  },
  marks: {
    strong: (props: { children?: React.ReactNode }) => (
      <strong className="font-semibold text-bark">{props.children}</strong>
    ),
    em: (props: { children?: React.ReactNode }) => (
      <em className="italic text-clay">{props.children}</em>
    ),
    link: (props: { children?: React.ReactNode; value?: { href?: string } }) => (
      <a
        href={props.value?.href}
        className="text-clay underline transition-colors hover:text-bark"
        target="_blank"
        rel="noopener noreferrer"
      >
        {props.children}
      </a>
    ),
  },
}

export const revalidate = 300

export const metadata: Metadata = {
  title: 'Terms of Use - Soul Care Counselling',
  description:
    'Terms of Use for Soul Care Counselling - Understand the terms and conditions for using our faith-centered counselling services and website.',
}

export default async function Terms() {
  const pageData = await getTermsOfUsePage()
  const headings = extractHeadings(pageData?.content)
  // Plain-language summary: use pageData.summary (if provided) or derive from first paragraph
  const deriveSummary = () => {
    if (pageData?.summary) {
      if (Array.isArray(pageData.summary)) return pageData.summary
      if (typeof pageData.summary === 'string')
        return pageData.summary
          .split('\n')
          .map((s: string) => s.trim())
          .filter(Boolean)
    }
    // derive from first text block
    type BlockChild = { text?: string }
    type BlockLike = { _type?: string; style?: string; children?: BlockChild[] }
    const firstBlock = Array.isArray(pageData?.content)
      ? pageData.content.find(
          (b: unknown) => typeof b === 'object' && b !== null && (b as BlockLike)._type === 'block'
        )
      : null
    if (firstBlock) {
      const maybe = firstBlock as BlockLike
      const children = Array.isArray(maybe.children) ? maybe.children : []
      const text = children.map((c: BlockChild) => c.text || '').join(' ')
      const sentences = text
        .split(/(?<=[.?!])\s+/)
        .map((s: string) => s.trim())
        .filter(Boolean)
      return sentences.slice(0, 3)
    }
    return []
  }
  const summaryItems = deriveSummary()
  return (
    <div className="mx-auto max-w-4xl">
      <section className="no-print relative mb-6 overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <h1 className="font-heading text-3xl font-bold md:text-4xl">
            {pageData?.title || 'Terms of Use'}
          </h1>
        </div>
      </section>
      {/* Metadata row: effective date / last updated / print */}
      <div className="mb-6 flex flex-col gap-3 text-sm text-charcoal/80 sm:flex-row sm:items-center">
        <div>
          Effective:{' '}
          <strong>
            {pageData?.effectiveDate ??
              (pageData?._updatedAt ? new Date(pageData._updatedAt).toLocaleDateString() : '-')}
          </strong>
        </div>
        <div>•</div>
        <div>
          Last updated:{' '}
          {pageData?._updatedAt ? (
            <time dateTime={pageData._updatedAt}>
              {new Date(pageData._updatedAt).toLocaleDateString()}
            </time>
          ) : (
            '-'
          )}
        </div>
        <div className="ml-0 flex items-center gap-3 sm:ml-auto">
          <Link href="/contact" className="text-clay underline">
            Contact us about this policy
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Stack layout: quick summary -> TOC -> main content (single column on all sizes) */}
      <div>
        {/* Plain-language summary */}
        {summaryItems && summaryItems.length > 0 && (
          <div className="mb-4 rounded-lg bg-sand/50 p-4 ring-1 ring-charcoal/10">
            <strong className="mb-2 block text-sm text-charcoal/80">Quick summary</strong>
            <ul className="list-disc space-y-1 pl-5 text-sm text-charcoal/85">
              {summaryItems.map((s: string, i: number) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Contents (stacked below summary on all sizes) */}
        {headings.length > 0 && (
          <div className="mb-6">
            <LegalTOC headings={headings} />
          </div>
        )}

        <main className="prose prose-lg max-w-none">
          {pageData?.content && (
            <PortableText value={pageData.content} components={portableTextComponents} />
          )}
        </main>
      </div>
    </div>
  )
}

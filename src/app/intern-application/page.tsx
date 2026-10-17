import type { Metadata } from 'next'
import { getInternApplicationPage } from '@/lib/content-queries'
import InternApplicationForm from '@/components/InternApplicationForm'
import Link from 'next/link'
import EmptyState from '@/components/ui/EmptyState'

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await getInternApplicationPage()

  return {
    title: pageData?.title
      ? `${pageData.title} | Soul Care Counselling`
      : 'Intern Application | Soul Care Counselling',
    description:
      pageData?.metaDescription ||
      'Apply for an internship with Soul Care Counselling. Join our faith-centered team and gain hands-on experience in therapeutic practice.',
  }
}

// ISR with tag revalidation for Content-driven content
export const revalidate = 300

export default async function InternApplicationPage() {
  const pageData = await getInternApplicationPage()

  // Return fallback if no data
  if (!pageData) {
    return (
      <EmptyState
        title="Intern application page content not found."
        description="The application information is being prepared."
        action={
          <Link href="/contact" className="ui-btn-primary">
            Return to the application page
          </Link>
        }
      />
    )
  }

  return (
    <>
      <section className="relative mb-10 overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>
        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-[11px] uppercase tracking-[.22em] ring-1 ring-cream/30">
            {pageData.hero.badge}
          </span>
          <h1 className="mb-2 mt-3 font-heading text-3xl font-bold md:text-4xl">
            {pageData.hero.heading}
          </h1>
          {pageData.hero.description.map((paragraph) => (
            <p key={paragraph} className="mt-3 max-w-3xl text-cream/85">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-10 md:mt-16 md:grid-cols-12 md:items-start">
        {/* LEFT: Intern Application Form or Paused Message */}
        <div className="md:col-span-7">
          {pageData.acceptingApplications ? (
            <>
              <InternApplicationForm pageData={pageData} />
              <p className="mt-4 text-xs text-charcoal/70">{pageData.formFields.fileUploadNote}</p>
            </>
          ) : (
            <div className="rounded-2xl bg-sand p-6 ring-1 ring-charcoal/5 md:p-8">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-clay/15 text-clay">
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-heading text-xl font-semibold">Applications Paused</h3>
                  <p className="mt-2 leading-relaxed text-charcoal/75">
                    We are not currently accepting internship applications. Please check back later.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: Intern Info Side Column */}
        <aside className="mt-10 space-y-6 md:col-span-5 md:mt-[3.25rem]">
          <div className="rounded-2xl bg-sand p-5 ring-1 ring-charcoal/5">
            <h3 className="font-heading font-semibold">{pageData.sidebar.aboutSection.title}</h3>
            <ul className="mt-3 space-y-2.5 text-sm">
              {pageData.sidebar.aboutSection.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-2.5">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay" />
                  <span className="leading-relaxed text-charcoal/75">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-charcoal/5">
            <h3 className="font-heading font-semibold">
              {pageData.sidebar.questionsSection.title}
            </h3>
            <p className="mt-3 text-sm text-charcoal/80">
              {pageData.sidebar.questionsSection.description
                .split(pageData.sidebar.questionsSection.contactEmail)
                .map((part, index, array) => (
                  <span key={`${part}-${index}`}>
                    {part}
                    {index < array.length - 1 && (
                      <a
                        href={`mailto:${pageData.sidebar.questionsSection.contactEmail}`}
                        className="underline decoration-charcoal/30 hover:decoration-charcoal"
                      >
                        {pageData.sidebar.questionsSection.contactEmail}
                      </a>
                    )}
                  </span>
                ))}
            </p>
          </div>
        </aside>
      </section>
    </>
  )
}

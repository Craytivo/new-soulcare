import type { Metadata } from 'next'
import { getInternApplicationPage } from '@/lib/content-queries'
import InternApplicationForm from '@/components/InternApplicationForm'
import { ArrowRight, Mail } from 'lucide-react'
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
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {pageData.hero.badge}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {pageData.hero.heading}
            </h1>
            <div className="mt-5 max-w-2xl space-y-3">
              {pageData.hero.description.map((paragraph) => (
                <p key={paragraph} className="text-base leading-7 text-white/75">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <aside className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Application status
            </p>
            <p className="mt-3 font-heading text-2xl font-semibold text-white">
              {pageData.acceptingApplications ? 'Applications are open' : 'Applications are paused'}
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">
              {pageData.acceptingApplications
                ? 'Share a little about yourself and your interest in joining our team.'
                : 'Please check back later for updates about future opportunities.'}
            </p>
            {pageData.acceptingApplications ? (
              <a
                href="#application-form"
                className="group mt-5 inline-flex items-center gap-2 self-start text-sm font-semibold text-clay transition hover:text-white"
              >
                Go to application
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>
            ) : null}
          </aside>
        </section>

        <section className="grid gap-10 border-b border-charcoal/10 py-12 sm:py-14 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] md:gap-16">
          <div id="application-form" className="scroll-mt-24">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              01 · Your application
            </p>
            <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
              {pageData.acceptingApplications ? 'Tell us about yourself.' : 'Stay in touch.'}
            </h2>
            {pageData.acceptingApplications ? (
              <>
                <InternApplicationForm pageData={pageData} />
                <p className="mt-4 text-xs leading-5 text-charcoal/60">
                  {pageData.formFields.fileUploadNote}
                </p>
              </>
            ) : (
              <div className="mt-6 border-t border-charcoal/10 py-5">
                <p className="max-w-xl text-sm leading-7 text-charcoal/70">
                  We are not currently accepting internship applications. Please check back later.
                </p>
                <Link
                  href="/contact"
                  className="group mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
                >
                  Contact our team
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            )}
          </div>

          <aside className="space-y-8 md:border-l md:border-charcoal/10 md:pl-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                02 · The opportunity
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold text-bark">
                {pageData.sidebar.aboutSection.title}
              </h2>
              <ul className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10">
                {pageData.sidebar.aboutSection.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-3 py-3 text-sm leading-6 text-charcoal/70"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                03 · Questions
              </p>
              <h2 className="mt-3 font-heading text-xl font-semibold text-bark">
                {pageData.sidebar.questionsSection.title}
              </h2>
              <p className="mt-3 text-sm leading-6 text-charcoal/70">
                {pageData.sidebar.questionsSection.description
                  .split(pageData.sidebar.questionsSection.contactEmail)
                  .map((part, index, array) => (
                    <span key={`${part}-${index}`}>
                      {part}
                      {index < array.length - 1 && (
                        <a
                          href={`mailto:${pageData.sidebar.questionsSection.contactEmail}`}
                          className="inline-flex items-center gap-1 font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
                        >
                          {pageData.sidebar.questionsSection.contactEmail}
                          <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </span>
                  ))}
              </p>
            </div>
          </aside>
        </section>
      </div>
    </div>
  )
}

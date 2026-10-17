import { getAboutPage } from '@/lib/content-queries'
import { urlFor, type AboutPage } from '@/lib/content'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import Link from 'next/link'
import AboutTeamClient from '@/components/AboutTeamClient'
import DirectorSection from '@/components/about/DirectorSection'
import NextStepCTA from '@/components/about/NextStepCTA'
import { getTeamMembers } from '@/lib/content-queries'

function getHeroImagePosition(
  image: NonNullable<NonNullable<AboutPage['hero']['backgroundImage']>>
) {
  const hotspot = image.hotspot
  if (hotspot && typeof hotspot.x === 'number' && typeof hotspot.y === 'number') {
    return `${hotspot.x * 100}% ${hotspot.y * 100}%`
  }

  return '50% 22%'
}

export default async function ContentAboutPage() {
  const pageData = await getAboutPage()
  const teamMembers = await getTeamMembers()

  if (!pageData) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 text-center sm:px-8 md:px-10 xl:px-12">
        <p className="text-charcoal/70">No content available for this page.</p>
      </div>
    )
  }

  const portableTextComponents = {
    block: {
      h3: (props: { children?: React.ReactNode }) => (
        <h3 className="mb-3 mt-8 font-heading text-xl font-semibold tracking-tight text-bark md:text-2xl">
          {props.children}
        </h3>
      ),
      h4: (props: { children?: React.ReactNode }) => (
        <h4 className="mb-2 mt-6 font-heading text-lg font-semibold tracking-tight text-bark md:text-xl">
          {props.children}
        </h4>
      ),
      normal: (props: { children?: React.ReactNode }) => (
        <p className="max-w-65ch mb-4 text-[0.95rem] leading-7 text-charcoal/85 md:text-[1.01rem]">
          {props.children}
        </p>
      ),
    },
    list: {
      bullet: (props: { children?: React.ReactNode }) => (
        <ul className="mb-4 space-y-2">{props.children}</ul>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <ol className="mb-4 list-decimal space-y-2 pl-6">{props.children}</ol>
      ),
    },
    listItem: {
      bullet: (props: { children?: React.ReactNode }) => (
        <li className="flex items-start gap-3">
          <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-clay" />
          <span className="max-w-65ch leading-relaxed text-charcoal/80">{props.children}</span>
        </li>
      ),
      number: (props: { children?: React.ReactNode }) => (
        <li className="max-w-65ch leading-relaxed text-charcoal/80">{props.children}</li>
      ),
    },
  }

  return (
    <div className="-mx-4 -my-12 bg-cream">
      {/* Homepage-aligned hero: full-bleed image, bottom gradient, and compact text system. */}
      <section className="relative left-1/2 right-1/2 isolate -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-charcoal text-white lg:flex lg:min-h-[min(62vw,calc(100svh-5rem))] lg:items-end">
        {pageData.hero.backgroundImage && (
          <div className="relative aspect-[124/77] w-full lg:absolute lg:inset-0 lg:-z-20 lg:aspect-auto">
            <Image
              src={urlFor(pageData.hero.backgroundImage).width(2200).height(1400).quality(92).url()}
              alt={pageData.hero.backgroundImage.alt || pageData.hero.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: getHeroImagePosition(pageData.hero.backgroundImage) }}
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-b from-transparent from-55% to-charcoal lg:from-transparent lg:from-45% lg:via-charcoal/55 lg:via-70% lg:to-charcoal"
            />
          </div>
        )}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-14 lg:px-12 lg:pb-10 lg:pt-0 xl:pb-12">
          <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-10 xl:gap-14">
            <div className="lg:col-span-6 xl:col-span-7">
              {pageData.hero.badge && (
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-white/80 sm:text-sm">
                  {pageData.hero.badge}
                </p>
              )}
              <h1 className="max-w-4xl text-balance font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-white [text-shadow:0_2px_16px_rgba(0,0,0,0.35)] sm:text-5xl lg:text-[2.6rem] xl:text-5xl">
                {pageData.hero.title}
              </h1>
            </div>

            <div className="mt-6 lg:col-span-6 lg:mt-0 xl:col-span-5">
              <p className="max-w-xl text-base leading-7 text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] sm:text-lg">
                {pageData.hero.description}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/contact"
                  className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-clay px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-bark sm:w-auto"
                >
                  Book a Consultation
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-lg border border-white/70 bg-charcoal/20 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/15 sm:w-auto"
                >
                  Get in Touch
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main content container - matches homepage structure */}
      <section className="relative z-20 -mt-14 rounded-t-[2rem] border-t border-white/70 bg-cream shadow-[0_-22px_55px_rgba(35,32,27,0.16)] sm:-mt-16 sm:rounded-t-[2.5rem] lg:-mt-20">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-clay/35 to-transparent" />

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-5 sm:py-10 md:px-10 md:py-12 lg:py-16 xl:px-12">
          {/* OUR STORY / WELCOME SECTION */}
          <section className="mb-6 md:mb-12">
            <div className="mb-4 flex items-center gap-3">
              <span className="inline-block h-8 w-2 rounded bg-clay" />
              <h2 className="font-heading text-xl font-bold tracking-tight text-bark md:text-2xl lg:text-3xl">
                Our Story
              </h2>
            </div>
            <p className="mb-5 max-w-3xl text-base leading-relaxed text-charcoal/85 md:text-lg">
              {pageData.welcome.title}
            </p>
            <div className="grid gap-6 md:grid-cols-2 md:gap-10">
              {/* CTA Buttons Column - First on mobile */}
              <div className="flex flex-col justify-start gap-3 md:order-2">
                <Link
                  href="/contact"
                  className="group inline-flex w-full items-center justify-center gap-3 rounded-lg bg-clay px-5 py-3.5 text-sm font-semibold text-cream ring-1 ring-clay/40 transition shadow-elevation-2 hover:bg-bark hover:shadow-elevation-3 sm:w-auto sm:px-6 sm:py-4"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  Book a Consultation
                </Link>
                <Link
                  href="/services"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-clay/40 bg-clay/10 px-5 py-3.5 text-sm font-semibold text-bark transition hover:border-clay/60 hover:bg-clay/20 sm:w-auto sm:px-6 sm:py-4"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Explore Our Services
                </Link>
                <Link
                  href="/areas"
                  className="inline-flex w-full items-center justify-center gap-3 rounded-lg border border-charcoal/15 bg-white px-5 py-3.5 text-sm font-semibold text-bark transition hover:border-charcoal/20 hover:bg-sand sm:w-auto sm:px-6 sm:py-4"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Areas We Specialize In
                </Link>
              </div>
              <div className="space-y-4 md:order-1">
                <PortableText
                  value={pageData.welcome.content as import('@portabletext/types').TypedObject[]}
                  components={portableTextComponents}
                />
              </div>
            </div>
          </section>

          {/* OUR APPROACH / PILLARS - Card Grid */}
          <section className="mb-16 md:mb-20">
            <div className="rounded-3xl bg-sand/30 p-6 md:p-10">
              <div className="mb-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-clay/60 sm:text-sm">
                  Built on these principles
                </p>
                <h2 className="font-heading text-xl font-bold tracking-tight text-bark md:text-2xl lg:text-3xl">
                  {pageData.pillars.title}
                </h2>
              </div>
              <p className="mb-6 max-w-3xl text-base leading-relaxed text-charcoal/80 md:mb-8">
                Our foundation is built on compassion, evidence, and your unique needs.
              </p>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6">
                {pageData.pillars.pillarList.map((pillar, i) => (
                  <div
                    key={pillar.title}
                    className="ring-charcoal/8 group relative rounded-2xl bg-white/80 p-4 ring-1 backdrop-blur-sm transition-all duration-200 hover:-translate-y-0.5 hover:ring-clay/25 hover:shadow-elevation-2 sm:p-5 md:p-6"
                  >
                    <span className="font-mono text-xs tabular-nums text-clay/40">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="mt-3 font-heading text-lg font-semibold leading-snug text-bark">
                      {pillar.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-charcoal/75 md:text-base">
                      {pillar.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FOUNDER / DIRECTOR SECTION */}
          <DirectorSection
            name={pageData.director.name}
            credentials={pageData.director.credentials}
            badge={pageData.director.badge}
            image={pageData.director.image}
            description={pageData.director.description}
            quote={pageData.director.quote}
            bookingLink={pageData.director.bookingLink}
            bookingText={pageData.director.bookingText}
            psychologyTodayImage={pageData.director.psychologyTodayImage}
            psychologyTodayLink={pageData.director.psychologyTodayLink}
          />

          {/* MEET THE TEAM SECTION */}
          <section className="mb-16 md:mb-20">
            <AboutTeamClient teamMembers={teamMembers} />
          </section>

          {/* WHY CLIENTS CHOOSE US - Trust Building Section */}
          <section className="mb-16 md:mb-20">
            <div className="mb-5 flex items-center gap-3">
              <span className="inline-block h-8 w-2 rounded bg-clay" />
              <h2 className="font-heading text-2xl font-bold tracking-tight text-bark md:text-3xl">
                Why Clients Choose Us
              </h2>
            </div>
            <p className="mb-8 max-w-3xl text-base text-charcoal/80">
              Soul Care Counsellor stands out through our commitment to safety, expertise, and your
              whole wellbeing.
            </p>
            <div className="grid gap-5 sm:grid-cols-2 md:gap-6">
              {[
                {
                  title: 'Confidential & Safe',
                  description:
                    'Your privacy is sacred. Every conversation is secure and protected by professional standards.',
                },
                {
                  title: 'Culturally Responsive',
                  description:
                    'We understand and honor your background, values, and unique life experience.',
                },
                {
                  title: 'Faith-Informed Care',
                  description:
                    'For those who value it, we integrate your faith perspective into therapeutic work.',
                },
                {
                  title: 'Flexible Sessions',
                  description:
                    'Virtual counselling across Canada with appointment times that fit your life.',
                },
                {
                  title: 'Experienced Team',
                  description:
                    'Licensed clinicians with specialized training in trauma, anxiety, relationships, and more.',
                },
                {
                  title: 'Personalized Approach',
                  description:
                    'Treatment plans designed for your specific goals and needs, not a one-size-fits-all model.',
                },
              ].map((benefit, idx) => (
                <div
                  key={idx}
                  className="ring-charcoal/8 rounded-2xl bg-white p-5 ring-1 transition-all duration-200 hover:-translate-y-0.5 hover:ring-clay/25 hover:shadow-elevation-2 md:p-6"
                >
                  <h3 className="mb-2 font-heading text-lg font-semibold text-bark">
                    {benefit.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-charcoal/75 md:text-base">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* INTERNSHIP / CAREERS SECTION - Combined with final CTA */}
          {pageData.cta && (
            <NextStepCTA
              joinTeamTitle="Ready to Take the Next Step?"
              joinTeamDescription="Whether you're seeking therapy, exploring an internship, or have questions about our services, we're here to support you."
            />
          )}
        </div>
      </section>
    </div>
  )
}

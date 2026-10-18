'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

import type { ContactPage } from '@/lib/content'

import ConsultationCta from '@/components/cta/ConsultationCta'

import { trackConsultationClick } from '@/lib/tracking'

export default function ContactClient({ pageData }: { pageData: ContactPage }) {
  const [formStatus, setFormStatus] = useState('')

  const [modalOpen, setModalOpen] = useState(false)

  const [submitName, setSubmitName] = useState('')

  const [animateIn, setAnimateIn] = useState(false)

  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const closeModal = () => {
    setAnimateIn(false)

    // wait for animation then unmount

    setTimeout(() => setModalOpen(false), 200)
  }

  useEffect(() => {
    if (!modalOpen) return

    setAnimateIn(true)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }

    document.addEventListener('keydown', onKey)

    return () => document.removeEventListener('keydown', onKey)
  }, [modalOpen])

  useEffect(() => {
    if (animateIn) closeBtnRef.current?.focus()
  }, [animateIn])

  // Custom handler for async form submission

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setFormStatus('Sending...')

    const form = e.currentTarget

    const formData = new FormData(form)

    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',

        body: formData,
      })

      if (res.ok) {
        const nameVal = formData.get('name')?.toString() || ''

        setSubmitName(nameVal)

        setModalOpen(true)

        setFormStatus('')

        form.reset()
      } else {
        const payload = (await res.json().catch(() => null)) as { message?: string } | null

        setFormStatus(payload?.message || 'Error sending message.')
      }
    } catch {
      setFormStatus('Error sending message.')
    }
  }

  if (!pageData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-clay"></div>

          <p className="mt-2 text-charcoal/60">Loading contact page...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="-mx-4 -my-12 bg-cream text-charcoal">
      <div className="mx-auto max-w-7xl px-5 pb-12 pt-6 sm:px-8 sm:pb-16 lg:px-12 lg:pt-10">
        {/* Page hero */}

        <section className="grid overflow-hidden bg-charcoal text-white lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
              {pageData.hero.badge}
            </p>
            <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
              {pageData.hero.heading}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {pageData.hero.description}
            </p>
          </div>

          <div className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
              Get in touch
            </p>
            <p className="mt-3 font-heading text-2xl font-semibold text-white">
              We&apos;re here to listen.
            </p>
            <div className="mt-6 flex flex-col items-start gap-2">
              <a
                href={`mailto:${pageData.contactInfo.quickContact.emailAddress}`}
                className="group inline-flex min-h-12 items-center justify-center gap-2 bg-clay px-5 py-3 text-sm font-semibold text-white transition hover:bg-white hover:text-bark"
              >
                {pageData.hero.emailButtonText}
                <ArrowRight
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                />
              </a>

              <a
                href={pageData.contactInfo.quickContact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackConsultationClick({
                    location: 'contact-hero',

                    label: pageData.hero.consultationButtonText,

                    url: pageData.contactInfo.quickContact.bookingUrl,
                  })
                }
                className="inline-flex min-h-11 items-center px-1 py-3 text-sm font-semibold text-white/75 underline decoration-white/30 underline-offset-4 transition hover:text-white"
              >
                {pageData.hero.consultationButtonText}
              </a>
            </div>
          </div>
        </section>

        {/* Submission modal */}

        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setModalOpen(false)}
              aria-hidden="true"
            ></div>

            <div className="relative mx-4 w-full max-w-lg">
              <div className="rounded-2xl bg-white p-6 shadow-xl ring-1 ring-charcoal/5 md:p-8">
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
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="font-heading text-xl font-semibold">
                      Thanks, {submitName || 'there'}!
                    </h3>

                    <p className="mt-2 leading-relaxed text-charcoal/75">
                      We have received your message and will get back to you shortly.
                    </p>

                    <div className="mt-4 flex items-center gap-3">
                      <button
                        ref={closeBtnRef}
                        onClick={closeModal}
                        className="inline-flex items-center justify-center rounded-full bg-clay px-5 py-2 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact content */}

        <section className="grid gap-10 py-12 sm:py-14 md:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)] md:gap-16">
          {/* LEFT: Forms */}

          <div>
            {/* General Contact Form */}

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                01 · Send a message
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-bark sm:text-3xl">
                {pageData.contactForm.heading}
              </h2>

              <form
                name="contact"
                method="POST"
                encType="multipart/form-data"
                className="mt-6 space-y-5 border border-charcoal/10 bg-white p-5 sm:p-7"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <input type="hidden" name="form-start-time" value={Date.now().toString()} />
                <input
                  type="text"
                  name="company"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  className="hidden"
                  aria-hidden="true"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-charcoal/80">
                      {pageData.contactForm.fields.fullNameLabel}
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      className="mt-1 w-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
                      placeholder={pageData.contactForm.fields.fullNamePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-charcoal/80">
                      {pageData.contactForm.fields.emailLabel}
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
                      placeholder={pageData.contactForm.fields.emailPlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-charcoal/80">
                      {pageData.contactForm.fields.phoneLabel}
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      className="mt-1 w-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
                      placeholder={pageData.contactForm.fields.phonePlaceholder}
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-charcoal/80">
                      {pageData.contactForm.fields.subjectLabel}
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      className="mt-1 w-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
                      placeholder={pageData.contactForm.fields.subjectPlaceholder}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-charcoal/80">
                    {pageData.contactForm.fields.messageLabel}
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="mt-1 w-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
                    placeholder={pageData.contactForm.fields.messagePlaceholder}
                  ></textarea>
                </div>

                <div className="flex items-start gap-2">
                  <input
                    id="consent"
                    name="consent"
                    type="checkbox"
                    required
                    className="mt-1 h-4 w-4 rounded border-charcoal/20 text-clay focus:ring-clay/20"
                  />

                  <label htmlFor="consent" className="text-sm text-charcoal/85">
                    {pageData.contactForm.consentText}
                  </label>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex min-h-11 items-center justify-center bg-clay px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-bark"
                  >
                    {pageData.contactForm.submitButtonText}
                  </button>

                  <div
                    className={`flex min-h-[1.5em] items-center gap-2 text-sm transition-all duration-200 ${formStatus === 'Sending...' ? 'text-bark' : formStatus.includes('Error') ? 'text-red-600' : 'text-charcoal/80'}`}
                    role="status"
                    aria-live="polite"
                  >
                    {formStatus === 'Sending...' && (
                      <svg
                        className="h-4 w-4 animate-spin text-bark"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}

                    {formStatus.includes('Error') && (
                      <svg className="h-4 w-4 text-red-600" fill="none" viewBox="0 0 24 24">
                        <path
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    )}

                    <span>{formStatus}</span>
                  </div>
                </div>
              </form>

              <p className="mt-3 text-xs text-charcoal/70">{pageData.contactForm.crisisNotice}</p>

              <p className="mt-2 text-xs text-charcoal/70">
                Looking for self-guided support first? Explore our{' '}
                <Link
                  href="/resources"
                  className="underline decoration-charcoal/30 hover:decoration-charcoal"
                >
                  resource library
                </Link>{' '}
                or review our{' '}
                <Link
                  href="/services"
                  className="underline decoration-charcoal/30 hover:decoration-charcoal"
                >
                  counselling services
                </Link>
                .
              </p>
            </div>
          </div>

          {/* RIGHT: Details aligned with form box */}

          <aside className="space-y-8 md:border-l md:border-charcoal/10 md:pl-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                02 · Quick contact
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold text-bark">
                {pageData.contactInfo.quickContact.heading}
              </h3>

              <div className="mt-4 divide-y divide-charcoal/10 border-y border-charcoal/10 text-sm">
                <div className="py-3">
                  <p className="mb-1 font-medium text-charcoal">
                    {pageData.contactInfo.quickContact.emailLabel}
                  </p>

                  <a
                    href={`mailto:${pageData.contactInfo.quickContact.emailAddress}`}
                    className="underline decoration-charcoal/30 underline-offset-4 hover:decoration-charcoal"
                  >
                    {pageData.contactInfo.quickContact.emailAddress}
                  </a>
                </div>

                <div className="py-3">
                  <p className="mb-1 font-medium text-charcoal">
                    {pageData.contactInfo.quickContact.phoneLabel}
                  </p>

                  <a
                    href={`tel:+1-${pageData.contactInfo.quickContact.phoneNumber.replace(/\D/g, '')}`}
                    className="underline decoration-charcoal/30 underline-offset-4 hover:decoration-charcoal"
                  >
                    {pageData.contactInfo.quickContact.phoneNumber}
                  </a>
                </div>

                <div className="py-3">
                  <p className="mb-1 font-medium text-charcoal">
                    {pageData.contactInfo.quickContact.bookingLabel}
                  </p>

                  <a
                    href={pageData.contactInfo.quickContact.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() =>
                      trackConsultationClick({
                        location: 'contact-sidebar',

                        label: pageData.contactInfo.quickContact.bookingText,

                        url: pageData.contactInfo.quickContact.bookingUrl,
                      })
                    }
                    className="font-semibold text-bark underline decoration-clay/60 underline-offset-4 transition hover:text-clay"
                  >
                    {pageData.contactInfo.quickContact.bookingText}
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
                03 · Availability
              </p>
              <h3 className="mt-3 font-heading text-xl font-semibold text-bark">
                {pageData.contactInfo.hours.heading}
              </h3>

              <dl className="mt-4 grid grid-cols-2 gap-x-4 text-sm">
                {pageData.contactInfo.hours.schedule.map((item) => (
                  <div key={`${item.days}-${item.hours}`} className="contents">
                    <dt className="border-t border-charcoal/10 py-2">{item.days}</dt>

                    <dd className="border-t border-charcoal/10 py-2 text-charcoal/80">
                      {item.hours}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-3 text-xs text-charcoal/70">{pageData.contactInfo.hours.note}</p>
            </div>
          </aside>
        </section>

        <ConsultationCta
          title={pageData.finalCta.heading}
          description={pageData.finalCta.description}
          buttonText={pageData.finalCta.buttonText}
          bookingUrl={pageData.finalCta.buttonUrl}
          trackingLocation="contact-bottom"
          variant="bark"
          className="!mt-0 !rounded-none !bg-charcoal !shadow-none !ring-0"
        />
      </div>
    </div>
  )
}

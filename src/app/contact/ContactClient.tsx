'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

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
    <>
      {/* Page hero */}

      <section className="relative overflow-hidden rounded-2xl bg-bark text-cream ring-1 ring-cream/15">
        <div
          className="absolute -right-12 -top-12 h-56 w-56 rounded-full bg-gradient-to-br from-clay/40 to-cream/10 blur-2xl"
          aria-hidden="true"
        ></div>

        <div className="relative z-10 px-6 py-10 md:px-10 md:py-14">
          <span className="inline-flex items-center gap-2 rounded-full bg-cream/10 px-3 py-1 text-[11px] uppercase tracking-[.22em] ring-1 ring-cream/30">
            {pageData.hero.badge}
          </span>

          <h1 className="mt-3 text-balance font-heading text-3xl font-bold leading-tight md:text-4xl">
            {pageData.hero.heading}
          </h1>

          <p className="mt-3 max-w-3xl text-cream/85">{pageData.hero.description}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={`mailto:${pageData.contactInfo.quickContact.emailAddress}`}
              className="inline-flex items-center justify-center rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
            >
              {pageData.hero.emailButtonText}
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
              className="inline-flex items-center justify-center rounded-full bg-cream/10 px-5 py-2.5 text-sm font-semibold text-cream ring-1 ring-cream/20 transition-colors hover:bg-cream/15"
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

      <section className="mt-14 grid gap-10 md:mt-16 md:grid-cols-12 md:items-start">
        {/* LEFT: Forms */}

        <div className="md:col-span-7">
          {/* General Contact Form */}

          <div>
            <h2 className="font-heading text-xl font-semibold md:text-2xl">
              {pageData.contactForm.heading}
            </h2>

            <form
              name="contact"
              method="POST"
              encType="multipart/form-data"
              className="mt-4 space-y-5 rounded-2xl bg-white p-6 ring-1 ring-charcoal/5 md:p-8"
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
                    className="mt-1 w-full rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
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
                    className="mt-1 w-full rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
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
                    className="mt-1 w-full rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
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
                    className="mt-1 w-full rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
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
                  className="mt-1 w-full rounded-2xl border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-charcoal/40 focus:border-clay focus:ring-2 focus:ring-clay/20"
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
                  className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
                >
                  {pageData.contactForm.submitButtonText}
                </button>

                <div
                  className={`flex min-h-[1.5em] items-center gap-2 text-sm transition-all duration-200 ${formStatus === 'Sending...' ? 'text-bark' : formStatus.includes('Error') ? 'text-red-600' : 'text-charcoal/80'}`}
                  role="status"
                  aria-live="polite"
                >
                  {formStatus === 'Sending...' && (
                    <svg className="h-4 w-4 animate-spin text-bark" fill="none" viewBox="0 0 24 24">
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

        <aside className="mt-10 space-y-6 md:col-span-5 md:mt-[3.25rem]">
          <div className="rounded-2xl bg-sand p-5 ring-1 ring-charcoal/5">
            <h3 className="font-heading font-semibold">
              {pageData.contactInfo.quickContact.heading}
            </h3>

            <div className="mt-3 space-y-3 text-sm">
              <div>
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

              <div>
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

              <div>
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
                  className="underline decoration-charcoal/30 underline-offset-4 hover:decoration-charcoal"
                >
                  {pageData.contactInfo.quickContact.bookingText}
                </a>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 ring-1 ring-charcoal/5">
            <h3 className="font-heading font-semibold">{pageData.contactInfo.hours.heading}</h3>

            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {pageData.contactInfo.hours.schedule.map((item) => (
                <div key={`${item.days}-${item.hours}`} className="contents">
                  <dt>{item.days}</dt>

                  <dd className="text-charcoal/80">{item.hours}</dd>
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
        className="md:mt-20"
      />
    </>
  )
}

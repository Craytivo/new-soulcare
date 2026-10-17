'use client'
import { useState, useEffect, useRef } from 'react'
import type { InternApplicationPage } from '@/lib/content'

interface InternApplicationFormProps {
  pageData: InternApplicationPage
}

export default function InternApplicationForm({ pageData }: InternApplicationFormProps) {
  const [formStatus, setFormStatus] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [submitName, setSubmitName] = useState('')
  const [animateIn, setAnimateIn] = useState(false)
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  const closeModal = () => {
    setAnimateIn(false)
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

      // Submission is handled by the Next.js API route.

  // Render form field based on type
  const renderFormField = (question: InternApplicationPage['formFields']['formQuestions'][0]) => {
    const baseClasses =
      'mt-1 w-full rounded-full border border-charcoal/10 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-clay focus:ring-2 focus:ring-clay/20 placeholder:text-charcoal/40'

    switch (question.fieldType) {
      case 'textarea':
        return (
          <textarea
            id={`intern-${question._key}`}
            name={question._key}
            rows={4}
            required
            className={baseClasses}
            placeholder={question.placeholder}
          />
        )
      case 'file':
        return (
          <input
            id={`intern-${question._key}`}
            name={question._key}
            type="file"
            accept=".pdf,.doc,.docx"
            required
            className={baseClasses}
          />
        )
      case 'checkbox':
        return (
          <div className="flex items-start gap-2">
            <input
              id={`intern-${question._key}`}
              name={question._key}
              type="checkbox"
              required
              className="mt-1 h-4 w-4 rounded border-charcoal/20 text-clay focus:ring-clay/20"
            />
            <label htmlFor={`intern-${question._key}`} className="text-sm text-charcoal/85">
              {question.label}
            </label>
          </div>
        )
      case 'select':
        return (
          <select
            id={`intern-${question._key}`}
            name={question._key}
            required
            className={baseClasses}
          >
            <option value="">Choose an option</option>
            {question.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )
      default:
        return (
          <input
            id={`intern-${question._key}`}
            name={question._key}
            type={question.fieldType}
            required
            className={baseClasses}
            placeholder={question.placeholder}
          />
        )
    }
  }

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
        // Try to extract a name field from the form data
        let nameVal = ''
        for (const [k, v] of Array.from(formData.entries())) {
          if (/name/i.test(k)) {
            nameVal = String(v)
            break
          }
        }
        if (!nameVal) {
          // fallback: first text-like field
          for (const [, v] of Array.from(formData.entries())) {
            if (
              typeof v === 'string' &&
              v.trim().length > 0 &&
              v.toString().split(' ').length <= 4
            ) {
              nameVal = String(v)
              break
            }
          }
        }
        setSubmitName(nameVal || 'Applicant')
        setModalOpen(true)
        setFormStatus('')
        form.reset()
      } else {
        const payload = (await res.json().catch(() => null)) as { message?: string } | null
        setFormStatus(payload?.message || 'Error sending application.')
      }
    } catch {
      setFormStatus('Error sending application.')
    }
  }

  return (
    <form
      name="intern-application"
      encType="multipart/form-data"
      className="mt-4 space-y-6 rounded-2xl bg-white p-6 ring-1 ring-charcoal/5 md:p-8"
      onSubmit={handleSubmit}
    >
      <input type="hidden" name="form-name" value="intern-application" />
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
      {/* Dynamic form fields from Supabase content */}
      <div className="space-y-4">
        {pageData.formFields.formQuestions.map((question) => (
          <div key={question._key} className={question.fieldType === 'checkbox' ? '' : 'space-y-1'}>
            {question.fieldType !== 'checkbox' && (
              <label
                htmlFor={`intern-${question._key}`}
                className="block text-sm font-medium text-charcoal/80"
              >
                {question.label}
              </label>
            )}
            {renderFormField(question)}
          </div>
        ))}
      </div>

      {/* Submit button and status */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-full bg-clay px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-clay/90"
        >
          Send application
        </button>
        <div
          className={`flex min-h-[1.5em] items-center gap-2 text-sm transition-all duration-200 ${formStatus === 'Sending...' ? 'text-bark' : formStatus.includes('successfully') ? 'text-green-700' : formStatus.includes('Error') ? 'text-red-600' : 'text-charcoal/80'}`}
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
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0z"
              />
            </svg>
          )}
          {formStatus.includes('successfully') && (
            <svg className="h-4 w-4 text-green-700" fill="none" viewBox="0 0 24 24">
              <path
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
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
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeModal}
            aria-hidden="true"
          ></div>
          <div className="relative mx-4 w-full max-w-lg">
            <div
              className={`transform-gpu rounded-2xl bg-white p-6 shadow-xl ring-1 ring-charcoal/5 transition-all duration-200 md:p-8 ${animateIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}
            >
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
                    Thank you, {submitName || 'Applicant'}!
                  </h3>
                  <p className="mt-2 leading-relaxed text-charcoal/75">
                    We have received your application and will be in touch if there are next steps.
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
    </form>
  )
}

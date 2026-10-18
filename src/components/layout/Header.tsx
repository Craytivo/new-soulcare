'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { trackConsultationClick } from '@/lib/tracking'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const closeMenu = () => setIsMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/95 text-bark backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4">
          {/* LEFT: Brand */}
          <Link href="/" className="flex items-center gap-3">
            {/* Logo on black circle */}
            <span className="relative flex h-16 w-16 items-center justify-center">
              <svg
                className="absolute inset-0 z-0 h-full w-full"
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <circle cx="50" cy="50" r="50" fill="#fff" stroke="#F5D07B" strokeWidth="2" />
              </svg>
              <span className="relative z-10 flex h-12 w-12 items-center justify-center">
                <Image
                  src="/assets/logo/logo-s-c-intertwined.png"
                  alt="Soul Care Counselling Logo"
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                  priority
                />
              </span>
            </span>
          </Link>

          {/* CENTER: Desktop nav */}
          <nav className="hidden items-center justify-center gap-7 lg:flex" aria-label="Primary">
            <Link
              href="/"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              About Us
            </Link>
            <Link
              href="/services"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              Services
            </Link>
            <Link
              href="/areas"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              Areas of Focus
            </Link>
            <Link
              href="/resources"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              Resources
            </Link>
            <Link
              href="/contact"
              className="whitespace-nowrap text-sm font-medium uppercase tracking-[.15em] text-bark/80 transition-colors duration-200 hover:text-gold"
            >
              Contact
            </Link>
          </nav>

          {/* RIGHT: CTA + Hamburger */}
          <div className="flex items-center justify-end gap-2">
            <a
              href="https://thesoulcarecounsellor.janeapp.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackConsultationClick({
                  location: 'desktop-nav',
                  label: 'Book a Free Consultation',
                  url: 'https://thesoulcarecounsellor.janeapp.com',
                })
              }
              className="inline-flex min-h-10 items-center justify-center whitespace-nowrap bg-clay px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-bark lg:px-4 lg:text-sm"
            >
              <span className="lg:hidden">Book</span>
              <span className="hidden lg:inline">Book Consultation</span>
            </a>
            <button
              type="button"
              onClick={toggleMenu}
              className={`inline-flex h-10 w-10 shrink-0 items-center justify-center border border-bark/20 transition-colors duration-200 hover:bg-sand ${isMenuOpen ? 'bg-sand' : ''}`}
              aria-controls="menuPanel"
              aria-expanded={isMenuOpen}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  toggleMenu()
                }
              }}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              <span className={`relative block h-5 w-5 ${isMenuOpen ? 'opacity-70' : ''}`}>
                {/* Hamburger to X animation */}
                <span
                  className={`absolute left-0 top-1 h-0.5 w-5 rounded bg-bark transition-all duration-300 ${isMenuOpen ? 'top-2.5 rotate-45 bg-bark' : ''}`}
                  style={{ transitionProperty: 'transform, top, background' }}
                ></span>
                <span
                  className={`absolute left-0 top-2.5 h-0.5 w-5 rounded bg-bark transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
                  style={{ transitionProperty: 'opacity' }}
                ></span>
                <span
                  className={`absolute left-0 top-4 h-0.5 w-5 rounded bg-bark transition-all duration-300 ${isMenuOpen ? 'top-2.5 -rotate-45 bg-bark' : ''}`}
                  style={{ transitionProperty: 'transform, top, background' }}
                ></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-[59] bg-charcoal/50"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <aside
        id="menuPanel"
        className={`fixed inset-y-0 right-0 z-[60] w-[86%] max-w-sm overflow-y-auto border-l border-cream/15 bg-bark/95 text-cream shadow-xl transition-transform duration-300 ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!isMenuOpen}
        tabIndex={-1}
      >
        {/* Sticky header inside panel */}
        <div className="sticky top-0 flex items-center justify-between border-b border-cream/15 bg-bark/95 px-4 py-3 backdrop-blur">
          <span className="text-sm font-semibold uppercase tracking-wide">Menu</span>
          <button
            type="button"
            onClick={closeMenu}
            className="inline-flex items-center justify-center rounded-md p-2 ring-1 ring-cream/20 hover:bg-cream/10"
            aria-label="Close menu panel"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                closeMenu()
              }
            }}
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-cream"
              aria-hidden="true"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="px-4 py-4 text-sm" aria-label="All pages">
          <Link
            href="/"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            About Us
          </Link>
          <Link
            href="/core-values"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Core Pillars
          </Link>
          <Link
            href="/services"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Services
          </Link>
          <Link
            href="/areas"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Areas of Focus
          </Link>
          <Link
            href="/intern-application"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Apply to be an Intern
          </Link>

          <hr className="my-3 border-cream/15" />

          <Link
            href="/faq"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            FAQs
          </Link>
          <Link
            href="/notes"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Notes from Soul Care
          </Link>
          <Link
            href="/workshops"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Wellness Webinars
          </Link>
          <Link
            href="/resources"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Resources
          </Link>
          <Link
            href="/shop"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Shop
          </Link>
          <Link
            href="/contact"
            className="block py-2 text-sm uppercase tracking-[.15em] text-cream/90 hover:text-cream"
            onClick={closeMenu}
          >
            Contact
          </Link>

          <a
            href="https://thesoulcarecounsellor.janeapp.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackConsultationClick({
                location: 'mobile-menu',
                label: 'Book a Free Consultation',
                url: 'https://thesoulcarecounsellor.janeapp.com',
              })
            }
            className="mt-6 inline-flex items-center justify-center rounded-xl bg-gold px-6 py-3 font-bold tracking-wide text-bark shadow-lg transition-all duration-200 hover:scale-105 hover:bg-gold/90"
          >
            Book a Free Consultation
          </a>
        </nav>
      </aside>
    </>
  )
}

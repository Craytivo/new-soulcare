import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About Us' },
  { href: '/core-values', label: 'Core Values' },
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Areas of Focus' },
  { href: '/intern-application', label: 'Apply to be an Intern' },
]

const resourceLinks = [
  { href: '/faq', label: 'FAQs' },
  { href: '/notes', label: 'Notes from Soul Care' },
  { href: '/workshops', label: 'Wellness Webinars' },
]

const linkClass =
  'group inline-flex items-center gap-2 text-sm font-medium text-bark/68 transition hover:text-bark focus:outline-none focus:ring-2 focus:ring-bark/20 focus:ring-offset-2 focus:ring-offset-cream'

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-cream text-bark">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-8 md:py-16 lg:px-10">
        <div className="border-t border-charcoal/10 pt-10 md:pt-12">
          <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr] lg:gap-16">
            <div className="max-w-md">
              <Link
                href="/"
                className="inline-flex items-center gap-4"
                aria-label="Soul Care Counselling home"
              >
                <span className="ring-charcoal/8 flex h-14 w-14 items-center justify-center rounded-xl bg-white ring-1 shadow-elevation-2">
                  <Image
                    src="/assets/logo/logo-s-c-intertwined.png"
                    alt="Soul Care Counselling Logo"
                    width={42}
                    height={42}
                    className="h-10 w-10 object-contain"
                  />
                </span>
                <span className="max-w-44 font-heading text-lg font-semibold leading-tight text-bark">
                  Soul Care Counselling
                </span>
              </Link>

              <ul className="mt-7 space-y-2 text-sm leading-6 text-bark/70">
                <li>Virtual appointments across Canada</li>
                <li>
                  <a
                    href="mailto:info@thesoulcarecounsellor.com"
                    className="transition hover:text-bark"
                  >
                    info@thesoulcarecounsellor.com
                  </a>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="https://www.instagram.com/thesoulcaretherapists/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Soul Care Instagram profile"
                  className="text-bark/78 inline-flex min-h-10 items-center gap-2 border border-charcoal/10 bg-white px-3.5 py-2 text-sm font-semibold transition hover:border-clay/35 hover:text-bark focus:outline-none focus:ring-2 focus:ring-bark/20 focus:ring-offset-2 focus:ring-offset-cream"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.5" y2="6.5" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <Link
                  href="/contact"
                  className="text-bark/78 inline-flex min-h-10 items-center border border-charcoal/10 bg-white px-3.5 py-2 text-sm font-semibold transition hover:border-clay/35 hover:text-bark focus:outline-none focus:ring-2 focus:ring-bark/20 focus:ring-offset-2 focus:ring-offset-cream"
                >
                  Get in touch
                </Link>
              </div>

              <div className="mt-7">
                <a
                  href="https://www.psychologytoday.com/"
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  aria-label="Soul Care Psychology Today verification badge"
                  className="ring-charcoal/8 inline-flex rounded-xl bg-white p-2.5 ring-1 transition shadow-elevation-1 hover:shadow-elevation-2"
                >
                  <Image
                    src="/assets/img/icons/psychology-today.png"
                    alt="Verified by Psychology Today"
                    className="h-9 w-auto md:h-10"
                    width={320}
                    height={110}
                    loading="lazy"
                  />
                </a>
              </div>
            </div>

            <div className="grid gap-10 sm:grid-cols-3 lg:gap-12">
              <nav
                aria-label="Quick links"
                className="sm:border-l sm:border-charcoal/10 sm:pl-6 lg:pl-8"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bark">
                  Quick Links
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              <nav
                aria-label="Resources"
                className="sm:border-l sm:border-charcoal/10 sm:pl-6 lg:pl-8"
              >
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bark">
                  Resources
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {resourceLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a
                      href="https://thesoulcarecounsellor.janeapp.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      Client Booking (Jane)
                      <ArrowUpRight className="h-3.5 w-3.5 opacity-45 transition group-hover:opacity-80" />
                    </a>
                  </li>
                </ul>
              </nav>

              <nav aria-label="Legal" className="sm:border-l sm:border-charcoal/10 sm:pl-6 lg:pl-8">
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bark">
                  Policies
                </h3>
                <ul className="mt-6 space-y-3.5">
                  <li>
                    <Link href="/privacy" className={linkClass}>
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className={linkClass}>
                      Terms of Use
                    </Link>
                  </li>
                </ul>
                <p className="text-bark/62 mt-7 border-l-2 border-clay/60 bg-white/70 p-4 text-xs leading-6">
                  Not for crisis support. If you&apos;re in immediate danger, call 911 or local
                  emergency services.
                </p>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-charcoal/10 bg-cream text-bark">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-6 py-7 text-sm sm:px-8 md:flex-row md:items-center md:justify-between lg:px-10">
          <p className="text-bark/68">
            &copy; {new Date().getFullYear()} Soul Care Counselling. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacy" className="text-bark/68 transition hover:text-bark">
              Privacy
            </Link>
            <Link href="/terms" className="text-bark/68 transition hover:text-bark">
              Terms
            </Link>
            <a href="#" className="text-bark/68 transition hover:text-bark">
              Back to top
            </a>
          </div>

          <p className="text-bark/58 text-xs">
            Built and optimized with{' '}
            <a
              href="https://craytivo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline decoration-bark/30 underline-offset-4 transition hover:text-bark"
            >
              Craytivo
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

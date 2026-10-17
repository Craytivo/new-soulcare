'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Quote } from 'lucide-react'
import { urlForImage } from '@/lib/content'
import { useState, useEffect, useRef } from 'react'

interface ContentImage {
  _type: 'image'
  asset: {
    _ref: string
    _type: 'reference'
  }
  alt?: string
}

interface DirectorSectionProps {
  name: string
  credentials?: string
  badge?: string
  image?: ContentImage
  description: string
  quote?: string
  bookingLink?: string
  bookingText?: string
  psychologyTodayImage?: ContentImage
  psychologyTodayLink?: string
  slug?: string
}

export default function DirectorSection({
  name,
  credentials,
  badge,
  image,
  description,
  quote,
  bookingLink,
  bookingText = 'Book a Free Consultation',
  psychologyTodayImage,
  psychologyTodayLink,
  slug = 'jessica-robinson-grant',
}: DirectorSectionProps) {
  const paragraphs = description.split(/\n{2,}/).filter(Boolean)

  // Mouse position for parallax effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const portraitRef = useRef<HTMLDivElement>(null)

  // Reveal animation state
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  // Quote typing effect
  const [displayedQuote, setDisplayedQuote] = useState('')
  const quoteRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check screen size
    const checkScreenSize = () => {
      setIsLargeScreen(window.innerWidth > 768)
    }
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    // Mouse move handler for parallax (desktop only) - very subtle
    const handleMouseMove = (e: MouseEvent) => {
      if (!portraitRef.current || window.innerWidth <= 768) return
      const rect = portraitRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const x = (e.clientX - centerX) / 80 // Reduced from 30 to 80 for much subtler effect
      const y = (e.clientY - centerY) / 80 // Reduced from 30 to 80 for much subtler effect
      setMousePosition({ x, y })
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', checkScreenSize)
    }
  }, [])

  useEffect(() => {
    // Intersection Observer for reveal animations
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    // Intersection Observer for quote
    const quoteObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && quote) {
          let index = 0
          const typeInterval = setInterval(() => {
            if (index < quote.length) {
              setDisplayedQuote(quote.slice(0, index + 1))
              index++
            } else {
              clearInterval(typeInterval)
            }
          }, 30)
          return () => clearInterval(typeInterval)
        }
      },
      { threshold: 0.5 }
    )

    if (quoteRef.current) {
      quoteObserver.observe(quoteRef.current)
    }

    return () => quoteObserver.disconnect()
  }, [quote])

  return (
    <section ref={sectionRef} className="section-spacing">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20">
        {/* Header: Portrait badge + name (clickable) */}
        <div className="mb-12 md:mb-16 lg:mb-24">
          <div className="flex flex-col justify-center gap-8 md:flex-row md:items-center md:gap-10 lg:gap-14">
            {/* Portrait badge - advanced parallax effect */}
            {image && (
              <div className="flex flex-shrink-0 justify-center">
                <Link href={`/about/${slug}`} className="group inline-block">
                  <div
                    ref={portraitRef}
                    className="group-hover:scale-102 relative h-36 w-28 transition-transform duration-700 ease-out sm:h-40 sm:w-32 md:h-48 md:w-40"
                    style={{
                      transform: isLargeScreen
                        ? `perspective(1000px) rotateY(${mousePosition.x}deg) rotateX(${-mousePosition.y}deg)`
                        : undefined,
                    }}
                  >
                    {/* Subtle gradient glow */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-clay/10 via-transparent to-cream/10 opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-50" />

                    {/* Outer glow frame */}
                    <div className="blur-xs absolute inset-0 rounded-lg border-2 border-clay/20 opacity-40 transition-all duration-700 group-hover:opacity-60" />

                    {/* Main frame */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg border border-clay/80 bg-white/5 backdrop-blur-sm shadow-elevation-1">
                      {/* Corner brackets - very subtle */}
                      <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-clay/60 transition-all duration-700 group-hover:border-clay/80" />
                      <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-clay/60 transition-all duration-700 group-hover:border-clay/80" />
                      <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-clay/60 transition-all duration-700 group-hover:border-clay/80" />
                      <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-clay/60 transition-all duration-700 group-hover:border-clay/80" />

                      {/* Image */}
                      <div className="relative h-full w-full">
                        <Image
                          src={urlForImage(image, { width: 200, height: 240, fit: 'crop' }).url()}
                          alt={image.alt || name}
                          fill
                          className="object-cover transition-transform duration-1000 group-hover:scale-105"
                          priority
                          sizes="(max-width: 640px) 112px, (max-width: 768px) 128px, 160px"
                        />
                        {/* Subtle vignette */}
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 via-transparent to-transparent transition-opacity duration-700 group-hover:from-charcoal/20" />

                        {/* Very subtle hover overlay */}
                        <div className="absolute inset-0 bg-clay/5 opacity-0 transition-opacity duration-700 group-hover:opacity-50" />
                      </div>
                    </div>

                    {/* Subtle status indicator */}
                    <div className="absolute -bottom-2 -right-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-cream bg-clay shadow-lg transition-all duration-700 group-hover:scale-105 group-hover:bg-bark">
                        <div className="h-2 w-2 rounded-full bg-cream" />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}

            {/* Name section with reveal animation */}
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-6 transition-all duration-700 ease-out md:mb-8 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                <h2 className="heading-xl mb-2 text-2xl sm:mb-3 sm:text-3xl md:text-4xl lg:text-5xl">
                  <Link
                    href={`/about/${slug}`}
                    className="decoration-clay/50 decoration-2 underline-offset-4 transition-all hover:text-clay hover:underline"
                  >
                    {name}
                  </Link>
                </h2>
                {credentials && (
                  <p className="text-lg font-semibold text-clay transition-opacity duration-500 hover:opacity-80 sm:text-xl">
                    {credentials}
                  </p>
                )}
                {/* Badge and link on same line */}
                <div className="mt-3 flex flex-wrap items-center gap-4 sm:mt-4">
                  {badge && (
                    <p className="label-text inline-block w-fit rounded-full border border-clay/20 bg-sand/50 px-3 py-1 text-xs sm:text-sm">
                      {badge}
                    </p>
                  )}
                  {/* Stylish link to personal page */}
                  <Link
                    href={`/about/${slug}`}
                    className="group relative inline-flex items-center gap-2 text-sm font-semibold text-clay transition-colors hover:text-bark"
                  >
                    <span className="relative z-10">View full profile</span>
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-clay transition-all duration-300 group-hover:w-full" />
                    <ArrowUpRight className="relative z-10 h-4 w-4 transform transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content area */}
        <div className="mx-auto max-w-3xl text-center">
          {/* Bio content with staggered reveal */}
          <div className="mb-8 space-y-5 sm:space-y-6 md:mb-12 md:space-y-8">
            {paragraphs.map((paragraph, idx) => (
              <p
                key={idx}
                className="body-text text-base leading-relaxed transition-all duration-700 ease-out sm:text-lg"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${idx * 150}ms`,
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Quote section with typing effect */}
          {quote && (
            <div
              ref={quoteRef}
              className="relative mb-8 border-b-4 border-t-4 border-clay/30 px-6 py-4 transition-colors duration-500 hover:border-clay sm:px-8 sm:py-6 md:mb-12"
            >
              <Quote className="mx-auto mb-3 h-6 w-6 text-clay/20 sm:h-8 sm:w-8" />
              <p className="font-serif text-lg italic leading-relaxed text-charcoal/80 sm:text-xl md:text-2xl">
                &quot;{displayedQuote}&quot;
                <span className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-clay sm:h-6" />
              </p>
            </div>
          )}

          {/* Psychology Today badge with hover effect */}
          {psychologyTodayImage && psychologyTodayLink && (
            <div
              className={`mb-8 flex justify-center transition-all duration-700 ease-out md:mb-12 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: '400ms' }}
            >
              <a
                href={psychologyTodayLink}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="group relative inline-block"
                aria-label="Verified on Psychology Today"
              >
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-clay/20 to-cream/20 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />
                <Image
                  src={urlForImage(psychologyTodayImage, { fit: 'crop' }).url()}
                  alt={psychologyTodayImage.alt || 'Verified on Psychology Today'}
                  width={320}
                  height={110}
                  className="relative h-10 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-12"
                />
              </a>
            </div>
          )}

          {/* CTA Button with advanced hover effect */}
          {bookingLink && (
            <div
              className={`flex justify-center transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              style={{ transitionDelay: '500ms' }}
            >
              <a
                href={bookingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-lg bg-clay px-6 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-bark hover:shadow-elevation-3 focus:outline-none focus:ring-2 focus:ring-clay/50 focus:ring-offset-2 sm:px-8 sm:py-3.5 sm:text-base"
              >
                <span className="relative z-10">{bookingText}</span>
                <svg
                  className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                {/* Button shine effect */}
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 ease-in-out group-hover:translate-x-full" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

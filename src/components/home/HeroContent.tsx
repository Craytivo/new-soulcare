'use client'

import { useEffect, useState } from 'react'
import { Globe2, GraduationCap, LockKeyhole, MapPin, ShieldCheck } from 'lucide-react'
import type { HomePage } from '@/lib/content'

interface HeroContentProps {
  homePageData: HomePage | null
}

const iconComponents = {
  lock: LockKeyhole,
  mapPin: MapPin,
  globe: Globe2,
  graduationCap: GraduationCap,
}

export default function HeroContent({ homePageData }: HeroContentProps) {
  const [activeFeature, setActiveFeature] = useState(0)
  const heroData = homePageData?.hero
  const features = [...(heroData?.features ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4)
  const safeFeatureIndex = features.length ? activeFeature % features.length : 0
  const active = features[safeFeatureIndex]
  const ActiveIcon = active ? (iconComponents[active.icon] ?? ShieldCheck) : ShieldCheck

  useEffect(() => {
    if (features.length < 2) return

    const timer = window.setInterval(() => {
      setActiveFeature((current) => (current + 1) % features.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [features.length])

  if (!heroData) {
    return null
  }

  return (
    <section
      className="border-b border-charcoal/10 bg-cream px-5 py-10 text-bark sm:px-8 sm:py-12 lg:px-12 lg:py-14"
      aria-label="What to expect"
    >
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.8fr)] lg:items-center lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
            A considered place to begin
          </p>
          <p className="mt-4 max-w-2xl font-heading text-2xl font-semibold leading-tight text-charcoal sm:text-3xl">
            {heroData.description}
          </p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium uppercase tracking-[0.14em] text-bark/60">
            {features.map((feature) => (
              <span key={`${feature.icon}-${feature.text}`}>{feature.text}</span>
            ))}
          </div>
        </div>

        <div
          className="relative overflow-hidden border-l-2 border-clay/70 pl-5 sm:pl-6"
          aria-live="polite"
        >
          {active ? (
            <>
              <ActiveIcon className="h-5 w-5 text-clay" strokeWidth={1.7} aria-hidden="true" />
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-bark/55">
                {active.text}
              </p>
              {heroData.quote?.text && (
                <p className="mt-3 max-w-md font-serif text-lg italic leading-7 text-bark/80">
                  &ldquo;{heroData.quote.text}&rdquo;
                </p>
              )}
              {heroData.quote?.author && (
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-clay">
                  {heroData.quote.author}
                </p>
              )}
            </>
          ) : (
            <p className="text-sm text-bark/70">Thoughtful care, shaped around your story.</p>
          )}
          {features.length > 1 && (
            <div className="mt-6 flex gap-1.5" aria-hidden="true">
              {features.map((feature, index) => (
                <span
                  key={`${feature.icon}-progress`}
                  className={`h-1 transition-all duration-500 ${
                    index === safeFeatureIndex ? 'w-8 bg-clay' : 'w-2 bg-clay/25'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

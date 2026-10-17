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
  if (!homePageData?.hero) {
    return null
  }

  const heroData = homePageData.hero
  const features = [...(heroData.features ?? [])]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .slice(0, 4)

  return (
    <section
      className="relative overflow-hidden border-b border-[#e7c49a]/20 bg-charcoal px-5 py-5 text-white sm:px-8 lg:px-12"
      aria-label="What to expect"
    >
      {/* Soft warm glow so the bar reads as a continuation of the hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-[#e7c49a]/[0.07] to-transparent"
      />

      <div className="relative mx-auto flex max-w-7xl flex-col items-center gap-3.5">
        {features.length > 0 && (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-0">
            {features.map((feature, index) => {
              const Icon = iconComponents[feature.icon] ?? ShieldCheck

              return (
                <li key={`${feature.icon}-${feature.text}`} className="flex items-center">
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="mx-4 hidden h-1 w-1 rotate-45 bg-[#e7c49a]/60 sm:inline-block xl:mx-5"
                    />
                  )}
                  <Icon
                    className="mr-2 h-3.5 w-3.5 shrink-0 text-[#e7c49a]"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                  <span className="text-[0.68rem] font-medium uppercase leading-snug tracking-[0.14em] text-white/85">
                    {feature.text}
                  </span>
                </li>
              )
            })}
          </ul>
        )}

        {heroData.quote?.text && (
          <figure className="flex shrink-0 flex-col items-center gap-1 text-center sm:flex-row sm:gap-3">
            <blockquote>
              <p className="font-serif text-sm italic text-cream/90">
                &ldquo;{heroData.quote.text}&rdquo;
              </p>
            </blockquote>
            {heroData.quote.author && (
              <figcaption className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-[#e7c49a]">
                {heroData.quote.author}
              </figcaption>
            )}
          </figure>
        )}
      </div>
    </section>
  )
}

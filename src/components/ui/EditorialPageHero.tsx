import type { ReactNode } from 'react'

interface EditorialPageHeroProps {
  eyebrow: string
  title: string
  description?: string
  children?: ReactNode
  aside?: ReactNode
}

export default function EditorialPageHero({
  eyebrow,
  title,
  description,
  children,
  aside,
}: EditorialPageHeroProps) {
  return (
    <section
      className={`grid overflow-hidden bg-charcoal text-white ${aside ? 'lg:grid-cols-[1.15fr_0.85fr]' : ''}`}
    >
      <div
        className={`flex flex-col justify-center p-7 sm:p-10 lg:p-12 xl:p-16 ${aside ? '' : 'lg:col-span-2'}`}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">{eyebrow}</p>
        <h1 className="mt-4 max-w-2xl text-balance font-heading text-4xl font-semibold leading-[1.06] tracking-tight sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </div>
      {aside ? (
        <aside className="flex flex-col justify-center border-t border-white/15 bg-white/[0.03] p-7 sm:p-10 lg:border-l lg:border-t-0 lg:p-12">
          {aside}
        </aside>
      ) : null}
    </section>
  )
}

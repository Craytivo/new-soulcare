import FAQAccordion from './FAQAccordion'

interface FAQ {
  question: string
  answer: string
  order?: number
}

interface FAQSectionProps {
  title: string
  id: string
  faqs: FAQ[]
  startIndex: number
}

export default function FAQSection({ title, id, faqs, startIndex }: FAQSectionProps) {
  if (faqs.length === 0) return null

  return (
    <section id={id} className="scroll-mt-24 py-10 sm:py-12">
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-clay">
          {String(startIndex + 1).padStart(2, '0')} · Common questions
        </p>
        <h2 className="mt-2 font-heading text-2xl font-semibold text-bark sm:text-3xl">{title}</h2>
      </div>
      <div className="divide-y divide-charcoal/10 border-y border-charcoal/10">
        {faqs.map((faq, i) => (
          <FAQAccordion
            key={`${faq.question}-${faq.order || i}`}
            question={faq.question}
            answer={faq.answer}
            index={startIndex + i}
            defaultOpen={i === 0 && startIndex === 0}
          />
        ))}
      </div>
    </section>
  )
}

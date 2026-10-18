'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface FAQAccordionProps {
  question: string
  answer: string
  index: number
  defaultOpen?: boolean
}

export default function FAQAccordion({
  question,
  answer,
  index,
  defaultOpen = false,
}: FAQAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="overflow-hidden bg-white transition-colors hover:bg-sand/30">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-5 text-left md:p-6"
        aria-expanded={isOpen}
      >
        <span className="flex items-start gap-3">
          <span className="mt-0.5 font-mono text-xs tabular-nums text-clay/50">
            {String(index + 1).padStart(2, '0')}
          </span>
          <span className="font-heading font-semibold leading-snug text-charcoal">{question}</span>
        </span>
        <span className="h-6 w-6 flex-shrink-0 text-clay">
          {isOpen ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
        </span>
      </button>
      {isOpen && (
        <div className="px-5 pb-5 md:px-6 md:pb-6">
          <div className="mb-4 h-px bg-charcoal/5" />
          <p className="leading-relaxed text-charcoal/75">{answer}</p>
        </div>
      )}
    </div>
  )
}

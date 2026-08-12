"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-[1200px] px-4 py-12">
      <h2 className="mb-6 text-[24px] font-bold text-[#191919]">
        Frequently Asked Questions
      </h2>
      <div className="divide-y divide-[#E5E5E5]">
        {items.map((item, index) => (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="flex w-full items-center justify-between gap-4 py-5 text-left text-[16px] font-medium text-[#191919] hover:text-[#0B5E9E] transition-colors"
            >
              {item.question}
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gray-400 transition-transform",
                  openIndex === index && "rotate-180"
                )}
                strokeWidth={1.5}
              />
            </button>
            {openIndex === index && (
              <div className="pb-5 text-[16px] leading-[1.7] text-gray-600">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

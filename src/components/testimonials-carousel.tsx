"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  text: string;
  name: string;
  state: string;
}

function StarRating() {
  return (
    <div className="mb-2 flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="h-4 w-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5">
      <StarRating />
      <p className="mb-4 flex-1 text-[14px] leading-relaxed text-gray-600">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#0C4B75]/10 text-[12px] font-bold text-[#0C4B75]">
          {t.name.charAt(0)}
        </div>
        <div>
          <p className="text-[13px] font-semibold text-[#191919]">{t.name}</p>
          <p className="text-[11px] text-gray-400">{t.state}</p>
        </div>
      </div>
    </div>
  );
}

export function TestimonialsCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [current, setCurrent] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const total = testimonials.length;

  // Auto-advance mobile carousel
  useEffect(() => {
    if (total <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 4000);
    return () => clearInterval(timer);
  }, [total]);

  // Scroll mobile carousel
  useEffect(() => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.children[current] as HTMLElement;
    if (card) {
      scrollRef.current.scrollTo({ left: card.offsetLeft - 16, behavior: "smooth" });
    }
  }, [current]);

  if (total === 0) return null;

  const desktopVisible = testimonials.slice(0, 4);

  return (
    <div className="mb-6">
      <h3 className="mb-4 text-[17px] font-bold text-[#191919]">What Patients Say</h3>

      {/* Desktop: 4 cards in a row */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {desktopVisible.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>

      {/* Mobile: horizontal scroll carousel */}
      <div className="sm:hidden">
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {testimonials.map((t, i) => (
            <div key={i} className="w-[85%] shrink-0 snap-center">
              <TestimonialCard t={t} />
            </div>
          ))}
        </div>

        {/* Dots + arrows */}
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === current ? "w-5 bg-[#0C4B75]" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => setCurrent((current - 1 + total) % total)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 active:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </button>
            <button
              onClick={() => setCurrent((current + 1) % total)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-400 active:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

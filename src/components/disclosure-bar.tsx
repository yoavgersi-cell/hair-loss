"use client";

import { useState } from "react";
import { X } from "lucide-react";

export function DisclosureBar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-[#f0f4f8] border-b-[1.5px] border-[#cdd7e1] px-4 py-1.5 sm:py-2 text-center text-[10px] sm:text-[13px] leading-tight sm:leading-normal text-gray-600">
        Some providers featured on this site may compensate us. This may affect the order and placement of listings but does not influence our editorial ratings or reviews.{" "}
        <button
          onClick={() => setIsOpen(true)}
          className="font-bold text-[#191919] underline underline-offset-2 hover:text-[#0C4B75]"
        >
          Advertising Disclosure
        </button>
      </div>

      {/* Popup overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setIsOpen(false)}>
          <div
            className="relative mx-4 max-h-[80vh] w-full max-w-[600px] overflow-y-auto rounded-lg bg-white p-8 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" strokeWidth={1.5} />
            </button>

            <h2 className="mb-5 text-[20px] font-bold text-[#191919]">Advertising Disclosure</h2>

            <div className="space-y-4 text-[14px] leading-[1.7] text-gray-600">
              <p>
                TopHairLoss.io is an independent comparison website designed to help consumers explore and evaluate weight loss treatment providers. We research, review, and compare available programs, services, and treatment options to make the decision process easier.
              </p>
              <p>
                The information presented on this website is provided for general informational purposes only. While we strive to keep content accurate and up to date, we cannot guarantee the completeness, accuracy, or availability of every provider, offer, or treatment currently available in the market.
              </p>
              <p>
                Some of the companies featured on this website may compensate us when visitors click through to their websites or become customers. This compensation may influence how providers are displayed, ranked, or featured on our pages. However, our goal is to present useful, relevant, and transparent information that helps users make informed decisions.
              </p>
              <p>
                Provider names, trademarks, logos, and brand assets remain the property of their respective owners. Their appearance on this website does not imply endorsement, partnership, or sponsorship unless explicitly stated.
              </p>
              <p>
                Our rankings, reviews, and recommendations are based on a combination of editorial research, publicly available information, pricing, treatment availability, user experience factors, and other criteria determined by our team. Not every provider operating in this industry is included on our website.
              </p>
              <p>
                By using this website, you agree to our Terms of Use and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

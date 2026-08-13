"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

const STORAGE_KEY = "thl-audience-pref";

// First-visit, dismissible modal that asks whether the visitor wants men's or
// women's treatment and routes them to the matching hub. Remembered via
// localStorage so it never nags a returning visitor. Non-blocking: the page
// behind it is fully rendered and crawlable (no SEO interstitial penalty), and
// it only ever renders after mount (never server-side / for crawlers).
export function AudiencePopup() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(STORAGE_KEY)) {
        // Small delay so it appears after the page paints, not on top of it.
        const t = setTimeout(() => setOpen(true), 900);
        return () => clearTimeout(t);
      }
    } catch {
      /* localStorage unavailable — just don't show the popup */
    }
  }, []);

  const remember = (value: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const choose = (path: string, value: string) => {
    remember(value);
    setOpen(false);
    router.push(path);
  };

  const dismiss = () => {
    remember("dismissed");
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="audience-popup-title"
      onClick={dismiss}
    >
      <div
        className="relative w-full max-w-[440px] rounded-2xl bg-white p-7 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600"
        >
          <X className="h-5 w-5" strokeWidth={1.75} />
        </button>

        <h2 id="audience-popup-title" className="text-center text-[22px] font-extrabold text-[#191919]">
          Who are we finding treatment for?
        </h2>
        <p className="mt-2 text-center text-[14px] leading-relaxed text-gray-500">
          Men&apos;s and women&apos;s hair loss use different treatments and providers. Pick one and
          we&apos;ll show the options built for you.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => choose("/men", "men")}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-4 py-5 transition-colors hover:border-[#0C4B75] hover:bg-[#0C4B75]/[0.03]"
          >
            <span className="text-[32px]" aria-hidden>👨</span>
            <span className="text-[15px] font-bold text-[#191919]">For Men</span>
          </button>
          <button
            onClick={() => choose("/women", "women")}
            className="flex flex-col items-center gap-2 rounded-xl border-2 border-[#E5E5E5] px-4 py-5 transition-colors hover:border-[#C0392B] hover:bg-[#C0392B]/[0.03]"
          >
            <span className="text-[32px]" aria-hidden>👩</span>
            <span className="text-[15px] font-bold text-[#191919]">For Women</span>
          </button>
        </div>

        <button
          onClick={dismiss}
          className="mt-5 block w-full text-center text-[13px] font-medium text-gray-400 hover:text-gray-600"
        >
          Just browsing — show me everything
        </button>
      </div>
    </div>
  );
}

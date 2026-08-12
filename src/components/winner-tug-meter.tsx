"use client";

import { useEffect, useRef, useState } from "react";
import { Trophy, ArrowRight } from "lucide-react";
import { ProviderCta } from "./provider-cta";

// Above-the-fold "verdict" for battle pages: a premium radial confidence gauge
// fills to the winner's share of the head-to-head score, paired with the
// winner call-out and CTA. Animates once on load; snaps to final for
// reduced-motion / repeat views. Desktop = gauge + text side by side;
// mobile = stacked and centered.
export function WinnerTugMeter({
  winnerName,
  loserName,
  advantage,
  winnerHref,
  winnerSlug,
}: {
  winnerName: string;
  loserName: string;
  advantage: number; // winner's share, 50–100
  winnerHref: string;
  winnerSlug: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setPct(advantage);
      setRevealed(true);
      return;
    }

    const startDelay = window.setTimeout(() => {
      const t0 = performance.now();
      const dur = 1200;
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - p, 4); // easeOutQuart
        setPct(Math.round(advantage * e));
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      window.setTimeout(() => setRevealed(true), 350);
    }, 200);

    return () => window.clearTimeout(startDelay);
  }, [advantage]);

  return (
    <section
      ref={ref}
      className="mb-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-7"
    >
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-7 sm:text-left">
        {/* Radial confidence gauge */}
        <div
          className="relative h-[124px] w-[124px] shrink-0 rounded-full sm:h-[132px] sm:w-[132px]"
          style={{
            background: `conic-gradient(#0F6F4D ${pct}%, #EEF0F3 0)`,
            transition: "background 90ms linear",
          }}
          role="img"
          aria-label={`${winnerName} wins with ${advantage}% of the head-to-head score`}
        >
          <div className="absolute inset-[11px] rounded-full bg-white" />
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <span className="text-[28px] font-extrabold leading-none tracking-[-0.03em] tabular-nums text-[#0F6F4D] sm:text-[30px]">
              {pct}%
            </span>
            <span className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.07em] text-gray-400">
              advantage
            </span>
          </div>
        </div>

        {/* Verdict + CTA */}
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-bold uppercase tracking-[0.09em] text-gray-400">
            Who we&rsquo;d pick
          </p>

          <div
            className={`mt-2 flex items-center justify-center gap-2 transition-all duration-500 sm:justify-start ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <Trophy className="h-[20px] w-[20px] shrink-0 text-amber-500" strokeWidth={2.5} />
            <span className="text-[19px] font-extrabold tracking-[-0.02em] text-[#191919] sm:text-[21px]">
              {winnerName} wins
            </span>
          </div>

          <p
            className={`mx-auto mt-2 max-w-[46ch] text-[13.5px] leading-relaxed text-gray-500 transition-opacity delay-75 duration-500 sm:mx-0 ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            After comparing both, we&rsquo;d go with {winnerName} — it came out ahead of {loserName} on most of what matters.
          </p>

          <div
            className={`mt-4 transition-all delay-100 duration-500 ${
              revealed ? "translate-y-0 opacity-100" : "translate-y-1.5 opacity-0"
            }`}
          >
            <ProviderCta
              href={winnerHref}
              providerName={winnerName}
              providerSlug={winnerSlug}
              pageType="battle"
              sourceFlow="battle_page"
              className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
            >
              Visit {winnerName}
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </ProviderCta>
          </div>

          {/* Sources */}
          <div
            className={`mt-5 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 border-t border-gray-100 pt-3.5 text-[11px] text-gray-400 transition-opacity delay-150 duration-500 sm:justify-start ${
              revealed ? "opacity-100" : "opacity-0"
            }`}
          >
            <span className="font-bold uppercase tracking-[0.06em]">Sources</span>
            <span className="text-gray-300">·</span>
            <span className="inline-flex items-center gap-1">
              <TrustpilotStar className="h-3 w-3" />
              Trustpilot reviews
            </span>
            <span className="text-gray-300">·</span>
            <span>Our own research</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustpilotStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#00B67A"
        d="M12 2l2.6 6.6 7.4.4-5.7 4.6 1.9 7.1L12 16.8l-6.2 3.9 1.9-7.1L2 9l7.4-.4L12 2z"
      />
    </svg>
  );
}

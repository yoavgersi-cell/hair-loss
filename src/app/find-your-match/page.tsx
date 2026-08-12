"use client";

import { useState, useEffect, useMemo } from "react";
import { Check, Clock, Shield, Lock, ShieldCheck, Timer, Search, MapPin, ArrowRight } from "lucide-react";
import { trackOnce, trackEvent } from "@/lib/analytics";

// Simplify footer on quiz pages — hide disclosure & nav, keep copyright
function HideChrome() {
  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;
    // Hide footer disclosure & nav, and header nav
    const disclosure = footer.querySelector("p:has(strong)");
    const footerNav = footer.querySelector("nav");
    const headerNav = document.querySelector("header nav");
    const hamburger = document.querySelector("header button");
    if (disclosure) (disclosure as HTMLElement).style.display = "none";
    if (footerNav) (footerNav as HTMLElement).style.display = "none";
    if (headerNav) (headerNav as HTMLElement).style.display = "none";
    if (hamburger) (hamburger as HTMLElement).style.display = "none";
    return () => {
      if (disclosure) (disclosure as HTMLElement).style.display = "";
      if (footerNav) (footerNav as HTMLElement).style.display = "";
      if (headerNav) (headerNav as HTMLElement).style.display = "";
      if (hamburger) (hamburger as HTMLElement).style.display = "";
    };
  }, []);
  return null;
}
import { ComparisonCard } from "@/components/comparison-card";
import type { SiteConfig, Provider, QuizConfig, RankingPageConfig } from "@/lib/config";

/** Provider merged with quiz-generated display data */
interface QuizMatchedProvider extends Provider {
  rank: number;
  rating: number;
  ratingLabel: string;
  badge?: string;
  matchPct: number;
  reasons: string[];
}

export default function FindYourMatchPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [step, setStep] = useState(-1); // -1 = welcome
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [phase, setPhase] = useState<"welcome" | "quiz" | "midmsg" | "loading" | "results">("welcome");
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [loadingPct, setLoadingPct] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [slideDirection, setSlideDirection] = useState<"forward" | "back">("forward");
  const [phaseTransitioning, setPhaseTransitioning] = useState(false);
  const [matchedProviders, setMatchedProviders] = useState<QuizMatchedProvider[]>([]);

  useEffect(() => {
    fetch("/api/config", {
      headers: { Authorization: `Bearer ${sessionStorage.getItem("admin_token") || "topweight2026"}` },
    })
      .then((r) => r?.json())
      .then((d) => { if (d && !d.error) setConfig(d); })
      .catch(() => null);
  }, []);

  const quiz: QuizConfig | null = config?.quiz ?? null;
  const questions = quiz?.questions ?? [];
  const currentQ = step >= 0 ? questions[step] : null;
  const totalSteps = questions.length;
  const progress = totalSteps > 0 && step >= 0 ? 20 + (step / Math.max(totalSteps - 1, 1)) * 80 : 0;

  function handleSelect(value: string) {
    if (!currentQ) return;
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
    trackEvent("QuizStep", { step_name: currentQ.id, step_number: step + 1, answer: value });

    // Auto-advance for card-type questions
    if (currentQ.type === "cards") {
      setTimeout(() => {
        if (step < totalSteps - 1) {
          // Show mid-flow message after step 2
          if (step === 1 && quiz?.midFlowMessage) {
            setPhaseTransitioning(true);
            setTimeout(() => {
              setPhase("midmsg");
              setPhaseTransitioning(false);
              setTimeout(() => {
                setPhaseTransitioning(true);
                setTimeout(() => {
                  setStep(step + 1);
                  setPhase("quiz");
                  setTransitioning(false);
                  setTimeout(() => setPhaseTransitioning(false), 30);
                }, 280);
              }, 1500);
            }, 280);
          } else {
            transitionTo(() => setStep(step + 1));
          }
        } else {
          setPhaseTransitioning(true);
          setTimeout(() => {
            startLoading();
            setTimeout(() => setPhaseTransitioning(false), 30);
          }, 280);
        }
      }, 350);
    }
  }

  function transitionTo(next: () => void, direction: "forward" | "back" = "forward") {
    setSlideDirection(direction);
    setTransitioning(true);
    setTimeout(() => {
      next();
      setTimeout(() => setTransitioning(false), 30);
    }, 280);
  }

  function handleContinue() {
    if (step < totalSteps - 1) {
      if (step === 1 && quiz?.midFlowMessage) {
        setPhaseTransitioning(true);
        setTimeout(() => {
          setPhase("midmsg");
          setPhaseTransitioning(false);
          setTimeout(() => {
            setPhaseTransitioning(true);
            setTimeout(() => {
              setStep(step + 1);
              setPhase("quiz");
              setTransitioning(false);
              setTimeout(() => setPhaseTransitioning(false), 30);
            }, 280);
          }, 1500);
        }, 280);
      } else {
        transitionTo(() => setStep(step + 1));
      }
    } else {
      setPhaseTransitioning(true);
      setTimeout(() => {
        startLoading();
        setTimeout(() => setPhaseTransitioning(false), 30);
      }, 280);
    }
  }

  function startLoading() {
    setPhase("loading");
    setLoadingIdx(0);

    const ls = quiz?.loadingScreen;
    const logoIds = ls?.providerLogos ?? [];
    const logoCount = logoIds.length || 1;
    const perStep = 1100; // 1.1s per logo
    let step = 0;

    const interval = setInterval(() => {
      step++;
      if (step < logoCount) {
        setLoadingIdx(step);
      } else {
        clearInterval(interval);
        setTimeout(() => calculateResults(), 400);
      }
    }, perStep);
  }

  function calculateResults() {
    if (!config || !quiz) return;
    const userState = answers["state"] || "";
    const priority = answers["priority"] || "";
    const quizRatings = [9.8, 9.6, 9.4, 9.2, 9.0, 8.8, 8.6, 8.4, 8.2, 8.0];
    const quizLabels = ["Exceptional", "Excellent", "Excellent", "Excellent", "Excellent", "Very Good", "Very Good", "Very Good", "Good", "Good"];

    // Check for manual override for this priority
    const overrideOrder = quiz.resultOverrides?.[priority];

    let scored: { providerId: string; score: number; reasons: string[] }[];

    if (overrideOrder && overrideOrder.length > 0) {
      // Manual override — use exact order from CMS
      const filtered = overrideOrder.filter((id) => {
        if (!userState) return true;
        const provider = config.providers.find((p) => p.id === id);
        return !(provider?.excludedStates ?? []).includes(userState);
      });
      scored = filtered.map((id, idx) => {
        const profile = quiz.providerProfiles.find((p) => p.providerId === id);
        const reasons: string[] = [];
        if (profile?.matchReasons[priority]) reasons.push(profile.matchReasons[priority]);
        const otherKeys = Object.keys(profile?.matchReasons ?? {}).filter((k) => k !== priority);
        if (otherKeys.length > 0 && profile) reasons.push(profile.matchReasons[otherKeys[0]]);
        return { providerId: id, score: filtered.length - idx, reasons };
      });
    } else {
      // Algorithm-based scoring
      const quizOrder = quiz.providerOrder && quiz.providerOrder.length > 0 ? quiz.providerOrder : null;
      const profiles = (quizOrder
        ? quiz.providerProfiles.filter((p) => quizOrder.includes(p.providerId))
        : quiz.providerProfiles
      ).filter((profile) => {
        if (!userState) return true;
        const provider = config.providers.find((p) => p.id === profile.providerId);
        return !(provider?.excludedStates ?? []).includes(userState);
      });
      const ranking = config.ranking;
      scored = profiles.map((profile) => {
        const orderList = quizOrder || ranking.providerOrder;
        const rankingIndex = orderList.indexOf(profile.providerId);
        let score = 10 - (rankingIndex >= 0 ? rankingIndex : 5);
        if (priority === "cost") {
          score += profile.priceLevel === "low" ? 4 : profile.priceLevel === "mid" ? 2 : 0;
        }
        if ((profile.strengths ?? []).includes(priority)) score += 4;
        const reasons: string[] = [];
        if (profile.matchReasons[priority]) reasons.push(profile.matchReasons[priority]);
        const otherKeys = Object.keys(profile.matchReasons).filter((k) => k !== priority);
        if (otherKeys.length > 0) reasons.push(profile.matchReasons[otherKeys[0]]);
        return { providerId: profile.providerId, score, reasons };
      });
      scored.sort((a, b) => b.score - a.score);
    }

    const maxScore = Math.max(...scored.map((s) => s.score));
    const results = scored.map((s, idx) => {
      const provider = config.providers.find((p) => p.id === s.providerId);
      if (!provider) return null;
      const matchPct = Math.min(98, Math.max(85, Math.round((s.score / maxScore) * 98)));
      return { ...provider, rank: idx + 1, rating: quizRatings[idx] ?? 8.0, ratingLabel: quizLabels[idx] ?? "Good", matchPct, reasons: s.reasons };
    }).filter(Boolean) as QuizMatchedProvider[];

    setMatchedProviders(results);
    setPhase("results");
    trackOnce("Lead");
  }

  if (!config || !quiz) {
    return (
      <>
        <HideChrome />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0C4B75]" />
        </div>
      </>
    );
  }

  // ========== WELCOME ==========
  if (phase === "welcome") {
    const trustIcons = [Clock, Shield, Check];
    const badgeIcons = [Lock, ShieldCheck, Timer];
    const badgeLabels = ["Personalized Match", "Trusted Providers", "Takes 1 Minute"];

    return (
      <>
      <HideChrome />
      <div className={`bg-[#F7F8FA] px-5 py-10 sm:py-20 transition-all duration-[280ms] ease-out ${phaseTransitioning ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"}`}>
        <div className="mx-auto w-full max-w-[540px] text-center">
          <h1 className="text-[28px] font-extrabold text-[#191919] leading-[1.15] sm:text-[46px]">
            Find Your Best Weight Loss Provider
          </h1>
          <p className="mx-auto mt-3 max-w-[360px] text-[15px] font-[450] leading-[1.55] text-gray-500 sm:mt-5 sm:max-w-[460px] sm:text-[20px]">
            Answer a few questions to receive your personalized provider recommendation.
          </p>

          <button
            onClick={() => {
              setPhaseTransitioning(true);
              trackOnce("StartMatch");
              setTimeout(() => {
                setPhase("quiz");
                setStep(0);
                setTimeout(() => setPhaseTransitioning(false), 30);
              }, 280);
            }}
            className="mt-8 inline-flex h-[46px] w-full max-w-[280px] items-center justify-center rounded-xl bg-[#0C4B75] text-[15px] font-bold text-white shadow-lg transition-all hover:bg-[#093d61] hover:shadow-xl sm:mt-10 sm:h-[50px] sm:w-auto sm:px-14 sm:text-[18px]"
          >
            {quiz.welcomeCta || "Find My Match"}
          </button>

          {/* Trust badges */}
          <div className="mt-8 flex items-center justify-center gap-7 sm:mt-10 sm:gap-10">
            {badgeLabels.map((label, i) => {
              const Icon = badgeIcons[i];
              return (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <Icon className="h-[18px] w-[18px] text-[#8fb5cc] sm:h-[24px] sm:w-[24px]" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium text-gray-500 sm:text-[15px]">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Provider logos as social proof */}
          <div className="mt-14 sm:mt-20">
            <p className="mb-4 text-[13px] font-medium text-gray-400 sm:text-[14px]">
              Comparing trusted providers including
            </p>
            <div className="flex items-center justify-center gap-5 sm:gap-7">
              {(config.ranking.providerOrder
                .map((id) => config.providers.find((p) => p.id === id))
                .filter(Boolean) as Provider[])
                .slice(0, 8)
                .map((p) => (
                  <div key={p.id} className="hidden h-[22px] w-[64px] items-center justify-center first:flex [&:nth-child(-n+5)]:flex sm:h-[44px] sm:w-[140px] sm:[&:nth-child(-n+8)]:flex">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain opacity-50 grayscale"
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }

  // ========== MID-FLOW MESSAGE ==========
  if (phase === "midmsg") {
    return (
      <><HideChrome /><div className={`flex min-h-[60vh] flex-col items-center justify-center px-6 transition-all duration-[280ms] ease-out ${phaseTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {/* Animated pulsing ring with check */}
        <div className="relative flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-[#0C4B75]/10" style={{ animationDuration: "1.5s" }} />
          <div className="absolute inset-0 animate-pulse rounded-full bg-[#0C4B75]/5" style={{ animationDuration: "2s" }} />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#0C4B75] to-[#1a7ab5] shadow-lg">
            <Check className="h-6 w-6 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <p className="mt-5 text-center text-[18px] font-semibold text-[#191919] sm:text-[20px]">
          {quiz.midFlowMessage}
        </p>
        {/* Animated dots */}
        <div className="mt-3 flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-[#0C4B75]/40 animate-bounce"
              style={{ animationDelay: `${i * 0.2}s`, animationDuration: "1s" }}
            />
          ))}
        </div>
      </div></>
    );
  }

  // ========== LOADING ==========
  if (phase === "loading") {
    const ls = quiz.loadingScreen;
    const logoIds = ls?.providerLogos ?? [];
    const texts = ls?.supportingTexts ?? quiz.loadingMessages;
    const currentLogoId = logoIds[loadingIdx % logoIds.length];
    const currentProvider = config.providers.find((p) => p.id === currentLogoId);
    const currentText = texts[loadingIdx % texts.length] ?? texts[0];

    return (
      <><HideChrome /><div className={`flex min-h-[60vh] flex-col items-center pt-20 sm:pt-28 px-6 bg-white transition-all duration-[280ms] ease-out ${phaseTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        <div className="flex flex-col items-center">
          <h2 className="mb-6 text-[20px] font-bold text-[#191919] sm:text-[24px]">
            {ls?.headline ?? "Finding your best match"}
          </h2>

          <div className="relative mb-6 flex h-[44px] w-[160px] items-center justify-center">
            {currentProvider && (
              <img
                key={loadingIdx}
                src={currentProvider.logo}
                alt={currentProvider.name}
                className="max-h-[36px] max-w-[130px] object-contain grayscale brightness-[1.3] opacity-0 animate-[logoFade_1s_ease-in-out_forwards]"
              />
            )}
          </div>

          <p className="mb-1.5 text-[14px] font-medium text-gray-500 sm:text-[15px]">
            Comparing top weight loss providers...
          </p>
          <p
            key={`text-${loadingIdx}`}
            className="text-[13px] text-gray-400 animate-[fadeIn_0.3s_ease-out] sm:text-[14px]"
          >
            {currentText}
          </p>

          <div className="mt-12 flex flex-col items-center gap-1">
            <p className="text-[22px] font-extrabold text-[#191919] sm:text-[26px]">18,400+</p>
            <p className="text-[12px] text-gray-400 sm:text-[13px]">people found their weight loss program with us</p>
          </div>
        </div>
      </div></>
    );
  }

  // ========== RESULTS ==========
  if (phase === "results" && matchedProviders.length > 0) {
    const featured = matchedProviders[0];
    const others = matchedProviders.slice(1);

    return (
      <><HideChrome /><div className="bg-[#F7F8FA] py-8 sm:py-14 overflow-x-hidden animate-[fadeSlideUp_0.5s_ease-out]">
        <div className="mx-auto max-w-[800px] px-4 overflow-hidden">
          {/* Results title */}
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-[26px] font-extrabold text-[#191919] sm:text-[34px]">{quiz.resultsTitle}</h1>
            <p className="mt-2 text-[14px] text-gray-500 sm:text-[16px]">{quiz.resultsSubtitle}</p>
          </div>

          {/* Featured provider */}
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="rounded-full bg-[#0C4B75] px-4 py-1 text-[12px] font-bold text-white sm:text-[13px]">
                {featured.matchPct}% Match
              </span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 sm:text-[12px]">
                Top Recommendation
              </span>
            </div>
            <div className="rounded-xl shadow-md">
              <ComparisonCard product={featured} pageType="quiz_results" sourceFlow="matching_flow" />
            </div>
            <div className="mt-2 flex items-center gap-3 px-1">
              {featured.reasons.map((r, i) => (
                <span key={i} className="flex items-center gap-1 text-[11px] text-gray-500 sm:text-[12px]">
                  <Check className="h-3 w-3 shrink-0 text-[#0C4B75]" strokeWidth={2} />
                  {r}
                </span>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          {quiz.testimonials && quiz.testimonials.length > 0 && (() => {
            const t = quiz.testimonials[Math.floor(Math.random() * quiz.testimonials.length)];
            return (
              <div className="mt-6 flex items-start gap-3 rounded-lg px-1">
                <div className="min-w-0">
                  <div className="mb-1 flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-3 w-3 text-amber-400" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    ))}
                  </div>
                  <p className="text-[13px] leading-relaxed text-gray-500 italic">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="mt-1 text-[11px] font-medium text-gray-400">
                    {t.name} &middot; {t.state}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Others section */}
          {others.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-[16px] font-bold text-gray-500 sm:text-[18px]">
                {quiz.resultsOthersTitle}
              </h2>
              <div className="space-y-3">
                {others.map((provider) => (
                  <div key={provider.id}>
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="rounded-full bg-gray-200 px-3 py-0.5 text-[11px] font-bold text-gray-600">
                        {provider.matchPct}% Match
                      </span>
                    </div>
                    <div className="opacity-90">
                      <ComparisonCard product={provider} hideRank pageType="quiz_results" sourceFlow="matching_flow" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Retake */}
        </div>
      </div></>
    );
  }

  // ========== QUIZ ==========
  const isDropdown = currentQ?.type === "dropdown";

  return (
    <><HideChrome /><div className={`bg-[#F7F8FA] px-4 py-3 sm:py-16 transition-all duration-[280ms] ease-out ${phaseTransitioning ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"}`}>
      <div className="mx-auto max-w-[720px]">
        {/* Progress section */}
        <div className="mb-3 flex items-center gap-3 sm:mb-4">
          <div className="h-[3px] flex-1 rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-[#0C4B75] transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="shrink-0 text-[11px] font-medium text-gray-400 sm:text-[12px]">
            Question {step + 1} of {totalSteps}
          </span>
        </div>

        {/* Persistent card */}
        <div className="rounded-2xl border-0 bg-white px-5 py-5 shadow-[0_6px_24px_rgba(0,0,0,0.08)] sm:px-10 sm:py-8">
          {/* Content with transition */}
          <div className={`transition-all duration-[280ms] ease-out ${
            transitioning
              ? slideDirection === "forward"
                ? "opacity-0 -translate-x-6"
                : "opacity-0 translate-x-6"
              : "opacity-100 translate-x-0"
          }`}>
            {step > 0 && (
              <button onClick={() => transitionTo(() => setStep(step - 1), "back")} className="mb-3 text-[12px] font-medium text-gray-400 hover:text-gray-600 sm:text-[13px]">
                &larr; Back
              </button>
            )}

            <h2 className="text-[21px] font-bold text-[#191919] leading-snug sm:text-[28px]">{currentQ?.title}</h2>
            <p className="mt-1 text-[15px] text-gray-400 sm:mt-1.5 sm:text-[16px]">{currentQ?.subtitle}</p>

            {/* Card options — auto advance */}
            {currentQ?.type === "cards" && (
              <div className="mt-4 space-y-1.5 sm:mt-5 sm:space-y-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.value;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt.value)}
                      className={`flex w-full items-center rounded-xl border-[1.5px] px-4 py-2.5 text-left text-[16px] font-medium transition-all duration-200 sm:px-5 sm:py-3 sm:text-[17px] active:scale-[0.99] ${
                        isSelected
                          ? "border-[#0C4B75] bg-[#0C4B75]/[0.04] text-[#191919] shadow-sm"
                          : "border-gray-200 bg-[#fafbfc] text-gray-700"
                      }`}
                    >
                      <span
                        className={`mr-3 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-200 ${
                          isSelected
                            ? "border-[#0C4B75] bg-[#0C4B75]"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && <span className="h-[6px] w-[6px] rounded-full bg-white" />}
                      </span>
                      <span dangerouslySetInnerHTML={{ __html: opt.label }} />
                    </button>
                  );
                })}
              </div>
            )}

            {/* State picker */}
            {isDropdown && (
              <>
                <StatePickerInline
                  options={currentQ?.options || []}
                  selected={answers[currentQ?.id || ""] || ""}
                  onSelect={(v) => handleSelect(v)}
                />
                <button
                  onClick={() => startLoading()}
                  disabled={!answers[currentQ?.id || ""]}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0C4B75] py-3.5 text-[16px] font-bold text-white transition-all hover:bg-[#093d61] disabled:opacity-40 sm:mt-5 sm:py-4 sm:text-[18px]"
                >
                  Get My Results
                  <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div></>
  );
}

function StatePickerInline({
  options,
  selected,
  onSelect,
}: {
  options: { label: string; value: string }[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const selectedLabel = options.find((o) => o.value === selected)?.label || "";

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, options]);

  return (
    <div className="mt-4 sm:mt-5">
      {/* Search input */}
      <div className="relative mb-3">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
        <input
          type="text"
          placeholder={selected ? selectedLabel : "Search your state..."}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-[14px] placeholder-gray-400 focus:border-[#0C4B75] focus:bg-white focus:outline-none sm:py-3 sm:text-[15px] ${
            selected && !search ? "border-[#0C4B75] bg-[#0C4B75]/5 text-[#0C4B75] font-medium" : "border-gray-200 bg-[#fafbfc] text-gray-700"
          }`}
        />
      </div>

      {/* Scrollable list */}
      {isOpen && (
      <div className="max-h-[160px] overflow-y-auto rounded-xl border border-gray-200 bg-white sm:max-h-[200px]">
        {filtered.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => { onSelect(opt.value); setIsOpen(false); setSearch(""); }}
              className={`flex w-full items-center gap-3 border-b border-gray-100 px-4 py-2.5 text-left text-[14px] font-medium transition-colors last:border-0 sm:px-5 sm:py-3 sm:text-[15px] ${
                isActive
                  ? "bg-[#0C4B75]/5 text-[#0C4B75]"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <MapPin className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-[#0C4B75]" : "text-gray-300"}`} strokeWidth={1.5} />
              {opt.label}
            </button>
          );
        })}
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-[13px] text-gray-400">No states found</p>
        )}
      </div>
      )}
    </div>
  );
}

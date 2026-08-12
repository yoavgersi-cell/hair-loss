"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Check, Search } from "lucide-react";
import { trackOnce, trackEvent } from "@/lib/analytics";
import { ComparisonCard } from "@/components/comparison-card";
import type { SiteConfig, Provider, QuizConfig } from "@/lib/config";

interface ChatMessage {
  id: string;
  from: "bot" | "user";
  text: string;
}

interface QuizMatchedProvider extends Provider {
  rank: number;
  rating: number;
  ratingLabel: string;
  badge?: string;
  matchPct: number;
  reasons: string[];
}

function HideChrome() {
  useEffect(() => {
    const header = document.querySelector("header");
    const footer = document.querySelector("footer");
    const disclosure = document.querySelector("header")?.previousElementSibling;
    if (header) (header as HTMLElement).style.display = "none";
    if (footer) (footer as HTMLElement).style.display = "none";
    if (disclosure) (disclosure as HTMLElement).style.display = "none";
    return () => {
      if (header) (header as HTMLElement).style.display = "";
      if (footer) (footer as HTMLElement).style.display = "";
      if (disclosure) (disclosure as HTMLElement).style.display = "";
    };
  }, []);
  return null;
}

export default function ChatQuizPage() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(-1);
  const [typing, setTyping] = useState(false);
  const [activeOptions, setActiveOptions] = useState<{ questionId: string; options: { label: string; value: string }[]; type: "cards" | "dropdown" } | null>(null);
  const [phase, setPhase] = useState<"chat" | "loading" | "results">("chat");
  const [loadingPct, setLoadingPct] = useState(0);
  const [loadingIdx, setLoadingIdx] = useState(0);
  const [matchedProviders, setMatchedProviders] = useState<QuizMatchedProvider[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

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
  const totalSteps = questions.length;
  const answeredCount = Object.keys(answers).length;
  const progress = totalSteps > 0 ? Math.round(20 + (answeredCount / Math.max(totalSteps - 1, 1)) * 80) : 0;

  function scrollToBottom() {
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 80);
    // Second scroll to catch late-rendered content
    setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
      }
    }, 350);
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages, typing, activeOptions]);

  // Start chat
  useEffect(() => {
    if (config && quiz && messages.length === 0 && currentStep === -1) {
      trackOnce("StartMatch");
      pushBotThenQuestion(
        quiz.chatIntroMessage || "Let's find the right weight loss provider for you. It only takes about a minute.",
        0
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  function pushBot(text: string, onDone?: () => void) {
    setTyping(true);
    setActiveOptions(null);
    const delay = 600 + Math.random() * 500;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: `b-${Date.now()}-${Math.random()}`, from: "bot", text }]);
      if (onDone) setTimeout(onDone, 200);
    }, delay);
  }

  function pushBotThenQuestion(text: string, stepIdx: number) {
    pushBot(text, () => showQuestion(stepIdx));
  }

  function showQuestion(stepIdx: number) {
    const q = questions[stepIdx];
    if (!q) return;
    setCurrentStep(stepIdx);
    setTyping(true);
    setActiveOptions(null);
    const delay = 600 + Math.random() * 400;
    setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: `q-${stepIdx}`, from: "bot", text: q.title }]);
      setTimeout(() => {
        setActiveOptions({ questionId: q.id, options: q.options, type: q.type });
      }, 150);
    }, delay);
  }

  function handleSelect(value: string, label: string) {
    if (!activeOptions) return;
    const qId = activeOptions.questionId;
    setActiveOptions(null);
    // User bubble
    setMessages((prev) => [...prev, { id: `u-${Date.now()}`, from: "user", text: label.replace(/<[^>]*>/g, "") }]);
    setAnswers((prev) => ({ ...prev, [qId]: value }));
    trackEvent("QuizStep", { step_name: qId, step_number: currentStep + 1, answer: value });

    const nextStep = currentStep + 1;

    if (currentStep === 1 && quiz?.midFlowMessage) {
      pushBot(quiz.midFlowMessage, () => {
        if (nextStep < questions.length) {
          showQuestion(nextStep);
        } else {
          goToLoading();
        }
      });
    } else if (nextStep < questions.length) {
      showQuestion(nextStep);
    } else {
      goToLoading();
    }
  }

  function goToLoading() {
    pushBot("Finding your best matches...", () => {
      setTimeout(() => setPhase("loading"), 400);
    });
  }

  function startLoading() {
    setLoadingIdx(0);

    const ls = quiz?.loadingScreen;
    const logoIds = ls?.providerLogos ?? [];
    const logoCount = logoIds.length || 1;
    const perStep = 1100;
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

  useEffect(() => {
    if (phase === "loading") startLoading();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function calculateResults() {
    if (!config || !quiz) return;
    const userState = answers["state"] || "";
    const priority = answers["priority"] || "";
    const quizRatings = [9.8, 9.6, 9.4, 9.2, 9.0, 8.8, 8.6, 8.4, 8.2, 8.0];
    const quizLabels = ["Exceptional", "Excellent", "Excellent", "Excellent", "Excellent", "Very Good", "Very Good", "Very Good", "Good", "Good"];

    const overrideOrder = quiz.resultOverrides?.[priority];
    let scored: { providerId: string; score: number; reasons: string[] }[];

    if (overrideOrder && overrideOrder.length > 0) {
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
        if (priority === "cost") score += profile.priceLevel === "low" ? 4 : profile.priceLevel === "mid" ? 2 : 0;
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
    return (<><HideChrome /><div className="flex min-h-[60vh] items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#0C4B75]" /></div></>);
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
      <><HideChrome /><div className="flex min-h-[60vh] flex-col items-center pt-20 sm:pt-28 px-6 bg-white">
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
          <div className="mb-6 text-center sm:mb-8">
            <h1 className="text-[26px] font-extrabold text-[#191919] sm:text-[34px]">{quiz.resultsTitle}</h1>
            <p className="mt-2 text-[14px] text-gray-500 sm:text-[16px]">{quiz.resultsSubtitle}</p>
          </div>
          <div className="mb-3">
            <div className="mb-2 flex items-center gap-2 px-1">
              <span className="rounded-full bg-[#0C4B75] px-4 py-1 text-[12px] font-bold text-white sm:text-[13px]">{featured.matchPct}% Match</span>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[11px] font-semibold text-amber-700 sm:text-[12px]">Top Recommendation</span>
            </div>
            <div className="rounded-xl shadow-md"><ComparisonCard product={featured} pageType="quiz_results" sourceFlow="matching_flow" /></div>
            <div className="mt-2 flex items-center gap-3 px-1">
              {featured.reasons.map((r, i) => (
                <span key={i} className="flex items-center gap-1 text-[11px] text-gray-500 sm:text-[12px]"><Check className="h-3 w-3 shrink-0 text-[#0C4B75]" strokeWidth={2} />{r}</span>
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

          {others.length > 0 && (
            <div className="mt-8">
              <h2 className="mb-4 text-[16px] font-bold text-gray-500 sm:text-[18px]">{quiz.resultsOthersTitle}</h2>
              <div className="space-y-3">
                {others.map((provider) => (
                  <div key={provider.id}>
                    <div className="mb-1 flex items-center gap-2 px-1">
                      <span className="rounded-full bg-gray-200 px-3 py-0.5 text-[11px] font-bold text-gray-600">{provider.matchPct}% Match</span>
                    </div>
                    <div className="opacity-90"><ComparisonCard product={provider} hideRank pageType="quiz_results" sourceFlow="matching_flow" /></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div></>
    );
  }

  // ========== CHAT ==========
  return (
    <>
      <HideChrome />
      <div className="fixed inset-0 flex flex-col bg-[#F7F8FA]">
        {/* Logo bar */}
        <div className="shrink-0 border-b border-[#E5E7EB] bg-white px-4 py-3">
          <a href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="TopHairLoss.io" className="h-[28px] w-auto" />
          </a>
        </div>

        {/* Header */}
        <div className="shrink-0 border-b border-[#E5E7EB] bg-[#F7F8FA] px-4 pb-5 pt-5 text-center sm:pb-6 sm:pt-6">
          <h1 className="text-[24px] font-extrabold leading-tight text-[#191919] sm:text-[32px]">
            {quiz.welcomeTitle}
          </h1>
          <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-relaxed text-gray-500 sm:text-[16px]">
            {quiz.welcomeSubtitle}
          </p>
        </div>

        {/* Chat area */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6">
          <div className="mx-auto max-w-[560px] space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"} animate-[fadeSlideUp_0.3s_ease-out]`}
              >
                <div
                  className={`${
                    msg.from === "user"
                      ? "rounded-2xl rounded-br-sm bg-[#0C4B75] px-5 py-3.5 text-[16px] font-medium text-white sm:text-[17px]"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-[#E8EDF2] px-5 py-4 text-[16px] text-[#191919] sm:text-[17px]"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {typing && (
              <div className="flex justify-start animate-[fadeSlideUp_0.2s_ease-out]">
                <div className="rounded-2xl rounded-bl-sm bg-[#E8EDF2] px-5 py-5">
                  <div className="flex items-center gap-2">
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="h-2.5 w-2.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Option pills */}
            {activeOptions && activeOptions.type === "cards" && (
              <div className="flex flex-wrap gap-2 animate-[fadeSlideUp_0.3s_ease-out]">
                {activeOptions.options.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect(opt.value, opt.label)}
                    className="rounded-full border-[1.5px] border-[#D1D5DB] bg-white px-5 py-3 text-[15px] font-medium text-[#191919] transition-all hover:border-[#0C4B75] hover:bg-[#0C4B75]/[0.04] active:scale-[0.97] sm:px-6 sm:py-3 sm:text-[16px]"
                    dangerouslySetInnerHTML={{ __html: opt.label }}
                  />
                ))}
              </div>
            )}

            {/* Searchable state picker */}
            {activeOptions && activeOptions.type === "dropdown" && (
              <ChatStatePicker
                options={activeOptions.options}
                onSelect={(value, label) => handleSelect(value, label)}
              />
            )}
          </div>
        </div>

        {/* Bottom progress bar */}
        <div className="shrink-0 sticky bottom-0 border-t border-[#E5E7EB] bg-[#F7F8FA] px-4 py-3">
          <div className="mx-auto flex max-w-[560px] items-center gap-3">
            <div className="h-[10px] flex-1 overflow-hidden rounded-full bg-[#E5E7EB]">
              <div
                className="h-full rounded-full bg-[#0C4B75] transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="shrink-0 text-[14px] font-semibold text-gray-400">{progress}%</span>
          </div>
        </div>
      </div>
    </>
  );
}

function ChatStatePicker({
  options,
  onSelect,
}: {
  options: { label: string; value: string }[];
  onSelect: (value: string, label: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<{ label: string; value: string } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!search) return options;
    const q = search.toLowerCase();
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [search, options]);

  return (
    <div className="animate-[fadeSlideUp_0.3s_ease-out]">
      {/* Search input + send */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" strokeWidth={1.5} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your state..."
            value={selected ? selected.label : search}
            onChange={(e) => { setSearch(e.target.value); setSelected(null); }}
            onFocus={() => { if (selected) { setSearch(""); setSelected(null); } }}
            className={`w-full rounded-full border-2 bg-white py-3.5 pl-11 pr-4 text-[15px] focus:outline-none sm:text-[16px] ${
              selected ? "border-[#0C4B75] text-[#0C4B75] font-medium" : "border-[#0C4B75]/30 text-gray-700 focus:border-[#0C4B75]"
            }`}
          />
        </div>
        <button
          onClick={() => { if (selected) onSelect(selected.value, selected.label); }}
          disabled={!selected}
          className="flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full bg-[#0C4B75] text-white shadow-sm transition-all hover:bg-[#093d61] active:scale-95 disabled:opacity-30"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4 20-7z"/><path d="M22 2 11 13"/></svg>
        </button>
      </div>

      {/* Results list */}
      {!selected && (
        <div className="mt-2 max-h-[160px] overflow-y-auto rounded-2xl border border-gray-200 bg-white">
          {filtered.length > 0 ? (
            filtered.map((opt) => (
              <button
                key={opt.value}
                onClick={() => { setSelected(opt); setSearch(""); }}
                className="flex w-full items-center gap-2 border-b border-gray-100 px-5 py-2.5 text-left text-[15px] text-gray-700 transition-colors last:border-0 hover:bg-[#0C4B75]/5 hover:text-[#0C4B75]"
              >
                {opt.label}
              </button>
            ))
          ) : (
            <p className="px-5 py-4 text-center text-[13px] text-gray-400">No states found</p>
          )}
        </div>
      )}
    </div>
  );
}

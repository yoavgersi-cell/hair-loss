"use client";

import { useState, useEffect } from "react";
import type { SiteConfig, Provider, FaqItem, ReviewData, ArticleData, BattleData, LandingPageData, SidebarConfigData, RankingPageConfig, TrustpilotReview } from "@/lib/config";

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [activeTab, setActiveTab] = useState<"providers" | "ranking" | "hero" | "sidebar" | "faqs" | "reviews" | "articles" | "battles" | "pages" | "sidebars" | "quiz" | "team" | "general">("providers");

  const token = typeof window !== "undefined" ? sessionStorage.getItem("admin_token") : null;

  useEffect(() => {
    if (token) {
      setAuthed(true);
      loadConfig(token);
    }
  }, [token]);

  async function loadConfig(pw: string) {
    const res = await fetch("/api/config", {
      headers: { Authorization: `Bearer ${pw}` },
    });
    if (res.ok) {
      const data = await res.json();
      setConfig(data);
    } else {
      setMessage("Failed to load config");
    }
  }

  async function handleLogin() {
    const res = await fetch("/api/config", {
      headers: { Authorization: `Bearer ${password}` },
    });
    if (res.ok) {
      sessionStorage.setItem("admin_token", password);
      setAuthed(true);
      const data = await res.json();
      setConfig(data);
    } else {
      setMessage("Wrong password");
    }
  }

  async function handleSave() {
    if (!config) return;
    setSaving(true);
    setMessage("");
    const pw = sessionStorage.getItem("admin_token") || password;
    const res = await fetch("/api/config", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${pw}`,
      },
      body: JSON.stringify(config),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } else {
      setMessage("Failed to save");
    }
  }

  function updateProvider(index: number, field: keyof Provider, value: unknown) {
    if (!config) return;
    const providers = [...config.providers];
    providers[index] = { ...providers[index], [field]: value };
    setConfig({ ...config, providers });
  }

  function updateHighlight(providerIndex: number, bulletIndex: number, value: string) {
    if (!config) return;
    const providers = [...config.providers];
    const highlights = [...providers[providerIndex].highlights];
    highlights[bulletIndex] = value;
    providers[providerIndex] = { ...providers[providerIndex], highlights };
    setConfig({ ...config, providers });
  }

  function updateTrustpilotReview(providerIndex: number, reviewIndex: number, field: keyof TrustpilotReview, value: string | number) {
    if (!config) return;
    const providers = [...config.providers];
    const reviews = [...(providers[providerIndex].trustpilotReviews ?? [])];
    reviews[reviewIndex] = { ...reviews[reviewIndex], [field]: value };
    providers[providerIndex] = { ...providers[providerIndex], trustpilotReviews: reviews };
    setConfig({ ...config, providers });
  }

  function addProvider() {
    if (!config) return;
    const newId = `provider-${Date.now()}`;
    const newProvider: Provider = {
      id: newId,
      name: "New Provider",
      tagline: "Provider tagline",
      logo: "/logos/placeholder.svg",
      smallLogo: "",
      highlights: ["Highlight 1", "Highlight 2", "Highlight 3"],
      affiliateUrl: "#",
      ctaText: "View Plan",
    };
    // Also add to ranking order at the end
    const ranking = config.ranking || { providerOrder: [], positions: [] };
    setConfig({
      ...config,
      providers: [...config.providers, newProvider],
      ranking: {
        ...ranking,
        providerOrder: [...ranking.providerOrder, newId],
      },
    });
  }

  function removeProvider(index: number) {
    if (!config) return;
    const removedId = config.providers[index]?.id;
    const providers = config.providers.filter((_, i) => i !== index);
    const ranking = config.ranking || { providerOrder: [], positions: [] };
    setConfig({
      ...config,
      providers,
      ranking: {
        ...ranking,
        providerOrder: ranking.providerOrder.filter((id) => id !== removedId),
      },
    });
  }

  function moveRankingProvider(index: number, direction: "up" | "down") {
    if (!config) return;
    const ranking = config.ranking || { providerOrder: [], positions: [] };
    const order = [...ranking.providerOrder];
    const target = direction === "up" ? index - 1 : index + 1;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    setConfig({ ...config, ranking: { ...ranking, providerOrder: order } });
  }

  function updateFaq(index: number, field: keyof FaqItem, value: string) {
    if (!config) return;
    const faqs = [...config.faqs];
    faqs[index] = { ...faqs[index], [field]: value };
    setConfig({ ...config, faqs });
  }

  function addFaq() {
    if (!config) return;
    setConfig({ ...config, faqs: [...config.faqs, { question: "", answer: "" }] });
  }

  function removeFaq(index: number) {
    if (!config) return;
    setConfig({ ...config, faqs: config.faqs.filter((_, i) => i !== index) });
  }

  function updateReview(index: number, field: keyof ReviewData, value: unknown) {
    if (!config) return;
    const reviews = [...(config.reviews ?? [])];
    reviews[index] = { ...reviews[index], [field]: value };
    setConfig({ ...config, reviews });
  }

  function updateReviewArrayItem(reviewIndex: number, field: keyof ReviewData, itemIndex: number, value: string) {
    if (!config) return;
    const reviews = [...(config.reviews ?? [])];
    const arr = [...(reviews[reviewIndex][field] as string[])];
    arr[itemIndex] = value;
    reviews[reviewIndex] = { ...reviews[reviewIndex], [field]: arr };
    setConfig({ ...config, reviews });
  }

  function addReviewArrayItem(reviewIndex: number, field: keyof ReviewData) {
    if (!config) return;
    const reviews = [...(config.reviews ?? [])];
    const arr = [...(reviews[reviewIndex][field] as string[]), ""];
    reviews[reviewIndex] = { ...reviews[reviewIndex], [field]: arr };
    setConfig({ ...config, reviews });
  }

  function removeReviewArrayItem(reviewIndex: number, field: keyof ReviewData, itemIndex: number) {
    if (!config) return;
    const reviews = [...(config.reviews ?? [])];
    const arr = (reviews[reviewIndex][field] as string[]).filter((_, i) => i !== itemIndex);
    reviews[reviewIndex] = { ...reviews[reviewIndex], [field]: arr };
    setConfig({ ...config, reviews });
  }

  // Login screen
  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="w-full max-w-sm rounded-xl border bg-white p-8 shadow-sm">
          <h1 className="mb-6 text-xl font-bold text-[#191919]">Admin Login</h1>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="mb-4 w-full rounded-lg border px-4 py-2.5 text-sm focus:border-[#0C4B75] focus:outline-none"
          />
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-[#0C4B75] py-2.5 text-sm font-bold text-white hover:bg-[#093d61]"
          >
            Login
          </button>
          {message && <p className="mt-3 text-sm text-red-500">{message}</p>}
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const tabs = [
    { key: "providers" as const, label: "Providers" },
    { key: "ranking" as const, label: "Homepage" },
    { key: "hero" as const, label: "Hero" },
    { key: "sidebar" as const, label: "Sidebar" },
    { key: "faqs" as const, label: "FAQs" },
    { key: "reviews" as const, label: "Reviews" },
    { key: "articles" as const, label: "Articles" },
    { key: "battles" as const, label: "Battles" },
    { key: "pages" as const, label: "Pages" },
    { key: "sidebars" as const, label: "Sidebars" },
    { key: "quiz" as const, label: "Quiz" },
    { key: "team" as const, label: "Team" },
    { key: "general" as const, label: "General" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <h1 className="text-lg font-bold text-[#191919]">TopHairLoss CMS</h1>
        <div className="flex items-center gap-3">
          {message && (
            <span className={`text-sm font-medium ${message.includes("success") ? "text-green-600" : "text-red-500"}`}>
              {message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-[#0C4B75] px-6 py-2 text-sm font-bold text-white hover:bg-[#093d61] disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 flex gap-1 rounded-lg bg-gray-100 p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-white text-[#191919] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Providers Tab */}
        {activeTab === "providers" && (
          <div className="space-y-4">
            {config.providers.map((provider, index) => (
                <div key={provider.id} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="text-sm font-bold text-[#191919]">{provider.name}</h3>
                        <span className="text-xs text-gray-400">ID: {provider.id}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => removeProvider(index)} className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Name" value={provider.name} onChange={(v) => updateProvider(index, "name", v)} />
                    <Field label="ID / Slug" value={provider.id} onChange={(v) => updateProvider(index, "id", v)} />
                    <Field label="Tagline / Headline" value={provider.tagline} onChange={(v) => updateProvider(index, "tagline", v)} />
                    <ImageField label="Logo" value={provider.logo} onChange={(v) => updateProvider(index, "logo", v)} />
                    <ImageField label="Small Logo (icon)" value={provider.smallLogo || ""} onChange={(v) => updateProvider(index, "smallLogo", v)} />
                    <ImageField label="Sidebar Image (shown when #1)" value={provider.sidebarImage || ""} onChange={(v) => updateProvider(index, "sidebarImage", v)} />
                    <Field label="Affiliate URL" value={provider.affiliateUrl} onChange={(v) => updateProvider(index, "affiliateUrl", v)} />
                    <Field label="CTA Text" value={provider.ctaText} onChange={(v) => updateProvider(index, "ctaText", v)} />
                    <div className="sm:col-span-2">
                      <Field label="Excluded States (comma-separated codes, e.g. CA,NY,TX)" value={(provider.excludedStates ?? []).join(", ")} onChange={(v) => updateProvider(index, "excludedStates", v.split(",").map((s) => s.trim()).filter(Boolean))} />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Highlights (3 bullets)</label>
                    <div className="space-y-2">
                      {provider.highlights.map((h, hi) => (
                        <input
                          key={hi}
                          value={h}
                          onChange={(e) => updateHighlight(index, hi, e.target.value)}
                          className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50/50 p-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Trustpilot Reviews (shown on battle pages)</label>
                    <p className="mb-3 text-xs text-gray-400">Add reviews to show a Trustpilot carousel for this provider on VS pages.</p>
                    <div className="mb-3 grid gap-4 sm:grid-cols-2">
                      <Field label="Overall Rating (e.g. 4.7)" value={provider.trustpilotRating ?? ""} onChange={(v) => updateProvider(index, "trustpilotRating", v)} />
                      <Field label="Review Count (e.g. 2,341)" value={provider.trustpilotReviewCount ?? ""} onChange={(v) => updateProvider(index, "trustpilotReviewCount", v)} />
                    </div>
                    <div className="space-y-3">
                      {(provider.trustpilotReviews ?? []).map((r, ri) => (
                        <div key={ri} className="rounded-lg border bg-white p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Review {ri + 1}</span>
                            <div className="flex items-center gap-2">
                              <select
                                value={r.rating}
                                onChange={(e) => updateTrustpilotReview(index, ri, "rating", parseInt(e.target.value, 10))}
                                className="rounded border px-2 py-1 text-xs focus:border-[#0C4B75] focus:outline-none"
                              >
                                {[5, 4, 3, 2, 1].map((n) => (
                                  <option key={n} value={n}>{n} star{n > 1 ? "s" : ""}</option>
                                ))}
                              </select>
                              <button
                                onClick={() => {
                                  const reviews = (provider.trustpilotReviews ?? []).filter((_, i) => i !== ri);
                                  updateProvider(index, "trustpilotReviews", reviews);
                                }}
                                className="flex h-6 w-6 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                              </button>
                            </div>
                          </div>
                          <input
                            value={r.title}
                            onChange={(e) => updateTrustpilotReview(index, ri, "title", e.target.value)}
                            placeholder="Review title (e.g. Lost 22 lbs in 3 months)"
                            className="mb-2 w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                          />
                          <textarea
                            value={r.text}
                            onChange={(e) => updateTrustpilotReview(index, ri, "text", e.target.value)}
                            rows={2} placeholder="Review text..."
                            className="mb-2 w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <input value={r.name} onChange={(e) => updateTrustpilotReview(index, ri, "name", e.target.value)}
                              placeholder="Name (e.g. Sarah M.)" className="flex-1 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" />
                            <input value={r.location} onChange={(e) => updateTrustpilotReview(index, ri, "location", e.target.value)}
                              placeholder="Location (e.g. TX)" className="w-32 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const reviews: TrustpilotReview[] = [...(provider.trustpilotReviews ?? []), { title: "", text: "", name: "", location: "", rating: 5 }];
                        updateProvider(index, "trustpilotReviews", reviews);
                      }}
                      className="mt-2 w-full rounded border-2 border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
                    >
                      + Add Trustpilot Review
                    </button>
                  </div>
                </div>
              ))}
            <button
              onClick={addProvider}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Provider
            </button>
          </div>
        )}

        {/* Homepage Ranking Tab */}
        {activeTab === "ranking" && config.ranking && (
          <div className="space-y-6">
            {/* Provider Ranking Order */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Homepage Provider Order</h3>
              <p className="mb-4 text-xs text-gray-400">Choose which providers appear on the homepage and in what order. Only listed providers will be shown.</p>
              <div className="space-y-2">
                {config.ranking.providerOrder.map((providerId, index) => {
                  const provider = config.providers.find((p) => p.id === providerId);
                  const position = config.ranking.positions[index] || config.ranking.positions[config.ranking.positions.length - 1];
                  return (
                    <div key={providerId} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#191919] text-sm font-bold text-white shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[#191919]">{provider?.name ?? providerId}</p>
                        <p className="text-xs text-gray-400">
                          Score: {position.score} — {position.label}
                          {position.badge ? ` — "${position.badge}"` : ""}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => moveRankingProvider(index, "up")}
                          disabled={index === 0}
                          className="flex h-8 w-8 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                        </button>
                        <button
                          onClick={() => moveRankingProvider(index, "down")}
                          disabled={index === config.ranking.providerOrder.length - 1}
                          className="flex h-8 w-8 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                        <button
                          onClick={() => {
                            const order = config.ranking.providerOrder.filter((_, i) => i !== index);
                            setConfig({ ...config, ranking: { ...config.ranking, providerOrder: order } });
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 flex gap-2">
                <select
                  id="add-homepage-provider"
                  className="flex-1 rounded border px-3 py-2 text-sm text-gray-600 focus:border-[#0C4B75] focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Add provider to homepage...</option>
                  {config.providers
                    .filter((p) => !config.ranking.providerOrder.includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    const select = document.getElementById("add-homepage-provider") as HTMLSelectElement;
                    if (!select?.value) return;
                    setConfig({
                      ...config,
                      ranking: {
                        ...config.ranking,
                        providerOrder: [...config.ranking.providerOrder, select.value],
                      },
                    });
                    select.value = "";
                  }}
                  className="rounded border border-[#0C4B75] px-4 py-2 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Position Scoring Table */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Position Scoring Table</h3>
              <p className="mb-4 text-xs text-gray-400">Define the score, label, and optional badge for each ranking position.</p>
              <div className="space-y-3">
                {config.ranking.positions.map((pos, index) => (
                  <div key={index} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-600 shrink-0">
                      #{index + 1}
                    </div>
                    <div className="grid flex-1 gap-2 sm:grid-cols-3">
                      <Field
                        label="Score"
                        value={String(pos.score)}
                        onChange={(v) => {
                          const positions = [...config.ranking.positions];
                          positions[index] = { ...positions[index], score: parseFloat(v) || 0 };
                          setConfig({ ...config, ranking: { ...config.ranking, positions } });
                        }}
                        type="number"
                      />
                      <Field
                        label="Label"
                        value={pos.label}
                        onChange={(v) => {
                          const positions = [...config.ranking.positions];
                          positions[index] = { ...positions[index], label: v };
                          setConfig({ ...config, ranking: { ...config.ranking, positions } });
                        }}
                      />
                      <Field
                        label="Badge"
                        value={pos.badge || ""}
                        onChange={(v) => {
                          const positions = [...config.ranking.positions];
                          positions[index] = { ...positions[index], badge: v || undefined };
                          setConfig({ ...config, ranking: { ...config.ranking, positions } });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero Tab */}
        {activeTab === "hero" && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Hero Section</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="H1 Headline" value={config.hero.h1} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, h1: v } })} />
              <Field label="H2 Subtitle" value={config.hero.h2} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, h2: v } })} />
              <div className="sm:col-span-2">
                <Field label="Description" value={config.hero.description} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, description: v } })} />
              </div>
              <Field label="Updated Label" value={config.hero.updatedLabel} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, updatedLabel: v } })} />
              <ImageField label="Background Image" value={config.hero.backgroundImageUrl} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, backgroundImageUrl: v } })} />
              <Field label="Image Alt Text" value={config.hero.imageAlt} onChange={(v) => setConfig({ ...config, hero: { ...config.hero, imageAlt: v } })} />
            </div>
          </div>
        )}

        {/* Sidebar Tab */}
        {activeTab === "sidebar" && (
          <div className="space-y-4">
            {/* Block Order Control */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Sidebar Blocks — Order & Visibility</h3>
              <p className="mb-4 text-xs text-gray-400">Reorder, add, or remove sidebar blocks. Only blocks in this list will be shown, in this order.</p>
              <div className="space-y-2 mb-3">
                {(config.sidebar.blockOrder ?? ["socialProof", "secureBadge", "featuredImage", "editorialReviews", "rankingMethodology", "disclosure"]).map((blockId, bi) => {
                  const labels: Record<string, string> = { socialProof: "Social Proof", secureBadge: "Secure Badge", featuredImage: "Featured Provider Image", editorialReviews: "Editorial Reviews", rankingMethodology: "Ranking Methodology", disclosure: "Editorial Disclosure" };
                  const order = config.sidebar.blockOrder ?? ["socialProof", "secureBadge", "featuredImage", "editorialReviews", "rankingMethodology", "disclosure"];
                  return (
                    <div key={blockId} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2.5">
                      <span className="flex h-6 w-6 items-center justify-center rounded bg-[#191919] text-[11px] font-bold text-white">{bi + 1}</span>
                      <span className="flex-1 text-sm font-medium text-[#191919]">{labels[blockId] ?? blockId}</span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => { if (bi === 0) return; const o = [...order]; [o[bi], o[bi-1]] = [o[bi-1], o[bi]]; setConfig({ ...config, sidebar: { ...config.sidebar, blockOrder: o } }); }}
                          disabled={bi === 0}
                          className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white disabled:opacity-30"
                        ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg></button>
                        <button
                          onClick={() => { if (bi === order.length - 1) return; const o = [...order]; [o[bi], o[bi+1]] = [o[bi+1], o[bi]]; setConfig({ ...config, sidebar: { ...config.sidebar, blockOrder: o } }); }}
                          disabled={bi === order.length - 1}
                          className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white disabled:opacity-30"
                        ><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg></button>
                        <button
                          onClick={() => { const o = order.filter((_, i) => i !== bi); setConfig({ ...config, sidebar: { ...config.sidebar, blockOrder: o } }); }}
                          className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                        ><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <select
                className="w-full rounded border px-3 py-1.5 text-sm text-gray-600 focus:border-[#0C4B75] focus:outline-none"
                value=""
                onChange={(e) => {
                  if (!e.target.value) return;
                  const order = [...(config.sidebar.blockOrder ?? ["socialProof", "secureBadge", "featuredImage", "editorialReviews", "rankingMethodology", "disclosure"]), e.target.value];
                  setConfig({ ...config, sidebar: { ...config.sidebar, blockOrder: order } });
                  e.target.value = "";
                }}
              >
                <option value="">+ Add block...</option>
                {["socialProof", "secureBadge", "featuredImage", "editorialReviews", "rankingMethodology", "disclosure"]
                  .filter((b) => !(config.sidebar.blockOrder ?? ["socialProof", "secureBadge", "featuredImage", "editorialReviews", "rankingMethodology", "disclosure"]).includes(b))
                  .map((b) => {
                    const labels: Record<string, string> = { socialProof: "Social Proof", secureBadge: "Secure Badge", featuredImage: "Featured Provider Image", editorialReviews: "Editorial Reviews", rankingMethodology: "Ranking Methodology", disclosure: "Editorial Disclosure" };
                    return <option key={b} value={b}>{labels[b]}</option>;
                  })}
              </select>
            </div>

            {/* Content fields */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Social Proof</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Number" value={config.sidebar.socialProofNumber} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, socialProofNumber: v } })} />
                <Field label="Text" value={config.sidebar.socialProofText} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, socialProofText: v } })} />
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Secure Badge</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Title" value={config.sidebar.secureTitle} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, secureTitle: v } })} />
                <Field label="Text" value={config.sidebar.secureText} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, secureText: v } })} />
              </div>
            </div>
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Featured Image</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <ImageField label="Featured Image" value={config.sidebar.featuredImageUrl} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, featuredImageUrl: v } })} />
                <Field label="Image Alt" value={config.sidebar.featuredImageAlt} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, featuredImageAlt: v } })} />
                <Field label="Link URL" value={config.sidebar.featuredImageLink} onChange={(v) => setConfig({ ...config, sidebar: { ...config.sidebar, featuredImageLink: v } })} />
              </div>
            </div>
          </div>
        )}

        {/* FAQs Tab */}
        {activeTab === "faqs" && (
          <div className="space-y-4">
            {config.faqs.map((faq, index) => (
              <div key={index} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-500">FAQ #{index + 1}</h3>
                  <button onClick={() => removeFaq(index)} className="rounded border border-red-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50">Remove</button>
                </div>
                <Field label="Question" value={faq.question} onChange={(v) => updateFaq(index, "question", v)} />
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Answer</label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => updateFaq(index, "answer", e.target.value)}
                    rows={3}
                    className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={addFaq}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add FAQ
            </button>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === "reviews" && (
          <div className="space-y-4">
            {(config.reviews ?? []).map((review, index) => {
              const provider = config.providers.find((p) => p.id === review.providerId);
              return (
                <div key={review.slug} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#191919] text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#191919]">{provider?.name ?? review.providerId}</h3>
                      <span className="text-xs text-gray-400">Slug: {review.slug}</span>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Slug" value={review.slug} onChange={(v) => updateReview(index, "slug", v)} />
                    <Field label="Provider ID" value={review.providerId} onChange={(v) => updateReview(index, "providerId", v)} />
                    <Field label="Last Updated (YYYY-MM-DD, for SEO)" value={review.updatedAt ?? ""} onChange={(v) => updateReview(index, "updatedAt", v)} />
                  </div>

                  <div className="mt-4">
                    <Field label="Short Summary" value={review.shortSummary} onChange={(v) => updateReview(index, "shortSummary", v)} />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Review Intro</label>
                    <textarea
                      value={review.reviewIntro}
                      onChange={(e) => updateReview(index, "reviewIntro", e.target.value)}
                      rows={4}
                      className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                    />
                  </div>

                  <ArrayField
                    label="Key Features"
                    items={review.keyFeatures}
                    onUpdate={(i, v) => updateReviewArrayItem(index, "keyFeatures", i, v)}
                    onAdd={() => addReviewArrayItem(index, "keyFeatures")}
                    onRemove={(i) => removeReviewArrayItem(index, "keyFeatures", i)}
                  />

                  <div className="mt-4">
                    <Field label="Pricing Summary" value={review.pricingSummary} onChange={(v) => updateReview(index, "pricingSummary", v)} />
                  </div>

                  <ArrayField
                    label="Treatment Options"
                    items={review.treatmentOptions}
                    onUpdate={(i, v) => updateReviewArrayItem(index, "treatmentOptions", i, v)}
                    onAdd={() => addReviewArrayItem(index, "treatmentOptions")}
                    onRemove={(i) => removeReviewArrayItem(index, "treatmentOptions", i)}
                  />

                  <ArrayField
                    label="Pros"
                    items={review.pros}
                    onUpdate={(i, v) => updateReviewArrayItem(index, "pros", i, v)}
                    onAdd={() => addReviewArrayItem(index, "pros")}
                    onRemove={(i) => removeReviewArrayItem(index, "pros", i)}
                  />

                  <ArrayField
                    label="Cons"
                    items={review.cons}
                    onUpdate={(i, v) => updateReviewArrayItem(index, "cons", i, v)}
                    onAdd={() => addReviewArrayItem(index, "cons")}
                    onRemove={(i) => removeReviewArrayItem(index, "cons", i)}
                  />

                  <ArrayField
                    label="Best For"
                    items={review.bestFor}
                    onUpdate={(i, v) => updateReviewArrayItem(index, "bestFor", i, v)}
                    onAdd={() => addReviewArrayItem(index, "bestFor")}
                    onRemove={(i) => removeReviewArrayItem(index, "bestFor", i)}
                  />

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Final Verdict</label>
                    <textarea
                      value={review.finalVerdict}
                      onChange={(e) => updateReview(index, "finalVerdict", e.target.value)}
                      rows={4}
                      className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Articles Tab */}
        {activeTab === "articles" && (
          <div className="space-y-4">
            {(config.articles ?? []).map((article, index) => (
              <div key={article.slug || index} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-lg"
                      style={{ backgroundColor: article.heroColor || "#EEF4FB" }}
                    />
                    <div>
                      <h3 className="text-sm font-bold text-[#191919]">
                        {article.title || "Untitled Article"}
                      </h3>
                      <span className="text-xs text-gray-400">/{article.slug}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const articles = (config.articles ?? []).filter((_, i) => i !== index);
                      setConfig({ ...config, articles });
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Title"
                    value={article.title}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], title: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <Field
                    label="Slug"
                    value={article.slug}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], slug: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <div className="sm:col-span-2">
                    <Field
                      label="Description (SEO)"
                      value={article.description}
                      onChange={(v) => {
                        const articles = [...(config.articles ?? [])];
                        articles[index] = { ...articles[index], description: v };
                        setConfig({ ...config, articles });
                      }}
                    />
                  </div>
                  <Field
                    label="Category"
                    value={article.category}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], category: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <Field
                    label="Read Time"
                    value={article.readTime}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], readTime: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <Field
                    label="Published Date"
                    value={article.publishedAt}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], publishedAt: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <Field
                    label="Updated Date"
                    value={article.updatedAt}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], updatedAt: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                  <Field
                    label="Hero Color (hex)"
                    value={article.heroColor}
                    onChange={(v) => {
                      const articles = [...(config.articles ?? [])];
                      articles[index] = { ...articles[index], heroColor: v };
                      setConfig({ ...config, articles });
                    }}
                  />
                </div>

                {/* Sections */}
                <div className="mt-5">
                  <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Content Sections
                  </label>
                  <div className="space-y-4">
                    {(article.sections ?? []).map((section, si) => (
                      <div key={si} className="rounded-lg border bg-gray-50 p-4">
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-xs font-semibold text-gray-400">Section {si + 1}</span>
                          <button
                            onClick={() => {
                              const articles = [...(config.articles ?? [])];
                              const sections = articles[index].sections.filter((_, i) => i !== si);
                              articles[index] = { ...articles[index], sections };
                              setConfig({ ...config, articles });
                            }}
                            className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-500 hover:bg-red-50"
                          >
                            Remove
                          </button>
                        </div>
                        <Field
                          label="Heading"
                          value={section.heading}
                          onChange={(v) => {
                            const articles = [...(config.articles ?? [])];
                            const sections = [...articles[index].sections];
                            sections[si] = { ...sections[si], heading: v };
                            articles[index] = { ...articles[index], sections };
                            setConfig({ ...config, articles });
                          }}
                        />
                        <div className="mt-2">
                          <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Body</label>
                          <textarea
                            value={section.body}
                            onChange={(e) => {
                              const articles = [...(config.articles ?? [])];
                              const sections = [...articles[index].sections];
                              sections[si] = { ...sections[si], body: e.target.value };
                              articles[index] = { ...articles[index], sections };
                              setConfig({ ...config, articles });
                            }}
                            rows={4}
                            className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      const articles = [...(config.articles ?? [])];
                      const sections = [...articles[index].sections, { heading: "", body: "" }];
                      articles[index] = { ...articles[index], sections };
                      setConfig({ ...config, articles });
                    }}
                    className="mt-2 rounded border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
                  >
                    + Add Section
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={() => {
                const newArticle: ArticleData = {
                  slug: `article-${Date.now()}`,
                  title: "New Article",
                  description: "",
                  category: "Guide",
                  readTime: "5 min read",
                  publishedAt: new Date().toISOString().split("T")[0],
                  updatedAt: new Date().toISOString().split("T")[0],
                  heroColor: "#EEF4FB",
                  sections: [{ heading: "Introduction", body: "" }],
                };
                setConfig({ ...config, articles: [...(config.articles ?? []), newArticle] });
              }}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Article
            </button>
          </div>
        )}

        {/* Battles Tab */}
        {activeTab === "battles" && (
          <div className="space-y-4">
            {(config.battles ?? []).map((battle, index) => {
              const bp1 = config.providers.find((p) => p.id === battle.provider1Id);
              const bp2 = config.providers.find((p) => p.id === battle.provider2Id);
              const updateBattle = (patch: Record<string, unknown>) => {
                const battles = [...(config.battles ?? [])];
                battles[index] = { ...battles[index], ...patch };
                setConfig({ ...config, battles });
              };
              return (
                <div key={battle.slug || index} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#191919]">
                        {bp1?.name ?? battle.provider1Id} vs {bp2?.name ?? battle.provider2Id}
                      </h3>
                      <span className="text-xs text-gray-400">/{battle.slug}</span>
                    </div>
                    <button
                      onClick={() => {
                        const battles = (config.battles ?? []).filter((_, i) => i !== index);
                        setConfig({ ...config, battles });
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Slug (URL path)" value={battle.slug} onChange={(v) => updateBattle({ slug: v })} />
                    <Field label="Title" value={battle.title} onChange={(v) => updateBattle({ title: v })} />
                    <Field label="Subtitle" value={battle.subtitle || ""} onChange={(v) => updateBattle({ subtitle: v })} />
                    <Field label="SEO Description" value={battle.description} onChange={(v) => updateBattle({ description: v })} />
                    <Field label="Last Updated (YYYY-MM-DD, for SEO)" value={battle.updatedAt ?? ""} onChange={(v) => updateBattle({ updatedAt: v })} />
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider 1</label>
                      <select value={battle.provider1Id} onChange={(e) => updateBattle({ provider1Id: e.target.value })} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none">
                        <option value="">Select...</option>
                        {config.providers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider 2</label>
                      <select value={battle.provider2Id} onChange={(e) => updateBattle({ provider2Id: e.target.value })} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none">
                        <option value="">Select...</option>
                        {config.providers.map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Winner</label>
                      <select value={battle.winnerId} onChange={(e) => updateBattle({ winnerId: e.target.value })} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none">
                        <option value="">Select...</option>
                        {battle.provider1Id && <option value={battle.provider1Id}>{bp1?.name ?? battle.provider1Id}</option>}
                        {battle.provider2Id && <option value={battle.provider2Id}>{bp2?.name ?? battle.provider2Id}</option>}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Intro</label>
                    <textarea value={battle.intro} onChange={(e) => updateBattle({ intro: e.target.value })} rows={3} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                  </div>

                  <div className="mt-4">
                    <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Verdict</label>
                    <textarea value={battle.verdict} onChange={(e) => updateBattle({ verdict: e.target.value })} rows={3} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                  </div>

                  <ArrayField
                    label={`Choose ${(battle.winnerId === battle.provider2Id ? bp2?.name : bp1?.name) ?? "Winner"} if you want (winner's points)`}
                    items={battle.verdictWinnerPoints ?? []}
                    onUpdate={(i, v) => { const pts = [...(battle.verdictWinnerPoints ?? [])]; pts[i] = v; updateBattle({ verdictWinnerPoints: pts }); }}
                    onAdd={() => updateBattle({ verdictWinnerPoints: [...(battle.verdictWinnerPoints ?? []), ""] })}
                    onRemove={(i) => updateBattle({ verdictWinnerPoints: (battle.verdictWinnerPoints ?? []).filter((_, idx) => idx !== i) })}
                  />
                  <ArrayField
                    label={`Choose ${(battle.winnerId === battle.provider2Id ? bp1?.name : bp2?.name) ?? "Other"} if you prefer (runner-up's points)`}
                    items={battle.verdictLoserPoints ?? []}
                    onUpdate={(i, v) => { const pts = [...(battle.verdictLoserPoints ?? [])]; pts[i] = v; updateBattle({ verdictLoserPoints: pts }); }}
                    onAdd={() => updateBattle({ verdictLoserPoints: [...(battle.verdictLoserPoints ?? []), ""] })}
                    onRemove={(i) => updateBattle({ verdictLoserPoints: (battle.verdictLoserPoints ?? []).filter((_, idx) => idx !== i) })}
                  />

                  {/* Categories */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Comparison Categories</label>
                    <div className="space-y-3">
                      {(battle.categories ?? []).map((cat, ci) => (
                        <div key={ci} className="rounded-lg border bg-gray-50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-400">Category {ci + 1}</span>
                            <button onClick={() => { const cats = battle.categories.filter((_, i) => i !== ci); updateBattle({ categories: cats }); }} className="rounded border border-red-200 px-2 py-0.5 text-xs text-red-500 hover:bg-red-50">Remove</button>
                          </div>
                          <div className="grid gap-3 sm:grid-cols-2">
                            <Field label="Name" value={cat.name} onChange={(v) => { const cats = [...battle.categories]; cats[ci] = { ...cats[ci], name: v }; updateBattle({ categories: cats }); }} />
                            <div>
                              <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Winner</label>
                              <select value={cat.winner || ""} onChange={(e) => { const cats = [...battle.categories]; cats[ci] = { ...cats[ci], winner: e.target.value as "provider1" | "provider2" | "tie" }; updateBattle({ categories: cats }); }} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none">
                                <option value="provider1">{bp1?.name ?? "Provider 1"}</option>
                                <option value="provider2">{bp2?.name ?? "Provider 2"}</option>
                                <option value="tie">Tie</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-2">
                            <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Explanation</label>
                            <textarea value={cat.explanation || ""} onChange={(e) => { const cats = [...battle.categories]; cats[ci] = { ...cats[ci], explanation: e.target.value }; updateBattle({ categories: cats }); }} rows={2} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                          </div>
                          <ArrayField
                            label="Supporting Points"
                            items={cat.supportingPoints ?? []}
                            onUpdate={(i, v) => { const cats = [...battle.categories]; const pts = [...(cats[ci].supportingPoints ?? [])]; pts[i] = v; cats[ci] = { ...cats[ci], supportingPoints: pts }; updateBattle({ categories: cats }); }}
                            onAdd={() => { const cats = [...battle.categories]; cats[ci] = { ...cats[ci], supportingPoints: [...(cats[ci].supportingPoints ?? []), ""] }; updateBattle({ categories: cats }); }}
                            onRemove={(i) => { const cats = [...battle.categories]; cats[ci] = { ...cats[ci], supportingPoints: (cats[ci].supportingPoints ?? []).filter((_, idx) => idx !== i) }; updateBattle({ categories: cats }); }}
                          />
                        </div>
                      ))}
                    </div>
                    <button onClick={() => updateBattle({ categories: [...battle.categories, { name: "", winner: "tie" as const, explanation: "", supportingPoints: [] }] })} className="mt-2 rounded border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]">+ Add Category</button>
                  </div>

                  {/* Feature Table */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature Comparison Table</label>
                    <div className="space-y-2">
                      {(battle.features ?? []).map((feat, fi) => (
                        <div key={fi} className="flex gap-2 items-start">
                          <div className="grid flex-1 gap-2 sm:grid-cols-3">
                            <input value={feat.feature} onChange={(e) => { const feats = [...(battle.features ?? [])]; feats[fi] = { ...feats[fi], feature: e.target.value }; updateBattle({ features: feats }); }} placeholder="Feature" className="rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                            <input value={feat.provider1Value} onChange={(e) => { const feats = [...(battle.features ?? [])]; feats[fi] = { ...feats[fi], provider1Value: e.target.value }; updateBattle({ features: feats }); }} placeholder={bp1?.name ?? "Provider 1"} className="rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                            <input value={feat.provider2Value} onChange={(e) => { const feats = [...(battle.features ?? [])]; feats[fi] = { ...feats[fi], provider2Value: e.target.value }; updateBattle({ features: feats }); }} placeholder={bp2?.name ?? "Provider 2"} className="rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                          </div>
                          <button onClick={() => updateBattle({ features: (battle.features ?? []).filter((_, i) => i !== fi) })} className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => updateBattle({ features: [...(battle.features ?? []), { feature: "", provider1Value: "", provider2Value: "" }] })} className="mt-2 rounded border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]">+ Add Feature Row</button>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => {
                const newBattle: BattleData = {
                  slug: "provider1-vs-provider2",
                  provider1Id: config.providers[0]?.id ?? "",
                  provider2Id: config.providers[1]?.id ?? "",
                  title: "Provider 1 vs Provider 2: Which Is Better?",
                  subtitle: "Compare pricing, medication options, and overall value side by side.",
                  description: "",
                  intro: "",
                  verdict: "",
                  verdictWinnerPoints: [""],
                  verdictLoserPoints: [""],
                  winnerId: "",
                  categories: [
                    { name: "Pricing & Value", winner: "tie" as const, explanation: "", supportingPoints: [] },
                    { name: "Medical Support", winner: "tie" as const, explanation: "", supportingPoints: [] },
                    { name: "Medication Options", winner: "tie" as const, explanation: "", supportingPoints: [] },
                  ],
                  features: [
                    { feature: "GLP-1 Treatment Access", provider1Value: "", provider2Value: "" },
                    { feature: "Online Consultation", provider1Value: "", provider2Value: "" },
                    { feature: "Home Delivery", provider1Value: "", provider2Value: "" },
                  ],
                };
                setConfig({ ...config, battles: [...(config.battles ?? []), newBattle] });
              }}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Battle Page
            </button>
          </div>
        )}

        {/* Pages (Landing Pages) Tab */}
        {activeTab === "pages" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Create comparison landing pages (e.g. /semaglutide, /ozempic). Same layout as the homepage but with custom hero text and provider ranking.</p>
            {(config.landingPages ?? []).map((lp, index) => {
              const updateLP = (patch: Record<string, unknown>) => {
                const landingPages = [...(config.landingPages ?? [])];
                landingPages[index] = { ...landingPages[index], ...patch };
                setConfig({ ...config, landingPages });
              };
              return (
                <div key={lp.slug || index} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#191919]">{lp.h1 || "Untitled Page"}</h3>
                      <span className="text-xs text-gray-400">/{lp.slug}</span>
                    </div>
                    <button
                      onClick={() => {
                        const landingPages = (config.landingPages ?? []).filter((_, i) => i !== index);
                        setConfig({ ...config, landingPages });
                      }}
                      className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Slug (URL path)" value={lp.slug} onChange={(v) => updateLP({ slug: v })} />
                    <Field label="SEO Title" value={lp.seoTitle} onChange={(v) => updateLP({ seoTitle: v })} />
                    <div className="sm:col-span-2">
                      <Field label="SEO Description" value={lp.seoDescription} onChange={(v) => updateLP({ seoDescription: v })} />
                    </div>
                    <Field label="H1 Headline" value={lp.h1} onChange={(v) => updateLP({ h1: v })} />
                    <Field label="H2 Subtitle (blue)" value={lp.h2} onChange={(v) => updateLP({ h2: v })} />
                    <div className="sm:col-span-2">
                      <Field label="Hero Description" value={lp.heroDescription} onChange={(v) => updateLP({ heroDescription: v })} />
                    </div>
                  </div>

                  {/* Provider Ranking Order */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Provider Ranking Order
                    </label>
                    <p className="mb-3 text-xs text-gray-400">Drag providers up/down to change ranking for this page. Only listed providers will appear.</p>
                    <div className="space-y-2">
                      {(lp.providerOrder ?? []).map((providerId, pi) => {
                        const provider = config.providers.find((p) => p.id === providerId);
                        return (
                          <div key={providerId} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2.5">
                            <div className="flex h-7 w-7 items-center justify-center rounded bg-[#191919] text-xs font-bold text-white shrink-0">
                              {pi + 1}
                            </div>
                            <span className="flex-1 text-sm font-medium text-[#191919]">{provider?.name ?? providerId}</span>
                            <div className="flex gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  if (pi === 0) return;
                                  const order = [...(lp.providerOrder ?? [])];
                                  [order[pi], order[pi - 1]] = [order[pi - 1], order[pi]];
                                  updateLP({ providerOrder: order });
                                }}
                                disabled={pi === 0}
                                className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                              </button>
                              <button
                                onClick={() => {
                                  if (pi === (lp.providerOrder ?? []).length - 1) return;
                                  const order = [...(lp.providerOrder ?? [])];
                                  [order[pi], order[pi + 1]] = [order[pi + 1], order[pi]];
                                  updateLP({ providerOrder: order });
                                }}
                                disabled={pi === (lp.providerOrder ?? []).length - 1}
                                className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                              </button>
                              <button
                                onClick={() => {
                                  const order = (lp.providerOrder ?? []).filter((_, i) => i !== pi);
                                  updateLP({ providerOrder: order });
                                }}
                                className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                              >
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    {/* Add provider dropdown */}
                    <div className="mt-2 flex gap-2">
                      <select
                        id={`add-provider-${index}`}
                        className="flex-1 rounded border px-3 py-1.5 text-sm text-gray-600 focus:border-[#0C4B75] focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>Add provider...</option>
                        {config.providers
                          .filter((p) => !(lp.providerOrder ?? []).includes(p.id))
                          .map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                      </select>
                      <button
                        onClick={() => {
                          const select = document.getElementById(`add-provider-${index}`) as HTMLSelectElement;
                          if (!select?.value) return;
                          updateLP({ providerOrder: [...(lp.providerOrder ?? []), select.value] });
                          select.value = "";
                        }}
                        className="rounded border border-[#0C4B75] px-3 py-1.5 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  {/* Editorial Content Sections */}
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Editorial Content Sections
                    </label>
                    <p className="mb-3 text-xs text-gray-400">Custom content shown below the provider cards. HTML links are supported in body text. Leave empty to use the default editorial content.</p>
                    <div className="space-y-3">
                      {(lp.editorialSections ?? []).map((es, si) => (
                        <div key={si} className="rounded-lg border bg-gray-50 p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <span className="text-xs font-semibold text-gray-500">Section {si + 1}</span>
                            <button
                              onClick={() => {
                                const sections = (lp.editorialSections ?? []).filter((_, i) => i !== si);
                                updateLP({ editorialSections: sections });
                              }}
                              className="flex h-6 w-6 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                            </button>
                          </div>
                          <Field
                            label="Heading"
                            value={es.heading}
                            onChange={(v) => {
                              const sections = [...(lp.editorialSections ?? [])];
                              sections[si] = { ...sections[si], heading: v };
                              updateLP({ editorialSections: sections });
                            }}
                          />
                          <div className="mt-2">
                            <label className="mb-1 block text-xs text-gray-400">Body (HTML supported)</label>
                            <textarea
                              value={es.body}
                              onChange={(e) => {
                                const sections = [...(lp.editorialSections ?? [])];
                                sections[si] = { ...sections[si], body: e.target.value };
                                updateLP({ editorialSections: sections });
                              }}
                              rows={3}
                              className="w-full rounded border px-3 py-2 text-sm text-gray-700 focus:border-[#0C4B75] focus:outline-none"
                            />
                          </div>
                          <div className="mt-2">
                            <label className="mb-1 block text-xs text-gray-400">Bullets (one per line, optional)</label>
                            <textarea
                              value={(es.bullets ?? []).join("\n")}
                              onChange={(e) => {
                                const sections = [...(lp.editorialSections ?? [])];
                                const bullets = e.target.value.split("\n").filter((b) => b.trim());
                                sections[si] = { ...sections[si], bullets };
                                updateLP({ editorialSections: sections });
                              }}
                              rows={2}
                              className="w-full rounded border px-3 py-2 text-sm text-gray-700 focus:border-[#0C4B75] focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        const sections = [...(lp.editorialSections ?? []), { heading: "", body: "", bullets: [] }];
                        updateLP({ editorialSections: sections });
                      }}
                      className="mt-2 w-full rounded border-2 border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
                    >
                      + Add Section
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => {
                const newLP: LandingPageData = {
                  slug: "new-page",
                  seoTitle: "New Page Title",
                  seoDescription: "",
                  h1: "New Landing Page",
                  h2: "Compare providers side by side",
                  heroDescription: "",
                  providerOrder: config.ranking.providerOrder.slice(),
                  editorialSections: [],
                };
                setConfig({ ...config, landingPages: [...(config.landingPages ?? []), newLP] });
              }}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Landing Page
            </button>
          </div>
        )}

        {/* Sidebars Tab */}
        {activeTab === "sidebars" && (
          <div className="space-y-4">
            <p className="text-xs text-gray-400">Configure sidebar content per section. Sidebars can be assigned to articles, reviews, homepage, etc.</p>
            {(config.sidebars ?? []).map((sb, index) => {
              const updateSB = (patch: Record<string, unknown>) => {
                const sidebars = [...(config.sidebars ?? [])];
                sidebars[index] = { ...sidebars[index], ...patch };
                setConfig({ ...config, sidebars });
              };
              return (
                <div key={sb.id || index} className="rounded-xl border bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#191919]">{sb.name}</h3>
                      <span className="text-xs text-gray-400">ID: {sb.id} — Area: {sb.area}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                        <input type="checkbox" checked={sb.active} onChange={(e) => updateSB({ active: e.target.checked })} className="rounded" />
                        Active
                      </label>
                      <button onClick={() => setConfig({ ...config, sidebars: (config.sidebars ?? []).filter((_, i) => i !== index) })} className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <Field label="Sidebar Name" value={sb.name} onChange={(v) => updateSB({ name: v })} />
                    <Field label="ID" value={sb.id} onChange={(v) => updateSB({ id: v })} />
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Area</label>
                      <select value={sb.area} onChange={(e) => updateSB({ area: e.target.value })} className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none">
                        <option value="homepage">Homepage</option>
                        <option value="articles">Articles</option>
                        <option value="reviews">Reviews</option>
                        <option value="comparisons">Comparisons</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>

                  {/* Blocks */}
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Blocks</label>
                    <div className="flex gap-3">
                      {(sb.blocks ?? []).map((block, bi) => (
                        <label key={bi} className="flex items-center gap-1.5 text-sm font-medium text-gray-600">
                          <input type="checkbox" checked={block.enabled} onChange={(e) => {
                            const blocks = [...sb.blocks];
                            blocks[bi] = { ...blocks[bi], enabled: e.target.checked };
                            updateSB({ blocks });
                          }} className="rounded" />
                          {block.type === "providers" ? "Top Providers" : block.type === "quizCta" ? "Quiz CTA" : "Related Articles"}
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Selected Providers */}
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Sidebar Providers</label>
                    <div className="space-y-1.5">
                      {(sb.providerIds ?? []).map((pid, pi) => {
                        const prov = config.providers.find((p) => p.id === pid);
                        return (
                          <div key={pid} className="flex items-center gap-2 rounded border bg-gray-50 px-3 py-1.5 text-sm">
                            <span className="flex-1">{prov?.name ?? pid}</span>
                            <button onClick={() => updateSB({ providerIds: sb.providerIds.filter((_, i) => i !== pi) })} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-1.5 flex gap-2">
                      <select id={`sb-prov-${index}`} className="flex-1 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" defaultValue="">
                        <option value="" disabled>Add provider...</option>
                        {config.providers.filter((p) => !(sb.providerIds ?? []).includes(p.id)).map((p) => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                      <button onClick={() => { const el = document.getElementById(`sb-prov-${index}`) as HTMLSelectElement; if (el?.value) { updateSB({ providerIds: [...(sb.providerIds ?? []), el.value] }); el.value = ""; } }} className="rounded border border-[#0C4B75] px-3 py-1.5 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5">Add</button>
                    </div>
                  </div>

                  {/* Quiz CTA */}
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Quiz CTA</label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <Field label="Headline" value={sb.quizCta?.headline ?? ""} onChange={(v) => updateSB({ quizCta: { ...sb.quizCta, headline: v } })} />
                      <Field label="Description" value={sb.quizCta?.description ?? ""} onChange={(v) => updateSB({ quizCta: { ...sb.quizCta, description: v } })} />
                      <Field label="CTA Text" value={sb.quizCta?.ctaText ?? ""} onChange={(v) => updateSB({ quizCta: { ...sb.quizCta, ctaText: v } })} />
                      <Field label="CTA URL" value={sb.quizCta?.ctaUrl ?? ""} onChange={(v) => updateSB({ quizCta: { ...sb.quizCta, ctaUrl: v } })} />
                    </div>
                  </div>

                  {/* Related Articles */}
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Related Articles</label>
                    <div className="space-y-1.5">
                      {(sb.articleSlugs ?? []).map((aSlug, ai) => {
                        const art = (config.articles ?? []).find((a) => a.slug === aSlug);
                        return (
                          <div key={aSlug} className="flex items-center gap-2 rounded border bg-gray-50 px-3 py-1.5 text-sm">
                            <span className="flex-1 truncate">{art?.title ?? aSlug}</span>
                            <button onClick={() => updateSB({ articleSlugs: sb.articleSlugs.filter((_, i) => i !== ai) })} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-1.5 flex gap-2">
                      <select id={`sb-art-${index}`} className="flex-1 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" defaultValue="">
                        <option value="" disabled>Add article...</option>
                        {(config.articles ?? []).filter((a) => !(sb.articleSlugs ?? []).includes(a.slug)).map((a) => (<option key={a.slug} value={a.slug}>{a.title}</option>))}
                      </select>
                      <button onClick={() => { const el = document.getElementById(`sb-art-${index}`) as HTMLSelectElement; if (el?.value) { updateSB({ articleSlugs: [...(sb.articleSlugs ?? []), el.value] }); el.value = ""; } }} className="rounded border border-[#0C4B75] px-3 py-1.5 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5">Add</button>
                    </div>
                  </div>
                </div>
              );
            })}
            <button
              onClick={() => {
                const newSB: SidebarConfigData = {
                  id: `sidebar-${Date.now()}`,
                  name: "New Sidebar",
                  area: "articles",
                  active: true,
                  blocks: [
                    { type: "providers", enabled: true },
                    { type: "quizCta", enabled: true },
                    { type: "relatedArticles", enabled: true },
                  ],
                  providerIds: [],
                  quizCta: { headline: "Not sure which provider?", description: "Take our free quiz.", ctaText: "Find My Match", ctaUrl: "/find-your-match" },
                  articleSlugs: [],
                };
                setConfig({ ...config, sidebars: [...(config.sidebars ?? []), newSB] });
              }}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Sidebar
            </button>
          </div>
        )}

        {/* Quiz Tab */}
        {activeTab === "quiz" && config.quiz && (
          <div className="space-y-4">
            {/* Panel Type */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Panel Type</h3>
              <p className="mb-3 text-xs text-gray-400">Choose the quiz funnel style. Classic = card-based steps. Chat = conversational chat bubbles.</p>
              <div className="flex gap-3">
                {(["classic", "chat"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setConfig({ ...config, quiz: { ...config.quiz, panelType: type } })}
                    className={`flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition-colors ${
                      (config.quiz.panelType || "classic") === type
                        ? "border-[#0C4B75] bg-[#0C4B75]/5 text-[#0C4B75]"
                        : "border-gray-200 text-gray-500 hover:border-gray-300"
                    }`}
                  >
                    {type === "classic" ? "Classic (Card Steps)" : "Chat (Conversational)"}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                Classic: <span className="font-medium">/find-your-match</span> — Chat: <span className="font-medium">/find-your-match-weight-loss</span>
              </p>
            </div>

            {/* Welcome screen */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Welcome Screen</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Welcome Title" value={config.quiz.welcomeTitle || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, welcomeTitle: v } })} />
                <Field label="Welcome Subtitle" value={config.quiz.welcomeSubtitle || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, welcomeSubtitle: v } })} />
                <Field label="CTA Button Text" value={config.quiz.welcomeCta || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, welcomeCta: v } })} />
                <Field label="Mid-Flow Message" value={config.quiz.midFlowMessage || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, midFlowMessage: v } })} />
                <div className="sm:col-span-2">
                  <Field label="Chat Intro Message (chat panel only)" value={config.quiz.chatIntroMessage || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, chatIntroMessage: v } })} />
                </div>
              </div>
              <ArrayField
                label="Trust Points"
                items={config.quiz.welcomeTrustPoints || []}
                onUpdate={(i, v) => { const pts = [...(config.quiz.welcomeTrustPoints || [])]; pts[i] = v; setConfig({ ...config, quiz: { ...config.quiz, welcomeTrustPoints: pts } }); }}
                onAdd={() => setConfig({ ...config, quiz: { ...config.quiz, welcomeTrustPoints: [...(config.quiz.welcomeTrustPoints || []), ""] } })}
                onRemove={(i) => setConfig({ ...config, quiz: { ...config.quiz, welcomeTrustPoints: (config.quiz.welcomeTrustPoints || []).filter((_, idx) => idx !== i) } })}
              />
            </div>

            {/* Quiz Provider Order */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Quiz Provider Order</h3>
              <p className="mb-4 text-xs text-gray-400">Control which providers appear in quiz results and in what priority. Only listed providers will be shown.</p>
              <div className="space-y-2">
                {(config.quiz.providerOrder ?? config.ranking.providerOrder ?? []).map((providerId, pi) => {
                  const provider = config.providers.find((p) => p.id === providerId);
                  return (
                    <div key={providerId} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2.5">
                      <div className="flex h-7 w-7 items-center justify-center rounded bg-[#191919] text-xs font-bold text-white shrink-0">{pi + 1}</div>
                      <span className="flex-1 text-sm font-medium text-[#191919]">{provider?.name ?? providerId}</span>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => {
                            if (pi === 0) return;
                            const order = [...(config.quiz.providerOrder ?? config.ranking.providerOrder ?? [])];
                            [order[pi], order[pi - 1]] = [order[pi - 1], order[pi]];
                            setConfig({ ...config, quiz: { ...config.quiz, providerOrder: order } });
                          }}
                          disabled={pi === 0}
                          className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                        </button>
                        <button
                          onClick={() => {
                            const order = config.quiz.providerOrder ?? config.ranking.providerOrder ?? [];
                            if (pi === order.length - 1) return;
                            const newOrder = [...order];
                            [newOrder[pi], newOrder[pi + 1]] = [newOrder[pi + 1], newOrder[pi]];
                            setConfig({ ...config, quiz: { ...config.quiz, providerOrder: newOrder } });
                          }}
                          disabled={pi === (config.quiz.providerOrder ?? config.ranking.providerOrder ?? []).length - 1}
                          className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white hover:text-gray-600 disabled:opacity-30"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                        </button>
                        <button
                          onClick={() => {
                            const order = (config.quiz.providerOrder ?? config.ranking.providerOrder ?? []).filter((_, i) => i !== pi);
                            setConfig({ ...config, quiz: { ...config.quiz, providerOrder: order } });
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex gap-2">
                <select
                  id="add-quiz-provider"
                  className="flex-1 rounded border px-3 py-1.5 text-sm text-gray-600 focus:border-[#0C4B75] focus:outline-none"
                  defaultValue=""
                >
                  <option value="" disabled>Add provider...</option>
                  {config.providers
                    .filter((p) => !(config.quiz.providerOrder ?? config.ranking.providerOrder ?? []).includes(p.id))
                    .map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>
                <button
                  onClick={() => {
                    const select = document.getElementById("add-quiz-provider") as HTMLSelectElement;
                    if (!select?.value) return;
                    const order = [...(config.quiz.providerOrder ?? config.ranking.providerOrder ?? []), select.value];
                    setConfig({ ...config, quiz: { ...config.quiz, providerOrder: order } });
                    select.value = "";
                  }}
                  className="rounded border border-[#0C4B75] px-3 py-1.5 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Results & loading */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Results & Loading</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Results Title" value={config.quiz.resultsTitle} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, resultsTitle: v } })} />
                <Field label="Results Subtitle" value={config.quiz.resultsSubtitle} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, resultsSubtitle: v } })} />
                <Field label="Others Section Title" value={config.quiz.resultsOthersTitle || ""} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, resultsOthersTitle: v } })} />
              </div>
              <ArrayField
                label="Trust Strip"
                items={config.quiz.trustStrip || []}
                onUpdate={(i, v) => { const ts = [...(config.quiz.trustStrip || [])]; ts[i] = v; setConfig({ ...config, quiz: { ...config.quiz, trustStrip: ts } }); }}
                onAdd={() => setConfig({ ...config, quiz: { ...config.quiz, trustStrip: [...(config.quiz.trustStrip || []), ""] } })}
                onRemove={(i) => setConfig({ ...config, quiz: { ...config.quiz, trustStrip: (config.quiz.trustStrip || []).filter((_, idx) => idx !== i) } })}
              />
              <ArrayField
                label="Loading Messages"
                items={config.quiz.loadingMessages}
                onUpdate={(i, v) => {
                  const msgs = [...config.quiz.loadingMessages];
                  msgs[i] = v;
                  setConfig({ ...config, quiz: { ...config.quiz, loadingMessages: msgs } });
                }}
                onAdd={() => setConfig({ ...config, quiz: { ...config.quiz, loadingMessages: [...config.quiz.loadingMessages, ""] } })}
                onRemove={(i) => setConfig({ ...config, quiz: { ...config.quiz, loadingMessages: config.quiz.loadingMessages.filter((_, idx) => idx !== i) } })}
              />
            </div>

            {/* Testimonials */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Testimonials</h3>
              <p className="mb-4 text-xs text-gray-400">Shown on quiz results page below the top provider. One is randomly selected per page load.</p>
              <div className="space-y-3">
                {(config.quiz.testimonials ?? []).map((t, ti) => (
                  <div key={ti} className="rounded-lg border bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Testimonial {ti + 1}</span>
                      <button
                        onClick={() => {
                          const testimonials = (config.quiz.testimonials ?? []).filter((_, i) => i !== ti);
                          setConfig({ ...config, quiz: { ...config.quiz, testimonials } });
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <textarea
                      value={t.text}
                      onChange={(e) => {
                        const testimonials = [...(config.quiz.testimonials ?? [])];
                        testimonials[ti] = { ...testimonials[ti], text: e.target.value };
                        setConfig({ ...config, quiz: { ...config.quiz, testimonials } });
                      }}
                      rows={2}
                      placeholder="Review text..."
                      className="mb-2 w-full rounded border px-3 py-2 text-sm text-gray-700 focus:border-[#0C4B75] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        value={t.name}
                        onChange={(e) => {
                          const testimonials = [...(config.quiz.testimonials ?? [])];
                          testimonials[ti] = { ...testimonials[ti], name: e.target.value };
                          setConfig({ ...config, quiz: { ...config.quiz, testimonials } });
                        }}
                        placeholder="Name (e.g. Sarah M.)"
                        className="flex-1 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none"
                      />
                      <input
                        value={t.state}
                        onChange={(e) => {
                          const testimonials = [...(config.quiz.testimonials ?? [])];
                          testimonials[ti] = { ...testimonials[ti], state: e.target.value };
                          setConfig({ ...config, quiz: { ...config.quiz, testimonials } });
                        }}
                        placeholder="State (e.g. Texas)"
                        className="w-32 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => {
                  const testimonials = [...(config.quiz.testimonials ?? []), { text: "", name: "", state: "" }];
                  setConfig({ ...config, quiz: { ...config.quiz, testimonials } });
                }}
                className="mt-2 w-full rounded border-2 border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
              >
                + Add Testimonial
              </button>
            </div>

            {/* Loading Screen Config */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Loading Screen (Provider Scan)</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Headline" value={config.quiz.loadingScreen?.headline ?? "Finding your best match"} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), headline: v } } })} />
                <Field label="Duration (ms)" value={String(config.quiz.loadingScreen?.durationMs ?? 3500)} onChange={(v) => setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), durationMs: parseInt(v) || 3500 } } })} />
              </div>
              <div className="mt-4">
                <ArrayField
                  label="Supporting Texts (rotate during loading)"
                  items={config.quiz.loadingScreen?.supportingTexts ?? []}
                  onUpdate={(i, v) => {
                    const texts = [...(config.quiz.loadingScreen?.supportingTexts ?? [])];
                    texts[i] = v;
                    setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), supportingTexts: texts } } });
                  }}
                  onAdd={() => setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), supportingTexts: [...(config.quiz.loadingScreen?.supportingTexts ?? []), ""] } } })}
                  onRemove={(i) => setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), supportingTexts: (config.quiz.loadingScreen?.supportingTexts ?? []).filter((_, idx) => idx !== i) } } })}
                />
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Provider Logos (in order)</label>
                <p className="mb-3 text-xs text-gray-400">Select which provider logos appear during loading and in what order. Logos are shown in grayscale.</p>
                <div className="space-y-2">
                  {(config.quiz.loadingScreen?.providerLogos ?? []).map((pid, pi) => {
                    const provider = config.providers.find((p) => p.id === pid);
                    return (
                      <div key={pid} className="flex items-center gap-3 rounded-lg border bg-gray-50 px-4 py-2">
                        <span className="flex-1 text-sm font-medium text-[#191919]">{provider?.name ?? pid}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => {
                              if (pi === 0) return;
                              const logos = [...(config.quiz.loadingScreen?.providerLogos ?? [])];
                              [logos[pi], logos[pi - 1]] = [logos[pi - 1], logos[pi]];
                              setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), providerLogos: logos } } });
                            }}
                            disabled={pi === 0}
                            className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white disabled:opacity-30"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                          </button>
                          <button
                            onClick={() => {
                              if (pi === (config.quiz.loadingScreen?.providerLogos ?? []).length - 1) return;
                              const logos = [...(config.quiz.loadingScreen?.providerLogos ?? [])];
                              [logos[pi], logos[pi + 1]] = [logos[pi + 1], logos[pi]];
                              setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), providerLogos: logos } } });
                            }}
                            disabled={pi === (config.quiz.loadingScreen?.providerLogos ?? []).length - 1}
                            className="flex h-7 w-7 items-center justify-center rounded border text-gray-400 hover:bg-white disabled:opacity-30"
                          >
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                          </button>
                          <button
                            onClick={() => {
                              const logos = (config.quiz.loadingScreen?.providerLogos ?? []).filter((_, i) => i !== pi);
                              setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), providerLogos: logos } } });
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-2 flex gap-2">
                  <select
                    id="add-loading-logo"
                    className="flex-1 rounded border px-3 py-1.5 text-sm text-gray-600 focus:border-[#0C4B75] focus:outline-none"
                    defaultValue=""
                  >
                    <option value="" disabled>Add provider logo...</option>
                    {config.providers
                      .filter((p) => !(config.quiz.loadingScreen?.providerLogos ?? []).includes(p.id))
                      .map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                  </select>
                  <button
                    onClick={() => {
                      const select = document.getElementById("add-loading-logo") as HTMLSelectElement;
                      if (!select?.value) return;
                      setConfig({ ...config, quiz: { ...config.quiz, loadingScreen: { ...(config.quiz.loadingScreen ?? { headline: "Finding your best match", supportingTexts: [], providerLogos: [], durationMs: 5000 }), providerLogos: [...(config.quiz.loadingScreen?.providerLogos ?? []), select.value] } } });
                      select.value = "";
                    }}
                    className="rounded border border-[#0C4B75] px-3 py-1.5 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>

            {/* Questions */}
            {config.quiz.questions.map((q, qi) => (
              <div key={q.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Question {qi + 1}: {q.id}</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="ID" value={q.id} onChange={(v) => {
                    const questions = [...config.quiz.questions];
                    questions[qi] = { ...questions[qi], id: v };
                    setConfig({ ...config, quiz: { ...config.quiz, questions } });
                  }} />
                  <Field label="Title" value={q.title} onChange={(v) => {
                    const questions = [...config.quiz.questions];
                    questions[qi] = { ...questions[qi], title: v };
                    setConfig({ ...config, quiz: { ...config.quiz, questions } });
                  }} />
                  <div className="sm:col-span-2">
                    <Field label="Subtitle" value={q.subtitle} onChange={(v) => {
                      const questions = [...config.quiz.questions];
                      questions[qi] = { ...questions[qi], subtitle: v };
                      setConfig({ ...config, quiz: { ...config.quiz, questions } });
                    }} />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Options</label>
                  <div className="space-y-2">
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2">
                        <input value={opt.label} onChange={(e) => {
                          const questions = [...config.quiz.questions];
                          const options = [...questions[qi].options];
                          options[oi] = { ...options[oi], label: e.target.value };
                          questions[qi] = { ...questions[qi], options };
                          setConfig({ ...config, quiz: { ...config.quiz, questions } });
                        }} placeholder="Label" className="flex-1 rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                        <input value={opt.value} onChange={(e) => {
                          const questions = [...config.quiz.questions];
                          const options = [...questions[qi].options];
                          options[oi] = { ...options[oi], value: e.target.value };
                          questions[qi] = { ...questions[qi], options };
                          setConfig({ ...config, quiz: { ...config.quiz, questions } });
                        }} placeholder="Value" className="w-28 rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}

            {/* Provider profiles */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">Provider Match Profiles</h3>
              {config.quiz.providerProfiles.map((pp, ppi) => {
                const provider = config.providers.find((p) => p.id === pp.providerId);
                return (
                  <div key={pp.providerId} className="mb-4 rounded-lg border p-4 last:mb-0">
                    <p className="mb-2 text-sm font-bold text-[#191919]">{provider?.name || pp.providerId}</p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <Field label="Provider ID" value={pp.providerId} onChange={(v) => {
                        const profiles = [...config.quiz.providerProfiles];
                        profiles[ppi] = { ...profiles[ppi], providerId: v };
                        setConfig({ ...config, quiz: { ...config.quiz, providerProfiles: profiles } });
                      }} />
                      <Field label="Price Level" value={pp.priceLevel} onChange={(v) => {
                        const profiles = [...config.quiz.providerProfiles];
                        profiles[ppi] = { ...profiles[ppi], priceLevel: v as "low" | "mid" | "high" };
                        setConfig({ ...config, quiz: { ...config.quiz, providerProfiles: profiles } });
                      }} />
                      <Field label="Strengths (comma)" value={(pp.strengths ?? []).join(", ")} onChange={(v) => {
                        const profiles = [...config.quiz.providerProfiles];
                        profiles[ppi] = { ...profiles[ppi], strengths: v.split(",").map((s) => s.trim()).filter(Boolean) };
                        setConfig({ ...config, quiz: { ...config.quiz, providerProfiles: profiles } });
                      }} />
                    </div>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {Object.entries(pp.matchReasons).map(([key, val]) => (
                        <Field key={key} label={`Reason: ${key}`} value={val} onChange={(v) => {
                          const profiles = [...config.quiz.providerProfiles];
                          profiles[ppi] = { ...profiles[ppi], matchReasons: { ...profiles[ppi].matchReasons, [key]: v } };
                          setConfig({ ...config, quiz: { ...config.quiz, providerProfiles: profiles } });
                        }} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quiz Results Override — Visual Tree */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Quiz Results — Per Priority Override</h3>
              <p className="mb-4 text-xs text-gray-400">Drag providers to set the exact result order for each priority. When set, this overrides the algorithm. Leave empty to use automatic scoring.</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { key: "cost", label: "Lowest Monthly Cost" },
                  { key: "medical", label: "Doctor-Guided Care" },
                  { key: "online", label: "Fast Online Treatment" },
                  { key: "personalized", label: "Personalized Care" },
                ].map(({ key, label }) => {
                  const overrides = config.quiz.resultOverrides ?? {};
                  const order = overrides[key] ?? [];
                  return (
                    <div key={key} className="rounded-lg border bg-gray-50 p-3">
                      <p className="mb-2 text-xs font-bold text-[#0C4B75]">{label}</p>
                      <div className="space-y-1.5 mb-2">
                        {order.map((pid, pi) => {
                          const provider = config.providers.find((p) => p.id === pid);
                          return (
                            <div key={pid} className="flex items-center gap-2 rounded border bg-white px-2.5 py-1.5">
                              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-[#191919] text-[10px] font-bold text-white">{pi + 1}</span>
                              <span className="flex-1 text-xs font-medium text-[#191919] truncate">{provider?.name ?? pid}</span>
                              <div className="flex gap-0.5 shrink-0">
                                <button
                                  onClick={() => {
                                    if (pi === 0) return;
                                    const newOrder = [...order];
                                    [newOrder[pi], newOrder[pi - 1]] = [newOrder[pi - 1], newOrder[pi]];
                                    setConfig({ ...config, quiz: { ...config.quiz, resultOverrides: { ...overrides, [key]: newOrder } } });
                                  }}
                                  disabled={pi === 0}
                                  className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-20"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m18 15-6-6-6 6"/></svg>
                                </button>
                                <button
                                  onClick={() => {
                                    if (pi === order.length - 1) return;
                                    const newOrder = [...order];
                                    [newOrder[pi], newOrder[pi + 1]] = [newOrder[pi + 1], newOrder[pi]];
                                    setConfig({ ...config, quiz: { ...config.quiz, resultOverrides: { ...overrides, [key]: newOrder } } });
                                  }}
                                  disabled={pi === order.length - 1}
                                  className="flex h-5 w-5 items-center justify-center rounded text-gray-400 hover:bg-gray-100 disabled:opacity-20"
                                >
                                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 9 6 6 6-6"/></svg>
                                </button>
                                <button
                                  onClick={() => {
                                    const newOrder = order.filter((_, i) => i !== pi);
                                    setConfig({ ...config, quiz: { ...config.quiz, resultOverrides: { ...overrides, [key]: newOrder } } });
                                  }}
                                  className="flex h-5 w-5 items-center justify-center rounded text-red-400 hover:bg-red-50"
                                >
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                        {order.length === 0 && (
                          <p className="py-2 text-center text-[10px] text-gray-400 italic">Using algorithm</p>
                        )}
                      </div>
                      <select
                        className="w-full rounded border px-2 py-1 text-xs text-gray-500 focus:border-[#0C4B75] focus:outline-none"
                        value=""
                        onChange={(e) => {
                          if (!e.target.value) return;
                          setConfig({ ...config, quiz: { ...config.quiz, resultOverrides: { ...overrides, [key]: [...order, e.target.value] } } });
                          e.target.value = "";
                        }}
                      >
                        <option value="">+ Add provider...</option>
                        {config.providers
                          .filter((p) => !order.includes(p.id))
                          .map((p) => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === "team" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
              <b>Trust &amp; credibility (E-E-A-T) layer.</b> These experts appear as bylines on battle pages, reviews and articles, and feed author/reviewer structured data for Google. Use <b>real</b> team members — only add medical credentials (MD, RD, PharmD…) for people who actually hold them.
            </div>
            {(config.experts ?? []).map((expert, index) => (
              <div key={expert.id} className="rounded-xl border bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#191919]">{expert.name || "New Expert"}</h3>
                  <button
                    onClick={() => setConfig({ ...config, experts: (config.experts ?? []).filter((_, i) => i !== index) })}
                    className="flex h-8 w-8 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Name" value={expert.name} onChange={(v) => { const experts = [...(config.experts ?? [])]; experts[index] = { ...experts[index], name: v }; setConfig({ ...config, experts }); }} />
                  <Field label="Role / Title" value={expert.role} onChange={(v) => { const experts = [...(config.experts ?? [])]; experts[index] = { ...experts[index], role: v }; setConfig({ ...config, experts }); }} />
                  <Field label="Credentials (real only, e.g. RD, MPH)" value={expert.credentials ?? ""} onChange={(v) => { const experts = [...(config.experts ?? [])]; experts[index] = { ...experts[index], credentials: v }; setConfig({ ...config, experts }); }} />
                  <ImageField label="Avatar (optional — initials used if empty)" value={expert.avatar ?? ""} onChange={(v) => { const experts = [...(config.experts ?? [])]; experts[index] = { ...experts[index], avatar: v }; setConfig({ ...config, experts }); }} />
                </div>
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Bio</label>
                  <textarea
                    value={expert.bio}
                    onChange={(e) => { const experts = [...(config.experts ?? [])]; experts[index] = { ...experts[index], bio: e.target.value }; setConfig({ ...config, experts }); }}
                    rows={3}
                    className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                  />
                </div>
              </div>
            ))}
            <button
              onClick={() => setConfig({ ...config, experts: [...(config.experts ?? []), { id: `expert-${Date.now()}`, name: "New Expert", role: "Health Researcher", bio: "" }] })}
              className="w-full rounded-lg border-2 border-dashed border-gray-300 py-4 text-sm font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
            >
              + Add Team Member
            </button>
          </div>
        )}

        {/* General Tab */}
        {activeTab === "general" && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold text-gray-500 uppercase tracking-wider">General Settings</h3>
            <div className="space-y-4">
              <Field label="Site Name" value={config.siteName} onChange={(v) => setConfig({ ...config, siteName: v })} />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Card Social Proof — Number" value={config.cardSocialProof?.number ?? ""} onChange={(v) => setConfig({ ...config, cardSocialProof: { ...(config.cardSocialProof ?? { number: "", text: "" }), number: v } })} />
                <Field label="Card Social Proof — Text" value={config.cardSocialProof?.text ?? ""} onChange={(v) => setConfig({ ...config, cardSocialProof: { ...(config.cardSocialProof ?? { number: "", text: "" }), text: v } })} />
                <ImageField label="Battle Winner Banner — Desktop Image" value={config.battleWinnerBannerImageDesktop ?? ""} onChange={(v) => setConfig({ ...config, battleWinnerBannerImageDesktop: v })} />
                <ImageField label="Battle Winner Banner — Mobile Image (wide)" value={config.battleWinnerBannerImageMobile ?? ""} onChange={(v) => setConfig({ ...config, battleWinnerBannerImageMobile: v })} />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">Disclosure Text</label>
                <textarea
                  value={config.disclosureText}
                  onChange={(e) => setConfig({ ...config, disclosureText: e.target.value })}
                  rows={3}
                  className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                />
              </div>
            </div>

            {/* Review Testimonials */}
            <div className="mt-4 rounded-xl border bg-white p-6 shadow-sm">
              <h3 className="mb-1 text-sm font-bold text-gray-500 uppercase tracking-wider">Review Page Testimonials</h3>
              <p className="mb-4 text-xs text-gray-400">Shown as a carousel on all review pages. First name + last initial format.</p>
              <div className="space-y-3">
                {(config.reviewTestimonials ?? []).map((t, ti) => (
                  <div key={ti} className="rounded-lg border bg-gray-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-semibold text-gray-500">Testimonial {ti + 1}</span>
                      <button
                        onClick={() => {
                          const testimonials = (config.reviewTestimonials ?? []).filter((_, i) => i !== ti);
                          setConfig({ ...config, reviewTestimonials: testimonials });
                        }}
                        className="flex h-6 w-6 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
                      </button>
                    </div>
                    <textarea
                      value={t.text}
                      onChange={(e) => { const ts = [...(config.reviewTestimonials ?? [])]; ts[ti] = { ...ts[ti], text: e.target.value }; setConfig({ ...config, reviewTestimonials: ts }); }}
                      rows={2} placeholder="Review text..."
                      className="mb-2 w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
                    />
                    <div className="flex gap-2">
                      <input value={t.name} onChange={(e) => { const ts = [...(config.reviewTestimonials ?? [])]; ts[ti] = { ...ts[ti], name: e.target.value }; setConfig({ ...config, reviewTestimonials: ts }); }}
                        placeholder="Name (e.g. Sarah M.)" className="flex-1 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" />
                      <input value={t.state} onChange={(e) => { const ts = [...(config.reviewTestimonials ?? [])]; ts[ti] = { ...ts[ti], state: e.target.value }; setConfig({ ...config, reviewTestimonials: ts }); }}
                        placeholder="State" className="w-28 rounded border px-3 py-1.5 text-sm focus:border-[#0C4B75] focus:outline-none" />
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setConfig({ ...config, reviewTestimonials: [...(config.reviewTestimonials ?? []), { text: "", name: "", state: "" }] })}
                className="mt-2 w-full rounded border-2 border-dashed border-gray-200 py-2 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
              >
                + Add Testimonial
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file: File) {
    setUploading(true);
    const pw = sessionStorage.getItem("admin_token") || "";
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { Authorization: `Bearer ${pw}` },
      body: form,
    });
    if (res.ok) {
      const data = await res.json();
      onChange(data.url);
    }
    setUploading(false);
  }

  return (
    <div>
      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
          placeholder="URL or upload..."
        />
        <label className="flex cursor-pointer items-center gap-1 rounded border border-[#0C4B75] px-3 py-2 text-xs font-semibold text-[#0C4B75] hover:bg-[#0C4B75]/5">
          {uploading ? "Uploading..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleUpload(f);
            }}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 rounded border bg-gray-50 p-2">
          <img src={value} alt="Preview" className="max-h-16 object-contain" />
        </div>
      )}
    </div>
  );
}

function ArrayField({
  label,
  items,
  onUpdate,
  onAdd,
  onRemove,
}: {
  label: string;
  items: string[];
  onUpdate: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}) {
  return (
    <div className="mt-4">
      <label className="mb-1 block text-xs font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      <div className="space-y-2">
        {items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <input
              value={item}
              onChange={(e) => onUpdate(i, e.target.value)}
              className="flex-1 rounded border px-3 py-2 text-sm focus:border-[#0C4B75] focus:outline-none"
            />
            <button
              onClick={() => onRemove(i)}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-red-200 text-red-400 hover:bg-red-50 hover:text-red-600"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={onAdd}
        className="mt-2 rounded border border-dashed border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-400 hover:border-[#0C4B75] hover:text-[#0C4B75]"
      >
        + Add Item
      </button>
    </div>
  );
}

import { BadgeCheck } from "lucide-react";
import type { Expert } from "@/lib/config";

function initials(name: string) {
  const words = name.replace(/^The\s+/i, "").split(/\s+/).filter(Boolean);
  const letters = words.length >= 2 ? words[0][0] + words[words.length - 1][0] : (words[0]?.slice(0, 2) ?? "");
  return letters.toUpperCase();
}

// Full editorial-team section for the About page (E-E-A-T).
export function ExpertTeam({ experts }: { experts: Expert[] }) {
  if (!experts || experts.length === 0) return null;

  return (
    <section className="mb-12">
      <h2 className="mb-2 text-[22px] font-bold text-[#191919]">Meet Our Editorial Team</h2>
      <p className="mb-6 max-w-[640px] text-[15px] leading-relaxed text-gray-500">
        The independent researchers and editors behind our provider comparisons and
        reviews. Every ranking and review is produced and checked by this team.
      </p>

      <div className="grid gap-5 sm:grid-cols-2">
        {experts.map((expert) => (
          <article key={expert.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-[0_1px_3px_rgba(16,32,54,0.04)]">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#0C4B75] to-[#0B5E9E] text-[16px] font-bold text-white">
                {expert.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={expert.avatar} alt={expert.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                ) : (
                  initials(expert.name)
                )}
              </span>
              <div className="min-w-0">
                <h3 className="flex items-center gap-1.5 text-[16px] font-bold leading-tight text-[#191919]">
                  <span className="truncate">
                    {expert.name}
                    {expert.credentials && <span className="text-gray-400">, {expert.credentials}</span>}
                  </span>
                  <BadgeCheck className="h-4 w-4 shrink-0 text-[#0B5E9E]" strokeWidth={2} />
                </h3>
                <p className="mt-0.5 text-[13px] font-semibold text-[#0C4B75]">{expert.role}</p>
              </div>
            </div>

            {expert.bio && (
              <p className="mt-4 text-[14px] leading-[1.7] text-gray-600">{expert.bio}</p>
            )}

            {expert.specialties && expert.specialties.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {expert.specialties.map((s) => (
                  <span key={s} className="rounded-full bg-[#0C4B75]/[0.06] px-2.5 py-1 text-[11px] font-semibold text-[#0C4B75]">
                    {s}
                  </span>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

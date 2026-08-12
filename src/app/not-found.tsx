import Link from "next/link";
import { ArrowRight, Home, Search } from "lucide-react";
import { getConfig } from "@/lib/config-store";

export default async function NotFound() {
  const config = await getConfig();
  const { providerOrder } = config.ranking;

  const topProviders = providerOrder
    .slice(0, 4)
    .map((id) => config.providers.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => !!p);

  const comparisons = (config.battles ?? [])
    .map((b) => {
      const p1 = config.providers.find((p) => p.id === b.provider1Id);
      const p2 = config.providers.find((p) => p.id === b.provider2Id);
      return p1 && p2 ? { slug: b.slug, name: `${p1.name} vs ${p2.name}` } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .slice(0, 4);

  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="mx-auto max-w-[760px] px-4 py-16 sm:px-6 sm:py-24">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#0C4B75]">Error 404</p>
        <h1 className="mt-2 text-[30px] font-extrabold leading-tight text-[#191919] sm:text-[38px]">
          We couldn&rsquo;t find that page
        </h1>
        <p className="mt-3 max-w-[520px] text-[16px] leading-relaxed text-gray-500">
          The page may have moved or no longer exists. Here&rsquo;s where most people head next.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-[#0C4B75] px-6 text-[14px] font-bold text-white transition-colors hover:bg-[#093d61]"
          >
            <Home className="h-4 w-4" strokeWidth={2} />
            Compare all providers
          </Link>
          <Link
            href="/find-your-match"
            className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-[14px] font-bold text-[#191919] transition-colors hover:bg-gray-50"
          >
            <Search className="h-4 w-4" strokeWidth={2} />
            Find your match
          </Link>
        </div>

        {topProviders.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gray-400">Top providers</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {topProviders.map((p) => (
                <Link
                  key={p.id}
                  href={`/reviews/${p.id}`}
                  className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 transition-colors hover:border-[#0C4B75]/30"
                >
                  <div className="flex h-[26px] w-[90px] items-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.logo} alt={`${p.name} logo`} className="max-h-full max-w-full object-contain" />
                  </div>
                  <span className="ml-auto text-[13px] font-semibold text-[#0C4B75] group-hover:underline">Read review</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {comparisons.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-4 text-[13px] font-bold uppercase tracking-wider text-gray-400">Popular comparisons</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {comparisons.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.slug}`}
                  className="group flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-[13px] font-semibold text-[#191919] transition-colors hover:border-[#0C4B75]/30"
                >
                  {c.name}
                  <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#0C4B75]" strokeWidth={2.5} />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

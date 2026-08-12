import { ImageResponse } from "next/og";
import { getConfig } from "@/lib/config-store";

export const runtime = "edge";
export const alt = "Provider Comparison — tophairloss.io";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ battleSlug: string }>;
}) {
  const { battleSlug } = await params;

  let heading = battleSlug.replace(/-/g, " ");
  let subline = "Side-by-side comparison";
  try {
    const config = await getConfig();
    const battle = (config.battles ?? []).find((b) => b.slug === battleSlug);
    if (battle) {
      const p1 = config.providers.find((p) => p.id === battle.provider1Id);
      const p2 = config.providers.find((p) => p.id === battle.provider2Id);
      if (p1 && p2) {
        heading = `${p1.name} vs ${p2.name}`;
        subline = "Which one wins in 2026?";
      }
    } else {
      const landing = (config.landingPages ?? []).find((lp) => lp.slug === battleSlug);
      if (landing) {
        heading = landing.h1;
        subline = landing.h2;
      }
    }
  } catch {
    // fallback
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0C4B75 0%, #093d61 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <span
          style={{
            fontSize: "22px",
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            marginBottom: "40px",
          }}
        >
          tophairloss.io
        </span>
        <div
          style={{
            fontSize: "60px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          {heading}
        </div>
        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          {subline}
        </div>
      </div>
    ),
    { ...size }
  );
}

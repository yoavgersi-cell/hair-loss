import { ImageResponse } from "next/og";
import { getConfig } from "@/lib/config-store";

export const runtime = "edge";
export const alt = "Provider Review — tophairloss.io";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let providerName = slug;
  let score = "";
  try {
    const config = await getConfig();
    const review = (config.reviews ?? []).find((r) => r.slug === slug);
    const provider = review
      ? config.providers.find((p) => p.id === review.providerId)
      : null;
    if (provider) providerName = provider.name;
    const { providerOrder, positions } = config.ranking;
    const rankIndex = providerOrder.indexOf(review?.providerId ?? "");
    if (rankIndex >= 0 && positions[rankIndex]) {
      score = String(positions[rankIndex].score);
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
            fontSize: "56px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
            marginBottom: "24px",
          }}
        >
          {providerName} Review 2026
        </div>
        {score && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                fontWeight: 800,
                color: "#FDB515",
              }}
            >
              {score}
            </div>
            <span
              style={{
                fontSize: "24px",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              / 10
            </span>
          </div>
        )}
      </div>
    ),
    { ...size }
  );
}

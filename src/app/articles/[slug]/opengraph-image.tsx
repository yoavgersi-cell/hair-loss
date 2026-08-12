import { ImageResponse } from "next/og";
import { articles } from "@/data/articles";

export const runtime = "edge";
export const alt = "Article — tophairloss.io";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = articles.find((a) => a.slug === slug);

  const title = article?.title ?? "Article";
  const category = article?.category ?? "";

  const categoryColors: Record<string, string> = {
    Science: "#3B82F6",
    Guide: "#10B981",
    Advice: "#F59E0B",
    Wellness: "#8B5CF6",
  };

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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
            }}
          >
            tophairloss.io
          </span>
          {category && (
            <span
              style={{
                fontSize: "16px",
                fontWeight: 600,
                color: "white",
                background: categoryColors[category] || "#6B7280",
                padding: "4px 14px",
                borderRadius: "20px",
              }}
            >
              {category}
            </span>
          )}
        </div>
        <div
          style={{
            fontSize: "52px",
            fontWeight: 800,
            color: "white",
            lineHeight: 1.2,
          }}
        >
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { DisclosureBar } from "@/components/disclosure-bar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { MetaPixel } from "@/components/meta-pixel";
import { GoogleAnalytics } from "@/components/google-analytics";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tophairloss.io"),
  title: {
    default: "Top Hair Loss Providers 2026 — Compare Trusted Treatments Side by Side | tophairloss.io",
    template: "%s | tophairloss.io",
  },
  icons: {
    icon: "/favicon.png",
  },
  description:
    "Compare pricing, treatments, medical support, and overall value across the top hair loss providers of 2026. Find the finasteride, minoxidil, or custom treatment that best fits your needs.",
  keywords: [
    "hair loss treatment",
    "best hair loss providers",
    "finasteride online",
    "minoxidil online",
    "hims vs keeps",
    "telehealth hair loss",
    "compare hair loss providers",
    "hair loss treatment online",
    "men's hair loss treatment",
    "prescription hair loss treatment",
  ],
  openGraph: {
    title: "Top Hair Loss Providers 2026 — Compare Trusted Treatments Side by Side",
    description:
      "Compare pricing, treatments, medical support, and overall value across the top hair loss providers of 2026.",
    type: "website",
    siteName: "tophairloss.io",
    locale: "en_US",
    url: "https://www.tophairloss.io",
  },
  twitter: {
    card: "summary_large_image",
    title: "Top Hair Loss Providers 2026 — Compare Trusted Treatments Side by Side",
    description:
      "Compare pricing, treatments, medical support, and overall value across the top hair loss providers of 2026.",
  },
  other: {
    "geo.region": "US",
    "geo.position": "37.0902;-95.7129",
    "ICBM": "37.0902, -95.7129",
    "content-language": "en-US",
  },
  alternates: {
    canonical: "https://www.tophairloss.io",
    languages: {
      "en-US": "https://www.tophairloss.io",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-US" className={`${geistSans.variable} h-full antialiased`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "tophairloss.io",
              url: "https://www.tophairloss.io",
              areaServed: { "@type": "Country", name: "United States" },
              logo: "https://www.tophairloss.io/favicon.png",
              description: "Compare the top hair loss providers offering finasteride, minoxidil, and custom treatments. Expert reviews, pricing comparisons, and personalized provider matching.",
              sameAs: [],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "tophairloss.io",
              url: "https://www.tophairloss.io",
              description: "Compare trusted hair loss providers side by side",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://www.tophairloss.io/articles?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <MetaPixel />
        <GoogleAnalytics />
        <Analytics />
        <SpeedInsights />
        <DisclosureBar />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

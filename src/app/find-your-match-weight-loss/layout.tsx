import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Weight Loss Provider Match — Free Quiz",
  description:
    "Chat with us to find the best weight loss provider for your goals. Personalized GLP-1 provider recommendations based on your needs.",
  alternates: {
    canonical: "https://www.tophairloss.io/find-your-match-weight-loss",
  },
  openGraph: {
    title: "Find Your Weight Loss Provider Match",
    description:
      "Chat with us and get matched with the best weight loss provider for your goals and budget.",
    url: "https://www.tophairloss.io/find-your-match-weight-loss",
  },
};

export default function ChatQuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

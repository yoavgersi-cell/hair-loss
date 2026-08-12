import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Best Weight Loss Provider Match — Free Quiz",
  description:
    "Answer a few quick questions and get a personalized weight loss provider recommendation. Compare GLP-1 programs based on your goals, budget, and location.",
  alternates: {
    canonical: "https://www.tophairloss.io/find-your-match",
  },
  openGraph: {
    title: "Find Your Best Weight Loss Provider Match",
    description:
      "Take our free quiz and get matched with the best weight loss provider for your goals and budget.",
    url: "https://www.tophairloss.io/find-your-match",
  },
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

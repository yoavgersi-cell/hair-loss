import Image from "next/image";
import { cn } from "@/lib/utils";
import { Stethoscope, Star, Zap } from "lucide-react";

interface HeroSectionProps {
  backgroundImageUrl: string;
  imageAlt: string;
  updatedLabel?: string;
  h1: string;
  h2?: string;
  description?: string;
  overlayOpacity?: number;
  textAlign?: "left" | "center";
  maxTextWidth?: string;
}

export function HeroSection({
  backgroundImageUrl,
  imageAlt,
  updatedLabel,
  h1,
  h2,
  description,
  textAlign = "left",
  maxTextWidth = "640px",
}: HeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#e6f0fa]">
      {/* Desktop image — takes the photo's natural aspect ratio so the whole
          composition shows (no tight crop); capped so it never gets too tall. */}
      <div className="relative hidden w-full sm:block sm:aspect-[1923/818] sm:max-h-[500px]">
        <Image
          src={backgroundImageUrl}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Left scrim keeps the copy legible over the image's blue space */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#e6f0fa] from-12% via-[#e6f0fa]/40 via-45% to-transparent to-68%" />
      </div>

      {/* Content — normal flow on mobile (gives the section height), overlaid
          and vertically centered over the image on desktop. */}
      <div
        className={cn(
          "z-10 mx-auto flex w-full max-w-[1280px] flex-col justify-center px-4 py-8 sm:absolute sm:inset-0 sm:py-0 sm:px-10 lg:px-16",
          textAlign === "center" && "items-center text-center"
        )}
      >
        <div className="max-w-[540px]" style={{ maxWidth: maxTextWidth !== "640px" ? maxTextWidth : undefined }}>
          {updatedLabel && (
            <span className="mb-4 sm:mb-5 inline-flex items-center gap-1.5 text-[13px] text-gray-600">
              <svg className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
              {updatedLabel}
            </span>
          )}

          <h1 className="text-[22px] sm:text-[28px] lg:text-[30px] leading-[1.12] font-extrabold text-[#191919] lg:whitespace-nowrap">
            {h1}
          </h1>

          {h2 && (
            <h2 className="mt-2 hidden sm:block text-[24px] lg:text-[26px] leading-[1.25] font-semibold text-[#3a6ea5] lg:whitespace-nowrap">
              {h2}
            </h2>
          )}

          {description && (
            <p className="mt-3 sm:mt-4 text-[13px] sm:text-[16px] leading-[1.5] sm:leading-[1.6] text-gray-600 max-w-[480px]">
              {description}
            </p>
          )}

          <div className="mt-5 sm:mt-5 flex items-center gap-3 sm:gap-5">
            {[
              { label: "Licensed Providers", icon: Stethoscope },
              { label: "Top-Rated Options", icon: Star },
              { label: "Fast Online Process", icon: Zap },
            ].map(({ label, icon: Icon }) => (
              <span key={label} className="flex items-center gap-1 text-[11px] sm:text-[13px] font-medium text-gray-500 whitespace-nowrap">
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-[#0C4B75]" strokeWidth={1.5} />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

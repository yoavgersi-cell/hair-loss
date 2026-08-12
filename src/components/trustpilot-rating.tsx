// Compact Trustpilot trust signal: the star rating rendered visually (with
// fractional fill, like Trustpilot's own widget) plus the review count and a
// clear "Trustpilot" attribution. Intentionally shows NO numeric score — just
// the stars and the number of reviews.

const TP_GREEN = "#00B67A";

function TrustpilotStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="white" className={className} aria-hidden="true">
      <path d="M12 2l2.6 6.6 7.4.4-5.7 4.6 1.9 7.1L12 16.8l-6.2 3.9 1.9-7.1L2 9l7.4-.4L12 2z" />
    </svg>
  );
}

// Official Trustpilot star mark (green star with dark-green notch) + wordmark
function TrustpilotWordmark({ starClass = "h-[13px] w-[13px]", textClass = "text-[12px]" }: { starClass?: string; textClass?: string }) {
  return (
    <span className="inline-flex items-center gap-1" aria-label="Trustpilot">
      <svg viewBox="0 0 1133 1080" className={starClass} aria-hidden="true">
        <path fill={TP_GREEN} d="M1132.8 412.8H700.2L566.4 0 432.6 412.8 0 412.5l350.1 254.7L216 1080l350.4-254.4L916.8 1080 783 667.2l349.8-254.4z" />
        <path fill="#005128" d="M813.3 760.5 783 667.2 566.4 825.6z" />
      </svg>
      <span className={`${textClass} font-bold tracking-tight text-[#191919]`}>Trustpilot</span>
    </span>
  );
}

// One Trustpilot-style box: green background filled left-to-right by `fill`
// (0–1), gray remainder, white star on top.
function StarBox({ fill, size = 18 }: { fill: number; size?: number }) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(90deg, ${TP_GREEN} ${pct}%, #DCDCE6 ${pct}%)`,
      }}
    >
      <TrustpilotStar className="h-[68%] w-[68%]" />
    </div>
  );
}

function formatCount(count: string): string {
  const digits = count.replace(/[^0-9]/g, "");
  if (!digits) return count;
  return Number(digits).toLocaleString("en-US");
}

export function TrustpilotRating({
  rating,
  reviewCount,
  starSize = 18,
  className = "",
}: {
  rating: string;
  reviewCount?: string;
  starSize?: number;
  className?: string;
}) {
  const value = parseFloat(rating);
  if (isNaN(value)) return null;

  return (
    <div className={`flex flex-wrap items-center gap-x-2 gap-y-1 ${className}`}>
      <div className="flex gap-0.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <StarBox key={i} fill={value - i} size={starSize} />
        ))}
      </div>
      {reviewCount && (
        <span className="text-[12px] text-gray-500">
          <span className="font-semibold text-[#191919]">{formatCount(reviewCount)}</span> reviews on
        </span>
      )}
      <TrustpilotWordmark />
    </div>
  );
}

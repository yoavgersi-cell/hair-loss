import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-[#E5E5E5] bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Footer links grid */}
        <div className="mb-6 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Compare</h4>
            <nav className="space-y-1.5">
              <Link href="/" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Top Providers</Link>
              <Link href="/hims-vs-keeps" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Hims vs Keeps</Link>
              <Link href="/hims-vs-roman" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Hims vs Roman</Link>
              <Link href="/keeps-vs-roman" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Keeps vs Roman</Link>
              <Link href="/hims-vs-happy-head" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Hims vs Happy Head</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Reviews</h4>
            <nav className="space-y-1.5">
              <Link href="/reviews/hims" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Hims</Link>
              <Link href="/reviews/keeps" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Keeps</Link>
              <Link href="/reviews/roman" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Roman</Link>
              <Link href="/reviews/happyhead" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Happy Head</Link>
              <Link href="/reviews/nutrafol" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Nutrafol</Link>
              <Link href="/reviews" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">All Reviews</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Learn</h4>
            <nav className="space-y-1.5">
              <Link href="/articles" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">All Articles</Link>
              <Link href="/find-your-match" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Provider Quiz</Link>
              <Link href="/how-we-rank" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">How We Rank</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Company</h4>
            <nav className="space-y-1.5">
              <Link href="/about" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">About Us</Link>
              <Link href="/disclaimer" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Disclaimer</Link>
            </nav>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <p className="mb-4 text-xs text-gray-400">
            <strong className="text-gray-500">Affiliate Disclosure:</strong> TopHairLoss may earn a commission
            when you click on links and make a purchase. This does not affect our
            rankings or reviews. We are committed to providing honest, independent
            comparisons to help you make informed decisions.
          </p>
          <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
            <p className="text-[12px] text-gray-400">
              &copy; {new Date().getFullYear()} TopHairLoss. All rights reserved.
            </p>
            <p className="text-[11px] text-gray-300">
              tophairloss.io is not a medical provider. Always consult a licensed physician.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

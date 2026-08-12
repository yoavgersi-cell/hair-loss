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
              <Link href="/semaglutide" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Semaglutide</Link>
              <Link href="/tirzepatide" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Tirzepatide</Link>
              <Link href="/ozempic-for-weight-loss" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Ozempic</Link>
              <Link href="/wegovy-providers" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Wegovy</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Browse</h4>
            <nav className="space-y-1.5">
              <Link href="/best-weight-loss-injections" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Weight Loss Injections</Link>
              <Link href="/weight-loss-pills" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Weight Loss Pills</Link>
              <Link href="/best-online-weight-loss-programs" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Online Programs</Link>
              <Link href="/cheapest-weight-loss-medication" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Affordable Options</Link>
              <Link href="/reviews" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">All Reviews</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Learn</h4>
            <nav className="space-y-1.5">
              <Link href="/articles/how-glp1-medications-work" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">How GLP-1 Works</Link>
              <Link href="/articles/semaglutide-side-effects-guide" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Side Effects Guide</Link>
              <Link href="/articles/weight-loss-medication-cost-guide" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Cost Guide</Link>
              <Link href="/glp1-weight-loss-statistics" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">GLP-1 Statistics</Link>
              <Link href="/articles" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">All Articles</Link>
            </nav>
          </div>
          <div>
            <h4 className="mb-2 text-[12px] font-bold uppercase tracking-wider text-[#191919]">Tools</h4>
            <nav className="space-y-1.5">
              <Link href="/find-your-match" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">Provider Quiz</Link>
              <Link href="/how-we-rank" className="block text-[13px] text-gray-500 hover:text-[#0C4B75]">How We Rank</Link>
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

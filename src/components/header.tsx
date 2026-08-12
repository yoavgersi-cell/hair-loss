"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="border-b-2 border-[#D5D5D5] bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="TopHairLoss.io" className="h-[48px] sm:h-[60px] w-auto" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#191919]">
          <Link href="/" className="hover:text-[#0C4B75] transition-colors">
            Compare
          </Link>
          <Link href="/reviews" className="hover:text-[#0C4B75] transition-colors">
            Reviews
          </Link>
          <Link href="/articles" className="hover:text-[#0C4B75] transition-colors">
            Articles
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:hidden text-[#191919]"
        >
          {isOpen ? (
            <X className="h-6 w-6" strokeWidth={1.5} />
          ) : (
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <nav className="sm:hidden border-t border-[#E5E5E5] bg-white px-4 py-3 space-y-3">
          <Link href="/" onClick={() => setIsOpen(false)} className="block text-[15px] font-medium text-[#191919] hover:text-[#0C4B75]">
            Compare
          </Link>
          <Link href="/reviews" onClick={() => setIsOpen(false)} className="block text-[15px] font-medium text-[#191919] hover:text-[#0C4B75]">
            Reviews
          </Link>
          <Link href="/articles" onClick={() => setIsOpen(false)} className="block text-[15px] font-medium text-[#191919] hover:text-[#0C4B75]">
            Articles
          </Link>
        </nav>
      )}
    </header>
  );
}

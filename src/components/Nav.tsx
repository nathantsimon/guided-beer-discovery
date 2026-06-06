"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/explore", label: "Explore" },
  { href: "/about", label: "About" },
];

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-amber-950 border-b border-amber-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-amber-400 text-xl select-none">🍺</span>
            <span className="text-amber-50 font-semibold text-base tracking-tight hidden sm:block">
              Guided Beer Discovery
            </span>
            <span className="text-amber-50 font-semibold text-base tracking-tight sm:hidden">
              GBD
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-7">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  pathname === href
                    ? "text-amber-400"
                    : "text-amber-200 hover:text-amber-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="sm:hidden text-amber-200 hover:text-amber-400 p-2 -mr-2 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="sm:hidden border-t border-amber-900 py-2 flex flex-col">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                className={`px-2 py-3 text-sm font-medium rounded transition-colors ${
                  pathname === href
                    ? "text-amber-400"
                    : "text-amber-200 hover:text-amber-400"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

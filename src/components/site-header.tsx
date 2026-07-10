"use client";

import Link from "next/link";
import { useState } from "react";
import { navLinks } from "./nav-links";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background-raised">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Text-based logo placeholder */}
        <Link
          href="/"
          className="font-display text-2xl uppercase tracking-wide text-text"
          onClick={() => setOpen(false)}
        >
          ThaiSide <span className="text-accent-yellow">Rens</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile menu toggle */}
        <button
          type="button"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text md:hidden"
        >
          <span className="sr-only">Menu</span>
          {/* Simple hamburger / close glyph */}
          <div className="relative h-4 w-5">
            <span
              className={`absolute left-0 top-0 h-0.5 w-5 bg-current transition-transform ${
                open ? "translate-y-[7px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute left-0 top-[7px] h-0.5 w-5 bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute bottom-0 left-0 h-0.5 w-5 bg-current transition-transform ${
                open ? "-translate-y-[7px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile nav panel */}
      {open && (
        <nav className="border-t border-border md:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-text-muted transition-colors hover:text-text"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}

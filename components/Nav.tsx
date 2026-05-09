"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
];

export function Nav() {
  const path = usePathname();
  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-cream/70 bg-cream/90 border-b border-ink/10">
      <div className="px-4 sm:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="font-display text-[1.35rem] sm:text-[1.5rem] uppercase tracking-tight"
        >
          Tom Hunter
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = path === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`px-3 py-1.5 text-xs uppercase tracking-widest rounded-full border transition-colors ${
                  active
                    ? "border-ink bg-ink text-cream"
                    : "border-ink/20 hover:border-ink"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}

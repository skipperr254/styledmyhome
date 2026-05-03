"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Variant = "light" | "dark";

type SiteHeaderProps = {
  variant?: Variant;
};

export function SiteHeader({ variant = "dark" }: SiteHeaderProps) {
  const pathname = usePathname();
  const onLight = variant === "light";
  const textColor = onLight ? "text-ink" : "text-white";
  const hover = onLight ? "hover:text-amber-deep" : "hover:text-amber";
  const logoFilter = onLight
    ? undefined
    : "drop-shadow(0 1px 8px rgba(0,0,0,0.25))";

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    if (!isMenuOpen) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [isMenuOpen]);

  const navLinks: Array<{ label: string; href: string }> = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`relative z-20 ${onLight ? "bg-white border-b border-ink/5" : ""}`}>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 md:px-12 md:py-8">
        {/* Logo → home */}
        <Link href="/" aria-label="Styled My Home — home" className="block shrink-0">
          <Image
            src="/images/styled-my-home-logo.png"
            alt="Styled My Home"
            width={200}
            height={80}
            className="h-16 md:h-20 w-auto"
            style={logoFilter ? { filter: logoFilter } : undefined}
            priority
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <ul className={`flex items-center gap-10 text-[11px] font-medium uppercase tracking-[0.3em] ${textColor}`}>
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`transition ${hover} ${isActive ? (onLight ? "text-amber-deep" : "text-amber") : ""}`}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            href="/get-started"
            className={`btn-amber ${!onLight ? "shadow-[0_2px_12px_rgba(0,0,0,0.2)]" : ""}`}
          >
            Discover your style →
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((v) => !v)}
          className={`md:hidden inline-flex h-10 w-10 items-center justify-center ${onLight ? "text-ink" : "text-white"}`}
        >
          <span className="sr-only">Toggle menu</span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {isMenuOpen ? (
              <>
                <line x1="5" y1="5" x2="19" y2="19" />
                <line x1="19" y1="5" x2="5" y2="19" />
              </>
            ) : (
              <>
                <line x1="3.5" y1="7" x2="20.5" y2="7" />
                <line x1="3.5" y1="12" x2="20.5" y2="12" />
                <line x1="3.5" y1="17" x2="20.5" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute inset-x-0 top-full z-30 border-t border-black/5 bg-white shadow-lg"
        >
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-6 py-4 text-[13px] font-medium uppercase tracking-[0.3em] text-ink">
            {navLinks.map((l) => {
              const isActive = pathname === l.href;
              return (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className={`block py-3 transition hover:text-amber-deep ${isActive ? "text-amber-deep" : ""}`}
                    onClick={closeMenu}
                  >
                    {l.label}
                  </Link>
                </li>
              );
            })}
            <li className="pt-2 pb-1">
              <Link href="/get-started" className="btn-amber w-full justify-center" onClick={closeMenu}>
                Discover your style →
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

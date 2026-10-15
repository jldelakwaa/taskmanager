"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ArrowUpRight, Moon, Sun } from "lucide-react";
import { useMarketingTheme } from "@/components/marketing-theme";

function subscribeToScroll(callback: () => void) {
  window.addEventListener("scroll", callback, { passive: true });
  return () => window.removeEventListener("scroll", callback);
}

export function MarketingHeader() {
  const compact = useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 48,
    () => false,
  );
  const { theme, setTheme } = useMarketingTheme();
  const dark = theme === "dark";

  function toggleTheme() {
    const next = dark ? "light" : "dark";
    setTheme(next);
  }

  return (
    <header className={`marketing-header${compact ? " is-scrolled" : ""}`}>
      <div className="marketing-container marketing-nav">
        <Link
          className="marketing-brand"
          href="/"
          aria-label="Coliconstruct home"
        >
          <Image
            src="/brand/coliconstruct-logo.png"
            alt="Coliconstruct Engineering Services"
            width={2135}
            height={736}
            priority
          />
        </Link>
        <span className="marketing-brand-divider" />
        <span className="marketing-product-name">Task Manager</span>
        <nav aria-label="Main navigation">
          <a href="#features">Features</a>
          <a href="#workflow">How it works</a>
          <a href="#questions">FAQs</a>
        </nav>
        <div className="marketing-header-actions">
          <button
            className="marketing-theme-toggle"
            onClick={toggleTheme}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
            title={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link href="/sign-in" className="marketing-login">
            Sign In <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </header>
  );
}

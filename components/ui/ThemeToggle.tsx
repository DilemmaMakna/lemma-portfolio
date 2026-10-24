"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getTheme, onThemeChange, setTheme, type Theme } from "@/lib/ui/theme";

// Tombol bulat tema gelap/terang. Ikon menunjukkan tema TUJUAN (bulan = ke gelap, matahari = ke terang).
export default function ThemeToggle({ className = "" }: { className?: string }) {
  const { locale } = useLocale();
  const [theme, setState] = useState<Theme>("dark");

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- tema hanya diketahui di klien (skrip boot)
    setState(getTheme());
    return onThemeChange(setState);
  }, []);

  const next: Theme = theme === "dark" ? "light" : "dark";
  const label =
    locale === "id"
      ? next === "light" ? "Ganti ke mode terang" : "Ganti ke mode gelap"
      : next === "light" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      id="theme-toggle"
      onClick={() => setTheme(next)}
      aria-label={label}
      title={label}
      className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors hover:border-accent hover:text-accent after:absolute after:-inset-0.5 after:content-[''] ${className}`}
    >
      {next === "light" ? (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      ) : (
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a8.5 8.5 0 1 0 10.7 10.7Z" />
        </svg>
      )}
    </button>
  );
}

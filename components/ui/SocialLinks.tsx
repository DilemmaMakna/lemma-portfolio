"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { socials, type SocialKey } from "@/lib/content/socials";

const LABEL = { id: "Ikuti kami", en: "Follow us" } as const;

function Icon({ name }: { name: SocialKey }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    className: "h-[45%] w-[45%]",
  };
  switch (name) {
    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
          <path d="M8 10.5V16M8 7.8v.01M11.5 16v-5.5M11.5 13c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5V16" />
        </svg>
      );
    case "threads":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" />
          <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8" />
        </svg>
      );
    case "x":
      return (
        <svg {...common}>
          <path d="M5 4h3.2L19 20h-3.2z" />
          <path d="M18.5 4l-5.7 6.4M5.5 20l5.7-6.4" />
        </svg>
      );
  }
}

type Props = {
  /** Tampilkan teks "Ikuti kami" di atas deretan ikon. */
  label?: boolean;
  /** "md" 44px (CTA), "sm" 36px (footer / area padat). */
  size?: "md" | "sm";
  className?: string;
};

// Deretan ikon media sosial (Instagram, LinkedIn, Threads, X). Akun diatur di lib/content/socials.ts.
export default function SocialLinks({ label = false, size = "md", className = "" }: Props) {
  const { locale } = useLocale();
  const items = socials.filter((s) => s.href);
  if (items.length === 0) return null;

  // sm 36px: area sentuh diperluas 4px per sisi lewat ::after (visual tetap).
  const box = size === "sm" ? "h-9 w-9 after:absolute after:-inset-1 after:content-['']" : "h-11 w-11";

  return (
    <div className={className}>
      {label && <p className="mono mono-2xs mb-3 text-fg-dim !normal-case">{LABEL[locale]}</p>}
      <ul className="flex flex-wrap items-center gap-3">
        {items.map((s) => (
          <li key={s.key}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Lemma — ${s.label}`}
              data-social={s.key}
              className={`relative inline-flex ${box} items-center justify-center rounded-full border border-accent/60 text-accent transition-colors duration-300 hover:border-accent hover:bg-accent hover:text-on-accent`}
            >
              <Icon name={s.key} />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

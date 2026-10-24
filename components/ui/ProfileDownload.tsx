"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { COMPANY_PROFILE } from "@/lib/content/company-profile";

// Tautan eksternal ke Drive (bukan next/link), dibuka di tab baru; target _blank membuat PageTransition tidak mencegatnya.
// "button": tombol ghost seperti Button; "link": teks mono untuk footer.
export default function ProfileDownload({
  id,
  variant = "button",
  className = "",
}: {
  id?: string;
  variant?: "button" | "link";
  className?: string;
}) {
  const { t } = useLocale();
  const label = t.contact.profile;

  if (variant === "link") {
    return (
      <a
        id={id}
        href={COMPANY_PROFILE.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`mono inline-flex items-center gap-2 !normal-case text-sm tracking-[-0.01em] text-fg transition-colors hover:text-accent ${className}`}
      >
        {label}
        <span className="font-mono" aria-hidden="true">
          ↗
        </span>
      </a>
    );
  }

  return (
    <a id={id} href={COMPANY_PROFILE.href} target="_blank" rel="noopener noreferrer" className={`btn btn-ghost ${className}`}>
      {label}
      <span className="arrow" aria-hidden="true">
        ↗
      </span>
    </a>
  );
}

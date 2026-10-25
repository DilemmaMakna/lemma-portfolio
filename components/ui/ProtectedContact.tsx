"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ProtectedContact({
  channel,
  children,
  className,
  id,
  navigate = false,
  query,
  ...linkProps
}: {
  channel: "email" | "business" | "whatsapp" | "nataku";
  children?: ReactNode;
  className?: string;
  id?: string;
  navigate?: boolean;
  query?: { subject: string; body: string };
  target?: string;
  rel?: string;
  "aria-label"?: string;
}) {
  const { locale } = useLocale();
  const [contact, setContact] = useState<{ href: string; label: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const link = useRef<HTMLAnchorElement>(null);
  useEffect(() => {
    if (contact && !navigate) link.current?.focus();
  }, [contact, navigate]);
  const email = channel === "email" || channel === "business";
  const label =
    locale === "id" ? (email ? "Tampilkan email" : "Tampilkan WhatsApp") : email ? "Show email" : "Show WhatsApp";
  const href = contact ? contact.href + (query ? `?${new URLSearchParams(query)}` : "") : "";
  async function reveal() {
    setBusy(true);
    setError(false);
    try {
      const response = await fetch("/api/contact-details", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channel }),
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Contact unavailable");
      const data = (await response.json()) as { href: string; label: string };
      setContact(data);
      if (navigate) window.location.assign(data.href);
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  if (contact)
    return (
      <a ref={link} id={id} className={className} href={href} {...linkProps}>
        {navigate ? children : contact.label} ↗
      </a>
    );
  return (
    <button
      id={id}
      type="button"
      className={className}
      onClick={reveal}
      disabled={busy}
      aria-busy={busy}
      aria-label={linkProps["aria-label"]}
    >
      {busy
        ? locale === "id"
          ? "Memuat…"
          : "Loading…"
        : error
          ? locale === "id"
            ? "Coba lagi"
            : "Try again"
          : (children ?? label)}
    </button>
  );
}

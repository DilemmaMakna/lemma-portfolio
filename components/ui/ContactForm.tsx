"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useLocale } from "@/components/LocaleProvider";

type Status = "idle" | "sending" | "success" | "error";

const FIELD =
  "w-full border-b border-line-strong bg-transparent py-3 text-fg outline-none transition-colors placeholder:text-fg-dim focus:border-accent";

// Form kontak yang dipakai bersama oleh modal (ContactModal) dan halaman /contact.
// `source` ikut terkirim supaya pesan bisa dilacak dari tombol mana ia berasal.
export default function ContactForm({ source, autoFocus = false }: { source: string; autoFocus?: boolean }) {
  const { t, locale } = useLocale();
  const m = t.contactModal;
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");
  const firstField = useRef<HTMLInputElement>(null);
  const mountedAt = useRef(0);

  useEffect(() => {
    mountedAt.current = Date.now();
    if (autoFocus) firstField.current?.focus();
  }, [autoFocus]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const v = (key: string) => String(fd.get(key) ?? "").trim();

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: v("name"),
          email: v("email"),
          company: v("company"),
          message: v("message"),
          website: v("website"), // honeypot, harus kosong
          elapsed: Date.now() - mountedAt.current, // jebakan waktu untuk bot
          source,
          locale,
        }),
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      form.reset();
      setStatus("success");
    } catch (err) {
      console.error("Contact form failed:", err);
      // Cadangan: pesan yang sama disiapkan sebagai email supaya tidak hilang.
      const subject = `[Lemma] ${v("name")}${v("company") ? ` / ${v("company")}` : ""}`;
      const body = `${v("message")}\n\n${v("name")}\n${v("email")}`;
      setMailto(`mailto:${t.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="mt-10 text-fg">
        {m.success}
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
      <label className="flex flex-col gap-1">
        <span className="mono text-xs text-fg-muted">{m.name}</span>
        <input ref={firstField} name="name" required autoComplete="name" maxLength={100} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="mono text-xs text-fg-muted">{m.email}</span>
        <input name="email" type="email" required autoComplete="email" maxLength={200} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="mono text-xs text-fg-muted">{m.company}</span>
        <input name="company" autoComplete="organization" maxLength={150} className={FIELD} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="mono text-xs text-fg-muted">{m.message}</span>
        <textarea name="message" required rows={4} maxLength={2000} className={`${FIELD} resize-none`} />
      </label>

      {/* Honeypot: disembunyikan dari pengguna, diisi hanya oleh bot. */}
      <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

      {status === "error" && (
        <div role="alert" className="flex flex-col gap-2">
          <p className="mono text-sm text-accent">{m.error}</p>
          <a
            href={mailto}
            className="mono !normal-case text-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent"
          >
            {m.fallback} {t.contact.email} ↗
          </a>
        </div>
      )}

      <div>
        <button type="submit" disabled={status === "sending"} className="btn btn-primary">
          {status === "sending" ? m.sending : m.submit}
          <span className="arrow" aria-hidden="true">
            ↗
          </span>
        </button>
      </div>
    </form>
  );
}

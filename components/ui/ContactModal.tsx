"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { getLenis } from "@/lib/lenis";

type Status = "idle" | "sending" | "success" | "error";

type Ctx = {
  open: (source: string) => void;
};

const ContactModalContext = createContext<Ctx | null>(null);

export const useContactModal = () => {
  const c = useContext(ContactModalContext);
  if (!c) throw new Error("useContactModal must be used inside ContactModalProvider");
  return c;
};

const FIELD =
  "w-full border-b border-line-strong bg-transparent py-3 text-fg outline-none transition-colors placeholder:text-fg-dim focus:border-accent";

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const { t, locale } = useLocale();
  const m = t.contactModal;
  const [source, setSource] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("idle");
  const lastFocus = useRef<HTMLElement | null>(null);
  const firstField = useRef<HTMLInputElement>(null);
  const openedAt = useRef(0);
  const [mailto, setMailto] = useState("");
  const isOpen = source !== null;

  const open = useCallback((s: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    openedAt.current = Date.now();
    setStatus("idle");
    setSource(s);
  }, []);

  const close = useCallback(() => setSource(null), []);

  useEffect(() => {
    if (!isOpen) {
      lastFocus.current?.focus();
      return;
    }
    const lenis = getLenis();
    lenis?.stop();
    document.body.style.overflow = lenis ? "" : "hidden";
    firstField.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

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
          elapsed: Date.now() - openedAt.current, // jebakan waktu untuk bot
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

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-[66] flex items-end justify-center bg-bg/80 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            className="max-h-[92svh] w-full max-w-lg overflow-y-auto border border-line-strong bg-bg-raised p-6 sm:rounded-[4px] md:p-8"
          >
            <div className="flex items-start justify-between gap-6">
              <h2 id="contact-modal-title" className="text-[clamp(1.75rem,4vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em]">
                {m.title}
              </h2>
              <button type="button" onClick={close} className="btn btn-ghost !h-10 shrink-0">
                {t.nav.close}
              </button>
            </div>
            <p className="lead mt-4">{m.sub}</p>

            {status === "success" ? (
              <p role="status" className="mt-10 text-fg">
                {m.success}
              </p>
            ) : (
              <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-6">
                <label className="flex flex-col gap-1">
                  <span className="mono text-xs text-fg-dim">{m.name}</span>
                  <input ref={firstField} name="name" required autoComplete="name" maxLength={100} className={FIELD} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="mono text-xs text-fg-dim">{m.email}</span>
                  <input name="email" type="email" required autoComplete="email" maxLength={200} className={FIELD} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="mono text-xs text-fg-dim">{m.company}</span>
                  <input name="company" autoComplete="organization" maxLength={150} className={FIELD} />
                </label>
                <label className="flex flex-col gap-1">
                  <span className="mono text-xs text-fg-dim">{m.message}</span>
                  <textarea name="message" required rows={4} maxLength={2000} className={`${FIELD} resize-none`} />
                </label>

                {/* Honeypot: disembunyikan dari pengguna, diisi hanya oleh bot. */}
                <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

                {status === "error" && (
                  <div role="alert" className="flex flex-col gap-2">
                    <p className="mono text-sm text-accent">{m.error}</p>
                    <a href={mailto} className="mono !normal-case text-sm text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                      {m.fallback} {t.contact.email} ↗
                    </a>
                  </div>
                )}

                <div>
                  <button type="submit" disabled={status === "sending"} className="btn btn-primary">
                    {status === "sending" ? m.sending : m.submit}
                    <span className="arrow" aria-hidden="true">↗</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

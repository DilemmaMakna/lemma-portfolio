"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import ContactForm from "@/components/ui/ContactForm";
import { getLenis } from "@/lib/motion/lenis";

type Ctx = {
  open: (source: string) => void;
};

const ContactModalContext = createContext<Ctx | null>(null);

export const useContactModal = () => {
  const c = useContext(ContactModalContext);
  if (!c) throw new Error("useContactModal must be used inside ContactModalProvider");
  return c;
};

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
  const { t } = useLocale();
  const m = t.contactModal;
  const [source, setSource] = useState<string | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const isOpen = source !== null;

  const open = useCallback((s: string) => {
    lastFocus.current = document.activeElement as HTMLElement | null;
    setSource(s);
  }, []);

  const close = useCallback(() => setSource(null), []);

  useEffect(() => {
    if (!isOpen) {
      lastFocus.current?.focus();
      return;
    }
    const lenis = getLenis();
    const prevOverflow = document.body.style.overflow;
    lenis?.stop();
    if (!lenis) document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
      if (!lenis) document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  const value = useMemo(() => ({ open }), [open]);

  return (
    <ContactModalContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className="fixed inset-0 z-modal flex items-end justify-center bg-bg/80 backdrop-blur-sm sm:items-center sm:p-6"
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
              <h2
                id="contact-modal-title"
                className="text-[clamp(1.75rem,4vw,2.25rem)] font-medium leading-[1.05] tracking-[-0.03em]"
              >
                {m.title}
              </h2>
              <button type="button" onClick={close} className="btn btn-ghost !h-10 shrink-0">
                {t.nav.close}
              </button>
            </div>
            <p className="lead mt-4">{m.sub}</p>

            <ContactForm source={source} autoFocus />
          </div>
        </div>
      )}
    </ContactModalContext.Provider>
  );
}

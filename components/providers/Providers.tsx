"use client";

import { useEffect, useRef } from "react";
import { useLocale } from "./LocaleProvider";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import PageTransition from "@/components/ui/PageTransition";
import { LocaleProvider } from "./LocaleProvider";
import { reducedMotion } from "@/lib/motion/gsap";
import { playIntro } from "@/lib/motion/intro";
import { ContactModalProvider } from "@/components/ui/ContactModal";

function Shell({ children }: { children: React.ReactNode }) {
  const { ready } = useLocale();
  const pre = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    if (!ready || started.current) return;
    started.current = true;
    const root = document.documentElement;
    root.classList.remove("is-booting");
    if (!root.classList.contains("is-loading") || reducedMotion()) {
      root.classList.remove("is-loading");
      if (pre.current) pre.current.style.display = "none";
      return;
    }
    playIntro(pre.current, counter.current);
  }, [ready]);

  return (
    <>
      <div
        ref={pre}
        aria-hidden="true"
        className="preloader fixed inset-0 z-preloader items-center justify-center bg-bg"
      >
        <span
          data-pre-mark
          className="text-2xl font-semibold uppercase tracking-[0.18em]"
        >
          LEMMA
        </span>
        <span
          ref={counter}
          className="mono absolute bottom-6 right-6 text-fg-dim"
        >
          000
        </span>
      </div>
      <div className="grain" aria-hidden="true" />
      <Cursor />
      <PageTransition />
      <div id="page">{children}</div>
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      <SmoothScroll>
        <ContactModalProvider>
          <Shell>{children}</Shell>
        </ContactModalProvider>
      </SmoothScroll>
    </LocaleProvider>
  );
}

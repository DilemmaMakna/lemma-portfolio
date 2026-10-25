"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { gsap, reducedMotion } from "@/lib/motion/gsap";
import { messages, type Locale, type Messages } from "@/lib/content/messages";

type Ctx = {
  locale: Locale;
  t: Messages;
  ready: boolean;
  setLocale: (l: Locale) => void;
};

const LocaleContext = createContext<Ctx | null>(null);

export const useLocale = () => {
  const c = useContext(LocaleContext);
  if (!c) throw new Error("useLocale must be used inside LocaleProvider");
  return c;
};

function apply(l: Locale) {
  const d = document.documentElement;
  d.lang = l;
  d.setAttribute("data-locale", l);
  document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; samesite=lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  // Sebelum paint: baca bahasa yang sudah ditentukan skrip boot di <head>.
  useLayoutEffect(() => {
    const l = (document.documentElement.getAttribute("data-locale") as Locale) || "en";
    // eslint-disable-next-line react-hooks/set-state-in-effect -- locale harus diketahui sebelum paint
    setLocaleState(l);
    setReady(true);
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      if (next === locale) return;
      const swap = () => {
        apply(next);
        setLocaleState(next);
      };
      const page = document.getElementById("page");
      if (!page || reducedMotion()) return swap();
      // fade out 150ms, tukar, fade in 150ms (tanpa blur)
      gsap.to(page, {
        opacity: 0,
        duration: 0.15,
        ease: "power1.out",
        onComplete: () => {
          swap();
          requestAnimationFrame(() =>
            gsap.to(page, { opacity: 1, duration: 0.15, ease: "power1.in", clearProps: "opacity" }),
          );
        },
      });
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, t: messages[locale] as Messages, ready, setLocale }),
    [locale, ready, setLocale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

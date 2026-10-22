"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "@/components/LocaleProvider";
import { gsap, ScrollTrigger, reducedMotion } from "@/lib/gsap";
import { getLenis, scrollToId } from "@/lib/lenis";

const STRIPS = 5;
const SERIF = 'var(--font-serif), "Instrument Serif", Georgia, serif';
const FAILSAFE_MS = 3000;

// Transisi antarhalaman: tirai lima strip naik dari tengah, nama tujuan muncul, lalu tirai
// terangkat sementara elemen hero halaman baru masuk. Memakai satu listener klik global
// (fase capture) sehingga semua <Link>/<a> internal ikut tanpa diubah satu per satu.
export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const { t } = useLocale();
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const pending = useRef<{ hash: string } | null>(null);
  const failsafe = useRef<number | null>(null);
  const labels = useRef<Record<string, string>>({});

  useEffect(() => {
    labels.current = {
      "/": "Lemma",
      "/services": t.nav.services,
      "/about": t.nav.about,
      "/work": t.nav.work,
    };
  }, [t]);

  const el = useCallback((sel: string) => root.current!.querySelectorAll<HTMLElement>(sel), []);

  const reveal = useCallback(() => {
    if (!root.current || !pending.current) return;
    const { hash } = pending.current;
    pending.current = null;
    if (failsafe.current) window.clearTimeout(failsafe.current);

    // Halaman baru mulai dari atas; kunci scroll dari menu mobile dilepas.
    const lenis = getLenis();
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo(0, 0);
    document.body.style.overflow = "";
    if (!document.documentElement.classList.contains("is-loading")) lenis?.start();

    const fades = gsap.utils.toArray<HTMLElement>('[data-intro="fade"], [data-intro="word"]');
    gsap.set(fades, { autoAlpha: 0, y: 28, filter: "blur(14px)" });

    const strips = el("[data-strip]");
    gsap.set(strips, { transformOrigin: "50% 0%" });

    const tl = gsap.timeline({
      defaults: { ease: "expo.inOut" },
      onComplete: () => {
        gsap.set(root.current, { display: "none", pointerEvents: "none" });
        busy.current = false;
        ScrollTrigger.refresh();
        if (hash) requestAnimationFrame(() => scrollToId(hash));
      },
    });
    tl.to(el("[data-word]"), { autoAlpha: 0, y: -24, filter: "blur(14px)", duration: 0.5 }, 0)
      .to(el("[data-line]"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.6 }, 0.05)
      .to(strips, { scaleY: 0, duration: 0.85, stagger: { each: 0.07, from: "edges" } }, 0.2)
      .to(
        fades,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          ease: "expo.out",
          stagger: 0.09,
          clearProps: "filter,transform,opacity,visibility",
        },
        0.75,
      );
  }, [el]);

  // Pathname berubah = halaman baru sudah dirender; tirai boleh diangkat.
  useEffect(() => {
    if (pending.current) reveal();
  }, [pathname, reveal]);

  useEffect(() => {
    if (reducedMotion()) return;

    const cover = (url: URL) => {
      busy.current = true;
      pending.current = { hash: url.hash.slice(1) };

      const word = el("[data-word]");
      word[0].textContent = labels.current[url.pathname] ?? "Lemma";

      const strips = el("[data-strip]");
      gsap.set(root.current, { display: "block", pointerEvents: "auto" });
      gsap.set(strips, { scaleY: 0, transformOrigin: "50% 100%" });
      gsap.set(el("[data-line]"), { scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set(word, { autoAlpha: 0, y: 32, filter: "blur(16px)" });

      gsap
        .timeline({
          defaults: { ease: "expo.inOut" },
          onComplete: () => {
            router.push(url.pathname + url.search + url.hash);
            // Jaring pengaman: kalau navigasi macet, tirai tetap diangkat.
            failsafe.current = window.setTimeout(reveal, FAILSAFE_MS);
          },
        })
        .to(strips, { scaleY: 1, duration: 0.8, stagger: { each: 0.07, from: "center" } }, 0)
        .to(el("[data-line]"), { scaleX: 1, duration: 0.7 }, 0.35)
        .to(
          word,
          { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 0.7, ease: "expo.out" },
          0.5,
        )
        .to({}, { duration: 0.15 });
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return;

      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname) return; // hash / scroll di halaman yang sama

      e.preventDefault();
      e.stopPropagation();
      if (!busy.current) cover(url);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, reveal, el]);

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[68] hidden"
      style={{ display: "none" }}
    >
      <div className="absolute inset-0 flex overflow-hidden">
        {Array.from({ length: STRIPS }).map((_, i) => (
          <i
            key={i}
            data-strip
            className="block h-full border-r border-line bg-bg"
            style={{ flex: "1 0 0", marginRight: -1 }}
          />
        ))}
      </div>
      <i
        data-line
        className="absolute left-0 top-1/2 block h-px w-full bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5">
        <span
          data-word
          className="text-accent"
          style={{
            fontFamily: SERIF,
            fontStyle: "italic",
            fontSize: "clamp(3.5rem, 10vw, 8rem)",
            lineHeight: 1,
            letterSpacing: "-0.03em",
            opacity: 0,
          }}
        />
      </div>
    </div>
  );
}

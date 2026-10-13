import { gsap } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";

// Intro blur: preloader singkat, lalu elemen hero masuk berurutan. Total di bawah 2.5s.
export function playIntro(preloader: HTMLElement | null, counter: HTMLElement | null) {
  const root = document.documentElement;
  const done = () => {
    root.classList.remove("is-loading");
    sessionStorage.setItem("lemma-intro", "1");
    getLenis()?.start();
  };

  const words = gsap.utils.toArray<HTMLElement>('[data-intro="word"]');
  const fades = gsap.utils.toArray<HTMLElement>('[data-intro="fade"]');

  const tl = gsap.timeline({ defaults: { ease: "expo.out" } });
  const mark = preloader?.querySelector<HTMLElement>("[data-pre-mark]");

  if (preloader && mark) {
    gsap.set(mark, { autoAlpha: 0, filter: "blur(24px)" });
    tl.to(mark, { autoAlpha: 1, filter: "blur(0px)", duration: 0.8 }, 0);
    if (counter) {
      const c = { v: 0 };
      tl.to(
        c,
        {
          v: 100,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            counter.textContent = String(Math.round(c.v)).padStart(3, "0");
          },
        },
        0,
      );
    }
    tl.to(preloader, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, 0.85);
    tl.set(preloader, { display: "none" });
  }

  const at = preloader ? 1.0 : 0;
  tl.set([...words, ...fades], { autoAlpha: 0, filter: "blur(20px)", y: 24 }, at - 0.01)
    .add(() => root.classList.remove("is-loading"), at - 0.01)
    .to(words, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.4, stagger: 0.06 }, at)
    .to(fades, { autoAlpha: 1, filter: "blur(0px)", y: 0, duration: 1.0, stagger: 0.1 }, at + 0.5)
    .set([...words, ...fades], { clearProps: "filter,transform,opacity,visibility" })
    .add(done);

  return tl;
}

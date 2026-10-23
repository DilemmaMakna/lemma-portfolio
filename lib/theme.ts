// Tema gelap/terang. Default gelap (identitas brand); pilihan pengunjung disimpan di localStorage
// dan dibaca skrip boot di <head> sebelum paint, jadi tidak ada kedipan tema.
export type Theme = "dark" | "light";
export const THEME_KEY = "lemma-theme";
export const THEME_COLOR: Record<Theme, string> = { dark: "#0a0a0a", light: "#f3f1ec" };

export const getTheme = (): Theme =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";

export function setTheme(next: Theme) {
  const apply = () => {
    document.documentElement.dataset.theme = next;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[next]);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {}
  };
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "startViewTransition" in document) document.startViewTransition(apply);
  else apply();
}

/** Panggil `cb` setiap tema berubah (untuk canvas yang membaca warna dari CSS). */
export function onThemeChange(cb: (t: Theme) => void) {
  const mo = new MutationObserver(() => cb(getTheme()));
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

/** Nilai CSS custom property dari :root, mis. cssVar("--dot"). */
export const cssVar = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

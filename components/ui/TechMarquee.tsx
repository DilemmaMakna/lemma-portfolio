import type { TechItem } from "@/lib/content/tech-stack";
import TechTile from "./TechTile";

// Baris logo yang bergeser pelan tanpa henti. Daftar digandakan dan digeser -50% supaya putarannya mulus;
// salinan kedua aria-hidden. Ujung kiri/kanan larut lewat mask, jadi tidak ada logo yang terpotong tajam.
// Animasi (.lm-marquee-track) berhenti saat hover dan untuk reduced motion (lihat globals.css).
const EDGE =
  "linear-gradient(to right, transparent 0%, rgba(0,0,0,.25) 6%, rgba(0,0,0,.7) 12%, #000 20%, #000 80%, rgba(0,0,0,.7) 88%, rgba(0,0,0,.25) 94%, transparent 100%)";

export default function TechMarquee({
  items,
  duration = 60,
  reverse = false,
  label,
  size = "md",
}: {
  items: readonly TechItem[];
  duration?: number;
  reverse?: boolean;
  label: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="lm-marquee overflow-hidden py-1"
      style={{ maskImage: EDGE, WebkitMaskImage: EDGE }}
    >
      <div
        className={`lm-marquee-track${reverse ? " is-reverse" : ""}`}
        style={{ ["--lm-marquee-dur" as string]: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-3 pr-3" aria-hidden={copy === 1 ? "true" : undefined}>
            {items.map((it) => (
              <TechTile key={`${copy}-${it.name}`} item={it} size={size} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

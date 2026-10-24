import type { TechItem } from "@/lib/content/tech-stack";

// Satu tile logo, selaras dengan kartu situs (Products/Services): datar, sudut --radius-sm, garis tipis, tanpa gradien
// atau bayangan. Ikon satu warna dari token teks (aman di tema terang/gelap); hover seperti kartu: garis dan latar naik
// satu tingkat, ikon memakai aksen.
export default function TechTile({ item, size = "md" }: { item: TechItem; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-11 w-11" : "h-14 w-14";
  const icon = size === "sm" ? "h-5 w-5" : "h-6 w-6";
  return (
    <span
      role="img"
      aria-label={item.name}
      title={item.name}
      className={`flex shrink-0 items-center justify-center rounded-[4px] border border-line bg-surface text-fg-dim transition-colors duration-300 hover:border-line-strong hover:bg-surface-2 hover:text-accent ${box}`}
    >
      {item.kind === "icon" ? (
        <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={icon}>
          <path d={item.path} />
        </svg>
      ) : (
        <span aria-hidden="true" className="mono !text-[0.8125rem] !font-medium !tracking-[0.02em] !normal-case">
          {item.text}
        </span>
      )}
    </span>
  );
}

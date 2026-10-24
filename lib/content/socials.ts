// Satu-satunya tempat akun media sosial Lemma. Dipakai oleh components/ui/SocialLinks.tsx dan JSON-LD (lib/seo/site.ts).
// Entri dengan href kosong ("") otomatis tidak ditampilkan. X dikosongkan sampai akunnya ada.
export type SocialKey = "instagram" | "linkedin" | "threads" | "x";

export const socials: { key: SocialKey; label: string; href: string }[] = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/lemma.bercerita/" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/lemma-bercerita/" },
  { key: "threads", label: "Threads", href: "https://www.threads.com/@lemma.bercerita" },
  { key: "x", label: "X", href: "" },
];

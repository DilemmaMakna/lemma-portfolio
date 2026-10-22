// Satu-satunya tempat akun media sosial Lemma. Dipakai oleh components/ui/SocialLinks.tsx.
// TODO: ganti `href` dengan akun resmi. Nilai di bawah hanya contoh berdasarkan domain
// lemma.studio, belum diverifikasi. Entri dengan href kosong ("") otomatis tidak ditampilkan.
export type SocialKey = "instagram" | "linkedin" | "threads" | "x";

export const socials: { key: SocialKey; label: string; href: string }[] = [
  { key: "instagram", label: "Instagram", href: "https://www.instagram.com/lemma.studio" },
  { key: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/company/lemma-studio" },
  { key: "threads", label: "Threads", href: "https://www.threads.net/@lemma.studio" },
  { key: "x", label: "X", href: "https://x.com/lemma_studio" },
];

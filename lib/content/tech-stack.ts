// Tumpukan teknologi dan alat yang ditampilkan sebagai tile ber-logo (beranda: marquee, /services: per bidang).
// Fokus pada yang paling dibutuhkan saat ini: BE+FE, data+AI, UX+HCI, plus alat desain dan motion Adobe.
import { ICON_PATHS } from "./tech-icons";

export type TechItem =
  | { name: string; kind: "icon"; path: string }
  | { name: string; kind: "badge"; text: string };

// Logo Adobe tidak ada di simple-icons; badge teks dua huruf sesuai kebiasaan ikon aplikasinya.
const BADGES: Record<string, { name: string; text: string }> = {
  ps: { name: "Adobe Photoshop", text: "Ps" },
  ai: { name: "Adobe Illustrator", text: "Ai" },
  ae: { name: "Adobe After Effects", text: "Ae" },
  pr: { name: "Adobe Premiere Pro", text: "Pr" },
};

export function tech(keys: readonly string[]): TechItem[] {
  return keys.map((k) => {
    const b = BADGES[k];
    if (b) return { name: b.name, kind: "badge", text: b.text };
    const i = ICON_PATHS[k];
    if (!i) throw new Error(`tech-stack: ikon "${k}" tidak ada di tech-icons.ts`);
    return { name: i.title, kind: "icon", path: i.path };
  });
}

// Tiga baris marquee di beranda.
export const STACK_ROWS = {
  engineering: tech(["react", "nextdotjs", "typescript", "tailwindcss", "nodedotjs", "nestjs", "django", "fastapi", "laravel", "go", "postgresql", "mongodb", "redis", "supabase", "docker", "flutter"]),
  data: tech(["python", "pytorch", "tensorflow", "huggingface", "anthropic", "langchain", "ollama", "pandas", "scikitlearn", "jupyter", "apachespark", "mlflow", "streamlit", "opencv", "metabase", "googleanalytics"]),
  design: tech(["figma", "framer", "miro", "notion", "maze", "hotjar", "storybook", "lottiefiles", "blender", "sketch", "ps", "ai", "ae", "pr"]),
} as const;

// Satu baris per langkah di section Process (urut): struktur -> desain/UX; tujuan -> data & AI; selesai -> uji, dokumentasi, serah-terima.
// Langkah 3 (pengujian, dokumentasi, serah-terima): alat uji, dokumentasi, lalu repositori dan rilis. Bukan stack engineering umum.
const HANDOVER = tech(["jest", "vitest", "cypress", "testinglibrary", "pytest", "postman", "k6", "storybook", "swagger", "docusaurus", "gitbook", "markdown", "notion", "github", "gitlab", "githubactions", "docker", "vercel"]);

export const PROCESS_STACK = [STACK_ROWS.design, STACK_ROWS.data, HANDOVER] as const;

// Alat per layanan di /services, indeks mengikuti `index` di lib/content/services.ts.
export const SERVICE_STACK: Record<string, TechItem[]> = {
  "01": tech(["ai", "ps", "ae", "pr", "figma", "framer", "blender", "lottiefiles"]),
  "02": tech(["figma", "framer", "miro", "maze", "hotjar", "storybook", "notion"]),
  "03": tech(["react", "nextdotjs", "typescript", "tailwindcss", "nodedotjs", "postgresql", "docker", "flutter"]),
  "04": tech(["python", "pytorch", "tensorflow", "huggingface", "pandas", "anthropic", "langchain", "mlflow"]),
  "05": tech(["notion", "miro", "jira", "linear", "airtable", "n8n", "zapier", "googleanalytics"]),
};

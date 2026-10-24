import { llmsFull } from "@/lib/seo/llms";

// /llms-full.txt: seluruh isi situs dalam satu dokumen teks, dibangun dari data situs (lib/seo/llms.ts).
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=86400" },
  });
}

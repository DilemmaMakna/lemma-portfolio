import { llmsFull } from "@/lib/llms";

// /index.md: versi Markdown lengkap situs (isi sama dengan /llms-full.txt), dibangun dari data situs.
export function GET() {
  return new Response(llmsFull(), {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=86400" },
  });
}

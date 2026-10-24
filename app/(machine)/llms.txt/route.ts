import { llmsTxt } from "@/lib/seo/llms";

// /llms.txt: ringkasan + tautan untuk AI/crawler, dibangun dari data situs (lib/seo/llms.ts).
export function GET() {
  return new Response(llmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=0, s-maxage=86400" },
  });
}

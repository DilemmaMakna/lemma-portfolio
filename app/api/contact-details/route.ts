import { NextResponse } from "next/server";

// These values stay in the server route, never in a client import or static HTML.
const channels = {
  email: { label: "hello@dilemma-makna.com", href: "mailto:hello@dilemma-makna.com" },
  business: { label: "marketing@dilemma-makna.com", href: "mailto:marketing@dilemma-makna.com" },
  whatsapp: { label: "+62 (851) 4492 2167", href: "https://wa.me/6285144922167" },
  nataku: {
    label: "+62 813-8360-0844",
    href: `https://wa.me/6281383600844?text=${encodeURIComponent("Halo, aku mau coba Nataku!")}`,
  },
} as const;
const hits = new Map<string, { count: number; until: number }>();
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow" };
const reply = (body: unknown, status = 200) => NextResponse.json(body, { status, headers });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    if (!origin || new URL(origin).host !== host) return reply({ error: "Forbidden" }, 403);
  } catch {
    return reply({ error: "Forbidden" }, 403);
  }
  if (request.headers.get("sec-fetch-site") === "cross-site") return reply({ error: "Forbidden" }, 403);
  if (!request.headers.get("content-type")?.includes("application/json"))
    return reply({ error: "Unsupported media type" }, 415);
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const hit = hits.get(ip);
  if (hit && hit.until > now && hit.count >= 12) return reply({ error: "Try again later" }, 429);
  if (!hit || hit.until <= now) {
    if (hits.size >= 5000) hits.delete(hits.keys().next().value!);
    hits.set(ip, { count: 1, until: now + 60_000 });
  } else hit.count++;
  try {
    const raw = await request.text();
    if (raw.length > 128) return reply({ error: "Invalid request" }, 413);
    const body: unknown = JSON.parse(raw);
    const channel = body && typeof body === "object" && "channel" in body ? body.channel : null;
    if (typeof channel !== "string" || !Object.hasOwn(channels, channel))
      return reply({ error: "Invalid channel" }, 400);
    return reply(channels[channel as keyof typeof channels]);
  } catch {
    return reply({ error: "Invalid request" }, 400);
  }
}

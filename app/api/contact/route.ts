import { NextResponse } from "next/server";

// Form kontak -> webhook (CONTACT_WEBHOOK_URL, mis. Make/Zapier/n8n/Formspree yang meneruskan ke email).
// Lapisan perlindungan, semuanya tanpa dependensi tambahan:
// 1. Hanya JSON dari origin situs sendiri, ukuran body dibatasi.
// 2. Honeypot + jebakan waktu (bot mengisi form dalam < MIN_FILL_MS) dibalas "ok" palsu.
// 3. Rate limit per IP (best effort: per instance serverless, cukup untuk meredam spam beruntun).
// 4. Validasi dan pembersihan isi; URL webhook tidak pernah dikirim ke klien.
// Bila webhook belum diatur, balas 503 + fallback "email" supaya klien menawarkan mailto, bukan
// membuang pesan.
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, company: 150, message: 2000, source: 60 } as const;
const MAX_BODY = 10_000; // byte
const MIN_FILL_MS = 2500;
const RATE = { limit: 5, windowMs: 10 * 60_000 };

const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // jangan sampai memori tumbuh tanpa batas
  return recent.length > RATE.limit;
}

// Buang karakter kontrol (kecuali baris baru di pesan) dan rapikan spasi.
const clean = (v: unknown, multiline = false) =>
  typeof v === "string"
    ? v.replace(multiline ? /[\u0000-\u0009\u000B-\u001F\u007F]/g : /[\u0000-\u001F\u007F]/g, "").trim()
    : "";

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

const fail = (status: number, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, ...extra }, { status });

export async function POST(request: Request) {
  if (!sameOrigin(request)) return fail(403);
  if (!request.headers.get("content-type")?.includes("application/json")) return fail(415);
  if (Number(request.headers.get("content-length") ?? 0) > MAX_BODY) return fail(413);

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return fail(429);

  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY) return fail(413);
    body = JSON.parse(raw);
  } catch {
    return fail(400);
  }

  // Honeypot terisi atau form diisi terlalu cepat berarti bot. Pura-pura berhasil.
  const elapsed = Number(body.elapsed);
  if (clean(body.website) || !Number.isFinite(elapsed) || elapsed < MIN_FILL_MS) {
    return NextResponse.json({ ok: true });
  }

  const data = {
    name: clean(body.name),
    email: clean(body.email),
    company: clean(body.company),
    message: clean(body.message, true),
  };

  const invalid =
    !data.name ||
    !data.message ||
    !EMAIL.test(data.email) ||
    data.name.length > MAX.name ||
    data.email.length > MAX.email ||
    data.company.length > MAX.company ||
    data.message.length > MAX.message;
  if (invalid) return fail(400);

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    console.error("CONTACT_WEBHOOK_URL is not set; offering email fallback.");
    return fail(503, { fallback: "email" });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: clean(body.source).slice(0, MAX.source),
        locale: clean(body.locale) === "en" ? "en" : "id",
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("Forwarding contact message failed:", err instanceof Error ? err.message : err);
    return fail(502, { fallback: "email" });
  }

  return NextResponse.json({ ok: true });
}

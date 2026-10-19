import { NextResponse } from "next/server";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX = { name: 100, email: 200, company: 150, message: 2000 } as const;

type Body = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  message?: unknown;
  website?: unknown;
  source?: unknown;
  locale?: unknown;
};

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // Honeypot terisi berarti bot. Pura-pura berhasil tanpa meneruskan apa pun.
  if (text(body.website)) return NextResponse.json({ ok: true });

  const data = {
    name: text(body.name),
    email: text(body.email),
    company: text(body.company),
    message: text(body.message),
  };

  const invalid =
    !data.name ||
    !data.message ||
    !EMAIL.test(data.email) ||
    data.name.length > MAX.name ||
    data.email.length > MAX.email ||
    data.company.length > MAX.company ||
    data.message.length > MAX.message;
  if (invalid) return NextResponse.json({ ok: false }, { status: 400 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    // Tanpa tujuan, pesan tidak boleh diam-diam hilang. Balas gagal.
    console.error("CONTACT_WEBHOOK_URL is not set; contact message was not forwarded.");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...data,
        source: text(body.source),
        locale: text(body.locale),
        submittedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
  } catch (err) {
    console.error("Forwarding contact message failed:", err);
    return NextResponse.json({ ok: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}

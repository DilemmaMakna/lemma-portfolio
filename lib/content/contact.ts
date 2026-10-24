// Copy halaman /contact. Bahasa Indonesia adalah sumber; versi en mengikuti strukturnya.
// Label form dan pesan status memakai t.contactModal (lib/content/messages.ts) supaya modal dan halaman seragam.
import type { Locale } from "@/lib/content/messages";

const id = {
  meta: {
    title: "Kontak | Lemma",
    description: "Ceritakan masalahmu ke Lemma lewat form, email, atau WhatsApp. Kami bertanya dulu sebelum menjawab.",
  },
  hero: {
    eyebrow: "08 / KONTAK",
    title: "Apa yang ingin kamu buktikan?",
    lead: "Ceritakan masalahnya, meski belum berbentuk. Kami membaca setiap pesan dan membalas dengan pertanyaan sebelum jawaban.",
  },
  form: { label: "Kirim pesan", sub: "Isi singkat saja. Kami balas setelah membacanya." },
  channels: {
    label: "Langsung",
    email: "Email",
    business: "Kemitraan & media",
    whatsapp: "WhatsApp",
    studio: "Studio",
    studioValue: "Jakarta, Indonesia",
  },
  next: {
    label: "Setelah kamu kirim",
    steps: [
      { title: "Kami membaca.", body: "Pesanmu dibaca tim, bukan dijawab otomatis." },
      { title: "Percakapan singkat.", body: "Kami bertanya sampai bentuk masalahnya jelas." },
      { title: "Lingkup tertulis.", body: "Lingkup, jadwal, dan harga dalam satu dokumen sebelum kerja dimulai." },
    ],
  },
};

export type ContactCopy = typeof id;

const en: ContactCopy = {
  meta: {
    title: "Contact | Lemma",
    description: "Tell Lemma about your problem by form, email, or WhatsApp. We ask before we answer.",
  },
  hero: {
    eyebrow: "08 / CONTACT",
    title: "What do you want to prove?",
    lead: "Tell us the problem, even if it has no shape yet. We read every message and reply with questions before answers.",
  },
  form: { label: "Send a message", sub: "Keep it short. We reply after reading it." },
  channels: {
    label: "Direct",
    email: "Email",
    business: "Partnerships & press",
    whatsapp: "WhatsApp",
    studio: "Studio",
    studioValue: "Jakarta, Indonesia",
  },
  next: {
    label: "After you send",
    steps: [
      { title: "We read it.", body: "Your message is read by the team, not auto-answered." },
      { title: "A short conversation.", body: "We ask until the shape of the problem is clear." },
      { title: "A written scope.", body: "Scope, timeline, and price in one document before work begins." },
    ],
  },
};

export const contactMessages: Record<Locale, ContactCopy> = { id, en };

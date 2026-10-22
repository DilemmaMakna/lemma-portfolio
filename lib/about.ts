// Copy halaman /about. Bahasa Indonesia adalah sumber; versi en mengikuti strukturnya.
import type { Locale } from "@/lib/messages";

const id = {
  hero: {
    eyebrow: "06 / TENTANG KAMI",
    title: "Siapa kami, dan kenapa itu penting.",
    lead: "Lemma adalah venture studio di Jakarta. Kami mengerjakan proyek klien dan membangun produk sendiri, dalam satu tim.",
    primary: "Mulai proyek",
    secondary: "Lihat layanan",
    // Kartu definisi di sisi kanan hero.
    term: "lemma",
    pron: "/ˈlem.ma/",
    kind: "n. matematika",
    definition: "Pembuktian kecil yang dikerjakan lebih dulu agar teorema besar bisa berdiri.",
  },
  who: {
    label: "01 / Siapa Kami",
    body: "Kami bekerja di persimpangan desain, teknologi, dan sistem. Bukan agensi yang selesai saat brief selesai, bukan startup yang berlomba burn rate. Klien datang dengan sesuatu yang belum berbentuk, dan kami ikut memegangnya sampai berdiri.",
    stats: { years: "tahun berjalan", projects: "proyek", products: "produk aktif" },
  },
  beliefs: {
    label: "02 / Yang Kami Yakini",
    items: [
      { title: "Tahu tujuannya dulu.", body: "Sebelum membahas caranya, kami pastikan dulu untuk apa sesuatu dibuat. Setelah itu, keputusan lain jadi jauh lebih mudah." },
      { title: "Fondasi rapi, eksperimen berani.", body: "Kalau dasarnya kuat, mencoba hal baru tidak lagi terasa seperti berjudi." },
      { title: "Hal kecil itu penting.", body: "Setiap detail ada karena punya fungsi, bukan sekadar pemanis." },
    ],
  },
  model: {
    label: "03 / Cara Kami Bekerja",
    items: [
      {
        title: "Proyek klien",
        body: "Brand, produk digital, dan sistem untuk organisasi dan bisnis. Ini menjadi sumber pendapatan sekaligus tempat kami menguji metode.",
        action: "Mulai proyek klien",
      },
      {
        title: "Produk sendiri",
        body: "NATA dan produk lain lahir dari riset, lalu kami bangun dari sisi teknologi, sistem, dan desain. Pelajarannya kembali ke proyek klien.",
        action: "Lihat produk",
      },
    ],
    // Roda yang berputar: proyek klien membiayai riset, riset melahirkan produk, produk mengajari proyek klien.
    flow: {
      nodes: ["Proyek klien", "Lemma", "Produk sendiri"],
      edges: ["pendapatan & konteks", "riset & sistem", "pelajaran kembali"],
    },
  },
  name: {
    label: "04 / Soal Nama",
    body: "Dalam matematika, lemma dibuktikan lebih dulu agar teorema besar bisa berdiri. Kami ingin menjadi bagian kecil itu untuk pesan yang kamu bawa.",
    steps: [
      { tag: "Lemma.", text: "Kami adalah bagian kecil yang dibuktikan lebih dulu." },
      { tag: "Teorema.", text: "Pesan yang kamu bawa berdiri utuh." },
      { tag: "Bukti.", text: "Riset, struktur, lalu bentuk." },
    ],
  },
  cta: {
    title: "Ada masalah yang layak dipecahkan?",
    sub: "Mulai dari satu pertanyaan: apa yang ingin kamu buktikan?",
    button: "Mulai proyek",
    secondary: "Lihat layanan",
    or: "atau email langsung",
  },
};

export type AboutCopy = typeof id;

const en: AboutCopy = {
  hero: {
    eyebrow: "06 / ABOUT US",
    title: "Who we are, and why it matters.",
    lead: "Lemma is a Jakarta venture studio. We do client work and build our own products, in one team.",
    primary: "Start a project",
    secondary: "See services",
    term: "lemma",
    pron: "/ˈlem.ma/",
    kind: "n. mathematics",
    definition: "A small proof, done first, so a larger theorem can stand.",
  },
  who: {
    label: "01 / Who We Are",
    body: "We work where design, technology, and systems meet. Not an agency that stops when the brief does, not a startup racing its burn rate. Clients arrive with something unshaped, and we stay with it until it stands.",
    stats: { years: "years running", projects: "projects", products: "active products" },
  },
  beliefs: {
    label: "02 / What We Believe",
    items: [
      { title: "Know the why first.", body: "Before we talk about how, we make sure we know what it is for. Every other decision gets easier after that." },
      { title: "Solid ground, bold moves.", body: "When the foundation is strong, trying something new stops feeling like a gamble." },
      { title: "Small things matter.", body: "Every detail is there because it does a job, not just to look nice." },
    ],
  },
  model: {
    label: "03 / How We Work",
    items: [
      {
        title: "Client projects",
        body: "Brands, digital products, and systems for organisations and businesses. They fund the studio and test our methods.",
        action: "Start a client project",
      },
      {
        title: "Our own products",
        body: "NATA and others start from research, then we build the technology, systems, and design. What we learn flows back into client work.",
        action: "See products",
      },
    ],
    flow: {
      nodes: ["Client projects", "Lemma", "Our products"],
      edges: ["revenue & context", "research & systems", "lessons back"],
    },
  },
  name: {
    label: "04 / About the Name",
    body: "In mathematics, a lemma is proved first so the larger theorem can stand. We aim to be that small part for the message you carry.",
    steps: [
      { tag: "Lemma.", text: "We are the small part, proved first." },
      { tag: "Theorem.", text: "The message you carry stands whole." },
      { tag: "Proof.", text: "Research, structure, then form." },
    ],
  },
  cta: {
    title: "Got a problem worth solving?",
    sub: "Start with one question: what do you want to prove?",
    button: "Start a project",
    secondary: "See services",
    or: "or email directly",
  },
};

export const aboutMessages: Record<Locale, AboutCopy> = { id, en };

// Copy halaman /services. Bahasa Indonesia adalah sumber; versi en mengikuti strukturnya.
import type { Locale } from "@/lib/content/messages";

const id = {
  hero: {
    eyebrow: "03 / LAYANAN",
    line1: "Empat disiplin,",
    line2: "satu",
    line3: "arah.",
    accent: 2,
    lead: "Kami mengerjakan bagian yang tak terlihat: riset, struktur, dan sistem. Supaya yang terlihat bisa berdiri.",
  },
  intro: {
    label: "01 / Pendekatan",
    body: "UX, HCI, data, dan teknologi jarang bekerja bersama. Di Lemma, keempatnya dirancang dalam satu alur, supaya hasilnya bermakna bagi orang yang memakainya, bukan hanya rapi di presentasi.",
    // Frasa di dalam body yang ditampilkan dengan serif italic (urutan: guide, seleksi).
    accent: ["satu alur", "bermakna"],
    // Frasa di dalam body yang ditampilkan dengan font mono bertema technical token.
    mono: ["UX, HCI, data,"],
  },
  services: [
    {
      index: "01",
      name: "Brand & Visual Identity",
      summary: "Identitas yang tahan diuji argumen.",
      body: "Kami tidak mulai dari referensi visual. Kami mulai dari pertanyaan: apa filosofi di balik bentuk dan warna ini? Dari sana logo, palet, dan tipografi dibangun dengan alasan yang bisa dipertahankan, dan bisa dijalankan oleh tim non-desain tanpa kehilangan kualitas.",
      deliverables: [
        "Sistem logo (horizontal, vertikal, monogram)",
        "Brand guideline book digital",
        "Palet warna, tipografi, dan aturan penggunaan",
        "Template untuk kebutuhan internal tim",
        "Dokumentasi Figma dengan design system",
      ],
      fit: "Cocok untuk organisasi, startup, dan institusi yang butuh identitas konsisten lintas media.",
    },
    {
      index: "02",
      name: "UX, HCI & Product Design",
      summary: "Dari riset perilaku pengguna sampai design system.",
      body: "Kami meneliti cara orang benar-benar memakai sesuatu, lalu merancang alur, arsitektur informasi, dan antarmuka yang menjawabnya. Hasilnya dokumen dan komponen yang bisa diteruskan tim kamu.",
      deliverables: [
        "Riset pengguna dan usability testing",
        "Arsitektur informasi dan alur pengguna",
        "UI kit dan design system",
        "Prototipe interaktif",
      ],
      fit: "Cocok untuk produk digital yang masih mencari bentuk, atau laporan dan platform yang ingin benar-benar dipakai.",
    },
    {
      index: "03",
      name: "Engineering & Technology",
      summary: "Sistem yang andal saat dipakai banyak pihak.",
      body: "Kami membangun web app, platform SaaS, dan sistem operasional dengan arsitektur yang dirancang untuk beban dan peran pengguna yang beragam. Setiap komponen diuji dan didokumentasikan sebelum diserahkan.",
      deliverables: [
        "Web app dan platform SaaS",
        "Dashboard, portal mitra, dan alur persetujuan",
        "Integrasi data dan otomasi proses",
        "Dokumentasi teknis untuk serah terima",
      ],
      fit: "Cocok untuk organisasi dengan banyak unit atau mitra yang harus bekerja dalam satu sistem.",
    },
    {
      index: "04",
      name: "AI & Data",
      summary: "AI yang bisa menjelaskan jawabannya.",
      body: "Kami membangun sistem rekomendasi, pipeline RAG, dan analitik dengan prinsip explainability sejak awal. Setiap keluaran bisa ditelusuri alasannya dan dievaluasi dengan metrik yang jelas.",
      deliverables: [
        "Recommender system dan chatbot berbasis RAG",
        "Evaluasi model dan metrik kualitas",
        "Dashboard analitik",
        "Dokumentasi arsitektur dan evaluasi",
      ],
      fit: "Cocok untuk institusi yang ingin AI yang dapat dipertanggungjawabkan, bukan kotak hitam.",
    },
    {
      index: "05",
      name: "Strategy & Systems",
      summary: "Kerangka untuk ide yang masih intuisi.",
      body: "Saat brief masih berupa intuisi, kami membantu merumuskan masalah, tujuan, dan ukuran keberhasilan. Dari situ disusun arsitektur informasi, OKR, dan dokumentasi operasional yang bisa langsung dipakai.",
      deliverables: [
        "Perumusan masalah dan tujuan",
        "Arsitektur informasi dan peta sistem",
        "OKR dan dokumentasi operasional",
      ],
      fit: "Cocok untuk tim yang tahu ada yang harus dibangun, tapi belum tahu bentuknya.",
    },
  ],
  labels: { deliverables: "Yang kamu terima", fit: "Cocok untuk", stack: "Alat yang kami pakai" },
  engagement: {
    label: "02 / Cara Bekerja Sama",
    title: "Mulai dari pertanyaan, bukan dari paket.",
    body: "Setiap proyek disusun dari kebutuhan yang sebenarnya. Kami mulai dengan percakapan singkat, merumuskan lingkup, lalu mengirim penawaran tertulis sebelum pekerjaan dimulai.",
    steps: [
      { title: "Percakapan", body: "Ceritakan masalahmu. Kami bertanya sampai bentuknya jelas." },
      { title: "Lingkup & penawaran", body: "Kami rumuskan ruang lingkup, durasi, dan harga dalam satu dokumen." },
      { title: "Pengerjaan", body: "Struktur dulu, visual kemudian. Kamu melihat progres di tiap tahap." },
      { title: "Serah terima", body: "Semua diuji dan didokumentasikan, supaya timmu bisa jalan sendiri." },
    ],
  },
  cta: {
    title: "Ada masalah yang layak dipecahkan?",
    sub: "Mulai dari satu pertanyaan: apa yang ingin kamu buktikan?",
    button: "Mulai proyek",
    pick: "Atau pilih yang paling dekat:",
  },
};

export type ServicesCopy = typeof id;

const en: ServicesCopy = {
  hero: {
    eyebrow: "03 / SERVICES",
    line1: "Four disciplines,",
    line2: "one",
    line3: "direction.",
    accent: 2,
    lead: "We work on the parts you can't see: research, structure, and systems. So that what you can see can stand.",
  },
  intro: {
    label: "01 / Approach",
    body: "UX, HCI, data, and technology rarely work together. At Lemma, all four are designed as one flow, so the result is meaningful to the people who use it, not just tidy in a presentation.",
    accent: ["one flow", "meaningful"],
    mono: ["UX, HCI, data,"],
  },
  services: [
    {
      index: "01",
      name: "Brand & Visual Identity",
      summary: "An identity that survives an argument.",
      body: "We don't start from visual references. We start from a question: what is the philosophy behind this shape and colour? From there the logo, palette, and typography are built on reasons you can defend, and a non-design team can run them without losing quality.",
      deliverables: [
        "Logo system (horizontal, vertical, monogram)",
        "Digital brand guideline book",
        "Colour palette, typography, and usage rules",
        "Templates for your team's internal needs",
        "Figma documentation with a design system",
      ],
      fit: "For organisations, startups, and institutions that need a consistent identity across media.",
    },
    {
      index: "02",
      name: "UX, HCI & Product Design",
      summary: "From user-behaviour research to design systems.",
      body: "We study how people actually use things, then design the flows, information architecture, and interfaces that answer it. The result is documents and components your team can carry forward.",
      deliverables: [
        "User research and usability testing",
        "Information architecture and user flows",
        "UI kit and design system",
        "Interactive prototypes",
      ],
      fit: "For digital products still finding their shape, or reports and platforms that want to actually be used.",
    },
    {
      index: "03",
      name: "Engineering & Technology",
      summary: "Systems that hold up when many parties use them.",
      body: "We build web apps, SaaS platforms, and operational systems with an architecture designed for load and a range of user roles. Every component is tested and documented before handover.",
      deliverables: [
        "Web apps and SaaS platforms",
        "Dashboards, partner portals, and approval flows",
        "Data integration and process automation",
        "Technical documentation for handover",
      ],
      fit: "For organisations with many units or partners that have to work in a single system.",
    },
    {
      index: "04",
      name: "AI & Data",
      summary: "AI that can explain its answers.",
      body: "We build recommender systems, RAG pipelines, and analytics with explainability from the start. Every output can be traced to its reasons and evaluated against clear metrics.",
      deliverables: [
        "Recommender systems and RAG-based chatbots",
        "Model evaluation and quality metrics",
        "Analytics dashboards",
        "Architecture and evaluation documentation",
      ],
      fit: "For institutions that want AI they can be accountable for, not a black box.",
    },
    {
      index: "05",
      name: "Strategy & Systems",
      summary: "A framework for an idea that is still intuition.",
      body: "When the brief is still an intuition, we help define the problem, the goal, and the measure of success. From there we draft the information architecture, OKRs, and operational documentation you can use right away.",
      deliverables: [
        "Problem and goal definition",
        "Information architecture and system map",
        "OKRs and operational documentation",
      ],
      fit: "For teams who know something has to be built, but not yet what shape it takes.",
    },
  ],
  labels: { deliverables: "What you receive", fit: "Best for", stack: "Tools we use" },
  engagement: {
    label: "02 / How We Work Together",
    title: "Start from a question, not a package.",
    body: "Every project is shaped by what you actually need. We start with a short conversation, define the scope, then send a written proposal before any work begins.",
    steps: [
      { title: "Conversation", body: "Tell us the problem. We keep asking until its shape is clear." },
      { title: "Scope & proposal", body: "We set the scope, timeline, and price in a single document." },
      { title: "Build", body: "Structure first, visuals after. You see progress at every stage." },
      { title: "Handover", body: "Everything is tested and documented, so your team can run on its own." },
    ],
  },
  cta: {
    title: "A problem worth solving?",
    sub: "Start with one question: what do you want to prove?",
    button: "Start a project",
    pick: "Or pick the closest fit:",
  },
};

export const servicesMessages: Record<Locale, ServicesCopy> = { id, en };

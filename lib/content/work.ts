// Copy dan data halaman /work. Sumber kebenaran proyek: .copyw/lemma_project_index.md.
// Field proyek mengikuti skema indeks ({ id, en } per field); copy halaman mengikuti pola Record<Locale, ...>.
import type { Locale } from "@/lib/content/messages";
import { workPhotos, type WorkPhoto } from "@/lib/work-photos";

type L = { id: string; en: string };

export type Category =
  | "Brand & Visual Identity"
  | "UX, HCI & Product Design"
  | "Engineering & Technology"
  | "AI & Data"
  | "Strategy & Systems";

export const CATEGORIES: Category[] = [
  "Brand & Visual Identity",
  "UX, HCI & Product Design",
  "Engineering & Technology",
  "AI & Data",
  "Strategy & Systems",
];

// Studi kasus ditulis sebagai pembuktian: Diketahui -> Pendekatan -> Bukti -> Maka.
type Story = {
  given: L;
  approach: L[];
  proof: { title: L; body: L }[];
  result: L;
};

export type Project = {
  n: string;
  slug: string;
  name: string;
  client: L;
  type: "client" | "internal-product" | "internal-asset";
  category: Category;
  secondary?: Category[];
  tags: string[];
  year: string;
  status: "delivered" | "active" | "stealth";
  visibility: "public" | "limited" | "hidden";
  featured: boolean;
  role: L;
  hook: L;
  summary: L;
  links?: { label: string; href: string }[];
  story?: Story;
  photos: WorkPhoto[];
};

const raw: Omit<Project, "photos" | "n">[] = [
  {
    slug: "lpj-ormawa-ipb-2025",
    name: "LPJ Ormawa IPB 2025",
    client: { id: "Direktorat Kemahasiswaan IPB University", en: "Directorate of Student Affairs, IPB University" },
    type: "client",
    category: "UX, HCI & Product Design",
    secondary: ["Engineering & Technology"],
    tags: ["Data Storytelling", "Report Design", "Interactive Website", "Design System"],
    year: "2025",
    status: "delivered",
    visibility: "public",
    featured: true,
    role: { id: "Desain laporan, visualisasi data, pembangunan web", en: "Report design, data visualisation, web build" },
    hook: { id: "Laporan yang dibaca karena isinya.", en: "A report read for its content." },
    summary: {
      id: "Laporan pertanggungjawaban yang disusun ulang sebagai narasi berbasis data, dengan website interaktif publik dan sistem desain yang konsisten lintas bab dan organisasi.",
      en: "An accountability report rebuilt as a data-driven narrative, with a public interactive website and one consistent design system across chapters and organisations.",
    },
    story: {
      given: {
        id: "Laporan pertanggungjawaban biasanya tebal, dicetak, lalu disimpan. Datanya ada, tapi tidak ada yang membacanya sampai selesai.",
        en: "Accountability reports are usually thick, printed, then shelved. The data is there, but nobody reads it to the end.",
      },
      approach: [
        {
          id: "Kami memperlakukan laporan sebagai cerita. Data ratusan ormawa disusun menjadi lima bab dengan alur yang jelas, dari lanskap, aksi dan capaian, kolaborasi, refleksi kinerja, sampai program unggulan.",
          en: "We treated the report as a story. Data from hundreds of student organisations became five chapters with a clear arc: landscape, actions and outcomes, collaboration, performance review, and flagship programmes.",
        },
        {
          id: "Satu sistem desain menyatukan ilustrasi, grafik, dan tipografi, sehingga laporan cetak dan website interaktif terasa sebagai satu karya.",
          en: "One design system ties illustration, charts, and typography together, so the printed report and the interactive website read as one piece.",
        },
      ],
      proof: [
        { title: { id: "184 ormawa dipetakan", en: "184 organisations mapped" }, body: { id: "Tipologi ormawa per klaster, lengkap dengan pergeseran trennya.", en: "Organisation typology by cluster, with how the trend shifted." } },
        { title: { id: "701.983 peserta", en: "701,983 participants" }, body: { id: "Capaian program divisualkan, bukan ditabelkan.", en: "Programme outcomes visualised, not tabulated." } },
        { title: { id: "94,6% realisasi", en: "94.6% realisation" }, body: { id: "Angka realisasi program kerja dibuat terbaca dalam sekali lihat.", en: "Work-plan realisation made readable at a glance." } },
        { title: { id: "Website interaktif", en: "Interactive website" }, body: { id: "Versi publik yang bisa dijelajahi per bab dan per organisasi.", en: "A public version you can explore by chapter and organisation." } },
      ],
      result: {
        id: "Laporan yang biasanya hanya diarsipkan kini dibaca, dibagikan, dan dipakai sebagai rujukan.",
        en: "A report that used to be archived is now read, shared, and used as a reference.",
      },
    },
  },
  {
    slug: "gumatika",
    name: "Gumatika, IPB University",
    client: { id: "Gumatika, IPB University", en: "Gumatika, IPB University" },
    type: "client",
    category: "Brand & Visual Identity",
    tags: ["Logo System", "Philosophy-Driven Design", "Brand Identity"],
    year: "2024/25",
    status: "delivered",
    visibility: "public",
    featured: true,
    role: { id: "Identitas visual", en: "Visual identity" },
    hook: { id: "Logo yang bisa dipertahankan dengan argumen.", en: "A logo you can defend with reasoning." },
    summary: {
      id: "Tiga konsep logo dengan landasan matematis yang eksplisit, berangkat dari satu kondisi awal yang sama.",
      en: "Three logo concepts, each with an explicit mathematical rationale, starting from one shared initial condition.",
    },
    story: {
      given: {
        id: "Himpunan mahasiswa matematika membutuhkan logo. Audiensnya terbiasa menuntut bukti, jadi \"terlihat bagus\" saja tidak cukup.",
        en: "A mathematics student association needed a logo. Its audience is used to demanding proof, so \"looks good\" was never going to be enough.",
      },
      approach: [
        {
          id: "Kami menetapkan satu kondisi awal yang sama, lalu menurunkan tiga konsep darinya. Setiap konsep punya alasan matematis yang bisa dijelaskan, bukan sekadar ditempelkan.",
          en: "We set one shared initial condition, then derived three concepts from it. Each one has a mathematical rationale that can be explained, not just attached.",
        },
      ],
      proof: [
        { title: { id: "Satu kondisi awal", en: "One initial condition" }, body: { id: "Ketiga konsep berangkat dari titik yang sama, sehingga bisa dibandingkan dengan adil.", en: "All three concepts start from the same point, so they can be compared fairly." } },
        { title: { id: "Tiga turunan", en: "Three derivations" }, body: { id: "Setiap konsep disertai penalaran yang eksplisit.", en: "Each concept comes with explicit reasoning." } },
      ],
      result: {
        id: "Logo yang dipilih bukan karena selera, tapi karena argumennya paling kuat.",
        en: "The logo was chosen not by taste, but because its argument held up best.",
      },
    },
  },
  {
    slug: "jalansiswa",
    name: "JalanSiswa",
    client: { id: "JalanSiswa (inisiatif ed-tech)", en: "JalanSiswa (ed-tech initiative)" },
    type: "client",
    category: "Brand & Visual Identity",
    tags: ["Startup Branding", "Ed-Tech", "Brand Guideline"],
    year: "2025",
    status: "delivered",
    visibility: "public",
    featured: true,
    role: { id: "Logo dan brand guideline", en: "Logo and brand guideline" },
    hook: { id: "Arah sejak langkah pertama.", en: "Direction from the first step." },
    summary: {
      id: "Logomark dan fondasi brand untuk startup ed-tech baru, dirancang adaptif di berbagai konteks digital dan siap tumbuh bersama produk.",
      en: "A logomark and brand foundation for a new ed-tech startup, built to adapt across digital contexts and grow with the product.",
    },
    story: {
      given: {
        id: "Startup yang baru lahir butuh identitas yang langsung bisa dipakai: di ikon aplikasi, kartu nama, sampai layar presentasi, tanpa harus didesain ulang setiap kali.",
        en: "A newborn startup needed an identity it could use right away: on an app icon, a business card, a presentation screen, without redesigning it each time.",
      },
      approach: [
        {
          id: "Logomark dibangun dari dua bentuk yang saling mengunci menjadi arah maju, sederhana untuk ukuran kecil dan tetap kuat di ukuran besar.",
          en: "The logomark is built from two interlocking shapes that read as forward motion: simple at small sizes, still strong at large ones.",
        },
        {
          id: "Warna dirumuskan sebagai gradien hangat yang punya makna, lalu diuji di permukaan gelap dan terang.",
          en: "Colour was defined as a warm gradient with meaning behind it, then tested on dark and light surfaces.",
        },
      ],
      proof: [
        { title: { id: "Dusk Flame & Deep Sunset", en: "Dusk Flame & Deep Sunset" }, body: { id: "Dua gradien utama: semangat belajar dan proses tumbuh yang pelan.", en: "Two primary gradients: the spark of learning and the slow process of growing." } },
        { title: { id: "Ikon aplikasi", en: "App icon" }, body: { id: "Logomark tetap terbaca di ukuran ikon dan lencana notifikasi.", en: "The mark stays legible at icon size and with a notification badge." } },
        { title: { id: "Mockup terapan", en: "Applied mockups" }, body: { id: "Kartu nama, signage, dan layar presentasi untuk menguji konsistensi.", en: "Business cards, signage, and presentation screens to test consistency." } },
      ],
      result: {
        id: "Fondasi brand yang siap dipakai hari ini dan cukup lentur untuk tumbuh bersama produknya.",
        en: "A brand foundation ready to use today and flexible enough to grow with the product.",
      },
    },
  },
  {
    slug: "bem-fahutan-langkah-bermakna",
    name: "BEM FAHUTAN IPB, Kabinet Langkah Bermakna",
    client: { id: "BEM Fakultas Kehutanan, IPB University", en: "BEM Faculty of Forestry, IPB University" },
    type: "client",
    category: "Brand & Visual Identity",
    secondary: ["UX, HCI & Product Design"],
    tags: ["Brand Identity", "Brand Guideline", "Design System", "Figma"],
    year: "2025",
    status: "delivered",
    visibility: "public",
    featured: false,
    role: { id: "Logo, guideline, dan design system", en: "Logo, guideline, and design system" },
    hook: { id: "Satu kepengurusan, satu identitas yang konsisten.", en: "One term, one consistent identity." },
    summary: {
      id: "Sistem identitas visual yang dapat dipakai banyak pengurus non-desainer tanpa merusak konsistensi, lengkap dengan template dan dokumentasi Figma.",
      en: "A visual identity system that many non-designers can use without breaking consistency, with templates and Figma documentation.",
    },
    story: {
      given: {
        id: "Dalam satu kepengurusan, puluhan orang membuat materi visual. Sebagian besar bukan desainer, jadi identitas mudah pecah dari satu unggahan ke unggahan berikutnya.",
        en: "In a single term, dozens of people produce visual material. Most are not designers, so the identity easily breaks from one post to the next.",
      },
      approach: [
        {
          id: "Logo dirancang sebagai combination mark: logomark yang dinamis dan logotype yang tegas. Setiap warna diberi makna agar mudah diingat dan dipakai dengan benar.",
          en: "The logo is a combination mark: a dynamic logomark with a firm logotype. Each colour carries a meaning so it is easy to remember and use correctly.",
        },
        {
          id: "Aturan dibuat sesederhana mungkin dan ditaruh langsung di Figma, supaya pengurus memakai template, bukan menebak.",
          en: "The rules were kept as simple as possible and placed directly in Figma, so the team works from templates instead of guessing.",
        },
      ],
      proof: [
        { title: { id: "Grid 9 × 9", en: "9 × 9 grid" }, body: { id: "Logomark disusun di grid rasio 1:1 agar presisi di semua ukuran.", en: "The mark is built on a 1:1 grid so it stays precise at every size." } },
        { title: { id: "Hijau, Jingga, Merah", en: "Green, Orange, Red" }, body: { id: "Pertumbuhan, antusiasme, dan tekad, tiga warna dengan makna yang jelas.", en: "Growth, enthusiasm, and resolve: three colours with clear meanings." } },
        { title: { id: "Clearspace & varian", en: "Clearspace & variants" }, body: { id: "Full color, neutral, horizontal, dan vertikal, lengkap dengan ruang aman.", en: "Full colour, neutral, horizontal, and vertical versions, all with safe space." } },
        { title: { id: "Template Figma", en: "Figma templates" }, body: { id: "Pengurus non-desainer bisa langsung memakai tanpa merusak konsistensi.", en: "Non-designers can use them right away without breaking consistency." } },
      ],
      result: {
        id: "Identitas yang bertahan sepanjang kepengurusan, siapa pun yang membuat materinya.",
        en: "An identity that holds for the whole term, whoever makes the material.",
      },
    },
  },
  {
    slug: "himpro-hksa-serenata",
    name: "Himpro HKSA SKHB IPB, Kabinet Serenata",
    client: { id: "Himpro HKSA SKHB, IPB University", en: "Himpro HKSA SKHB, IPB University" },
    type: "client",
    category: "Brand & Visual Identity",
    tags: ["Brand Identity", "Brand Guideline", "Illustration", "Supergraphics"],
    year: "2025",
    status: "delivered",
    visibility: "public",
    featured: false,
    role: { id: "Logo, guideline, dan ilustrasi pendukung", en: "Logo, guideline, and supporting illustration" },
    hook: { id: "Harmoni yang terlihat.", en: "Harmony, made visible." },
    summary: {
      id: "Identitas organik dan hangat yang berangkat dari makna harmoni, lengkap dengan guideline book, dokumentasi warna dan tipografi, serta grafis pendukung.",
      en: "An organic, warm identity built around the idea of harmony, with a full guideline book, colour and type documentation, and supporting graphics.",
    },
    story: {
      given: {
        id: "Kabinet Serenata ingin identitas yang terasa hangat dan profesional sekaligus, untuk himpunan mahasiswa kedokteran hewan.",
        en: "Kabinet Serenata wanted an identity that felt warm and professional at once, for a veterinary student association.",
      },
      approach: [
        {
          id: "Setiap elemen logo punya peran. Ular membentuk huruf S untuk Serenata dan melambangkan fleksibilitas, batang menjadi pondasi, daun menjadi kebermanfaatan, dan dua titik menggambarkan arah strategis dan aksi nyata yang saling melengkapi.",
          en: "Every element of the logo has a role. The snake forms the S of Serenata and stands for flexibility, the staff is the foundation, the leaves are usefulness, and two dots stand for strategy and action completing each other.",
        },
        {
          id: "Dari logo itu lahir supergrafis dan ilustrasi, sehingga identitas bisa diperluas tanpa kehilangan bentuk dasarnya.",
          en: "Supergraphics and illustration grew out of the logo, so the identity can extend without losing its core form.",
        },
      ],
      proof: [
        { title: { id: "Simbolisme yang terukur", en: "Measured symbolism" }, body: { id: "Ular, batang, daun, dan dua titik, masing-masing dengan alasan.", en: "Snake, staff, leaves, and two dots, each with a reason." } },
        { title: { id: "Deep Red & Deep Brown", en: "Deep Red & Deep Brown" }, body: { id: "Warna utama yang hangat dan mapan, ditopang enam warna sekunder.", en: "Warm, grounded primaries, backed by six secondary colours." } },
        { title: { id: "Beatique Display + Manjari", en: "Beatique Display + Manjari" }, body: { id: "Serif yang elegan untuk judul, sans yang ramah untuk isi.", en: "An elegant serif for titles, a friendly sans for body text." } },
      ],
      result: {
        id: "Identitas yang terasa seperti namanya: banyak unsur, satu harmoni.",
        en: "An identity that feels like its name: many parts, one harmony.",
      },
    },
  },
  {
    slug: "nata",
    name: "NATA",
    client: { id: "Internal (B2C)", en: "Internal (B2C)" },
    type: "internal-product",
    category: "UX, HCI & Product Design",
    secondary: ["Engineering & Technology"],
    tags: ["EdTech", "Student Productivity", "Indonesia"],
    year: "2026",
    status: "active",
    visibility: "public",
    featured: false,
    role: { id: "Co-founder, teknologi, sistem, dan desain", en: "Co-founder, technology, systems, and design" },
    hook: { id: "Lima aplikasi untuk satu kehidupan kampus? Satu saja cukup.", en: "Five apps for one campus life? One is enough." },
    summary: {
      id: "Satu platform untuk manajemen prioritas mahasiswa, sinkronisasi tugas organisasi, dan navigasi kehidupan kampus.",
      en: "A single platform for student priority management, organisation task sync, and campus life navigation.",
    },
    story: {
      given: {
        id: "Mahasiswa aktif hidup di lima aplikasi sekaligus: kalender, catatan, to-do, grup chat, dan pengingat. Tugas tercatat di mana-mana, tapi tetap ketinggalan.",
        en: "Active students live in five apps at once: calendar, notes, to-do, group chat, and reminders. Tasks are written down everywhere, yet still slip.",
      },
      approach: [
        {
          id: "Kami merangkum semuanya menjadi satu angka: skor produktivitas mingguan dari task, habit, dan agenda. Satu angka lebih mudah dipahami daripada lima daftar.",
          en: "We folded everything into one number: a weekly productivity score from tasks, habits, and agenda. One number is easier to read than five lists.",
        },
        {
          id: "Setiap hari dimulai dari satu pertanyaan, \"fokus hari ini apa?\", lalu aplikasi membantu menjawabnya.",
          en: "Each day starts with one question, \"what is today's focus?\", and the app helps answer it.",
        },
      ],
      proof: [
        { title: { id: "Skor mingguan", en: "Weekly score" }, body: { id: "Task, habit, dan agenda menjadi satu skor yang gampang dipahami.", en: "Tasks, habits, and agenda become one easy-to-read score." } },
        { title: { id: "Fokus hari ini", en: "Today's focus" }, body: { id: "Rekomendasi tugas yang paling perlu dikerjakan sekarang.", en: "Recommends the tasks that most need doing now." } },
        { title: { id: "Kalender & Gantt", en: "Calendar & Gantt" }, body: { id: "Tampilan bulan, minggu, dan Gantt untuk agenda kampus dan organisasi.", en: "Month, week, and Gantt views for campus and organisation agendas." } },
        { title: { id: "Onboarding yang ramah", en: "Friendly onboarding" }, body: { id: "Ilustrasi dan bahasa yang akrab, dari langkah pertama sampai konfirmasi.", en: "Illustration and familiar language, from the first step to confirmation." } },
      ],
      result: {
        id: "Satu aplikasi yang menggantikan lima, sekarang sedang dalam pengembangan aktif.",
        en: "One app that replaces five, now in active development.",
      },
    },
  },
  {
    slug: "arah-ai",
    name: "████ ██████",
    client: { id: "Internal (B2B SaaS)", en: "Internal (B2B SaaS)" },
    type: "internal-product",
    category: "AI & Data",
    secondary: ["UX, HCI & Product Design"],
    tags: ["Recommender System", "RAG", "Talent Mapping", "Explainability", "Research"],
    year: "2025/26",
    status: "stealth",
    visibility: "limited",
    featured: false,
    role: { id: "Riset, AI engineering, pengembangan produk", en: "Research, AI engineering, product development" },
    hook: { id: "Pengembangan mahasiswa berbantuan AI.", en: "AI-assisted student development." },
    summary: {
      id: "Riset dan validasi masih berjalan. Detail akan dibuka saat siap.",
      en: "Research and validation are ongoing. Details will open when it is ready.",
    },
  },
  {
    slug: "lemma-web",
    name: "Lemma Website",
    client: { id: "Internal", en: "Internal" },
    type: "internal-asset",
    category: "UX, HCI & Product Design",
    secondary: ["Engineering & Technology"],
    tags: ["Next.js", "Bilingual ID/EN", "Design System", "Generative Hero"],
    year: "2026",
    status: "active",
    visibility: "public",
    featured: false,
    role: { id: "Desain dan engineering", en: "Design and engineering" },
    hook: { id: "Kerja sebelum karya.", en: "The work before the work." },
    summary: {
      id: "Website studio sendiri yang dirancang sebagai argumen: tipografi editorial, grid ketat, dan hero peta kontur yang menggambarkan masalah belum berbentuk yang perlahan terdefinisi.",
      en: "The studio's own site, built as an argument: editorial typography, a strict grid, and a contour-map hero showing an undefined problem taking shape.",
    },
    story: {
      given: {
        id: "Studio yang menjual \"kerja sebelum karya\" harus menunjukkannya di websitenya sendiri, bukan hanya mengatakannya.",
        en: "A studio that sells \"the work before the work\" has to show it on its own site, not just say it.",
      },
      approach: [
        {
          id: "Setiap keputusan visual punya alasan: grid 12 kolom yang ketat, skala tipografi yang terbatas, dan motif matematika yang muncul berulang sebagai benang merah.",
          en: "Every visual decision has a reason: a strict 12-column grid, a limited type scale, and a mathematical motif that recurs as the common thread.",
        },
      ],
      proof: [
        { title: { id: "Dwibahasa ID/EN", en: "Bilingual ID/EN" }, body: { id: "Bahasa Indonesia sebagai sumber, Inggris mengikuti strukturnya.", en: "Indonesian is the source; English mirrors its structure." } },
        { title: { id: "Hero generatif", en: "Generative hero" }, body: { id: "Peta kontur dan animasi ASCII yang menggambarkan masalah yang perlahan berbentuk.", en: "Contour maps and ASCII animation showing a problem slowly taking shape." } },
        { title: { id: "Design system", en: "Design system" }, body: { id: "Token warna, skala tipe, dan aturan gerak yang dipakai di semua halaman.", en: "Colour tokens, a type scale, and motion rules shared across every page." } },
      ],
      result: {
        id: "Halaman yang kamu baca sekarang adalah buktinya.",
        en: "The page you are reading is the proof.",
      },
    },
  },
  {
    slug: "nata-launch-campaign",
    name: "Nataku Beta Launch",
    client: { id: "Internal, untuk NATA", en: "Internal, for NATA" },
    type: "internal-asset",
    category: "Brand & Visual Identity",
    secondary: ["Strategy & Systems"],
    tags: ["Social Media", "Campaign", "Illustration", "Mascot", "Copywriting"],
    year: "2026",
    status: "active",
    visibility: "public",
    featured: false,
    role: { id: "Konsep kampanye, copywriting, dan ilustrasi", en: "Campaign concept, copywriting, and illustration" },
    hook: { id: "Peluncuran yang mengajak ngobrol, bukan beriklan.", en: "A launch that talks, not advertises." },
    summary: {
      id: "Kampanye media sosial untuk beta testing Nataku, aplikasi dari NATA. Sepuluh unggahan yang berangkat dari masalah sehari-hari mahasiswa, dengan maskot, ilustrasi, dan nada bicara yang akrab.",
      en: "A social media campaign for the Nataku beta, the app from NATA. Ten posts that start from everyday student problems, with a mascot, illustration, and a familiar tone of voice.",
    },
    story: {
      given: {
        id: "Aplikasi baru harus merebut perhatian di linimasa yang penuh. Mahasiswa sudah lelah dengan iklan aplikasi produktivitas yang semuanya terdengar sama.",
        en: "A new app has to win attention in a crowded feed. Students are tired of productivity app ads that all sound the same.",
      },
      approach: [
        {
          id: "Setiap unggahan dimulai dari hal yang relate, misalnya \"dicatet sih, tapi ketimbun\", baru kemudian Nataku muncul sebagai jawaban. Masalah dulu, produk belakangan.",
          en: "Every post starts from something relatable, like \"I wrote it down, then it got buried\", and only then does Nataku show up as the answer. Problem first, product second.",
        },
        {
          id: "Seorang maskot merah dan bahasa sehari-hari membuat kampanye terasa seperti teman yang mengingatkan, bukan brand yang berjualan.",
          en: "A red mascot and everyday language make the campaign feel like a friend reminding you, not a brand selling to you.",
        },
      ],
      proof: [
        { title: { id: "Sepuluh unggahan berseri", en: "Ten-post series" }, body: { id: "Dari teaser \"Finally...\" sampai pengumuman rilis dan integrasi WhatsApp.", en: "From the \"Finally...\" teaser to the release announcement and WhatsApp integration." } },
        { title: { id: "Maskot & ilustrasi", en: "Mascot & illustration" }, body: { id: "Satu karakter yang menemani seluruh seri dan mudah dikenali.", en: "One character that carries the whole series and is easy to recognise." } },
        { title: { id: "Ajakan beta testing", en: "Beta testing call" }, body: { id: "Pendaftaran beta dibingkai sebagai kesempatan ikut menentukan arah produk.", en: "Beta sign-up framed as a chance to help shape the product." } },
      ],
      result: {
        id: "Kampanye yang membuat orang mendaftar karena merasa dipahami, bukan karena dibujuk.",
        en: "A campaign that gets people to sign up because they feel understood, not persuaded.",
      },
    },
  },
];

// Nomor tampil berurutan mengikuti daftar di atas.
export const projects: Project[] = raw.map((p, i) => ({
  ...p,
  n: String(i + 1).padStart(2, "0"),
  photos: workPhotos[p.slug] ?? [],
}));

// Angka studio untuk section Tentang (beranda dan /about), dihitung dari daftar proyek supaya
// selalu sinkron: tahun sejak proyek pertama, jumlah proyek, dan produk sendiri (internal-product).
export function studioStats(labels: { years: string; projects: string; products: string }) {
  // Tanpa new Date(): halaman di-prerender (cacheComponents), jadi rentang tahun diambil dari data.
  // "2025/26" dihitung sebagai 2025 untuk awal dan 2026 untuk akhir.
  const start = (y: string) => parseInt(y, 10);
  const end = (y: string) => (y.includes("/") ? Math.floor(start(y) / 100) * 100 + parseInt(y.split("/")[1], 10) : start(y));
  const first = Math.min(...projects.map((p) => start(p.year)));
  const last = Math.max(...projects.map((p) => end(p.year)));
  const years = Math.max(1, last - first);
  return [
    { value: `${years}+`, label: labels.years },
    { value: String(projects.length), label: labels.projects },
    { value: String(projects.filter((p) => p.type === "internal-product").length), label: labels.products },
  ];
}

// Proyek yang bisa dibuka detailnya (stealth hanya tampil sebagai tile tersensor).
export const isOpenable = (p: Project) => p.status !== "stealth";

const id = {
  meta: {
    title: "Karya | Lemma",
    description: "Proyek klien dan produk sendiri dari Lemma: identitas visual, produk digital, sistem, dan data.",
  },
  hero: {
    eyebrow: "07 / KARYA",
    title: "Bukti, bukan klaim.",
    lead: "Setiap proyek di sini adalah lemma kecil: masalah yang dibuktikan dulu, baru diberi bentuk.",
    count: "proyek",
    hint: "Arahkan kursor untuk berhenti. Klik untuk membuka.",
  },
  filters: { all: "Semua" },
  index: {
    label: "Indeks",
    cols: { n: "#", name: "Proyek", category: "Kategori", year: "Tahun", status: "Status" },
  },
  status: { delivered: "Selesai", active: "Aktif", stealth: "Stealth" },
  tile: { noPhoto: "Dokumentasi menyusul", stealth: "Disensor sampai siap", open: "Buka" },
  detail: {
    close: "Tutup",
    prev: "Sebelumnya",
    next: "Berikutnya",
    of: "dari",
    client: "Klien",
    role: "Peran",
    year: "Tahun",
    category: "Kategori",
    status: "Status",
    tags: "Tag",
    outline: "Kerangka bukti",
    progress: "Terbaca",
    sections: { given: "Diketahui", approach: "Pendekatan", proof: "Bukti", result: "Maka" },
    qed: "Terbukti.",
    cta: "Punya masalah serupa?",
    ctaButton: "Mulai proyek",
  },
};

export type WorkCopy = typeof id;

const en: WorkCopy = {
  meta: {
    title: "Work | Lemma",
    description: "Client projects and our own products from Lemma: visual identity, digital products, systems, and data.",
  },
  hero: {
    eyebrow: "07 / WORK",
    title: "Proof, not claims.",
    lead: "Every project here is a small lemma: a problem proven first, then given form.",
    count: "projects",
    hint: "Hover to pause. Click to open.",
  },
  filters: { all: "All" },
  index: {
    label: "Index",
    cols: { n: "#", name: "Project", category: "Category", year: "Year", status: "Status" },
  },
  status: { delivered: "Delivered", active: "Active", stealth: "Stealth" },
  tile: { noPhoto: "Documentation coming", stealth: "Redacted until ready", open: "Open" },
  detail: {
    close: "Close",
    prev: "Previous",
    next: "Next",
    of: "of",
    client: "Client",
    role: "Role",
    year: "Year",
    category: "Category",
    status: "Status",
    tags: "Tags",
    outline: "Proof outline",
    progress: "Read",
    sections: { given: "Given", approach: "Approach", proof: "Proof", result: "Therefore" },
    qed: "Q.E.D.",
    cta: "Got a similar problem?",
    ctaButton: "Start a project",
  },
};

export const workMessages: Record<Locale, WorkCopy> = { id, en };

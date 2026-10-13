// Sumber teks tunggal: lemma_home_copywriting.md. Jangan menulis ulang copy di komponen.
export type Locale = "id" | "en";

export const messages = {
  id: {
    meta: {
      title: "Lemma: Studio Venture yang membangun Makna",
      description:
        "Lemma menggabungkan UX, HCI, data, dan teknologi untuk brand, produk digital, dan sistem yang bermakna. Berbasis di Jakarta.",
    },
    nav: {
      work: "Karya",
      about: "Tentang Kami",
      services: "Layanan",
      products: "Produk",
      contact: "Kontak",
      cta: "Mulai proyek",
      menu: "Menu",
      close: "Tutup",
    },
    hero: {
      eyebrow: "00 / LEMMA STUDIO",
      place: "JAKARTA, ID",
      line1: "Kerja",
      line2: "sebelum",
      line3: "Karya.",
      accent: 2,
      lead: "Studio venture berbasis bukti. Kami mengerjakan riset, sistem, dan desain yang tak terlihat, supaya yang terlihat bisa berdiri.",
      scroll: "Gulir",
    },
    premise: {
      label: "01 / Premis",
      title: "Ada masalah yang belum punya bentuk.",
      body: "Kami melihat masalah yang menyentuh makna: masalah yang belum terdefinisi. Di sinilah kami bermakna.",
      closing:
        "Dalam matematika, lemma dibuktikan lebih dulu agar teorema besar bisa berdiri. Kami hadir untuk memberi makna pada pesan yang ingin kamu bawa.",
    },
    process: {
      label: "02 / Cara Kerja",
      steps: [
        {
          title: "Menceritakan struktur, alur, dan membangun arsitektur informasi.",
          body: "Struktur dulu. Alur, arsitektur informasi, dan design system disusun sebelum visual dikerjakan, supaya hasilnya konsisten dan mudah dikembangkan.",
        },
        {
          title: "Tujuan yang berarti, dan desain yang menjawabnya.",
          body: "Setiap keputusan desain dan teknis berangkat dari pertanyaan \"untuk apa\". Pesan dan target klien dirumuskan lebih dulu.",
        },
        {
          title: "Selesai dengan makna, siap diteruskan.",
          body: "Setiap komponen diuji dan didokumentasikan, sehingga tim kamu bisa melanjutkan tanpa bergantung pada kami.",
        },
      ],
    },
    services: {
      label: "03 / Layanan",
      title: "Empat disiplin, satu arah.",
      subtitle: "Dari Cerita menjadi Makna",
      lead: "Kami mengedepankan UX, HCI, data, dan teknologi, lalu mengintegrasikannya agar bermakna bagi orang yang memakainya.",
      sub: "Semuanya dimulai dari pertanyaan yang sama: ada yang ingin dibuktikan?",
      diagram: ["UX & HCI", "DESAIN", "DATA & AI", "TEKNOLOGI"],
      diagramSub: ["pengguna", "interaksi", "bukti", "sistem"],
      meaning: "MAKNA",
      proofLabel: "Bukti",
      items: [
        { name: "Brand & Visual Identity", summary: "Identitas yang tahan diuji argumen.", proof: "Gumatika, BEM FAHUTAN" },
        { name: "UX, HCI & Product Design", summary: "Dari riset perilaku pengguna sampai design system.", proof: "LPJ Ormawa IPB, NATA" },
        { name: "Engineering & Technology", summary: "Sistem yang andal saat dipakai banyak pihak.", proof: "CRL Consulting" },
        { name: "AI & Data", summary: "AI yang bisa menjelaskan jawabannya.", proof: "" },
        { name: "Strategy & Systems", summary: "Kerangka untuk ide yang masih intuisi.", proof: "" },
      ],
      all: "Semua layanan",
    },
    work: {
      label: "04 / Karya Terpilih",
      view: "Lihat",
      all: "Lihat semua karya",
      items: [
        { name: "CRL Consulting", tag: "Engineering", year: "2025/26", hook: "Satu sistem untuk puluhan dapur." },
        { name: "LPJ Ormawa IPB", tag: "Product, Data", year: "2025", hook: "Laporan yang dibaca karena isinya." },
        { name: "Gumatika", tag: "Brand Identity", year: "2024/25", hook: "Logo yang bisa dipertahankan dengan argumen." },
        { name: "JalanSiswa", tag: "Brand Identity", year: "2025", hook: "Arah sejak langkah pertama." },
      ],
    },
    products: {
      label: "05 / Produk",
      title: "Yang kami bangun sendiri.",
      items: [
        {
          name: "NATA",
          badge: "Active Development",
          status: "active",
          desc: "Lima aplikasi untuk satu kehidupan kampus? Satu saja cukup.",
          tags: ["EdTech", "B2C", "Indonesia"],
          cta: "Pelajari",
        },
        {
          name: "ARAH ██████",
          badge: "Stealth",
          status: "idle",
          desc: "Pengembangan mahasiswa berbantuan AI.",
          tags: ["AI", "B2B SaaS", "EdTech"],
          cta: "Segera hadir",
        },
      ],
    },
    about: {
      label: "06 / Tentang Kami",
      title: "Siapa kami, dan kenapa itu penting.",
      body: "Lemma adalah venture studio di Jakarta, di persimpangan desain, teknologi, dan sistem. Bukan agensi yang selesai saat brief selesai, bukan startup yang berlomba burn rate. Proyek klien dan produk kami sendiri tumbuh dalam satu ekosistem, saling menguji dan saling menguatkan.",
      stats: [
        { value: "4+", label: "tahun" },
        { value: "12", label: "proyek" },
        { value: "2", label: "produk aktif" },
      ],
      link: "Kenali kami",
    },
    contact: {
      label: "07 / Kontak",
      title: "Ada masalah yang layak dipecahkan?",
      sub: "Mulai dari satu pertanyaan: apa yang ingin kamu buktikan?",
      email: "hello@dilemma-makna.com",
      cta: "Mulai proyek",
    },
    footer: {
      brand: "Masih Dilemma Makna.",
      entity: "PT Masih Dilemma Makna, Jakarta, Indonesia",
      rights: "Semua hak dilindungi.",
      backToTop: "Kembali ke atas",
      terms: "Ketentuan Layanan",
      privacy: "Kebijakan Penggunaan Data",
      columns: {
        nav: "Navigasi",
        services: "Layanan",
        products: "Produk",
        legal: "Legal & Kebijakan",
      },
    },
  },
  en: {
    meta: {
      title: "Lemma: Evidence-Based Venture Studio",
      description:
        "Lemma integrates UX, HCI, data, and technology to build brands, digital products, and systems that mean something. Based in Jakarta.",
    },
    nav: {
      work: "Work",
      about: "About Us",
      services: "Services",
      products: "Products",
      contact: "Contact",
      cta: "Start a project",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      eyebrow: "00 / LEMMA STUDIO",
      place: "JAKARTA, ID",
      line1: "The work",
      line2: "before",
      line3: "the work.",
      accent: 2,
      lead: "An evidence-based venture studio. We do the unseen work, so the visible work can stand.",
      scroll: "Scroll",
    },
    premise: {
      label: "01 / Premise",
      title: "Some problems have no shape yet.",
      body: "We look at problems that touch on meaning: the ones not yet defined. This is where we matter.",
      closing:
        "In mathematics, a lemma is proved first so the larger theorem can stand. We are here to give meaning to the message you want to carry.",
    },
    process: {
      label: "02 / How We Work",
      steps: [
        {
          title: "Structure first.",
          body: "Flows, information architecture, and design systems come before visuals, so the result stays consistent and easy to extend.",
        },
        {
          title: "Purpose that matters.",
          body: "Every design and technical decision starts from \"what for\". Client goals and messaging are defined up front.",
        },
        {
          title: "Done with meaning, ready to hand over.",
          body: "Every component is tested and documented, so your team can carry on without depending on us.",
        },
      ],
    },
    services: {
      label: "03 / Services",
      title: "Four disciplines, one direction.",
      subtitle: "From Story to Meaning",
      lead: "We put UX, HCI, data, and technology first, and integrate them so they mean something to the people who use them.",
      sub: "All of them start with the same question: is there something you want to prove?",
      diagram: ["UX & HCI", "DESIGN", "DATA & AI", "TECHNOLOGY"],
      diagramSub: ["users", "interaction", "evidence", "systems"],
      meaning: "MEANINGFULNESS",
      proofLabel: "Proof",
      items: [
        { name: "Brand & Visual Identity", summary: "Identity that survives scrutiny.", proof: "Gumatika, BEM FAHUTAN" },
        { name: "UX, HCI & Product Design", summary: "From human-centred research to design system.", proof: "LPJ Ormawa IPB, NATA" },
        { name: "Engineering & Technology", summary: "Systems that hold under many hands.", proof: "CRL Consulting" },
        { name: "AI & Data", summary: "AI that can explain itself.", proof: "" },
        { name: "Strategy & Systems", summary: "A frame for ideas still in instinct.", proof: "" },
      ],
      all: "All services",
    },
    work: {
      label: "04 / Selected Work",
      view: "View",
      all: "View all work",
      items: [
        { name: "CRL Consulting", tag: "Engineering", year: "2025/26", hook: "One system for dozens of kitchens." },
        { name: "LPJ Ormawa IPB", tag: "Product, Data", year: "2025", hook: "A report read for its content." },
        { name: "Gumatika", tag: "Brand Identity", year: "2024/25", hook: "A logo you can defend with reasoning." },
        { name: "JalanSiswa", tag: "Brand Identity", year: "2025", hook: "Direction from the first step." },
      ],
    },
    products: {
      label: "05 / Products",
      title: "What we build ourselves.",
      items: [
        {
          name: "NATA",
          badge: "Active Development",
          status: "active",
          desc: "Five apps for one campus life? One is enough.",
          tags: ["EdTech", "B2C", "Indonesia"],
          cta: "Learn more",
        },
        {
          name: "ARAH ██████",
          badge: "Stealth",
          status: "idle",
          desc: "AI-assisted student development.",
          tags: ["AI", "B2B SaaS", "EdTech"],
          cta: "Coming soon",
        },
      ],
    },
    about: {
      label: "06 / About Us",
      title: "Who we are, and why it matters.",
      body: "Lemma is a Jakarta venture studio where design, technology, and systems meet. Not an agency that stops when the brief does, not a startup racing its burn rate. Client work and our own products grow in one ecosystem, each testing the other.",
      stats: [
        { value: "4+", label: "years" },
        { value: "12", label: "projects" },
        { value: "2", label: "active products" },
      ],
      link: "Meet the studio",
    },
    contact: {
      label: "07 / Contact",
      title: "Got a problem worth solving?",
      sub: "Start with one question: what do you want to prove?",
      email: "hello@dilemma-makna.com",
      cta: "Start a project",
    },
    footer: {
      brand: "Masih Di Lemma Makna.",
      entity: "PT Masih Dilemma Makna, Jakarta, Indonesia",
      rights: "All rights reserved.",
      backToTop: "Back to top",
      terms: "Terms of Service",
      privacy: "Data & Privacy Policy",
      columns: {
        nav: "Navigation",
        services: "Services",
        products: "Products",
        legal: "Legal & Policies",
      },
    },
  },
} as const;

export type Messages = (typeof messages)["id"] | (typeof messages)["en"];

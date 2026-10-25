// Identitas situs untuk SEO: URL kanonik, data organisasi, dan JSON-LD. Satu sumber untuk
// layout, sitemap, robots, dan halaman. Akun sosial diambil dari lib/content/socials.ts.
import type { Metadata } from "next";
import { env } from "@/lib/env";
import { socials } from "@/lib/content/socials";

// Domain produksi. Ganti lewat NEXT_PUBLIC_SITE_URL di Vercel bila domainnya berbeda.
export const SITE = env.siteUrl;

export const ORG = {
  name: "Lemma",
  legalName: "PT Masih Dilemma Makna",
  tagline: "The work before the work.",
  city: "Jakarta",
  country: "ID",
} as const;

export const sameAs = socials.filter((s) => s.href).map((s) => s.href);

const orgId = `${SITE}/#organization`;

// Grafik JSON-LD untuk seluruh situs: organisasi + situs web. Dipasang sekali di layout.
export const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": orgId,
      name: ORG.name,
      legalName: ORG.legalName,
      slogan: ORG.tagline,
      url: SITE,
      logo: `${SITE}/brand/lemma-logo-hero.svg`,


      description:
        "Lemma is a venture studio in Jakarta, Indonesia. It combines UX, HCI, data, and technology to build brands, digital products, and systems that mean something.",
      address: { "@type": "PostalAddress", addressLocality: ORG.city, addressCountry: ORG.country },
      areaServed: "ID",
      knowsLanguage: ["en", "id"],
      sameAs,
      contactPoint: [
        {
          "@type": "ContactPoint",
          contactType: "sales",


          availableLanguage: ["English", "Indonesian"],
          url: `${SITE}/contact`,
        },
      ],
      makesOffer: [
        "Brand & Visual Identity",
        "UX, HCI & Product Design",
        "Engineering & Technology",
        "AI & Data",
        "Strategy & Systems",
      ].map((name) => ({ "@type": "Offer", itemOffered: { "@type": "Service", name, provider: { "@id": orgId } } })),
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: ORG.name,
      inLanguage: ["en", "id"],
      publisher: { "@id": orgId },
    },
  ],
};

// JSON-LD halaman tunggal (breadcrumb + tipe halaman). `path` diawali "/".
export function pageJsonLd(opts: { path: string; name: string; description: string; type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage" }) {
  const url = `${SITE}${opts.path}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": opts.type ?? "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: opts.name,
        description: opts.description,
        isPartOf: { "@id": `${SITE}/#website` },
        about: { "@id": orgId },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          ...(opts.path === "/" ? [] : [{ "@type": "ListItem", position: 2, name: opts.name, item: url }]),
        ],
      },
    ],
  };
}

// Landing Nataku di /nataku: aplikasi + FAQ. Harga dan fitur mengikuti landing aslinya (pre-order, Android).
export function natakuLandingJsonLd(description: string, faqs: { question: string; answer: string }[]) {
  const url = `${SITE}/nataku`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#app`,
        name: "Nataku",
        description,
        url,
        applicationCategory: "ProductivityApplication",
        operatingSystem: "Android",
        inLanguage: "id-ID",
        publisher: { "@id": orgId },
        featureList: [
          "Today's Focus: maksimal 3 prioritas setiap hari",
          "Kalender terintegrasi dengan hitung mundur deadline",
          "WhatsApp Daily Digest setiap pagi jam 7",
          "Balas chat WhatsApp untuk coret dan tambah tugas",
          "Skor Produktivitas harian dan mingguan",
        ],
        offers: {
          "@type": "Offer",
          name: "Paket Mulai Dulu",
          price: "15000",
          priceCurrency: "IDR",
          availability: "https://schema.org/PreOrder",
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

// Serialisasi aman untuk <script type="application/ld+json">: "<" di-escape agar tidak menutup tag.
export const ld = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

// Gambar Open Graph dan Twitter, sama untuk semua halaman.
export const SHARE_IMAGE = {
  url: "/brand/share-card.jpg",
  width: 1200,
  height: 630,
  alt: `${ORG.name} | ${ORG.tagline}`,
};

// Metadata per halaman (EN: bahasa default dan yang dibaca crawler). Judul memakai format "Nama | Lemma".
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Lemma",
      type: "website",
      locale: "en_US",
      images: [SHARE_IMAGE],
    },
    twitter: { card: "summary_large_image", title, description, images: [SHARE_IMAGE.url] },
  };
}

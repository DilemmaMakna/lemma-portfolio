// Identitas situs untuk SEO: URL kanonik, data organisasi, dan JSON-LD. Satu sumber untuk
// layout, sitemap, robots, dan halaman. Akun sosial diambil dari lib/socials.ts.
import type { Metadata } from "next";
import { socials } from "@/lib/socials";

// Domain produksi. Ganti lewat NEXT_PUBLIC_SITE_URL di Vercel bila domainnya berbeda.
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://lemma.studio").replace(/\/$/, "");

export const ORG = {
  name: "Lemma",
  legalName: "PT Masih Dilemma Makna",
  tagline: "The work before the work.",
  email: "hello@dilemma-makna.com",
  marketingEmail: "marketing@dilemma-makna.com",
  phone: "+62 851 4492 2167",
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
      logo: `${SITE}/lemma-logo-hero.svg`,
      email: ORG.email,
      telephone: ORG.phone,
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
          email: ORG.email,
          telephone: ORG.phone,
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

// Serialisasi aman untuk <script type="application/ld+json">: "<" di-escape agar tidak menutup tag.
export const ld = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");

// Metadata per halaman (EN: bahasa default dan yang dibaca crawler). Judul memakai format "Nama | Lemma".
export function pageMeta(path: string, title: string, description: string): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, siteName: "Lemma", type: "website", locale: "en_US" },
    twitter: { card: "summary_large_image", title, description },
  };
}

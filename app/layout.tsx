import type { Metadata, Viewport } from "next";
import { generalSans, mono, serif } from "@/lib/fonts";
import { Providers } from "@/components/Providers";
import { env } from "@/lib/env";
import { messages } from "@/lib/messages";
import { SITE, siteJsonLd, ld } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  // Bahasa default EN (crawler tidak membawa cookie), jadi metadata dasar memakai EN.
  title: { default: messages.en.meta.title, template: "%s | Lemma" },
  description: messages.en.meta.description,
  applicationName: "Lemma",
  keywords: [
    "Lemma",
    "venture studio Jakarta",
    "UX design",
    "HCI",
    "brand identity",
    "product design",
    "web engineering",
    "AI and data",
    "studio venture Indonesia",
  ],
  authors: [{ name: "Lemma", url: SITE }],
  creator: "Lemma",
  publisher: "PT Masih Dilemma Makna",
  icons: { icon: [{ url: "/brand/icon.svg", sizes: "any", type: "image/svg+xml" }] },
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  // Isi GOOGLE_SITE_VERIFICATION di Vercel dengan token dari Google Search Console (metode "HTML tag").
  verification: { google: env.googleSiteVerification },
  openGraph: {
    title: "The work before the work.",
    description: messages.en.meta.description,
    siteName: "Lemma",
    type: "website",
    url: "/",
    locale: "en_US",
    alternateLocale: ["id_ID"],
  },
  twitter: { card: "summary_large_image", title: "The work before the work.", description: messages.en.meta.description },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Dijalankan sebelum paint: tentukan bahasa awal dan status intro tanpa flash.
const bootScript = `(function(){try{
var d=document.documentElement;
var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=(id|en)/);
var l=m?m[1]:'en';
d.lang=l;d.setAttribute('data-locale',l);d.classList.add('is-booting');
var th=null;try{th=localStorage.getItem('lemma-theme')}catch(e){}
if(th==='light'){d.setAttribute('data-theme','light');var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content','#f3f1ec');}
var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!r&&!sessionStorage.getItem('lemma-intro'))d.classList.add('is-loading');
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${generalSans.variable} ${mono.variable} ${serif.variable}`}
    >
      <head>
        <script
          id="lemma-boot"
          async
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: bootScript }}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(siteJsonLd) }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

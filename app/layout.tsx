import type { Metadata, Viewport } from "next";
import { generalSans, mono, serif } from "./fonts";
import { Providers } from "@/components/Providers";
import { messages } from "@/lib/messages";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://lemma.studio"),
  title: messages.id.meta.title,
  description: messages.id.meta.description,
  openGraph: {
    title: "The work before the work.",
    description: messages.en.meta.description,
    siteName: "Lemma",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "The work before the work." },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

// Dijalankan sebelum paint: tentukan bahasa awal dan status intro tanpa flash.
const bootScript = `(function(){try{
var d=document.documentElement;
var m=document.cookie.match(/(?:^|; )NEXT_LOCALE=(id|en)/);
var l=m?m[1]:'id';
d.lang=l;d.setAttribute('data-locale',l);d.classList.add('is-booting');
var th=null;try{th=localStorage.getItem('lemma-theme')}catch(e){}
if(th==='light'){d.setAttribute('data-theme','light');var tc=document.querySelector('meta[name="theme-color"]');if(tc)tc.setAttribute('content','#f3f1ec');}
var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!r&&!sessionStorage.getItem('lemma-intro'))d.classList.add('is-loading');
}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
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
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

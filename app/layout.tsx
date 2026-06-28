import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lemma — Creative-First, System-Oriented",
  description:
    "Lemma adalah venture studio Indonesia (Bogor/IPB) yang membangun solusi kreatif, data, dan digital untuk organisasi, bisnis, dan komunitas mahasiswa.",
  keywords: ["venture studio", "creative", "digital", "Bogor", "IPB", "Lemma"],
  openGraph: {
    title: "Lemma — Creative-First, System-Oriented",
    description: "Kami bantu menyusun sistemnya, bukan cuma desainnya.",
    siteName: "Lemma",
    locale: "id_ID",
    type: "website",
  },
};

import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/navigation/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Fontshare General Sans */}
        <link rel="preconnect" href="https://api.fontshare.com" />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@300,400,500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

import type React from "react";

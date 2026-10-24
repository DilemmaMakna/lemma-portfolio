import type { Metadata } from "next";
import Navbar from "@/components/nata/Navbar";
import HeroSection from "@/components/nata/HeroSection";
import ProblemFeatureSection from "@/components/nata/ProblemFeatureSection";
import PillarsSection from "@/components/nata/PillarsSection";
import PricingSection from "@/components/nata/PricingSection";
import FaqSection from "@/components/nata/FaqSection";
import Footer from "@/components/nata/Footer";
import JsonLd from "@/components/layout/JsonLd";
import { faqs } from "@/lib/nata/faq";
import { pageMeta, natakuLandingJsonLd } from "@/lib/seo/site";

const TITLE = "Nataku | Bikin Tugas Kuliah Beneran Beres";
const DESC =
  "Nataku menyatukan jadwal kuliah dan tugasmu ke dalam satu alur rapi. Setiap pagi disapa lewat WhatsApp, selesaikan tugas tanpa ribet buka-tutup aplikasi.";

const base = pageMeta("/nataku", TITLE, DESC);
export const metadata: Metadata = {
  ...base,
  keywords: [
    "to-do list mahasiswa",
    "manajemen tugas kuliah",
    "aplikasi tugas kuliah",
    "pengingat tugas whatsapp",
    "jadwal kuliah",
    "pengingat deadline tugas",
    "aplikasi produktivitas mahasiswa",
    "nataku",
  ],
  openGraph: { ...base.openGraph, locale: "id_ID" },
};

export default function NataRoute() {
  return (
    <>
      <JsonLd data={natakuLandingJsonLd(DESC, faqs)} />
      <main className="min-h-screen bg-[#FFFAF7]">
        <Navbar />
        <HeroSection />
        <ProblemFeatureSection />
        <PillarsSection />
        <PricingSection />
        <FaqSection />
        <Footer />
      </main>
    </>
  );
}

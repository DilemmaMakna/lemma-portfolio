import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import AboutHero from "@/components/about/AboutHero";
import Who from "@/components/about/Who";
import Beliefs from "@/components/about/Beliefs";
import Model from "@/components/about/Model";
import Name from "@/components/about/Name";
import AboutCta from "@/components/about/AboutCta";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Tentang Kami — Lemma",
  description:
    "Lemma adalah venture studio di Jakarta. Kami mengerjakan proyek klien dan membangun produk sendiri, dalam satu tim.",
};

export default function AboutPage() {
  return (
    <>
      <NavPill />
      <PageAnimations>
        <main>
          <AboutHero />
          <Who />
          <Beliefs />
          <Model />
          <Name />
          <AboutCta />
        </main>
        <Footer />
      </PageAnimations>
    </>
  );
}

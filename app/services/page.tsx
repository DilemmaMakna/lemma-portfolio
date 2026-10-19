import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesIntro from "@/components/services/ServicesIntro";
import ServiceList from "@/components/services/ServiceList";
import Engagement from "@/components/services/Engagement";
import ServicesCta from "@/components/services/ServicesCta";
import Footer from "@/components/home/Footer";

export const metadata: Metadata = {
  title: "Layanan — Lemma",
  description:
    "Brand, UX & HCI, engineering, AI & data, serta strategi dan sistem. Dirancang dalam satu alur oleh Lemma.",
};

export default function ServicesPage() {
  return (
    <>
      <NavPill />
      <PageAnimations>
        <main>
          <ServicesHero />
          <ServicesIntro />
          <ServiceList />
          <Engagement />
          <ServicesCta />
        </main>
        <Footer />
      </PageAnimations>
    </>
  );
}

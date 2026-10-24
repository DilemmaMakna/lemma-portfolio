import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/layout/PageAnimations";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesIntro from "@/components/services/ServicesIntro";
import ServiceList from "@/components/services/ServiceList";
import Engagement from "@/components/services/Engagement";
import ServicesCta from "@/components/services/ServicesCta";
import Footer from "@/components/home/Footer";
import { pageMeta, pageJsonLd } from "@/lib/seo/site";
import JsonLd from "@/components/layout/JsonLd";

const TITLE = "Services | Lemma";
const DESC =
  "Brand identity, UX & HCI, engineering, AI & data, and strategy & systems. Designed as one flow by Lemma.";
export const metadata: Metadata = pageMeta("/services", TITLE, DESC);

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/services", name: "Services", description: DESC, type: "WebPage" })} />
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

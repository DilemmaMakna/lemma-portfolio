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
import { pageMeta, pageJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

const TITLE = "About Us | Lemma";
const DESC =
  "Lemma is a venture studio in Jakarta. We take on client projects and build our own products, in one team.";
export const metadata: Metadata = pageMeta("/about", TITLE, DESC);

export default function AboutPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/about", name: "About Us", description: DESC, type: "AboutPage" })} />
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

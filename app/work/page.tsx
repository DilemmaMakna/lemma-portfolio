import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import WorkHero from "@/components/work/WorkHero";
import WorkExplorer from "@/components/work/WorkExplorer";
import Footer from "@/components/home/Footer";
import { workMessages } from "@/lib/work";
import { pageMeta, pageJsonLd } from "@/lib/site";
import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = pageMeta("/work", workMessages.en.meta.title, workMessages.en.meta.description);

export default function WorkPage() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/work", name: "Work", description: workMessages.en.meta.description, type: "CollectionPage" })} />
      <NavPill />
      <PageAnimations>
        <main>
          <WorkHero />
          <WorkExplorer />
        </main>
        <Footer />
      </PageAnimations>
    </>
  );
}

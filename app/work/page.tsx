import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import WorkHero from "@/components/work/WorkHero";
import WorkExplorer from "@/components/work/WorkExplorer";
import Footer from "@/components/home/Footer";
import { workMessages } from "@/lib/work";

export const metadata: Metadata = {
  title: workMessages.id.meta.title,
  description: workMessages.id.meta.description,
};

export default function WorkPage() {
  return (
    <>
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

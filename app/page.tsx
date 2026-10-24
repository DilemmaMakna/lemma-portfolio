import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/layout/PageAnimations";
import Hero from "@/components/home/Hero";
import Premise from "@/components/home/Premise";
import Process from "@/components/home/Process";
import Services from "@/components/home/Services";
import SelectedWork from "@/components/home/SelectedWork";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import ContactCta from "@/components/home/ContactCta";
import Footer from "@/components/home/Footer";
import JsonLd from "@/components/layout/JsonLd";
import { pageMeta, pageJsonLd } from "@/lib/seo/site";
import { messages } from "@/lib/content/messages";

export const metadata = pageMeta("/", messages.en.meta.title, messages.en.meta.description);

export default function Home() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/", name: "Home", description: messages.en.meta.description })} />
      <NavPill />
      <PageAnimations>
        <main>
          <Hero />
          <Premise />
          <Process />
          <Services />
          <SelectedWork />
          <Products />
          <About />
          <ContactCta />
        </main>
        <Footer />
      </PageAnimations>
    </>
  );
}

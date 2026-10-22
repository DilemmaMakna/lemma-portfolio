import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import Hero from "@/components/home/Hero";
import Premise from "@/components/home/Premise";
import Process from "@/components/home/Process";
import Services from "@/components/home/Services";
import SelectedWork from "@/components/home/SelectedWork";
import Products from "@/components/home/Products";
import About from "@/components/home/About";
import ContactCta from "@/components/home/ContactCta";
import Footer from "@/components/home/Footer";

export default function Home() {
  return (
    <>
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

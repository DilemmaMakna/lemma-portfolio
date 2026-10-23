import type { Metadata } from "next";
import NavPill from "@/components/nav/NavPill";
import PageAnimations from "@/components/PageAnimations";
import ContactPage from "@/components/contact/ContactPage";
import Footer from "@/components/home/Footer";
import JsonLd from "@/components/JsonLd";
import { contactMessages } from "@/lib/contact";
import { pageMeta, pageJsonLd } from "@/lib/site";

const { title, description } = contactMessages.en.meta;
export const metadata: Metadata = pageMeta("/contact", title, description);

export default function ContactRoute() {
  return (
    <>
      <JsonLd data={pageJsonLd({ path: "/contact", name: "Contact", description, type: "ContactPage" })} />
      <NavPill />
      <PageAnimations>
        <main>
          <ContactPage />
        </main>
        <Footer />
      </PageAnimations>
    </>
  );
}

import { ld } from "@/lib/site";

// Data terstruktur untuk mesin pencari. Server component: JSON-LD ikut ada di HTML awal.
export default function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld(data) }} />;
}

import Image from "next/image";

// Pita gambar penuh lebar: dua tangan yang saling mengulur (dithered). Sisi atas dan bawah larut ke latar
// lewat mask berundak (kurva smoothstep, bukan linear) supaya tidak ada garis tepi: 0 -> 100 di tengah -> 0.
// Dekoratif, jadi alt kosong dan tidak ada copy di komponen.
const FADE =
  "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,.04) 6%, rgba(0,0,0,.16) 12%, rgba(0,0,0,.36) 18%, rgba(0,0,0,.6) 25%, rgba(0,0,0,.82) 32%, rgba(0,0,0,.95) 40%, #000 50%, rgba(0,0,0,.95) 60%, rgba(0,0,0,.82) 68%, rgba(0,0,0,.6) 75%, rgba(0,0,0,.36) 82%, rgba(0,0,0,.16) 88%, rgba(0,0,0,.04) 94%, transparent 100%)";

export default function HandCollab() {
  // Penuh lebar layar (di luar .wrap). Tinggi dibatasi 100svh; di layar sangat lebar sisi kiri/kanan dipotong (object-cover).
  return (
    <section aria-hidden="true" className="relative overflow-hidden bg-bg">
      <div data-reveal>
        <div className="relative aspect-[3/2] max-h-[100svh] w-full" style={{ maskImage: FADE, WebkitMaskImage: FADE }}>
          <Image
            src="/images/dithered/hand-collab.webp"
            alt=""
            fill
            sizes="100vw"
            className="select-none object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}

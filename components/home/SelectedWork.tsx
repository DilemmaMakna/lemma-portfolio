"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import SectionLabel from "@/components/ui/SectionLabel";
import Button from "@/components/ui/Button";
import { projects, type Project } from "@/lib/content/work";

// Empat proyek pilihan beserta foto yang ditampilkan (indeks dari daftar foto proyek).
// Setiap kartu membuka detailnya di /work (?p=slug membuka modal proyek di sana).
// Kartu pertama (LPJ Ormawa IPB) adalah highlight project: diberi penanda di atas nomor proyek.
const HOME: { slug: string; pick: number[] }[] = [
  { slug: "lpj-ormawa-ipb-2025", pick: [1, 4] },
  { slug: "jalansiswa", pick: [0, 3] },
  { slug: "bem-fahutan-langkah-bermakna", pick: [0, 3] },
  { slug: "nata", pick: [0, 2, 4] },
];

const hookCls =
  "opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 transition-opacity duration-500";

const href = (p: Project) => `/work?p=${p.slug}`;

function Meta({
  p,
  view,
  highlight,
  className = "",
}: {
  p: Project;
  view: string;
  highlight?: string;
  className?: string;
}) {
  const { locale } = useLocale();
  return (
    <div className={`flex flex-col justify-between gap-8 ${className}`}>
      <div>
        {highlight && (
          <div className="mono mb-3 flex items-center gap-2 text-accent">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
            {highlight.toUpperCase()}
          </div>
        )}
        <div className="mono text-fg-dim">PROJECT {p.n}</div>
        <h3 className="mt-4 text-[clamp(1.75rem,3.6vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.03em] transition-colors group-hover:text-accent">
          {p.name}
        </h3>
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span className="tag">{p.category}</span>
          <span className="mono ml-1 text-fg-dim">{p.year}</span>
        </div>
      </div>
      <div className={hookCls}>
        <p className="max-w-[30ch] text-fg-muted">{p.hook[locale]}</p>
        <span className="mono mt-4 inline-block text-accent">{view} →</span>
      </div>
    </div>
  );
}

// Lebar foto: setiap bingkai berisi 2-3 foto berdampingan; di lg kartu paling lebar 8/12 kolom dibagi dua.
const FRAME_SIZES = "(min-width: 1024px) 33vw, 50vw";

// Foto 4:5 dijajarkan berdampingan mengisi bingkai lanskap (2 foto ≈ 16:10, 3 foto ≈ 21:9).
function Frame({
  p,
  pick,
  view,
  aspect = "aspect-[16/10]",
}: {
  p: Project;
  pick: number[];
  view: string;
  aspect?: string;
}) {
  const photos = pick.map((i) => p.photos[i]).filter(Boolean);
  return (
    <div className={`relative flex w-full gap-2 overflow-hidden ${aspect}`}>
      {photos.map((ph, i) => (
        <div
          key={ph.src}
          className={`relative h-full min-w-0 flex-1 overflow-hidden rounded-[4px] ${i === 2 ? "hidden md:block" : ""}`}
          style={{ backgroundColor: ph.color }}
        >
          <Image
            src={ph.src}
            width={ph.w}
            height={ph.h}
            sizes={FRAME_SIZES}
            alt=""
            className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        </div>
      ))}
    </div>
  );
}

export default function SelectedWork() {
  const { t, locale } = useLocale();
  const w = t.work;
  const [a, b, c, d] = HOME.map((h) => ({ ...h, p: projects.find((x) => x.slug === h.slug)! }));

  return (
    <section id="work" className="section bg-bg" aria-label={w.label}>
      <div className="wrap">
        <SectionLabel>{w.label}</SectionLabel>

        <div className="flex flex-col gap-20 md:gap-28">
          {/* 01: gambar 7 kolom kiri, meta 5 kolom kanan */}
          <Link href={href(a.p)} data-reveal className="group grid12 items-stretch gap-y-6">
            <div className="col-span-full lg:col-span-7">
              <Frame p={a.p} pick={a.pick} view={w.view} />
            </div>
            <Meta p={a.p} view={w.view} highlight={w.highlight} className="col-span-full lg:col-span-5 lg:pl-6" />
          </Link>

          {/* 02: meta 4 kolom kiri, gambar 8 kolom kanan */}
          <Link href={href(b.p)} data-reveal className="group grid12 items-stretch gap-y-6">
            <Meta p={b.p} view={w.view} className="order-2 col-span-full lg:order-1 lg:col-span-4 lg:pr-6" />
            <div className="order-1 col-span-full lg:order-2 lg:col-span-8">
              <Frame p={b.p} pick={b.pick} view={w.view} />
            </div>
          </Link>

          {/* 03: dua kolom setara */}
          <Link href={href(c.p)} data-reveal className="group grid12 items-stretch gap-y-6">
            <div className="col-span-full lg:col-span-6">
              <Frame p={c.p} pick={c.pick} view={w.view} aspect="aspect-[4/3]" />
            </div>
            <Meta p={c.p} view={w.view} className="col-span-full lg:col-span-6 lg:pl-10" />
          </Link>

          {/* 04: gambar penuh dengan caption overlay */}
          <Link href={href(d.p)} data-reveal className="group relative block">
            <Frame p={d.p} pick={d.pick} view={w.view} aspect="aspect-[16/10] md:aspect-[21/9]" />
            {/* Ponsel: caption di bawah gambar (bingkainya terlalu pendek untuk overlay). */}
            <div className="pointer-events-none mt-6 flex flex-col gap-3 md:absolute md:inset-x-0 md:bottom-0 md:mt-0 md:flex-row md:items-end md:justify-between md:p-8">
              <div className="md:bg-bg/90 md:p-5">
                <div className="mono text-fg-dim">PROJECT {d.p.n}</div>
                <h3 className="mt-2 text-[clamp(1.5rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em]">
                  {d.p.name}
                </h3>
                <div className="mt-3 flex items-center gap-3">
                  <span className="tag">{d.p.category}</span>
                  <span className="mono text-fg-dim">{d.p.year}</span>
                </div>
              </div>
              <div className={`md:bg-bg/90 md:p-5 ${hookCls}`}>
                <p className="text-fg-muted">{d.p.hook[locale]}</p>
                <span className="mono mt-2 inline-block text-accent">{w.view} →</span>
              </div>
            </div>
          </Link>
        </div>

        <div className="mt-16" data-reveal>
          <Button variant="ghost" href="/work">
            {w.all}
          </Button>
        </div>
      </div>
    </section>
  );
}

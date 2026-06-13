const React = window.React;

// Module-level component bindings — assigned by LandingPage once the
// design-system bundle is loaded. Sub-components capture these by closure,
// so they see the bindings as soon as LandingPage assigns them and re-renders.
let Navbar, Button, IconButton, Eyebrow, StatPill, HaloCard, BarrelBackdrop, ServiceTile;

const NAV_LINKS = [
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "work", label: "Work" },
  { id: "clients", label: "Clients" },
];

const PROJECTS = [
  {
    eyebrow: "Identitas Visual — 2025",
    title: "BEM FAHUTAN IPB University",
    description: "Identitas visual yang disusun untuk digunakan, bukan sekadar dipajang—memperkuat konsistensi organisasi lintas media dan periode kabinet.",
    color: "#1f6f43",
  },
  {
    eyebrow: "Identitas Visual — 2025",
    title: "Himpro HKSA SKHB IPB University",
    description: "Semangat akademik dan kehangatan organisasi yang disatukan dalam satu bahasa visual yang utuh—konsisten untuk kebutuhan cetak, digital, dan operasional.",
    color: "#b7401c",
  },
  {
    eyebrow: "Identitas Visual — 2025",
    title: "Jalansiswa Ed-Tech Startup",
    description: "Membangun identitas ed-tech yang mengomunikasikan arah sejelas produknya—sederhana, memiliki tujuan, dan mudah diingat oleh siswa maupun pendidik.",
    color: "#e7a23a",
  },
  {
    eyebrow: "Sistem Laporan & Digital — 2025",
    title: "Direktorat Kemahasiswaan IPB University",
    description: "Ekosistem pelaporan visual-data dan website interaktif yang merangkum ratusan ribu titik sentuh mahasiswa, dibangun untuk mendorong transparansi, refleksi, dan keberlanjutan.",
    color: "#264d3a",
  },
];

const ArrowUR = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M7 17 17 7"/><path d="M7 7h10v10"/>
  </svg>
);

const IconProjects = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 7h13l5 5v5h-2"/><circle cx="7.5" cy="17" r="2"/><circle cx="17.5" cy="17" r="2"/><path d="M9.5 17h6"/>
  </svg>
);
const IconChart = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 8v8"/><path d="M15 8v5"/>
  </svg>
);
const IconShield = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M12 3 4 6v6c0 5 3.5 7.5 8 9 4.5-1.5 8-4 8-9V6z"/>
  </svg>
);

function ProjectArtwork({ color, label }) {
  // Stand-in for real client artwork — keeps the kit visually complete
  // without inventing brand marks. Color-on-cream with the brand barrel motif.
  return (
    <div style={{ width: "100%", height: "100%", background: color, position: "relative", overflow: "hidden" }}>
      <BarrelBackdrop opacity={0.55} />
      <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.92)",
            color: "var(--neutral-ink)",
            borderRadius: 999,
            padding: "10px 20px",
            font: "var(--type-eyebrow)",
            letterSpacing: "var(--tracking-eyebrow)",
            fontSize: 13,
          }}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function LandingPage() {
  const [ready, setReady] = React.useState(() => !!window.LemmaDesignSystem_e5b9a2);
  const [activeService, setActiveService] = React.useState(1);
  const [navCurrent, setNavCurrent] = React.useState("about");

  React.useEffect(() => {
    if (ready) return;
    let raf;
    const tick = () => {
      if (window.LemmaDesignSystem_e5b9a2) setReady(true);
      else raf = setTimeout(tick, 60);
    };
    tick();
    return () => clearTimeout(raf);
  }, [ready]);

  if (!ready) {
    return React.createElement(
      "div",
      { style: { padding: 64, fontFamily: "var(--font-sans)", color: "var(--text-muted)" } },
      "Loading Lemma bundle…"
    );
  }

  // Bind module-level handles now that the bundle is available.
  ({ Navbar, Button, IconButton, Eyebrow, StatPill, HaloCard, BarrelBackdrop, ServiceTile } = window.LemmaDesignSystem_e5b9a2);

  return (
    <div style={{ width: "100%", maxWidth: "var(--container-max)", margin: "0 auto", background: "var(--neutral-0)", fontFamily: "var(--font-sans)", color: "var(--text-body)", overflow: "hidden" }}>
      <Navbar
        links={NAV_LINKS}
        current={navCurrent}
        onNavigate={(l) => setNavCurrent(l.id)}
        cta={<Button>Start a project</Button>}
      />

      <HeroSection />
      <PrinsipSection />
      <CoreValueSection />
      <LayananHeading />
      <ServicesStack active={activeService} onSelect={setActiveService} />
      <ProyekSection />
      <FooterSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{ position: "relative", padding: "var(--gutter)", display: "flex", flexDirection: "column", gap: 42, background: "var(--neutral-0)" }}>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 30, minHeight: 540 }}>
        {/* Top row: Digital + stats */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
          <h1 style={{ margin: 0, font: "var(--type-hero)", fontSize: "clamp(96px, 14vw, 196px)", lineHeight: 1.1, color: "var(--neutral-ink)", letterSpacing: "-0.02em" }}>
            <span style={{ fontWeight: 500 }}>D</span>
            <span style={{ fontWeight: 400 }}>igital</span>
          </h1>
          <div style={{ width: 452, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
              <StatPill icon={<IconProjects />} value="4 project" />
              <StatPill icon={<IconChart />}    value="701K+" dividerBefore />
              <StatPill icon={<IconShield />}   value="IPB"   dividerBefore />
            </div>
            <p style={{ margin: 0, maxWidth: 385, textAlign: "right", font: "var(--type-lead)", color: "var(--neutral-800)" }}>
              Solusi yang baik bukan soal tampilan, tapi juga soal kemudahan dipakai dan keberlanjutan sistemnya.
            </p>
          </div>
        </div>

        {/* Bottom row: tagline + Partner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: 24 }}>
          <div style={{ width: 469, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", gap: 32 }}>
            <p style={{ margin: 0, font: "var(--type-lead)", color: "var(--neutral-800)" }}>
              Lemma adalah partner yang hadir untuk organisasi, bisnis, dan komunitas yang ingin urusan desain, sistem, dan teknologi terasa lebih efisien.
            </p>
            <Button variant="ghost" size="lg" trailingIcon={<ArrowUR/>}>Selected work</Button>
          </div>
          <h1 style={{ margin: 0, font: "var(--type-hero)", fontSize: "clamp(96px, 14vw, 196px)", lineHeight: 1.1, color: "var(--neutral-ink)", letterSpacing: "-0.02em" }}>
            <span style={{ fontWeight: 500 }}>P</span>
            <span style={{ fontWeight: 400 }}>artner</span>
          </h1>
        </div>

        {/* Halo artwork between the two headlines */}
        <div style={{ position: "absolute", left: "38%", top: "23%", pointerEvents: "none" }}>
          <HaloCard width={343} height={220} rotate={13} />
        </div>
      </div>
    </section>
  );
}

function PrinsipSection() {
  return (
    <section style={{ position: "relative", padding: "var(--gutter)", background: "var(--grad-orange-radial)", overflow: "hidden", minHeight: 600, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 42, boxShadow: "0 0 0 7px rgba(249,124,22,0.15) inset" }}>
      <BarrelBackdrop opacity={0.95} />
      <h2 style={{ position: "relative", margin: 0, font: "var(--type-display)", color: "var(--beige-0)", textTransform: "capitalize" }}>
        <span style={{ fontWeight: 500 }}>P</span>
        <span style={{ fontWeight: 400 }}>rinsip </span>
        <span style={{ fontWeight: 500 }}>K</span>
        <span style={{ fontWeight: 400 }}>ami</span>
      </h2>
      <div style={{ position: "relative", display: "flex", justifyContent: "flex-end" }}>
        <p style={{ margin: 0, maxWidth: 656, fontSize: 40, lineHeight: 1.15, fontWeight: 400, color: "var(--beige-0)" }}>
          Kami memadukan pendekatan kreatif dengan pemikiran sistematis dalam memecahkan masalah.{" "}
          <span style={{ color: "rgba(255,255,255,0.5)" }}>
            Bagi kami, solusi digital yang baik harus berfungsi sebagai satu kesatuan sistem yang utuh, bukan sekadar kumpulan fitur yang terpisah-pisah.
          </span>
        </p>
      </div>
    </section>
  );
}

function CoreValueSection() {
  return (
    <section style={{ padding: "var(--gutter)", background: "var(--neutral-0)", display: "flex", flexDirection: "column", gap: 42 }}>
      <h2 style={{ margin: 0, font: "var(--type-display)", color: "var(--neutral-800)", textTransform: "capitalize" }}>
        <span style={{ fontWeight: 500 }}>C</span>
        <span style={{ fontWeight: 400 }}>ore </span>
        <span style={{ fontWeight: 500 }}>V</span>
        <span style={{ fontWeight: 400 }}>alue</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 59, alignItems: "stretch", minHeight: 356 }}>
        {/* Ribbon artwork */}
        <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "var(--grad-orange-radial)", minHeight: 356 }}>
          <RibbonArtwork />
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "20px 0", gap: 24 }}>
          <h3 style={{ margin: 0, fontSize: 48, lineHeight: 1.05, fontWeight: 500, color: "var(--neutral-800)" }}>
            Membangun sistem <span style={{ color: "var(--orange-500)" }}>utuh</span>, melalui pendekatan <span style={{ color: "var(--orange-500)" }}>kreatif</span>
          </h3>
          <p style={{ margin: 0, fontSize: 20, lineHeight: 1.2, fontWeight: 300, color: "var(--neutral-800)" }}>
            Kami merancang solusi digital dengan mengutamakan pengalaman pengguna dan keberlanjutan. Kami memposisikan diri sebagai partner kolaboratif untuk memastikan sistem yang dibangun tidak sekadar kumpulan fitur, melainkan solusi yang bermakna.
          </p>
          <div style={{ display: "inline-flex", gap: 16 }}>
            <Button size="lg">Explore All Showcase</Button>
            <IconButton variant="accent" size="lg" ariaLabel="Open showcase" />
          </div>
        </div>
      </div>
    </section>
  );
}

function RibbonArtwork() {
  // Concentric rounded "ribbon" — a stylized swoosh in cream tones.
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <svg viewBox="0 0 600 400" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        <defs>
          <linearGradient id="ribbon" x1="0" x2="1">
            <stop offset="0" stopColor="#FF5100" />
            <stop offset=".47" stopColor="#F39F34" />
            <stop offset=".7" stopColor="#E6E6E6" />
          </linearGradient>
          <radialGradient id="ribbon-shadow" cx="100%" cy="71%" r="120%">
            <stop offset="0" stopColor="rgba(0,0,0,0)" />
            <stop offset=".74" stopColor="rgba(0,0,0,.75)" />
            <stop offset="1" stopColor="rgba(0,0,0,1)" />
          </radialGradient>
        </defs>
        {[0,1,2,3,4].map((i) => (
          <rect key={i} x={50+i*30} y={-20-i*5} width={500-i*50} height={460-i*30} rx={20} fill="url(#ribbon-shadow)" style={{mixBlendMode:"screen", stroke:"rgba(255,255,255,.4)", strokeWidth:.7}} />
        ))}
        <rect x={290} y={-60} width={340} height={320} rx={20} fill="url(#ribbon)" />
      </svg>
    </div>
  );
}

function LayananHeading() {
  return (
    <section style={{ padding: "var(--gutter) var(--gutter) 0", background: "var(--neutral-0)" }}>
      <h2 style={{ margin: 0, font: "var(--type-display)", color: "var(--neutral-800)", textTransform: "capitalize" }}>
        <span style={{ fontWeight: 500 }}>L</span>
        <span style={{ fontWeight: 400 }}>ayanan </span>
        <span style={{ fontWeight: 500 }}>K</span>
        <span style={{ fontWeight: 400 }}>ami</span>
      </h2>
    </section>
  );
}

function MagentaRings() {
  return (
    <svg viewBox="0 0 1440 735" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <radialGradient id="ring-blue" cx=".7" cy=".15" r=".9">
          <stop offset="0" stopColor="#7E75FE" />
          <stop offset="1" stopColor="#74D5FE" />
        </radialGradient>
      </defs>
      {/* Tilted rings */}
      <g transform="translate(60 360) rotate(-21)">
        <ellipse cx="0" cy="0" rx="270" ry="320" fill="none" stroke="#3D9BFA" strokeWidth="14" opacity=".5"/>
        <ellipse cx="0" cy="0" rx="240" ry="290" fill="url(#ring-blue)" opacity=".4"/>
      </g>
      <g transform="translate(720 220) rotate(-13)">
        <ellipse cx="0" cy="0" rx="380" ry="310" fill="url(#ring-blue)" opacity=".4"/>
        <ellipse cx="0" cy="0" rx="380" ry="310" fill="none" stroke="#0183E0" strokeWidth="6"/>
      </g>
      <g transform="translate(1180 540) rotate(34)">
        <ellipse cx="0" cy="0" rx="450" ry="190" fill="none" stroke="#3D9BFA" strokeWidth="14" opacity=".6"/>
      </g>
    </svg>
  );
}

function TealLozenges() {
  return (
    <svg viewBox="0 0 1440 735" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="teal-loz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#017988"/><stop offset="1" stopColor="#01D5DD"/>
        </linearGradient>
      </defs>
      {[0,1,2,3,4,5].map(i => (
        <rect key={i} x={120+i*180} y={-200} width={130} height={980} rx={65} fill="url(#teal-loz)" stroke="#01E09D" strokeWidth="6" transform={`rotate(18 ${185+i*180} 280)`} />
      ))}
    </svg>
  );
}

function OliveBlobs() {
  return (
    <svg viewBox="0 0 1440 735" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      <defs>
        <linearGradient id="olive-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#887101"/><stop offset="1" stopColor="#DDA701"/>
        </linearGradient>
      </defs>
      {[
        {x: 1000, y: 400, r: 380, rot: 34},
        {x:  900, y: 250, r: 360, rot: 12},
        {x:  500, y: 380, r: 360, rot: -10},
        {x:  300, y: 320, r: 440, rot: -33},
      ].map((c, i) => (
        <ellipse key={i} cx={c.x} cy={c.y} rx={c.r} ry={c.r*0.6} fill="url(#olive-grad)" stroke="#E05E01" strokeWidth="10" transform={`rotate(${c.rot} ${c.x} ${c.y})`} />
      ))}
    </svg>
  );
}

function ServicesStack({ active, onSelect }) {
  // Lemma stacks three service tiles vertically. We render all three and
  // forward the active index — the badges feed back into the parent so the
  // active state syncs across tiles.
  const services = [
    { variant: "magenta", title: "Kreatif & Desain",  description: "Sistem visual yang dirancang bukan sekadar agar terlihat bagus, tetapi sebagai sistem komunikasi yang dapat digunakan lintas media dan periode.", scheme: "Skema: Berbasis Proyek",           decoration: <MagentaRings /> },
    { variant: "teal",    title: "Analitik Data",     description: "Sistem pelaporan dan dasbor operasional yang mengubah data menjadi sebuah keputusan, dirancang secara sistematis agar mudah dikelola oleh tim Anda.", scheme: "Skema: Berbasis Proyek / Retainer", decoration: <TealLozenges /> },
    { variant: "olive",   title: "Solusi Digital",    description: "Aplikasi web dan alat terintegrasi yang dibangun agar mudah diperbarui dan dipelihara tanpa harus selalu mengubah kode atau bergantung pada developer.", scheme: "Skema: Berbasis Proyek / Retainer", decoration: <OliveBlobs /> },
  ];
  return (
    <div style={{ background: "var(--neutral-0)" }}>
      {services.map((s, i) => (
        <ServiceTile
          key={i}
          index={i + 1}
          active={active}
          count={3}
          variant={s.variant}
          title={s.title}
          description={s.description}
          scheme={s.scheme}
          decoration={s.decoration}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}

function ProyekSection() {
  return (
    <section style={{ padding: "var(--gutter)", background: "var(--surface-paper)", display: "flex", flexDirection: "column", gap: 42 }}>
      <h2 style={{ margin: 0, font: "var(--type-display)", color: "var(--neutral-800)", textTransform: "capitalize" }}>
        <span style={{ fontWeight: 500 }}>P</span>
        <span style={{ fontWeight: 400 }}>royek </span>
        <span style={{ fontWeight: 500 }}>P</span>
        <span style={{ fontWeight: 400 }}>ilihan </span>
        <span style={{ fontWeight: 500 }}>K</span>
        <span style={{ fontWeight: 400 }}>ami</span>
      </h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 42, alignItems: "start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 63 }}>
          {[0, 3].map((idx) => (
            <ProjectCardWithArt key={idx} project={PROJECTS[idx]} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 63, paddingTop: 52 }}>
          {[1, 2].map((idx) => (
            <ProjectCardWithArt key={idx} project={PROJECTS[idx]} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCardWithArt({ project }) {
  return (
    <article style={{ background: "var(--neutral-0)", borderRadius: "var(--radius-card)", overflow: "hidden", outline: "1px solid var(--border-hairline)" }}>
      <div style={{ height: 365, background: "var(--surface-tile)", borderTopLeftRadius: "var(--radius-lg)", borderTopRightRadius: "var(--radius-lg)", overflow: "hidden" }}>
        <ProjectArtwork color={project.color} label={project.title} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: "22px 20px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 9.14 }}>
          <Eyebrow tone="muted">{project.eyebrow}</Eyebrow>
          <div style={{ font: "var(--type-card-title)", fontSize: 32, fontWeight: 500, lineHeight: 1.1, color: "var(--neutral-700)" }}>{project.title}</div>
        </div>
        <div style={{ fontSize: 14, lineHeight: 1.625, color: "var(--neutral-600)" }}>{project.description}</div>
      </div>
    </article>
  );
}

function FooterSection() {
  return (
    <section style={{ position: "relative", padding: "var(--gutter)", background: "var(--grad-orange-radial)", overflow: "hidden", display: "flex", flexDirection: "column", gap: 42, color: "var(--beige-100)" }}>
      <BarrelBackdrop opacity={0.7} />
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 39 }}>
        <div style={{ paddingBottom: 31, borderBottom: "1px solid rgba(247,245,241,0.16)" }}>
          <Eyebrow tone="warm">Kontak &amp; Tindak</Eyebrow>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 39, alignItems: "start" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 39 }}>
            <h2 style={{ margin: 0, fontSize: 52, lineHeight: 1.1, fontWeight: 500, color: "var(--beige-100)", maxWidth: 732 }}>
              Kami bekerja maksimal saat memahami masalah dahulu
            </h2>
            <div style={{ display: "inline-flex", gap: 12 }}>
              <Button variant="deep" size="lg">Work with Us</Button>
              <IconButton variant="deep" size="lg" ariaLabel="Get in touch" />
            </div>
          </div>
          <FooterCol heading="Navigate" items={["WhatsApp", "Email", "Instagram", "Work with us"]} />
          <FooterCol heading="Connect"  items={["LinkedIn", "X"]} />
        </div>
      </div>
      <div style={{ position: "relative", textAlign: "center", color: "rgba(70,32,0,0.52)", fontSize: 240, lineHeight: 1.1, fontWeight: 500, letterSpacing: "-0.02em" }}>
        Lemma
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 173, background: "var(--grad-footer-fade)", pointerEvents: "none" }} />
    </section>
  );
}

function FooterCol({ heading, items }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, paddingLeft: 20, borderLeft: "0.5px solid #979797" }}>
      <div style={{ fontSize: 20, color: "#FADCCB", fontWeight: 400 }}>{heading}</div>
      {items.map((label) => (
        <a key={label} href="#" style={{ fontSize: 20, color: "var(--beige-100)", fontWeight: 500, textDecoration: "none" }}>
          {label}
        </a>
      ))}
    </div>
  );
}

Object.assign(window, { LandingPage });

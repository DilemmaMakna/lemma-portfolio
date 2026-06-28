# DESIGN.md
## Lemma Web — Design System & Direction
**PT Masih Dilemma Makna · lemma.studio**
*Last updated: June 2026 · v1.0*

---

## 0. Design Philosophy

Website Lemma bukan portofolio. Ia adalah **argumen yang berjalan**.

Setiap scroll adalah premis. Setiap section adalah proposisi. Halaman terakhir adalah kesimpulan yang tidak ditulis — karena pengunjung yang menarik sendiri. Desain bekerja sebagai logika, bukan dekorasi.

Tiga prinsip yang tidak boleh dilanggar:

1. **Meaning over motion** — animasi ada karena memperjelas, bukan karena bisa.
2. **Tension as aesthetic** — kontras antara rigiditas grid dan kebebasan tipografi adalah karakter, bukan inkonsistensi.
3. **The work speaks first** — porto tampil tanpa caption panjang. Visual cukup. Teks hanya saat dibutuhkan.

---

## 1. Visual Identity

### 1.1 Warna

Palet dibangun dari dua kutub: **matematis (dingin, presisi)** dan **organik (hangat, proses)**. Tidak ada warna yang "fun" — setiap warna punya argumentasi.

```
/* Core */
--color-ink:        #0D0D0D;   /* Hampir hitam. Bukan #000 — terlalu keras. */
--color-paper:      #F5F2EC;   /* Off-white. Kertas lama, bukan layar steril. */
--color-void:       #1A1A1A;   /* Background section gelap. */

/* Accent — satu warna, dipakai jarang */
--color-signal:     #C8FF00;   /* Acid lime. Muncul hanya saat ada sesuatu penting. */
--color-signal-dim: #A8D800;   /* Hover state dari signal. */

/* Neutral */
--color-muted:      #6B6B6B;   /* Caption, label, metadata. */
--color-border:     #E0DDD6;   /* Divider halus di background terang. */
--color-border-dk:  #2A2A2A;   /* Divider di background gelap. */
```

**Aturan warna:**
- `--color-signal` maksimal muncul 3x per halaman. Jika lebih, ia kehilangan fungsinya sebagai penanda.
- Background berganti antara `--color-paper` dan `--color-void` antar section — bukan antar halaman. Ritme gelap-terang adalah navigasi visual.
- Tidak ada gradien kecuali pada elemen generatif/matematis (lihat: Hero section).

### 1.2 Tipografi

Dua typeface. Tidak lebih.

```
/* Display — untuk headline besar, angka, statement */
font-family: "Editorial New", "Playfair Display", Georgia, serif;
/* Karakter: tajam, kontras tinggi antara stroke tebal-tipis, presisi editorial */

/* Body & UI — untuk semua teks fungsional */
font-family: "Geist", "Inter", system-ui, sans-serif;
/* Karakter: bersih, legible, tidak menarik perhatian ke dirinya sendiri */
```

**Skala tipografi (base: 16px, ratio: 1.333 — perfect fourth):**

```
--text-xs:    0.563rem;   /* 9px  — metadata, label kecil */
--text-sm:    0.750rem;   /* 12px — caption, nav item */
--text-base:  1.000rem;   /* 16px — body */
--text-md:    1.333rem;   /* 21px — lead paragraph */
--text-lg:    1.777rem;   /* 28px — subheading */
--text-xl:    2.369rem;   /* 38px — section title */
--text-2xl:   3.157rem;   /* 51px — display medium */
--text-3xl:   4.209rem;   /* 67px — display large */
--text-hero:  clamp(4rem, 12vw, 9rem); /* Hero — fluid, memenuhi layar */
```

**Aturan tipografi:**
- Headline menggunakan `Editorial New` dengan `font-weight: 300` (light) — kontras dengan konten padat di bawahnya.
- Angka-angka besar (statistik, tahun, nomor urut portofolio) menggunakan `Editorial New` dengan `font-variant-numeric: tabular-nums`.
- Letter-spacing pada uppercase label: `0.12em`. Bukan lebih — ini bukan poster jadul.
- Line-height body: `1.6`. Display: `1.05`.

---

## 2. Layout & Grid

### 2.1 Grid System

```
/* Desktop */
--grid-cols: 12;
--grid-gutter: 2rem;        /* 32px */
--grid-margin: clamp(1.5rem, 5vw, 5rem);

/* Tablet */
--grid-cols: 8;
--grid-gutter: 1.5rem;

/* Mobile */
--grid-cols: 4;
--grid-gutter: 1rem;
--grid-margin: 1.25rem;
```

Grid 12-kolom, tapi **tidak dipakai simetris**. Konten bisa duduk di kolom 1-7, lalu headline melompat ke kolom 2-12. Asimetri adalah karakter, bukan kesalahan.

### 2.2 Spacing Scale

```
--space-1:   0.25rem;   /*  4px */
--space-2:   0.5rem;    /*  8px */
--space-3:   0.75rem;   /* 12px */
--space-4:   1rem;      /* 16px */
--space-6:   1.5rem;    /* 24px */
--space-8:   2rem;      /* 32px */
--space-12:  3rem;      /* 48px */
--space-16:  4rem;      /* 64px */
--space-24:  6rem;      /* 96px */
--space-32:  8rem;      /* 128px — jarak antar section besar */
--space-48: 12rem;      /* 192px — breathing room di hero */
```

**Aturan spacing:**
- Section-to-section: minimum `--space-32`.
- Tidak ada card dengan border-radius lebih dari `4px`. Lemma bukan aplikasi consumer.
- Gambar portofolio tidak punya border-radius — full rectangular, seperti cetakan foto.

---

## 3. Struktur Halaman

### 3.1 Navigasi

```
Nav — posisi: fixed top, full-width
├── Kiri: Wordmark "LEMMA" (Geist, uppercase, tracking lebar)
├── Tengah: — kosong —
└── Kanan: 
    ├── Language toggle: [ID] / [EN]  ← i18n switcher
    ├── Nav links: Work · Studio · Products · Contact
    └── CTA kecil: "Start a project →"
```

Nav background: `transparent` saat di hero, berubah ke `--color-paper` atau `--color-void` (sesuai section aktif) setelah scroll 80px — transisi `backdrop-filter: blur(12px)` dengan opacity bertahap.

Tidak ada hamburger menu di desktop. Di mobile, nav collapse ke ikon `[≡]` dengan full-screen overlay gelap.

### 3.2 Hero Section

**Tone: Pernyataan, bukan sambutan.**

```
Layout:
┌─────────────────────────────────────────────────────┐
│ [Noise/grid matematis — generatif, subtle]          │
│                                                     │
│  The work            ← Editorial New, hero size     │
│  before              ← baris kedua lebih inden      │
│    the work.         ← baris ketiga, paling inden   │
│                                                     │
│  [Lead: 1 kalimat]   ← Geist, text-md, muted       │
│                                                     │
│  [Scroll indicator]  ← "↓ Scroll" atau animasi     │
└─────────────────────────────────────────────────────┘
```

**Elemen generatif di background hero:**
Canvas atau SVG dengan grid titik-titik kecil yang sedikit bergerak mengikuti cursor (parallax ringan, `transform: translate` dengan faktor 0.02). Ini bukan dekoratif — ini merepresentasikan *solution space* dari logo filosofi Lemma. Intensitas partikel: rendah, tidak mengganggu teks.

**Teks headline animasi:**
Kata-kata muncul per baris dengan `clip-path: inset(0 100% 0 0)` → `inset(0 0% 0 0)`, durasi 0.8s, easing `cubic-bezier(0.16, 1, 0.3, 1)`. Baris kedua delay 0.15s, baris ketiga delay 0.3s.

### 3.3 Selected Work (Portofolio)

**Ini adalah jantung halaman.**

Layout portofolio mengikuti pendekatan **asimetris-bertahap** — bukan grid card uniform.

```
Item 1: Full-width horizontal (gambar kiri 60%, teks kanan 40%)
Item 2: Gambar besar kanan 70%, teks overlay kiri bawah
Item 3: Dua kolom setara — gambar kiri, deskripsi kanan
Item 4: Gambar full-width dengan caption overlay saat hover
```

Setiap item porto memiliki:
- **Nomor urut** — `01.`, `02.` — Editorial New, besar, muted, pojok kiri atas
- **Nama klien / produk** — Editorial New, display size
- **Tag kategori** — `Brand Identity` / `Engineering` / `Product` — label kecil uppercase
- **Tahun** — Geist, muted
- **Hover state:** gambar scale `1.02` + overlay hitam `opacity: 0.15` + muncul teks "View →"

**Tidak ada deskripsi panjang di grid portofolio.** Klik masuk ke halaman detail proyek.

### 3.4 Studio Section

Bukan "About Us" — ini **"Siapa kami dan kenapa itu penting"**.

```
Layout:
├── Kiri (col 1-5): Teks — filosofi, cara kerja, 2-3 paragraf
└── Kanan (col 7-12): 
    ├── Satu foto tim / studio (monokrom, crop ketat)
    └── 3 angka besar: "4+ tahun", "12 proyek", "2 produk aktif"
```

Angka-angka ini menggunakan Editorial New ukuran sangat besar (`text-3xl`), warna `--color-signal` pada digit, label kecil di bawahnya muted.

### 3.5 Products Section

**Produk internal Lemma — NATA dan ARAH AI.**

```
Layout: Dua kolom setara dengan background --color-void (dark section)

NATA card:
├── Badge: "Active Development"  ← dot hijau + label
├── Nama: NATA
├── Tagline: 1 kalimat
├── Tags: EdTech · B2C · Indonesia
└── CTA: "Learn more →"

ARAH AI card:
├── Badge: "Stealth"  ← dot abu/dim
├── Nama: ARAH AI ██████  ← nama penuh di-redact visual
├── Tagline: "AI-assisted student development."
├── Tags: AI · B2B SaaS · EdTech
└── CTA: "Coming soon"  ← disabled, cursor: not-allowed
```

Efek redacted pada ARAH AI: nama lengkap diisi blok `█` dengan opacity animasi pulse lambat. Ini adalah sinyal stealth yang deliberate dan estetik sekaligus.

### 3.6 Contact / CTA Section

Satu kalimat besar. Bukan form panjang.

```
Background: --color-void

Content:
├── Headline: "Got a problem worth solving?" (Editorial New, text-2xl)
├── Sub: "Start a conversation." (Geist, muted)
├── Email besar yang bisa diklik: hello@lemma.studio
└── Atau: tombol "→ Start a project" (outlined, hover: fill --color-signal)
```

---

## 4. Motion & Animation

### 4.1 Prinsip

- **Durasi default:** 400ms untuk transisi UI, 800ms untuk reveal konten.
- **Easing standar:** `cubic-bezier(0.16, 1, 0.3, 1)` — masuk cepat, overshoot halus, settle natural. Ini easing yang dipakai Vercel, Linear, dan Linear (app). Terasa presisi.
- **Tidak ada bounce yang berlebihan.** Tidak ada `spring` yang terasa seperti aplikasi consumer.
- Semua animasi **respects `prefers-reduced-motion`** — jika user set reduced motion, animasi mati sepenuhnya.

### 4.2 Scroll Reveal

Semua elemen di luar viewport pada saat load menggunakan IntersectionObserver dengan:

```js
{
  threshold: 0.15,   // mulai animasi saat 15% elemen terlihat
  rootMargin: "0px 0px -60px 0px"  // sedikit lebih awal dari tepi bawah
}
```

Animasi reveal default:
```css
/* Initial state */
opacity: 0;
transform: translateY(24px);

/* Revealed state */
opacity: 1;
transform: translateY(0);
transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
```

Delay stagger untuk elemen dalam satu grup: `0.08s` per item.

### 4.3 Cursor Custom (Desktop)

Cursor default diganti dengan dot kecil `8px × 8px`, warna `--color-signal`, border-radius `50%`, dengan lag ringan (lerp 0.15) mengikuti pointer asli.

Saat hover di atas elemen interaktif: cursor expand ke `32px`, opacity turun ke `0.6`, `mix-blend-mode: difference` — efeknya teks di bawah cursor berubah warna karena blend mode.

### 4.4 Page Transition

Saat navigasi antar halaman (SPA): overlay `--color-ink` slide masuk dari bawah (200ms), content baru load, overlay slide keluar ke atas (300ms). Total: ~500ms. Tidak mengganggu, tidak menunggu.

---

## 5. Internasionalisasi (i18n)

### 5.1 Bahasa

Dua bahasa: **Bahasa Indonesia (ID)** dan **English (EN)**.

Default: deteksi dari `navigator.language`. Jika `id` atau `id-ID` → load ID. Semua yang lain → load EN.

### 5.2 Toggle UI

```
Posisi: Nav kanan, sebelum nav links
Tampilan: [ID] / [EN]  — dua label teks kecil dipisah garis miring
State aktif: label bold, warna --color-ink (atau putih di dark nav)
State tidak aktif: --color-muted
Transisi: konten fade out 150ms → swap bahasa → fade in 150ms
```

Tidak ada dropdown, tidak ada globe icon. Label langsung — ini keputusan tipografi, bukan UI pattern umum.

### 5.3 Konten yang Diterjemahkan

| Elemen | ID | EN |
|---|---|---|
| Nav links | Karya · Studio · Produk · Kontak | Work · Studio · Products · Contact |
| Hero headline | "Kerja sebelum karya." | "The work before the work." |
| Hero sub | "Studio venture berbasis bukti." | "Evidence-based venture studio." |
| CTA | "Mulai proyek →" | "Start a project →" |
| Porto label | "Karya Terpilih" | "Selected Work" |
| Studio section | Teks penuh berbeda — bukan translate literal | Teks penuh berbeda |
| Products | Deskripsi NATA & ARAH disesuaikan konteks | Idem |
| Contact headline | "Ada masalah yang layak dipecahkan?" | "Got a problem worth solving?" |

**Aturan i18n:**
- Bukan translate kata per kata. Setiap bahasa punya voice-nya sendiri.
- Bahasa Indonesia: lebih langsung, lebih dekat. Bahasa Inggris: lebih editorial, lebih minimal.
- URL tidak berubah saat ganti bahasa (`?lang=id` atau localStorage). Tidak ada `/id/` prefix di URL.

---

## 6. Komponen UI

### Button

```css
/* Primary — outlined */
.btn-primary {
  border: 1.5px solid currentColor;
  padding: 0.625rem 1.5rem;
  font-family: var(--font-sans);
  font-size: var(--text-sm);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  background: transparent;
  transition: background 0.25s ease, color 0.25s ease;
}
.btn-primary:hover {
  background: var(--color-ink);
  color: var(--color-paper);
}

/* Dark context variant */
.btn-primary.dark:hover {
  background: var(--color-signal);
  color: var(--color-ink);
}
```

### Tag / Badge

```css
.tag {
  display: inline-flex;
  padding: 0.25rem 0.625rem;
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-muted);
  border-radius: 2px;   /* hampir tidak ada radius */
}
```

### Divider

Bukan `<hr>` biasa — divider adalah elemen konstruktif:
```css
.divider {
  width: 100%;
  height: 1px;
  background: var(--color-border);
}
/* Dengan nomor section */
.divider-labeled {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.divider-labeled::before { content: "0" counter(section); font-size: var(--text-xs); color: var(--color-muted); }
.divider-labeled::after  { content: ""; flex: 1; height: 1px; background: var(--color-border); }
```

---

## 7. Dark Mode

**Bukan toggle. Bukan otomatis.**

Website Lemma menggunakan dark section secara deliberat (misalnya Products section dan Contact section selalu gelap) bukan karena mengikuti `prefers-color-scheme`. Ini keputusan editorial: ritme terang-gelap adalah bagian dari narasi visual.

`prefers-color-scheme: dark` tetap dihormati untuk elemen UI minor (scrollbar, selection color), tapi tidak mengubah layout halaman.

---

## 8. Tech Stack Rekomendasi

| Layer | Pilihan | Alasan |
|---|---|---|
| Framework | Next.js 15 (App Router) | SSG untuk performa + SPA untuk transisi |
| Styling | Tailwind CSS + CSS Variables | Utility + token sistem yang konsisten |
| Animation | Framer Motion + GSAP (hanya untuk hero) | Framer untuk komponen React, GSAP untuk timeline kompleks |
| i18n | `next-intl` | Mature, App Router support, no-redirect i18n |
| Fonts | `next/font` (self-hosted) | Zero CLS, tidak ada request ke Google Fonts |
| CMS Porto | Notion API atau MDX lokal | Fleksibel — update porto tanpa deploy ulang |
| Deployment | Vercel | Native Next.js, edge network, preview URLs |
| Analytics | Vercel Analytics + Umami (self-hosted) | Privacy-respecting, tidak ada cookie banner |

---

## 9. Halaman Detail Proyek

Setiap entri portofolio punya halaman `/work/[slug]` dengan struktur:

```
├── Hero: Nama proyek besar + satu kalimat konteks
├── Meta row: Klien · Tahun · Kategori · Peran
├── Gambar hero proyek (full-width, no padding)
├── Brief section: Masalah yang diselesaikan (2-3 paragraf)
├── Gallery: Gambar-gambar proses dan hasil (layout asimetris)
├── Outcome: Apa yang berubah / dihasilkan
└── Nav: ← Proyek sebelumnya | Proyek berikutnya →
```

Tidak ada sidebar. Tidak ada related posts. Fokus pada satu karya satu waktu.

---

## 10. Checklist Sebelum Launch

- [ ] Lighthouse score ≥ 95 di Performance, Accessibility, Best Practices
- [ ] CLS < 0.1 (tidak ada layout shift dari font atau gambar)
- [ ] Semua gambar porto menggunakan `next/image` dengan `sizes` yang tepat
- [ ] `prefers-reduced-motion` diuji di semua animasi
- [ ] i18n: semua key terjemahkan, tidak ada fallback ke bahasa lain yang terlihat user
- [ ] Custom cursor nonaktif di touch device
- [ ] Meta tags lengkap: OG image, Twitter card, description per halaman
- [ ] `robots.txt` dan `sitemap.xml` di-generate otomatis
- [ ] `/work/arah-ai` tidak ada atau redirect — sesuai kebijakan stealth

---

*DESIGN.md ini adalah dokumen hidup. Update setiap kali ada keputusan desain baru yang signifikan.*
*Version control dokumen ini di repo yang sama dengan kode.*

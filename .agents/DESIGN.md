# DESIGN.md
## Lemma Web: Design System dan Direction (Dark, Orange, Mono)

PT Masih Dilemma Makna | lemma.studio | v2.0 | Oktober 2026

Dokumen ini adalah brief implementasi untuk AI agent. Ia menggantikan DESIGN.md v1.0 (palet paper/void dengan aksen lime). Copy halaman Home ada di `lemma_home_copywriting.md` dan menjadi satu-satunya sumber teks. Jangan menulis ulang copy.

## 0. Cara Memakai Dokumen Ini (untuk AI Agent)

1. Baca seluruh dokumen sebelum menulis kode.
2. Bangun urutan ini: foundation (token, font, i18n, smooth scroll), lalu komponen, lalu section Home, lalu halaman lain.
3. Semua teks tampil lewat key i18n. Tidak ada string hardcoded di komponen.
4. Jika ada konflik antara dokumen ini dan kebiasaan template, dokumen ini menang.
5. Kerjakan checklist di bagian 12 sebelum menyatakan selesai.

## 1. Filosofi dan Karakter

Website Lemma adalah argumen yang berjalan. Tiap section adalah satu premis. Tampilannya minimalis modern ala studio UI/UX: gelap, presisi, banyak teks mono sebagai penanda, satu aksen oranye.

Prinsip:
1. **Meaning over motion.** Animasi hanya untuk memperjelas hirarki dan urutan baca.
2. **Grid sebagai karakter.** Garis tipis, nomor section, label mono. Terlihat seperti dokumen teknis yang dirancang rapi.
3. **Hasil kerja bicara lebih dulu.** Portofolio tampil visual dulu, teks seperlunya.
4. **Satu aksen.** Oranye dipakai untuk hal yang bisa diklik atau penting. Tidak ada warna kedua.

Yang harus dihindari:
- Gradien warna-warni, glassmorphism berlebihan, stiker/tape ala portofolio playful.
- Emoji di UI.
- Ikon dekoratif per layanan.
- Bounce atau spring berlebihan.

## 2. Referensi Visual

Referensi berikut dari gambar yang kamu kirim, dengan apa yang diambil dan apa yang ditinggalkan.

| Referensi | Diambil | Ditinggalkan |
|---|---|---|
| Poster "Feel the freedom of nature" (mosaik piksel menutup foto) | Transisi gambar dari mosaik kotak ke foto penuh. Dipakai untuk hover karya dan transisi hero. Label kecil dalam kotak hitam. | Warna putih kertas |
| "Create with no limitations" (dither 1-bit hitam putih) | Perlakuan gambar dither/halftone di hero dan placeholder. Teks kecil di tengah bawah, banyak ruang kosong. | Serif italic sebagai aksen kata |
| "Bringing people together" (gelap, grain, nav pill tengah) | Nav pill di tengah atas, grain halus, tombol pill putih dengan panah | Ilustrasi tangan |
| Portofolio Robin (tag berwarna, label mono, nomor proyek) | Label mono besar-kecil, penomoran proyek "PROJECT 01", tab nav dengan ikon kecil | Warna-warni, stiker, font tulisan tangan, tape |
| Mindly (headline serif besar, kartu melayang, badge melingkar) | Komposisi hero simetris dengan headline besar dan kartu kecil di sisi | Serif display, terang |
| "Build Your Identity" (gelap, nav pill, label kursor melayang) | Label kursor bernama (misalnya "View"), kartu berjajar di bawah hero | 3D avatar, warna jenuh |

Referensi tambahan untuk dilihat agent atau desainer:
- [Dark Themed Web Design Inspiration](https://www.dark.design/): kurasi situs bertema gelap.
- [Siiimple](https://siiimple.com/): galeri situs minimalis, bagus untuk tipografi dan ruang kosong.
- [Fontshare](https://www.fontshare.com/): sumber General Sans.
- Dribbble tag [dark portfolio](https://dribbble.com/tags/dark-portfolio) dan [minimal portfolio](https://dribbble.com/tags/minimal-portfolio).

## 3. Token Warna (Dark Only)

Tidak ada toggle terang. Seluruh halaman gelap, dengan perbedaan tonal antar section untuk ritme.

```css
:root {
  /* Surface */
  --bg:            #0A0A0A;   /* dasar halaman */
  --bg-raised:     #101010;   /* section selang-seling */
  --surface:       #151515;   /* kartu, panel */
  --surface-2:     #1C1C1C;   /* hover kartu */

  /* Text */
  --fg:            #F2F0EB;   /* teks utama, off-white hangat */
  --fg-muted:      #A3A099;   /* paragraf sekunder */
  --fg-dim:        #6E6B65;   /* label, metadata */

  /* Line */
  --line:          #232323;
  --line-strong:   #333333;

  /* Accent: oranye */
  --accent:        #FF5A1F;
  --accent-hover:  #FF7440;
  --accent-press:  #E04A12;
  --accent-soft:   rgba(255, 90, 31, 0.12);
  --on-accent:     #0A0A0A;   /* teks di atas tombol oranye */

  /* Status */
  --ok:            #4ADE80;   /* dot "Active Development" */
  --idle:          #6E6B65;   /* dot "Stealth" */
}
```

Aturan warna:
- Oranye dipakai untuk: tombol primer, link hover, dot status aktif, nomor section yang sedang aktif, kursor, satu kata kunci per headline (opsional), dan titik dalam grid generatif.
- Jangan pakai oranye untuk teks paragraf panjang.
- Kontras teks di atas `--bg` minimal 4.5:1. `--fg-dim` hanya untuk teks 12px ke atas yang bukan informasi penting.
- Tanpa gradien, kecuali grid generatif di hero dan efek grain.

## 4. Tipografi

Dua keluarga: **General Sans** (heading dan paragraf) dan **mono** (label, UI, data). Mono dipakai banyak, itu bagian dari karakter.

### 4.1 Font

| Peran | Font | Sumber | Fallback |
|---|---|---|---|
| Heading dan paragraf | General Sans (variable) | Fontshare, self-host | `Inter, system-ui, sans-serif` |
| Mono | Geist Mono | `next/font/google` (di-host sendiri saat build) | `ui-monospace, "SF Mono", Menlo, monospace` |

General Sans tersedia sebagai font variable di Fontshare. Unduh dari Fontshare, simpan di `public/fonts` atau `app/fonts`, lalu muat dengan `next/font/local`. Periksa lisensi Fontshare untuk penggunaan komersial sebelum launch dan simpan salinan lisensinya di repo.

```ts
// app/fonts.ts
import localFont from 'next/font/local';
import { Geist_Mono } from 'next/font/google';

export const generalSans = localFont({
  src: [{ path: './fonts/GeneralSans-Variable.woff2', style: 'normal' }],
  variable: '--font-sans',
  display: 'swap',
  weight: '200 700',
});

export const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});
```

### 4.2 Skala (base 16px, rasio 1.25)

```css
:root {
  --text-2xs:  0.6875rem;  /* 11px mono label */
  --text-xs:   0.75rem;    /* 12px mono UI */
  --text-sm:   0.875rem;   /* 14px caption */
  --text-base: 1rem;       /* 16px paragraf */
  --text-md:   1.25rem;    /* 20px lead */
  --text-lg:   1.5625rem;  /* 25px subheading */
  --text-xl:   2.125rem;   /* 34px judul section */
  --text-2xl:  3rem;       /* 48px */
  --text-hero: clamp(3.25rem, 11vw, 9.5rem);
}
```

### 4.3 Aturan Penggunaan

| Elemen | Font | Weight | Ukuran | Tracking | Line-height |
|---|---|---|---|---|---|
| Hero headline | General Sans | 500 | hero | -0.04em | 0.95 |
| Judul section | General Sans | 500 | xl sampai 2xl | -0.03em | 1.05 |
| Lead | General Sans | 400 | md | -0.01em | 1.45 |
| Paragraf | General Sans | 400 | base | 0 | 1.6 |
| Nav, tombol, tag, label | Mono | 400 sampai 500 | 2xs sampai xs | 0.04em, uppercase | 1.2 |
| Nomor section dan proyek | Mono | 400 | xs | 0.08em | 1 |
| Angka besar (statistik) | General Sans | 500, tabular-nums | 2xl | -0.04em | 1 |
| Metadata (klien, tahun, peran) | Mono | 400 | xs | 0.04em | 1.4 |
| Email besar di Kontak | Mono | 400 | lg | -0.02em | 1.2 |

Pola yang berulang di seluruh halaman: label mono kecil di atas judul besar, misalnya `01 / PREMIS` lalu headline.

## 5. Grid, Spacing, Komponen Dasar

```css
:root {
  --grid-cols: 12;
  --grid-gutter: 1.5rem;
  --grid-margin: clamp(1.25rem, 4vw, 4rem);
  --max-w: 1440px;

  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-6: 1.5rem;   --space-8: 2rem;
  --space-12: 3rem;    --space-16: 4rem;    --space-24: 6rem;
  --space-32: 8rem;    --space-40: 10rem;

  --radius-sm: 4px;
  --radius-pill: 999px;
}
```

- Desktop 12 kolom, tablet 8, mobile 4. Layout boleh asimetris (teks kolom 1-6, visual kolom 7-12).
- Jarak antar section minimal `--space-32` di desktop, `--space-16` di mobile.
- Radius maksimal 4px untuk kartu dan gambar. Radius pill hanya untuk nav, tombol, dan badge.
- Garis pemisah 1px `--line`. Setiap section diawali baris label: nomor, nama, garis memanjang.

### 5.1 Grain

Overlay noise halus di seluruh halaman, `position: fixed; inset: 0; pointer-events: none; z-index: 60; opacity: 0.05; mix-blend-mode: overlay`. Gunakan PNG noise 200x200 yang di-tile. Matikan saat `prefers-reduced-motion` bila dianimasikan; versi statis tetap boleh.

### 5.2 Tombol

```css
.btn {
  display: inline-flex; align-items: center; gap: .625rem;
  height: 44px; padding: 0 1.25rem;
  font: 500 var(--text-xs)/1 var(--font-mono);
  letter-spacing: .06em; text-transform: uppercase;
  border-radius: var(--radius-pill);
  transition: background .3s, color .3s, border-color .3s;
}
.btn-primary { background: var(--accent); color: var(--on-accent); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-ghost { border: 1px solid var(--line-strong); color: var(--fg); }
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }
.btn .arrow { transition: transform .3s; }
.btn:hover .arrow { transform: translate(2px, -2px); }
```

Ikon panah diagonal `↗` di akhir tombol, mengikuti referensi tombol pill.

### 5.3 Tag dan Badge

Tag: border 1px `--line-strong`, mono 11px uppercase, padding 4px 10px, radius 4px.
Badge status: pill kecil dengan dot 6px (`--ok` untuk Active Development, `--idle` untuk Stealth) dan label mono.

## 6. Struktur Halaman Home

Urutan final:

| No | Section | Background | Catatan layout |
|---|---|---|---|
| 00 | Hero | `--bg` + grid dot generatif | Headline tiga baris berindentasi |
| 01 | Premis | `--bg` | Teks kolom 2-9, ukuran besar, penutup italic kecil |
| 02 | Cara Kerja | `--bg-raised` | Tiga langkah bernomor, sticky judul di kiri |
| 03 | Layanan Inti | `--bg` | Diagram integrasi + akordeon 5 baris |
| 04 | Karya Terpilih | `--bg` | Grid asimetris, hover mosaik piksel |
| 05 | Produk | `--bg-raised` | Dua kartu: NATA dan ARAH (stealth) |
| 06 | Tentang Kami | `--bg` | Teks kiri, tiga angka kanan |
| 07 | Kontak | `--bg-raised` | Satu kalimat besar, email mono, tombol |

### 6.1 Navigasi

Nav pill melayang di tengah atas (mengikuti referensi pill), bukan bar penuh.

```
        +-----------------------------------------------------------+
 LEMMA  |  Karya   Tentang Kami   Layanan   Produk   Kontak         |   [ID]/[EN]   [ MULAI PROYEK ↗ ]
        +-----------------------------------------------------------+
```

- Kiri: wordmark `LEMMA` (General Sans 600, uppercase, tracking 0.18em).
- Tengah: pill dengan 5 link mono uppercase. Link aktif berwarna `--accent`, dengan dot kecil di bawah.
- Kanan: toggle `[ID] / [EN]` dan tombol primer.
- Pill: `background: rgba(16,16,16,.7); backdrop-filter: blur(12px); border: 1px solid var(--line)`. Menyusut sedikit setelah scroll 80px.
- Mobile: pill diganti tombol `MENU`, membuka overlay penuh gelap dengan link besar.

### 6.2 Hero

```
+--------------------------------------------------------------+
| [dot grid generatif, oranye menyala dekat kursor]            |
|                                                              |
| 00 / LEMMA STUDIO                       JAKARTA, ID  GMT+7   |
|                                                              |
|  Kerja                                                       |
|        sebelum                                               |
|              bermakna.                                       |
|                                                              |
|  Lead satu kalimat (muted)               [ MULAI PROYEK ↗ ]  |
|                                                              |
|  ↓ GULIR                                 01 02 03 04 05 06  |
+--------------------------------------------------------------+
```

- Headline tiga baris, indentasi bertingkat (0, 1 kolom, 2 kolom).
- Satu kata di headline boleh berwarna `--accent` ("bermakna" di ID).
- Baris mono atas dan bawah memberi nuansa dokumen teknis. Jam lokal Jakarta bersifat opsional.
- Latar: canvas dot grid (lihat 8.4).

### 6.3 Layanan Inti

- Diagram integrasi UX, HCI, Data, Teknologi dibuat dengan SVG. Empat label mono di atas, garis halus menyatu ke satu titik oranye berlabel `MAKNA`. Garis tergambar saat masuk viewport (stroke-dashoffset).
- Akordeon lima baris: nomor mono, nama General Sans besar, satu kalimat muted, ikon `+` yang berputar jadi `-`. Hanya satu baris terbuka. Tinggi dianimasikan dengan GSAP (`height: auto`).
- Baris terbuka menampilkan deskripsi, link bukti, dan tombol ghost.

### 6.4 Karya Terpilih

Grid asimetris (bukan kartu seragam):

```
Item 01: gambar 7 kolom kiri, meta 5 kolom kanan
Item 02: meta kiri 4 kolom, gambar 8 kolom kanan
Item 03: dua kolom setara
Item 04: gambar penuh dengan caption overlay
```

Tiap item: nomor mono `PROJECT 01`, nama (General Sans besar), tag, tahun. Gambar default memakai perlakuan dither monokrom. Saat hover: mosaik piksel terbuka menjadi gambar berwarna (lihat 8.5), kursor berubah jadi label `VIEW`.

### 6.5 Produk

- Dua kartu `--surface`, border `--line`, tanpa radius lebih dari 4px.
- NATA: badge Active Development (dot hijau), tagline, tag, tombol.
- ARAH: nama disamarkan dengan blok `████` berdenyut pelan, badge Stealth, tombol nonaktif (`cursor: not-allowed`).
- Jangan pernah memunculkan nama panjang atau detail arsitektur ARAH AI. Rute `/work/arah-ai` tidak dibuat.

### 6.6 Kontak

- Satu kalimat besar. Email dalam mono ukuran lg, bisa diklik, garis bawah oranye saat hover.
- Tombol primer `MULAI PROYEK ↗`.
- Footer: wordmark, nama PT, tautan nav, toggle bahasa, hak cipta, baris merek "Masih Di Lemma Makna."

## 7. Internasionalisasi (i18n)

Dua bahasa: Indonesia (`id`) dan English (`en`). Library: `next-intl` dalam mode tanpa routing locale, jadi URL tidak berubah.

Aturan:
- Deteksi awal dari header `Accept-Language`; `id` memuat ID, selain itu EN.
- Pilihan user disimpan di cookie `NEXT_LOCALE` (1 tahun) dan dibaca di server agar tidak ada flash bahasa.
- Tidak ada prefix `/id` atau `/en` di URL. Tag `<html lang>` mengikuti locale aktif.
- Teks ID dan EN ditulis terpisah, bukan terjemahan kata per kata. Jangan menerjemahkan otomatis.
- Toggle: `[ID] / [EN]`, label aktif `--fg`, tidak aktif `--fg-dim`. Transisi konten: fade out 150ms, tukar, fade in 150ms (tanpa blur).
- Data portofolio dan produk menyimpan field per bahasa (`title.id`, `title.en`).

Struktur berkas:

```
messages/
  id.json
  en.json
i18n/
  request.ts        // baca cookie, fallback Accept-Language
  config.ts         // locales = ['id','en'], defaultLocale = 'en'
```

Contoh struktur key (isi diambil dari `lemma_home_copywriting.md`):

```json
{
  "nav": { "work": "Karya", "about": "Tentang Kami", "services": "Layanan", "products": "Produk", "contact": "Kontak", "cta": "Mulai proyek" },
  "hero": {
    "eyebrow": "00 / LEMMA STUDIO",
    "line1": "Kerja", "line2": "sebelum", "line3": "bermakna.",
    "lead": "Studio venture berbasis bukti. Kami mengerjakan riset, sistem, dan desain yang tak terlihat, supaya yang terlihat bisa berdiri.",
    "scroll": "Gulir"
  },
  "premise": { "label": "01 / Premis", "title": "...", "body": "...", "closing": "..." },
  "process": { "label": "02 / Cara Kerja", "steps": [ { "title": "...", "body": "..." } ] },
  "services": { "label": "03 / Layanan", "items": [ { "name": "...", "summary": "...", "detail": "...", "proof": "..." } ] }
}
```

Catatan: copy hero EN masih terbuka ("The work before the work." atau "Work before meaning."). Simpan sebagai key biasa agar mudah diganti.

## 8. Motion (GSAP, Lenis)

Library: `gsap`, `@gsap/react` (hook `useGSAP`), `lenis`. Daftarkan `ScrollTrigger` sekali di level modul. Semua animasi hormat pada `prefers-reduced-motion` (lihat 8.6).

### 8.1 Easing dan Durasi

| Token | Nilai |
|---|---|
| `ease-out-expo` | `expo.out` (GSAP) atau `cubic-bezier(0.16, 1, 0.3, 1)` (CSS) |
| Durasi UI | 0.3 sampai 0.4s |
| Durasi reveal | 0.9 sampai 1.4s |
| Stagger teks | 0.06s per kata, 0.12s per blok |

### 8.2 Lenis Smooth Scroll

Lenis dipasang sekali di provider klien, disinkronkan dengan ticker GSAP agar satu loop `requestAnimationFrame` menggerakkan keduanya, dan lag smoothing dimatikan agar ScrollTrigger akurat.

```tsx
// components/SmoothScroll.tsx
'use client';
import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
```

Pasang di `app/layout.tsx` membungkus `{children}`. Paket yang dipakai adalah `lenis` (bukan `@studio-freight/lenis` yang lama). Untuk anchor link, gunakan `lenis.scrollTo()`. Saat overlay menu mobile terbuka, panggil `lenis.stop()` dan `lenis.start()` saat tertutup.

### 8.3 Blur Intro (GSAP)

Intro tampil sekali per sesi: preloader singkat, lalu hero muncul dengan blur yang memudar. Total sekitar 2 detik. Pengulangan dalam sesi yang sama dilewati (cek `sessionStorage`).

Urutan:
1. 0.0s: layar `--bg`, wordmark `LEMMA` di tengah, blur 24px, opacity 0.
2. 0.0 sampai 0.8s: wordmark menjadi tajam (blur 0), counter mono `00` sampai `100` di pojok.
3. 0.8 sampai 1.1s: wordmark naik ke posisi nav, layar preloader terangkat (`yPercent: -100`).
4. 1.0 sampai 2.4s: elemen hero masuk berurutan (eyebrow, tiga baris headline per kata, lead, CTA, nav pill) dengan blur 20px menjadi 0, `y: 24` menjadi 0, opacity 0 menjadi 1.

```tsx
// lib/intro.ts
import gsap from 'gsap';

export function playIntro(scope: HTMLElement) {
  const q = gsap.utils.selector(scope);
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });

  tl.set(q('[data-intro]'), { autoAlpha: 0, filter: 'blur(20px)', y: 24 })
    .to(q('[data-intro="word"]'), {
      autoAlpha: 1, filter: 'blur(0px)', y: 0,
      duration: 1.4, stagger: 0.06,
    })
    .to(q('[data-intro="fade"]'), {
      autoAlpha: 1, filter: 'blur(0px)', y: 0,
      duration: 1.0, stagger: 0.1,
    }, '-=0.9')
    .set(q('[data-intro]'), { clearProps: 'filter,transform' });

  return tl;
}
```

Implementasi:
- Pecah headline menjadi kata dengan util sendiri (bungkus tiap kata dalam `span` inline-block). Plugin SplitText tidak wajib.
- Cegah flash konten: beri `html.is-loading [data-intro] { opacity: 0 }` lewat CSS, lepas kelas setelah timeline dimulai.
- Panggil di dalam `useGSAP({ scope })` agar otomatis dibersihkan saat unmount.
- Blur adalah filter yang mahal. Pakai hanya di intro dan headline hero. Jangan di daftar panjang atau di banyak elemen sekaligus. Hapus `filter` setelah selesai (`clearProps`).
- Scroll dikunci (`lenis.stop()`) selama intro, lalu `lenis.start()`.

### 8.4 Hero Dot Grid (Generatif)

Canvas 2D: grid titik 24px, radius 1px, warna `--line-strong`. Titik dalam radius sekitar 140px dari kursor membesar sampai 2.5px dan berubah ke `--accent` dengan falloff halus. Ini merepresentasikan solution space dari filosofi Lemma. Aturan:
- Maksimal 60 FPS, jeda saat tab tidak aktif (`document.hidden`) dan saat hero keluar viewport.
- Di touch device: grid statis, tanpa respon kursor.
- Canvas `aria-hidden="true"` dan `pointer-events: none`.

### 8.5 Mosaik Piksel (Hover Karya dan Transisi)

Terinspirasi poster mosaik: gambar proyek ditutup grid kotak (misalnya 12x8) berwarna `--bg`. Saat hover, kotak hilang acak dengan stagger `from: 'random'`, durasi total 0.6s, menampakkan gambar berwarna. Keluar hover: kotak kembali. Implementasi lewat canvas atau elemen absolut dengan `transform: scale`. Perlakuan default gambar: grayscale + kontras tinggi (atau file dither yang sudah diproses). Di touch device, gambar langsung berwarna.

### 8.6 Scroll Reveal dan Lainnya

- Reveal default: `opacity 0, y 24` menjadi `1, 0`, `ScrollTrigger` `start: 'top 85%'`, `toggleActions: 'play none none none'`, stagger 0.08s untuk elemen sejenis.
- Judul section: reveal per baris dengan `clip-path` atau mask, tanpa blur.
- Garis pemisah section digambar dari kiri ke kanan (`scaleX 0` menjadi `1`, `transform-origin: left`).
- Cara Kerja: judul sticky di kiri (`position: sticky; top: 20vh`), tiga langkah bergulir di kanan, nomor langkah aktif berwarna `--accent`.
- Kursor kustom (desktop saja): titik 8px `--accent`, lerp 0.15. Di atas elemen interaktif membesar jadi 28px dengan `mix-blend-mode: difference`. Di atas gambar karya berubah jadi pill berlabel `VIEW`. Nonaktif di touch device.
- Transisi halaman: overlay `--bg` naik dari bawah 0.3s, konten baru, overlay keluar ke atas 0.4s.
- `prefers-reduced-motion: reduce`: lewati intro, Lenis, kursor kustom, mosaik, dan reveal. Konten langsung terlihat penuh. Ini wajib.

## 9. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js (App Router), TypeScript | SSG untuk halaman statis |
| Styling | Tailwind CSS + CSS variables di atas | Token dipetakan ke `tailwind.config` |
| Animasi | GSAP + `@gsap/react` | Plugin yang dipakai: ScrollTrigger |
| Smooth scroll | `lenis` | Disinkronkan dengan ticker GSAP |
| i18n | `next-intl` (tanpa locale routing) | Cookie `NEXT_LOCALE` |
| Font | `next/font/local` (General Sans), `next/font/google` (Geist Mono) | Tanpa CLS |
| Konten portofolio | MDX lokal atau Notion API | Field per bahasa |
| Deploy | Vercel | Preview URL per PR |
| Analitik | Vercel Analytics + Umami self-hosted | Tanpa cookie banner |

## 10. Struktur Proyek

```
app/
  layout.tsx                 // font, SmoothScroll, NextIntlClientProvider, grain
  page.tsx                   // Home
  about/page.tsx
  services/page.tsx
  products/[slug]/page.tsx
  work/page.tsx
  work/[slug]/page.tsx
  contact/page.tsx
  fonts.ts
components/
  nav/ (NavPill, LangToggle, MobileMenu)
  home/ (Hero, Premise, Process, Services, SelectedWork, Products, About, ContactCta)
  ui/ (Button, Tag, Badge, SectionLabel, Accordion, Cursor, PixelReveal, DotGrid, Grain)
lib/
  intro.ts, gsap.ts, split.ts
messages/ id.json en.json
styles/ tokens.css globals.css
```

## 11. Halaman Lain (Ringkas)

- `/about`: filosofi, cara kerja, kapabilitas, tim per divisi (kerangka dulu, nama menyusul).
- `/services`: lima layanan dengan detail dan bukti.
- `/work/[slug]`: hero proyek, baris meta mono (Klien, Tahun, Kategori, Peran), gambar penuh, brief, galeri asimetris, hasil, navigasi proyek sebelum dan sesudah. Tanpa sidebar.
- `/products/nata`: halaman produk. `/products/arah-ai` tidak dibuat.
- `/contact`: kalimat besar, email, tombol. Form hanya bila diperlukan, satu layar.

## 12. Checklist Penerimaan

- [ ] Semua teks lewat i18n, ID dan EN lengkap, tanpa flash bahasa.
- [ ] Toggle bahasa tidak mengubah URL, pilihan tersimpan di cookie.
- [ ] Intro blur berjalan sekali per sesi, total di bawah 2.5 detik, scroll terkunci selama intro.
- [ ] Lenis tersinkron dengan ScrollTrigger tanpa jitter, anchor link memakai `lenis.scrollTo`.
- [ ] `prefers-reduced-motion` diuji: tidak ada intro, smooth scroll, kursor, atau mosaik.
- [ ] Mono dipakai konsisten untuk nav, label, tag, nomor, metadata, tombol.
- [ ] Oranye hanya untuk elemen interaktif, status, dan sorotan yang disebut di bagian 3.
- [ ] Kontras teks lolos WCAG AA.
- [ ] Lighthouse minimal 95 untuk Performance, Accessibility, Best Practices. CLS di bawah 0.1.
- [ ] Gambar memakai `next/image` dengan `sizes` yang benar.
- [ ] Kursor kustom dan mosaik tidak aktif di touch device.
- [ ] Tidak ada detail ARAH AI di halaman publik, `/work/arah-ai` tidak ada.
- [ ] Meta tags lengkap (OG image, Twitter card, description per halaman), `sitemap.xml` dan `robots.txt` otomatis.
- [ ] Salinan lisensi General Sans ada di repo.

## 13. Pertanyaan Terbuka untuk Pemilik

1. Hex oranye final. Default `#FF5A1F`; ganti jika brand punya nilai lain.
2. Hero EN: "The work before the work." atau "Work before meaning."
3. Apakah ingin satu aksen serif italic (seperti referensi Mindly dan "Create with no limitations")? Default: tidak, agar tetap dua keluarga font.
4. Gambar portofolio sudah tersedia dalam resolusi tinggi? Perlakuan dither perlu sumber yang bersih.
5. Preloader dengan counter boleh dipertahankan, atau intro langsung ke hero?

# Lemma Project Index

PT Masih Dilemma Makna · Jakarta · Updated October 2026

Language: [English](#english) · [Bahasa Indonesia](#bahasa-indonesia)

## Taxonomy

- **Categories:** Brand & Visual Identity · UX, HCI & Product Design · Engineering & Technology · AI & Data · Strategy & Systems
- **Type:** client · internal-product · internal-asset
- **Status:** delivered · active · stealth
- **Visibility:** public · limited · hidden · internal only

## Metadata Schema

```ts
type Project = {
  slug: string;
  name: string;
  type: "client" | "internal-product" | "internal-asset";
  category: Category;
  secondary?: Category[];
  tags: string[];
  year: string;
  status: "delivered" | "active" | "stealth";
  visibility: "public" | "limited" | "hidden";
  featured: boolean;
  role: { id: string; en: string };
  hook: { id: string; en: string };
  summary: { id: string; en: string };
  links?: string[];
};
```

# English

## Index

| # | Slug | Name | Type | Primary category | Secondary | Year | Status | Visibility | Featured |
|---|---|---|---|---|---|---|---|---|---|
| 01 | `crl-consulting-erp` | CRL Consulting ERP | client | Engineering & Technology | Strategy & Systems | 2025/26 | delivered | public | yes |
| 02 | `lpj-ormawa-ipb-2025` | LPJ Ormawa IPB 2025 | client | UX, HCI & Product Design | Engineering & Technology | 2025 | delivered | public | yes |
| 03 | `gumatika` | Gumatika, IPB University | client | Brand & Visual Identity | - | 2024/25 | delivered | public | yes |
| 04 | `jalansiswa` | JalanSiswa | client | Brand & Visual Identity | - | 2025 | delivered | public | yes |
| 05 | `bem-fahutan-langkah-bermakna` | BEM FAHUTAN IPB, Kabinet Langkah Bermakna | client | Brand & Visual Identity | UX, HCI & Product Design | 2025 | delivered | public | no |
| 06 | `himpro-hksa-serenata` | Himpro HKSA SKHB IPB, Kabinet Serenata | client | Brand & Visual Identity | - | 2025 | delivered | public | no |
| 07 | `nata` | NATA | internal-product | UX, HCI & Product Design | Engineering & Technology | 2026 | active | public | no |
| 08 | `arah-ai` | ARAH AI (LANGKAH AI) | internal-product | AI & Data | UX, HCI & Product Design | 2025/26 | stealth | hidden / limited | no |
| 09 | `lemma-web` | Lemma Website | internal-asset | UX, HCI & Product Design | Engineering & Technology | 2026 | active | public | no |
| 10 | `lemma-admin-guide` | Lemma Admin & Correspondence Guide | internal-asset | Strategy & Systems | - | 2026 | active | internal only | no |
| 11 | `nata-launch-campaign` | Nataku Beta Launch | internal-asset | Brand & Visual Identity | Strategy & Systems | 2026 | active | public | no |

## By Category

| Category | Projects |
|---|---|
| Brand & Visual Identity | Gumatika, IPB University, JalanSiswa, BEM FAHUTAN IPB, Kabinet Langkah Bermakna, Himpro HKSA SKHB IPB, Kabinet Serenata, Nataku Beta Launch |
| UX, HCI & Product Design | LPJ Ormawa IPB 2025, NATA, Lemma Website |
| Engineering & Technology | CRL Consulting ERP |
| AI & Data | ARAH AI (LANGKAH AI) |
| Strategy & Systems | Lemma Admin & Correspondence Guide |

## Project Entries

### 01. CRL Consulting ERP

- **Slug:** `crl-consulting-erp`
- **Client / owner:** CRL Consulting (Makan Bergizi Gratis program)
- **Category:** Engineering & Technology (+ Strategy & Systems)
- **Tags:** ERP, Dashboard, Partner Portal, Payroll, Compliance, Risk Monitoring
- **Role:** System design and engineering
- **Year:** 2025/26
- **Status:** delivered · public
- **Hook:** One system for dozens of kitchens.

A corporate control system for a multi-kitchen network. It covers an internal dashboard, partner portal, finance and payroll, compliance scoring, and real-time risk monitoring.

### 02. LPJ Ormawa IPB 2025

- **Slug:** `lpj-ormawa-ipb-2025`
- **Client / owner:** Direktorat Kemahasiswaan IPB University
- **Category:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** Data Storytelling, Report Design, Interactive Website, Design System
- **Role:** Report design, data visualisation, web build
- **Year:** 2025
- **Status:** delivered · public
- **Hook:** A report read for its content.

An accountability report rebuilt as a data-driven narrative, with a public interactive website and one consistent design system across chapters and organisations.

### 03. Gumatika, IPB University

- **Slug:** `gumatika`
- **Client / owner:** Gumatika, IPB University
- **Category:** Brand & Visual Identity
- **Tags:** Logo System, Philosophy-Driven Design, Brand Identity
- **Role:** Visual identity
- **Year:** 2024/25
- **Status:** delivered · public
- **Hook:** A logo you can defend with reasoning.

Three logo concepts, each with an explicit mathematical rationale, starting from one shared initial condition.

### 04. JalanSiswa

- **Slug:** `jalansiswa`
- **Client / owner:** JalanSiswa (ed-tech initiative)
- **Category:** Brand & Visual Identity
- **Tags:** Startup Branding, Ed-Tech, Brand Guideline
- **Role:** Logo and brand guideline
- **Year:** 2025
- **Status:** delivered · public
- **Hook:** Direction from the first step.

A logomark and brand foundation for a new ed-tech startup, built to adapt across digital contexts and grow with the product.

### 05. BEM FAHUTAN IPB, Kabinet Langkah Bermakna

- **Slug:** `bem-fahutan-langkah-bermakna`
- **Client / owner:** BEM Fakultas Kehutanan, IPB University
- **Category:** Brand & Visual Identity (+ UX, HCI & Product Design)
- **Tags:** Brand Identity, Brand Guideline, Design System, Figma
- **Role:** Logo, guideline, and design system
- **Year:** 2025
- **Status:** delivered · public
- **Hook:** One term, one consistent identity.

A visual identity system that many non-designers can use without breaking consistency, with templates and Figma documentation.

### 06. Himpro HKSA SKHB IPB, Kabinet Serenata

- **Slug:** `himpro-hksa-serenata`
- **Client / owner:** Himpro HKSA SKHB, IPB University
- **Category:** Brand & Visual Identity
- **Tags:** Brand Identity, Brand Guideline, Illustration, Supergraphics
- **Role:** Logo, guideline, and supporting illustration
- **Year:** 2025
- **Status:** delivered · public
- **Hook:** Harmony, made visible.

An organic, warm identity built around the idea of harmony, with a full guideline book, colour and type documentation, and supporting graphics.

### 07. NATA

- **Slug:** `nata`
- **Client / owner:** Internal (B2C)
- **Category:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** EdTech, Student Productivity, Indonesia
- **Role:** Co-founder, technology, systems, and design
- **Year:** 2026
- **Status:** active · public
- **Hook:** Five apps for one campus life? One is enough.

A single platform for student priority management, organisation task sync, and campus life navigation.

### 08. ARAH AI (LANGKAH AI)

- **Slug:** `arah-ai`
- **Client / owner:** Internal (B2B SaaS)
- **Category:** AI & Data (+ UX, HCI & Product Design)
- **Tags:** Recommender System, RAG, Talent Mapping, Explainability, Research
- **Role:** Research, AI engineering, product development
- **Year:** 2025/26
- **Status:** stealth · hidden / limited
- **Hook:** AI-assisted student development.

An AI platform for institutional student development with talent mapping, a hybrid recommender, a grounded chatbot, and a workforce analyzer in development. Research and validation are ongoing. Stealth: keep the name redacted and the public detail page absent or redirected.

### 09. Lemma Website

- **Slug:** `lemma-web`
- **Client / owner:** Internal
- **Category:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** Next.js, Bilingual ID/EN, Design System, Generative Hero
- **Role:** Design and engineering
- **Year:** 2026
- **Status:** active · public
- **Hook:** The work before the work.

The studio's own site, built as an argument: editorial typography, a strict grid, and a contour-map hero showing an undefined problem taking shape.

### 10. Lemma Admin & Correspondence Guide

- **Slug:** `lemma-admin-guide`
- **Client / owner:** Internal
- **Category:** Strategy & Systems
- **Tags:** SOP, Document Numbering, Finance Procedures, Archiving
- **Role:** Operations documentation
- **Year:** 2026
- **Status:** active · internal only
- **Hook:** Documents that can be traced.

Internal standards for document numbering, letter writing, finance procedures, and archiving.

### 11. Nataku Beta Launch

- **Slug:** `nata-launch-campaign`
- **Client / owner:** Internal, for NATA
- **Category:** Brand & Visual Identity (+ Strategy & Systems)
- **Tags:** Social Media, Campaign, Illustration, Mascot, Copywriting
- **Role:** Campaign concept, copywriting, and illustration
- **Year:** 2026
- **Status:** active · public
- **Hook:** A launch that talks, not advertises.

A social media campaign for the Nataku beta, the app from NATA. Ten posts that start from everyday student problems, with a mascot, illustration, and a familiar tone of voice.



# Bahasa Indonesia

## Indeks

| # | Slug | Name | Type | Primary category | Secondary | Year | Status | Visibility | Featured |
|---|---|---|---|---|---|---|---|---|---|
| 01 | `crl-consulting-erp` | CRL Consulting ERP | client | Engineering & Technology | Strategy & Systems | 2025/26 | delivered | public | yes |
| 02 | `lpj-ormawa-ipb-2025` | LPJ Ormawa IPB 2025 | client | UX, HCI & Product Design | Engineering & Technology | 2025 | delivered | public | yes |
| 03 | `gumatika` | Gumatika, IPB University | client | Brand & Visual Identity | - | 2024/25 | delivered | public | yes |
| 04 | `jalansiswa` | JalanSiswa | client | Brand & Visual Identity | - | 2025 | delivered | public | yes |
| 05 | `bem-fahutan-langkah-bermakna` | BEM FAHUTAN IPB, Kabinet Langkah Bermakna | client | Brand & Visual Identity | UX, HCI & Product Design | 2025 | delivered | public | no |
| 06 | `himpro-hksa-serenata` | Himpro HKSA SKHB IPB, Kabinet Serenata | client | Brand & Visual Identity | - | 2025 | delivered | public | no |
| 07 | `nata` | NATA | internal-product | UX, HCI & Product Design | Engineering & Technology | 2026 | active | public | no |
| 08 | `arah-ai` | ARAH AI (LANGKAH AI) | internal-product | AI & Data | UX, HCI & Product Design | 2025/26 | stealth | hidden / limited | no |
| 09 | `lemma-web` | Lemma Website | internal-asset | UX, HCI & Product Design | Engineering & Technology | 2026 | active | public | no |
| 10 | `lemma-admin-guide` | Lemma Admin & Correspondence Guide | internal-asset | Strategy & Systems | - | 2026 | active | internal only | no |
| 11 | `nata-launch-campaign` | Nataku Beta Launch | internal-asset | Brand & Visual Identity | Strategy & Systems | 2026 | active | public | no |

## Per Kategori

| Category | Projects |
|---|---|
| Brand & Visual Identity | Gumatika, IPB University, JalanSiswa, BEM FAHUTAN IPB, Kabinet Langkah Bermakna, Himpro HKSA SKHB IPB, Kabinet Serenata, Nataku Beta Launch |
| UX, HCI & Product Design | LPJ Ormawa IPB 2025, NATA, Lemma Website |
| Engineering & Technology | CRL Consulting ERP |
| AI & Data | ARAH AI (LANGKAH AI) |
| Strategy & Systems | Lemma Admin & Correspondence Guide |

## Detail Proyek

### 01. CRL Consulting ERP

- **Slug:** `crl-consulting-erp`
- **Klien / pemilik:** CRL Consulting (Makan Bergizi Gratis program)
- **Kategori:** Engineering & Technology (+ Strategy & Systems)
- **Tags:** ERP, Dashboard, Partner Portal, Payroll, Compliance, Risk Monitoring
- **Peran:** Perancangan sistem dan engineering
- **Tahun:** 2025/26
- **Status:** delivered · public
- **Hook:** Satu sistem untuk puluhan dapur.

Sistem kontrol korporat untuk jaringan multi-dapur. Mencakup dashboard internal, portal mitra, keuangan dan penggajian, penilaian kepatuhan, serta pemantauan risiko secara real-time.

### 02. LPJ Ormawa IPB 2025

- **Slug:** `lpj-ormawa-ipb-2025`
- **Klien / pemilik:** Direktorat Kemahasiswaan IPB University
- **Kategori:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** Data Storytelling, Report Design, Interactive Website, Design System
- **Peran:** Desain laporan, visualisasi data, pembangunan web
- **Tahun:** 2025
- **Status:** delivered · public
- **Hook:** Laporan yang dibaca karena isinya.

Laporan pertanggungjawaban yang disusun ulang sebagai narasi berbasis data, dengan website interaktif publik dan sistem desain yang konsisten lintas bab dan organisasi.

### 03. Gumatika, IPB University

- **Slug:** `gumatika`
- **Klien / pemilik:** Gumatika, IPB University
- **Kategori:** Brand & Visual Identity
- **Tags:** Logo System, Philosophy-Driven Design, Brand Identity
- **Peran:** Identitas visual
- **Tahun:** 2024/25
- **Status:** delivered · public
- **Hook:** Logo yang bisa dipertahankan dengan argumen.

Tiga konsep logo dengan landasan matematis yang eksplisit, berangkat dari satu kondisi awal yang sama.

### 04. JalanSiswa

- **Slug:** `jalansiswa`
- **Klien / pemilik:** JalanSiswa (ed-tech initiative)
- **Kategori:** Brand & Visual Identity
- **Tags:** Startup Branding, Ed-Tech, Brand Guideline
- **Peran:** Logo dan brand guideline
- **Tahun:** 2025
- **Status:** delivered · public
- **Hook:** Arah sejak langkah pertama.

Logomark dan fondasi brand untuk startup ed-tech baru, dirancang adaptif di berbagai konteks digital dan siap tumbuh bersama produk.

### 05. BEM FAHUTAN IPB, Kabinet Langkah Bermakna

- **Slug:** `bem-fahutan-langkah-bermakna`
- **Klien / pemilik:** BEM Fakultas Kehutanan, IPB University
- **Kategori:** Brand & Visual Identity (+ UX, HCI & Product Design)
- **Tags:** Brand Identity, Brand Guideline, Design System, Figma
- **Peran:** Logo, guideline, dan design system
- **Tahun:** 2025
- **Status:** delivered · public
- **Hook:** Satu kepengurusan, satu identitas yang konsisten.

Sistem identitas visual yang dapat dipakai banyak pengurus non-desainer tanpa merusak konsistensi, lengkap dengan template dan dokumentasi Figma.

### 06. Himpro HKSA SKHB IPB, Kabinet Serenata

- **Slug:** `himpro-hksa-serenata`
- **Klien / pemilik:** Himpro HKSA SKHB, IPB University
- **Kategori:** Brand & Visual Identity
- **Tags:** Brand Identity, Brand Guideline, Illustration, Supergraphics
- **Peran:** Logo, guideline, dan ilustrasi pendukung
- **Tahun:** 2025
- **Status:** delivered · public
- **Hook:** Harmoni yang terlihat.

Identitas organik dan hangat yang berangkat dari makna harmoni, lengkap dengan guideline book, dokumentasi warna dan tipografi, serta grafis pendukung.

### 07. NATA

- **Slug:** `nata`
- **Klien / pemilik:** Internal (B2C)
- **Kategori:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** EdTech, Student Productivity, Indonesia
- **Peran:** Co-founder, teknologi, sistem, dan desain
- **Tahun:** 2026
- **Status:** active · public
- **Hook:** Lima aplikasi untuk satu kehidupan kampus? Satu saja cukup.

Satu platform untuk manajemen prioritas mahasiswa, sinkronisasi tugas organisasi, dan navigasi kehidupan kampus.

### 08. ARAH AI (LANGKAH AI)

- **Slug:** `arah-ai`
- **Klien / pemilik:** Internal (B2B SaaS)
- **Kategori:** AI & Data (+ UX, HCI & Product Design)
- **Tags:** Recommender System, RAG, Talent Mapping, Explainability, Research
- **Peran:** Riset, AI engineering, pengembangan produk
- **Tahun:** 2025/26
- **Status:** stealth · hidden / limited
- **Hook:** Pengembangan mahasiswa berbantuan AI.

Platform AI untuk pengembangan mahasiswa secara institusional dengan pemetaan talenta, recommender hybrid, chatbot berbasis knowledge base, dan workforce analyzer yang sedang dikembangkan. Riset dan validasi masih berjalan. Stealth: nama tetap diredact dan halaman detail publik tidak ada atau diredirect.

### 09. Lemma Website

- **Slug:** `lemma-web`
- **Klien / pemilik:** Internal
- **Kategori:** UX, HCI & Product Design (+ Engineering & Technology)
- **Tags:** Next.js, Bilingual ID/EN, Design System, Generative Hero
- **Peran:** Desain dan engineering
- **Tahun:** 2026
- **Status:** active · public
- **Hook:** Kerja sebelum karya.

Website studio sendiri yang dirancang sebagai argumen: tipografi editorial, grid ketat, dan hero peta kontur yang menggambarkan masalah belum berbentuk yang perlahan terdefinisi.

### 10. Lemma Admin & Correspondence Guide

- **Slug:** `lemma-admin-guide`
- **Klien / pemilik:** Internal
- **Kategori:** Strategy & Systems
- **Tags:** SOP, Document Numbering, Finance Procedures, Archiving
- **Peran:** Dokumentasi operasional
- **Tahun:** 2026
- **Status:** active · internal only
- **Hook:** Dokumen yang bisa dilacak.

Standar internal untuk penomoran dokumen, penulisan surat, prosedur keuangan, dan pengarsipan.

### 11. Nataku Beta Launch

- **Slug:** `nata-launch-campaign`
- **Klien / pemilik:** Internal, untuk NATA
- **Kategori:** Brand & Visual Identity (+ Strategy & Systems)
- **Tags:** Social Media, Campaign, Illustration, Mascot, Copywriting
- **Peran:** Konsep kampanye, copywriting, dan ilustrasi
- **Tahun:** 2026
- **Status:** active · public
- **Hook:** Peluncuran yang mengajak ngobrol, bukan beriklan.

Kampanye media sosial untuk beta testing Nataku, aplikasi dari NATA. Sepuluh unggahan yang berangkat dari masalah sehari-hari mahasiswa, dengan maskot, ilustrasi, dan nada bicara yang akrab.



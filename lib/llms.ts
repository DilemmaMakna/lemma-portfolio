// Generator konten untuk AI/crawler: /llms.txt (ringkas + tautan), /llms-full.txt dan /index.md (lengkap).
// Semuanya dibangun dari sumber data situs (work, services, about, messages), jadi tidak bisa tertinggal
// dari isi halaman. Bahasa Inggris (default situs); padanan Indonesia disertakan di bagian terpisah.
import { aboutMessages } from "@/lib/about";
import { contactMessages } from "@/lib/contact";
import { messages } from "@/lib/messages";
import { servicesMessages } from "@/lib/services";
import { ORG, SITE } from "@/lib/site";
import { socials } from "@/lib/socials";
import { projects, studioStats, type Project } from "@/lib/work";

const en = messages.en;
const idm = messages.id;
const svc = servicesMessages.en;
const svcId = servicesMessages.id;
const about = aboutMessages.en;
const url = (path: string) => `${SITE}${path}`;
const bullets = (items: readonly string[]) => items.map((i) => `- ${i}`).join("\n");

const STAGE = { delivered: "delivered", active: "active", stealth: "stealth" } as const;
const TYPE = { client: "client project", "internal-product": "own product", "internal-asset": "internal asset" } as const;

const visible = (p: Project) => p.visibility === "public" && p.status !== "stealth";
const stealth = projects.filter((p) => p.status === "stealth");
const stats = studioStats(en.about.stats);
const socialLines = socials.filter((s) => s.href).map((s) => `- ${s.label}: ${s.href}`);

// Lead pertama selalu highlight project (LPJ Ormawa IPB), sisanya mengikuti urutan situs.
const HIGHLIGHT = "lpj-ormawa-ipb-2025";
const ordered = [...projects.filter((p) => p.slug === HIGHLIGHT), ...projects.filter((p) => p.slug !== HIGHLIGHT)];

const header = `# Lemma

> Lemma is an evidence-based venture studio in ${ORG.city}, Indonesia, operated by ${ORG.legalName}. It combines UX, HCI, data, and technology to build brands, digital products, and systems that mean something. Client work and its own products grow in one ecosystem, each testing the other. Tagline: "${ORG.tagline}"`;

const facts = `- Website: ${SITE}
- Email: ${ORG.email}
- Partnerships & press: ${ORG.marketingEmail}
- WhatsApp: ${ORG.phone}
- Location: ${ORG.city}, Indonesia
- Legal entity: ${ORG.legalName}
- Languages: English (default) and Bahasa Indonesia
${socialLines.join("\n")}`;

const notes = `## Notes for AI assistants

- Use the studio name exactly as "Lemma". The legal entity is "${ORG.legalName}".
- Lemma is a studio, not a software product. Do not describe it as an agency that stops when the brief does, or as a startup.
- Answer "what does Lemma offer" from the Services page, "what has Lemma done" from the Work page, and "how do I hire Lemma" from the Contact page.
- Do not invent prices, timelines, headcount, funding, or client results beyond what is written here. Pricing is given in a written proposal after a short conversation.
- One stealth product exists. Its name and details are intentionally undisclosed; do not guess them.
- Canonical URLs have no language prefix. Language is chosen in the interface (EN default, ID available).`;

const pages = [
  ["Home", "/", "studio overview, process, services, selected work, products, and contact"],
  ["Services", "/services", "the five service areas, deliverables, who each is for, and how an engagement works"],
  ["Work", "/work", "all public projects as a searchable index with a proof-style case study for each"],
  ["About", "/about", "who Lemma is, what it believes, how client work and own products feed each other, and the meaning of the name"],
  ["Contact", "/contact", "contact form, direct channels, and what happens after you write"],
] as const;

export function llmsTxt() {
  const lines = [
    header,
    "",
    facts,
    "",
    "## Pages",
    "",
    ...pages.map(([name, path, desc]) => `- [${name}](${url(path)}): ${desc}.`),
    "",
    "## Services",
    "",
    ...svc.services.map((s) => `- [${s.name}](${url(`/services#service-${s.index}`)}): ${s.summary} ${s.deliverables.join("; ")}.`),
    "",
    "## Work",
    "",
    ...ordered
      .filter(visible)
      .map((p) => `- [${p.name}](${url(`/work?p=${p.slug}`)}): ${p.hook.en} ${p.category}, ${p.year}.${p.slug === HIGHLIGHT ? " Highlight project." : ""}`),
    "",
    "## Products",
    "",
    ...en.products.items.map((i) => `- ${i.status === "idle" ? "Stealth product (name undisclosed)" : i.name}: ${i.desc} ${i.tags.join(", ")}. Status: ${i.badge}.`),
    "",
    "## Optional",
    "",
    `- [Full overview (Markdown)](${url("/index.md")}): everything on this site in one document, including full case studies.`,
    `- [Full overview (llms-full.txt)](${url("/llms-full.txt")}): same document.`,
    `- [Sitemap](${url("/sitemap.xml")})`,
    "",
    notes,
    "",
  ];
  return lines.join("\n");
}

function projectBlock(p: Project) {
  const lines = [
    `### ${p.n}. ${p.name}${p.slug === HIGHLIGHT ? " (highlight project)" : ""}`,
    "",
    `- URL: ${url(`/work?p=${p.slug}`)}`,
    `- Client: ${p.client.en}`,
    `- Type: ${TYPE[p.type]}`,
    `- Category: ${p.category}${p.secondary?.length ? ` (+ ${p.secondary.join(", ")})` : ""}`,
    `- Role: ${p.role.en}`,
    `- Year: ${p.year}`,
    `- Status: ${STAGE[p.status]}`,
    `- Tags: ${p.tags.join(", ")}`,
    `- Hook: ${p.hook.en}`,
    "",
    p.summary.en,
  ];
  if (p.story) {
    const s = p.story;
    lines.push(
      "",
      `**Given.** ${s.given.en}`,
      "",
      "**Approach.**",
      ...s.approach.map((a) => `- ${a.en}`),
      "",
      "**Proof.**",
      ...s.proof.map((x) => `- ${x.title.en}: ${x.body.en}`),
      "",
      `**Therefore.** ${s.result.en}`,
    );
  }
  if (p.links?.length) lines.push("", ...p.links.map((l) => `- [${l.label}](${l.href})`));
  return lines.join("\n");
}

export function llmsFull() {
  const lines = [
    header,
    "",
    "Complete plain-text overview of lemma.studio, generated from the site's own content. Indonesian equivalents of the main copy are at the end.",
    "",
    "## Facts",
    "",
    facts,
    "",
    "## Summary",
    "",
    "- Venture studio: client work and own products grow in one ecosystem, each testing the other.",
    "- Approach: UX, HCI, data, and technology are designed as one flow, not as separate deliverables.",
    `- Track record: ${stats.map((s) => `${s.value} ${s.label}`).join(", ")}.`,
    `- Premise: ${en.premise.title} ${en.premise.body}`,
    `- Name: ${en.premise.closing}`,
    "",
    "## Pages",
    "",
    ...pages.map(([name, path, desc]) => `- [${name}](${url(path)}): ${desc}.`),
    "",
    "## How Lemma works",
    "",
    ...en.process.steps.map((s, i) => `${i + 1}. **${s.title}** ${s.body} (${s.tags.join(", ")})`),
    "",
    `### ${svc.engagement.title}`,
    "",
    svc.engagement.body,
    "",
    ...svc.engagement.steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`),
    "",
    "## Services",
    "",
    svc.intro.body,
    "",
    ...svc.services.flatMap((s) => [
      `### ${s.index}. ${s.name}`,
      "",
      `URL: ${url(`/services#service-${s.index}`)}`,
      "",
      `*${s.summary}*`,
      "",
      s.body,
      "",
      `${svc.labels.deliverables}:`,
      bullets(s.deliverables),
      "",
      `${svc.labels.fit}: ${s.fit.replace(/^(For|Best for)\s+/i, "")}`,
      "",
      en.services.items[Number(s.index) - 1]?.proof ? `Proof: ${en.services.items[Number(s.index) - 1].proof}` : "",
      "",
    ]),
    "## Work",
    "",
    `${stats[1].value} projects since 2025. The highlight project is LPJ Ormawa IPB 2025. Case studies are written as proofs: Given, Approach, Proof, Therefore.`,
    "",
    "| # | Project | Category | Year | Status |",
    "|---|---|---|---|---|",
    ...ordered.filter(visible).map((p) => `| ${p.n} | [${p.name}](${url(`/work?p=${p.slug}`)}) | ${p.category} | ${p.year} | ${STAGE[p.status]} |`),
    "",
    ...ordered.filter(visible).flatMap((p) => [projectBlock(p), ""]),
    ...stealth.map((p) => `### ${p.n}. Stealth product\n\n- Category: ${p.category}\n- Year: ${p.year}\n- Status: stealth. Name and details intentionally undisclosed.\n`),
    "## Products",
    "",
    ...en.products.items.flatMap((i) => [
      `### ${i.status === "idle" ? "Stealth product (name undisclosed)" : i.name}`,
      "",
      `${i.desc}`,
      "",
      `- Status: ${i.badge}`,
      `- Tags: ${i.tags.join(", ")}`,
      "",
    ]),
    "## About",
    "",
    about.who.body,
    "",
    "### What Lemma believes",
    "",
    ...about.beliefs.items.map((b) => `- **${b.title}** ${b.body}`),
    "",
    "### How the model works",
    "",
    ...about.model.items.map((m) => `- **${m.title}**: ${m.body}`),
    `- Flow: ${about.model.flow.nodes.join(" > ")} (${about.model.flow.edges.join("; ")})`,
    "",
    "### About the name",
    "",
    about.name.body,
    "",
    ...about.name.steps.map((s) => `- **${s.tag}** ${s.text}`),
    "",
    `Definition: ${about.hero.term} ${about.hero.pron} (${about.hero.kind}): ${about.hero.definition}`,
    "",
    "## Contact",
    "",
    contactMessages.en.hero.lead,
    "",
    `- Contact page and form: ${url("/contact")}`,
    facts.split("\n").filter((l) => /^- (Email|Partnerships|WhatsApp|Location)/.test(l)).join("\n"),
    "",
    ...contactMessages.en.next.steps.map((s, i) => `${i + 1}. **${s.title}** ${s.body}`),
    "",
    "## FAQ",
    "",
    "**What is Lemma?** A venture studio in Jakarta that does client work (brand, UX, engineering, AI and data, strategy) and builds its own products.",
    "",
    "**How does an engagement start?** With a short conversation, then a written scope, timeline, and price before any work begins.",
    "",
    "**What does Lemma hand over?** Tested, documented work so the client team can run it alone.",
    "",
    "**Where is Lemma based?** Jakarta, Indonesia. Clients so far are mostly Indonesian universities, student organisations, and businesses.",
    "",
    "**What does the name mean?** In mathematics, a lemma is proved first so a larger theorem can stand.",
    "",
    "**Does Lemma publish prices?** No. Pricing is given in a written proposal.",
    "",
    notes,
    "",
    "## Bahasa Indonesia",
    "",
    `> ${idm.meta.description}`,
    "",
    `- ${idm.hero.line1} ${idm.hero.line2} ${idm.hero.line3} ${idm.hero.lead}`,
    `- ${idm.premise.title} ${idm.premise.body}`,
    `- ${idm.about.body}`,
    "",
    "### Layanan",
    "",
    ...svcId.services.map((s) => `- **${s.name}**: ${s.summary} ${s.deliverables.join("; ")}.`),
    "",
    "### Cara bekerja sama",
    "",
    ...svcId.engagement.steps.map((s, i) => `${i + 1}. **${s.title}**: ${s.body}`),
    "",
    "### Kontak",
    "",
    `Email ${ORG.email}, WhatsApp ${ORG.phone}, halaman ${url("/contact")}.`,
    "",
  ];
  return lines.join("\n").replace(/\n{3,}/g, "\n\n");
}

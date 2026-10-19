import type { MetadataRoute } from "next";

const SITE = "https://lemma.studio";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
  ];
}

import type { MetadataRoute } from "next";
import { SITE } from "@/lib/seo/site";

// Halaman publik saja. Proyek di /work dibuka lewat modal (?p=slug) dan berbagi satu URL kanonik, jadi tidak didaftarkan.
// /llms.txt dan /index.md sengaja tidak masuk sitemap (bukan halaman untuk hasil pencarian).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE}/nataku`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/services`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/about`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/contact`, changeFrequency: "yearly", priority: 0.6 },
  ];
}

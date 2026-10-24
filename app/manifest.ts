import type { MetadataRoute } from "next";
import { messages } from "@/lib/content/messages";

// Warna tema gelap (--bg di app/globals.css dan viewport themeColor di layout).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Lemma",
    short_name: "Lemma",
    description: messages.en.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      {
        src: "/brand/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}

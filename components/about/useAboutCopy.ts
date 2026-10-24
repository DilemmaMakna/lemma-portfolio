"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { aboutMessages } from "@/lib/content/about";

export function useAboutCopy() {
  const { locale } = useLocale();
  return aboutMessages[locale];
}

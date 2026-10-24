"use client";

import { useLocale } from "@/components/LocaleProvider";
import { aboutMessages } from "@/lib/content/about";

export function useAboutCopy() {
  const { locale } = useLocale();
  return aboutMessages[locale];
}

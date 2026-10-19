"use client";

import { useLocale } from "@/components/LocaleProvider";
import { aboutMessages } from "@/lib/about";

export function useAboutCopy() {
  const { locale } = useLocale();
  return aboutMessages[locale];
}

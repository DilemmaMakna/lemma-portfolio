"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { workMessages } from "@/lib/content/work";

export function useWorkCopy() {
  const { locale } = useLocale();
  return { w: workMessages[locale], locale };
}

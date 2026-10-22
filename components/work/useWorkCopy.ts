"use client";

import { useLocale } from "@/components/LocaleProvider";
import { workMessages } from "@/lib/work";

export function useWorkCopy() {
  const { locale } = useLocale();
  return { w: workMessages[locale], locale };
}

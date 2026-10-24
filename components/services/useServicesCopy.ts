"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import { servicesMessages } from "@/lib/content/services";

export function useServicesCopy() {
  const { locale } = useLocale();
  return servicesMessages[locale];
}

"use client";

import { useLocale } from "@/components/LocaleProvider";
import { servicesMessages } from "@/lib/services";

export function useServicesCopy() {
  const { locale } = useLocale();
  return servicesMessages[locale];
}

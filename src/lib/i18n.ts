import { supportedLocales, type Locale } from "./content-invariants";

export { type Locale };
export { supportedLocales };

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path ? `/${path.replace(/^\//, "")}` : "/"}`;
}

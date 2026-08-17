import { supportedLocales, type Locale } from "./content-invariants";

export { type Locale };
export { supportedLocales };

export function isLocale(value: string): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = ""): string {
  return `/${locale}${path ? `/${path.replace(/^\//, "")}` : "/"}`;
}

/**
 * The same page in the other locale. Swapping languages should keep the reader
 * where they are, so this strips whatever locale prefix a pathname carries and
 * re-applies the target one. A pathname that carries no known locale — a 404,
 * say — falls back to that locale's home rather than inventing a route.
 */
export function equivalentPath(pathname: string, target: Locale): string {
  const [first, ...rest] = pathname.replace(/^\/+/, "").split("/");
  return isLocale(first) ? localizedPath(target, rest.join("/")) : localizedPath(target);
}

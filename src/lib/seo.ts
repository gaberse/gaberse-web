import type { Locale } from "./i18n";

const siteName = "Gaberse";
const siteUrl = "https://gaberse.tech";

export function createSeo({ locale, title, description, path = "" }: { locale: Locale; title?: string; description?: string; path?: string }) {
  const pageTitle = title ? `${title} — ${siteName}` : siteName;
  // Built per locale rather than by rewriting the canonical: on the home the
  // path is empty, so the canonical has no "/<locale>/" left to substitute.
  const urlFor = (target: Locale) =>
    new URL(`/${target}/${path}`.replace(/\/$/, ""), siteUrl).toString();

  return {
    pageTitle,
    description,
    canonical: urlFor(locale),
    alternates: { en: urlFor("en"), es: urlFor("es") },
  };
}

import type { Locale } from "./i18n";

const siteName = "Gaberse";
const siteUrl = "https://gaberse.tech";

export function createSeo({ locale, title, description, path = "" }: { locale: Locale; title?: string; description?: string; path?: string }) {
  const pageTitle = title ? `${title} — ${siteName}` : siteName;
  const canonical = new URL(`/${locale}/${path}`.replace(/\/$/, "") || `/${locale}/`, siteUrl).toString();
  return { pageTitle, description, canonical };
}

/**
 * Destinations that live outside this repository. They are here rather than in
 * the pages that use them so that changing one is a single edit: the CV is
 * linked from the home and served by /cv, and both must agree.
 */

/** Google renders the PDF from the live document on request, so editing the
 *  document updates the download with no deploy. */
const googleDocPdf = (id: string) =>
  `https://docs.google.com/document/d/${id}/export?format=pdf`;

/**
 * The CV, one entry per language.
 *
 * Sharing URLs from Drive carry an `ouid` parameter that identifies the Google
 * account, and point at `/edit`, which hands out an editing link. Only the
 * document id belongs here; the export URL is built from it.
 *
 * /cv renders whatever this list holds, so adding a language is one line.
 */
const cvCatalogue = [
  {
    lang: "es",
    label: "Español",
    note: "PDF · 2 páginas",
    url: googleDocPdf("1kz-wspvPwlq6Hpwn4YdPj2C33tMMnXmR"),
    ready: true,
  },
  {
    lang: "en",
    label: "English",
    note: "PDF · 2 pages",
    url: googleDocPdf("1mp-mcfgXBZWm17-Glgses_IADo3nZW4l"),
    ready: true,
  },
] as const;

/** The flag stays because the page renders whatever is ready: a language can be
 *  taken down or added without touching markup. */
export const cvVersions = cvCatalogue.filter((version) => version.ready);

/**
 * What the site links to for the CV. The hop through this origin is what makes
 * the download countable — an outbound click is invisible to analytics, while a
 * page view is not — and it keeps a short, stable address that survives moving
 * the file somewhere else entirely.
 */
export const cvPath = "/cv";

/** Where the skills behind the "currently" section are published. */
export const skillsRepoUrl = "https://github.com/gaberse/skills";

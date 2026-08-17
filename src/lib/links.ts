/**
 * Destinations that live outside this repository. They are here rather than in
 * the pages that use them so that changing one is a single edit: the CV is
 * linked from the home and served by /cv, and both must agree.
 */

/**
 * The CV, rendered from the live Google Doc on every request, so editing the
 * document updates the download with no deploy.
 *
 * The sharing URL's `ouid` parameter is deliberately absent — it identifies the
 * Google account — and so is `/edit`, which would hand out an editing link.
 */
export const cvDocumentUrl =
  "https://docs.google.com/document/d/1ko5YryUu-yBkDhIhSjMPuDmrxiXpXuHb/export?format=pdf";

/**
 * What the site links to for the CV. The hop through this origin is what makes
 * the download countable — an outbound click is invisible to analytics, while a
 * page view is not — and it keeps a short, stable address that survives moving
 * the file somewhere else entirely.
 */
export const cvPath = "/cv";

/** Where the skills behind the "currently" section are published. */
export const skillsRepoUrl = "https://github.com/gaberse/skills";

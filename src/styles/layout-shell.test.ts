import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const readSource = (relativePath: string) =>
  readFileSync(new URL(relativePath, import.meta.url), "utf8");

describe("site shell layout system", () => {
  it("defines a reusable 112.5rem shell, with Header intentionally staying edge-to-edge", () => {
    const tokens = readSource("./tokens.css");
    const globalStyles = readSource("./global.css");
    const header = readSource("../components/home/Header.astro");
    const home = readSource("../pages/[locale]/index.astro");

    expect(tokens).toContain("--content-max-width: 112.5rem;");
    expect(globalStyles).toMatch(
      /\.site-shell\s*{[^}]*width:\s*100%;[^}]*max-width:\s*var\(--content-max-width\);[^}]*margin-inline:\s*auto;/s,
    );
    // Header keeps stretching edge-to-edge on ultrawide screens by design —
    // it does not adopt the capped .site-shell used by Home.
    expect(header).toContain('<header class="site-header">');
    expect(header).not.toMatch(/site-header\s+site-shell/);
    expect(home).toContain('<main class="home site-shell">');
    expect(home).toMatch(/\.home\s*{[^}]*container-type:\s*inline-size;/s);
    expect(home).toMatch(
      /@container \(min-width:\s*100rem\)\s*{\s*\.home__hero-copy\s*{\s*width:\s*50%;\s*}\s*}/s,
    );
  });

  it("scales Home against its capped shell while keeping the dialog viewport-relative", () => {
    const home = readSource("../pages/[locale]/index.astro");
    const explorer = readSource("../components/islands/home-explorer.css");
    const contactProfile = readSource("../components/islands/contact-profile.css");

    expect(home).not.toMatch(/\d(?:\.\d+)?vw/);
    expect(explorer).not.toMatch(/\d(?:\.\d+)?vw/);
    expect(home).toContain("7.3cqw");
    expect(explorer).toContain("1.55cqw");

    expect(contactProfile).toContain("width: min(78vw, 78rem)");
    expect(contactProfile).toContain("height: 78dvh");
    expect(contactProfile).toContain("width: 100vw");
    expect(contactProfile).toContain("height: 100dvh");
  });

  it("preserves reduced-motion fallbacks for the explorer and Contact overlay", () => {
    const explorer = readSource("../components/islands/home-explorer.css");
    const contactProfile = readSource("../components/islands/contact-profile.css");

    expect(explorer).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[^{]*{.*?\.explorer__artifact-drift\s*{\s*animation:\s*none;/s,
    );
    expect(contactProfile).toMatch(
      /@media \(prefers-reduced-motion: reduce\)[^{]*{.*?\.contact-profile__dialog\[open\]\s*{\s*animation:\s*none;/s,
    );
  });
});

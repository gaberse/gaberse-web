import { describe, expect, it } from "vitest";
import { equivalentPath, localizedPath } from "./i18n";

describe("equivalentPath", () => {
  it("keeps the reader on the same page when the locale changes", () => {
    expect(equivalentPath("/es/laboratoria", "en")).toBe("/en/laboratoria");
    expect(equivalentPath("/en/react-miami-2025", "es")).toBe(
      "/es/react-miami-2025",
    );
  });

  it("handles the home with and without a trailing slash", () => {
    expect(equivalentPath("/es", "en")).toBe("/en/");
    expect(equivalentPath("/es/", "en")).toBe("/en/");
  });

  it("preserves nested segments", () => {
    expect(equivalentPath("/en/archive/2019", "es")).toBe("/es/archive/2019");
  });

  it("falls back to the home when the path carries no known locale", () => {
    expect(equivalentPath("/404", "es")).toBe("/es/");
    expect(equivalentPath("/", "en")).toBe("/en/");
  });

  it("agrees with localizedPath for a plain slug", () => {
    expect(equivalentPath("/es/travel-photography", "en")).toBe(
      localizedPath("en", "travel-photography"),
    );
  });
});

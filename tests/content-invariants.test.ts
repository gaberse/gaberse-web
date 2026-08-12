import { describe, expect, it } from "vitest";

import {
  validateItemContentInvariants,
  type ItemIdentity,
  type LocalizedItemContent,
} from "../src/lib/content-invariants";

const item = (overrides: Partial<ItemIdentity> = {}): ItemIdentity => ({
  id: "ai-engineering-path",
  slug: "ai-engineering-path",
  published: true,
  source: "items/ai-engineering-path/item.yaml",
  ...overrides,
});

const content = (
  overrides: Partial<LocalizedItemContent> = {},
): LocalizedItemContent => ({
  itemId: "ai-engineering-path",
  locale: "en",
  source: "items/ai-engineering-path/en.mdx",
  body: "# English",
  ...overrides,
});

describe("validateItemContentInvariants", () => {
  it("accepts an unpublished Item without every locale", () => {
    expect(() =>
      validateItemContentInvariants(
        [item({ published: false })],
        [content()],
      ),
    ).not.toThrow();
  });

  it("requires every published Item to have exactly EN and ES content", () => {
    expect(() => validateItemContentInvariants([item()], [content()])).toThrow(
      'Published Item "ai-engineering-path" requires exactly one ES entry',
    );
  });

  it("rejects content pointing to an unknown Item", () => {
    expect(() =>
      validateItemContentInvariants([], [content({ itemId: "unknown" })]),
    ).toThrow('references unknown Item "unknown"');
  });

  it("rejects duplicate shared Item ids", () => {
    expect(() =>
      validateItemContentInvariants([item(), item({ source: "duplicate.yaml" })], []),
    ).toThrow('Duplicate Item id "ai-engineering-path"');
  });

  it("rejects duplicate shared Item slugs", () => {
    expect(() =>
      validateItemContentInvariants(
        [item(), item({ id: "another-item", source: "items/another-item/item.yaml" })],
        [],
      ),
    ).toThrow('Duplicate Item slug "ai-engineering-path"');
  });

  it("rejects duplicate Item and locale pairs", () => {
    expect(() =>
      validateItemContentInvariants(
        [item({ published: false })],
        [content(), content({ source: "items/other/en.mdx" })],
      ),
    ).toThrow('Duplicate localized content for Item "ai-engineering-path" and locale "en"');
  });

  it("rejects structural-slug collisions", () => {
    expect(() =>
      validateItemContentInvariants([item({ slug: "archive" })], []),
    ).toThrow('reserved structural slug "archive"');
  });

  it("rejects MDX imports so only the rendering allowlist supplies components", () => {
    expect(() =>
      validateItemContentInvariants(
        [item({ published: false })],
        [content({ body: 'import InternalThing from "../../components/InternalThing.astro"' })],
      ),
    ).toThrow("must not import application components");
  });
});

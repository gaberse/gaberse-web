export const supportedLocales = ["en", "es"] as const;
export type Locale = (typeof supportedLocales)[number];

export const reservedItemSlugs = ["archive"] as const;

export type ItemIdentity = {
  id: string;
  slug: string;
  published: boolean;
  source: string;
};

export type LocalizedItemContent = {
  itemId: string;
  locale: Locale;
  source: string;
  body?: string;
};

/** Fails the static build when the Git-backed content graph is inconsistent. */
export function validateItemContentInvariants(
  items: ItemIdentity[],
  localizedContent: LocalizedItemContent[],
): void {
  const itemsById = new Map<string, ItemIdentity>();
  const itemsBySlug = new Map<string, ItemIdentity>();

  for (const item of items) {
    if (itemsById.has(item.id)) {
      throw new Error(`Duplicate Item id "${item.id}" (${item.source}).`);
    }

    if (reservedItemSlugs.includes(item.slug as (typeof reservedItemSlugs)[number])) {
      throw new Error(
        `Item "${item.id}" uses reserved structural slug "${item.slug}" (${item.source}).`,
      );
    }

    if (itemsBySlug.has(item.slug)) {
      throw new Error(`Duplicate Item slug "${item.slug}" (${item.source}).`);
    }

    itemsById.set(item.id, item);
    itemsBySlug.set(item.slug, item);
  }

  const contentPairs = new Set<string>();
  for (const entry of localizedContent) {
    if (!itemsById.has(entry.itemId)) {
      throw new Error(
        `Localized content "${entry.source}" references unknown Item "${entry.itemId}".`,
      );
    }

    const pair = `${entry.itemId}:${entry.locale}`;
    if (contentPairs.has(pair)) {
      throw new Error(
        `Duplicate localized content for Item "${entry.itemId}" and locale "${entry.locale}".`,
      );
    }
    contentPairs.add(pair);

    if (/^\s*(?:import|export)\s/m.test(entry.body ?? "")) {
      throw new Error(
        `Localized content "${entry.source}" must not import application components; use the editorial component allowlist.`,
      );
    }
  }

  for (const item of items) {
    if (!item.published) continue;

    for (const locale of supportedLocales) {
      if (!contentPairs.has(`${item.id}:${locale}`)) {
        throw new Error(
          `Published Item "${item.id}" requires exactly one ${locale.toUpperCase()} entry.`,
        );
      }
    }
  }
}

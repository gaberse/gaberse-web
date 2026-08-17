import { getCollection, type CollectionEntry } from "astro:content";

import {
  type Locale,
  validateItemContentInvariants,
} from "./content-invariants";

export async function getAllItems() {
  return getCollection("items");
}

export async function getPublishedItems() {
  const [items, content] = await Promise.all([
    getCollection("items"),
    getCollection("itemContent"),
  ]);

  validateItemContentInvariants(
    items.map((item) => ({
      id: item.data.id,
      slug: item.data.slug,
      published: item.data.published,
      source: item.id,
    })),
    content.map((entry) => ({
      itemId: entry.data.itemId,
      locale: entry.data.locale,
      source: entry.id,
      body: entry.body,
    })),
  );

  return items.filter((item) => item.data.published);
}

export async function getLocalizedItem(slug: string, locale: Locale) {
  const [items, content] = await Promise.all([
    getPublishedItems(),
    getCollection("itemContent"),
  ]);
  const item = items.find((entry) => entry.data.slug === slug);
  const localized = content.find(
    (entry) =>
      entry.data.itemId === item?.data.id && entry.data.locale === locale,
  );

  return item && localized ? { item, localized } : undefined;
}

export type PublishedItem = CollectionEntry<"items">;

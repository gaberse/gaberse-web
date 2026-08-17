import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const locale = z.enum(["en", "es"]);
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

const items = defineCollection({
  loader: glob({ base: "./src/content/items", pattern: "**/item.yaml" }),
  schema: z.object({
    id: slug,
    slug,
    published: z.boolean().default(false),
    interests: z.array(slug).min(1),
    kind: z
      .enum(["living", "project", "experience", "visual", "story", "person"])
      .optional(),
    status: z
      .enum([
        "active",
        "building",
        "ongoing",
        "completed",
        "paused",
        "archived",
      ])
      .optional(),
    featuredMedia: z
      .object({
        id: slug,
        type: z.enum(["image", "video"]),
        src: z.string().startsWith("/"),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
      })
      .optional(),
  }),
});

const itemContent = defineCollection({
  loader: glob({ base: "./src/content/items", pattern: "**/*.{md,mdx}" }),
  schema: z.object({
    itemId: slug,
    locale,
    title: z.string().min(1),
    description: z.string().min(1),
    featuredMediaAlt: z.string().min(1).optional(),
    updatedAt: z.coerce.date().optional(),
  }),
});

export const collections = { items, itemContent };

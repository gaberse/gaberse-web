# Gaberse — Content / Data Model v1

## Goal

Use very few entities and allow Items to remain flexible.

Do not introduce a `Project` entity as the heart of the model.

## Locales

```ts
type Locale = "en" | "es";

type LocalizedText = {
  en: string;
  es: string;
};
```

For rich content, Codex should evaluate:
- localized block arrays; or
- locale-specific MDX tied to one Item identity.

## Interest

```ts
type Interest = {
  id: string;
  slug: string;
  name: LocalizedText;
  description?: LocalizedText;
  featured?: boolean;
  order?: number;
};
```

Definition:

> Anything that keeps pulling your attention.

Interests are associations, not strict categories.

## Item

```ts
type ItemKind =
  | "living"
  | "project"
  | "experience"
  | "visual"
  | "story"
  | "person";

type ItemStatus =
  | "active"
  | "building"
  | "ongoing"
  | "completed"
  | "paused"
  | "archived";

type Item = {
  id: string;
  slug: string;

  title: LocalizedText;
  subtitle?: LocalizedText;
  excerpt?: LocalizedText;

  interests: string[];

  kind?: ItemKind;
  status?: ItemStatus;

  dates?: {
    startedAt?: string;
    endedAt?: string;
    publishedAt?: string;
    updatedAt?: string;
  };

  location?: LocalizedText;

  cover?: Media;
  media?: Media[];

  content: unknown;

  living?: LivingData;

  relatedItems?: string[];

  featured?: boolean;
  archived?: boolean;

  seo?: {
    title?: LocalizedText;
    description?: LocalizedText;
  };
};
```

`kind` helps presentation but does not define whether an Item is valid.

## Media

```ts
type Media = {
  id: string;
  type: "image" | "video";
  src: string;

  width?: number;
  height?: number;

  alt: LocalizedText;
  caption?: LocalizedText;

  metadata?: {
    location?: LocalizedText;
    date?: string;
    camera?: string;
  };
};
```

Do not duplicate images per locale.

## Living data

```ts
type LivingData = {
  currentPhase?: string;
  progress?: number;
  phases?: Phase[];
  updates?: Update[];
  externalSources?: ExternalSource[];
};
```

### Phase

```ts
type Phase = {
  id: string;
  title: LocalizedText;
  description?: LocalizedText;
  status: "completed" | "active" | "next" | "planned";
  order: number;
};
```

### Update

```ts
type Update = {
  id: string;
  date: string;
  title: LocalizedText;
  summary?: LocalizedText;
  content?: unknown;
  relatedArtifacts?: string[];
};
```

### External source

```ts
type ExternalSource = {
  type: "github" | "website" | "figma" | "article" | "video";
  label: LocalizedText;
  url: string;
  metadata?: Record<string, unknown>;
};
```

Items must remain valid if external integrations are unavailable.

## Flexible content

If using structured data rather than MDX, possible primitives include:

```ts
type ContentBlock =
  | TextBlock
  | HeadingBlock
  | QuoteBlock
  | ImageBlock
  | GalleryBlock
  | ArtifactBlock
  | TimelineBlock
  | PhaseBlock
  | StatsBlock
  | LogBlock
  | EmbedBlock
  | SpacerBlock;
```

Avoid generic case-study fields such as `challenge`, `solution`, `result` unless a specific Item truly needs them.

## Archive

Archive is a derived view over Items.

No separate persistent entity is required.

## Stable slugs

Prefer:

`/en/items/react-miami-2025`
`/es/items/react-miami-2025`

Do not translate slugs in v1 without a compelling reason.

## Status localization

Store:

```ts
status: "active"
```

Translate display labels in UI dictionaries.

## Warning

This is conceptual v1.

Do not implement every optional field merely because it appears here.

Choose the simplest representation supporting actual v1 content.

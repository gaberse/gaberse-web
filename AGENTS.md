# AGENTS.md — Gaberse

Before modifying this repository, read:

- `GABERSE-HANDOFF.md`
- `docs/PRODUCT-BLUEPRINT.md`
- `docs/DESIGN-SYSTEM.md`
- `docs/CONTENT-MODEL.md`

Figma source of truth:

`https://www.figma.com/design/7aNV0w4jq8PLmbfOM3tul0`

## Product identity

Gaberse is Gabriela's personal universe, not a traditional developer portfolio.

**Interest:** Anything that keeps pulling Gabriela's attention.

**Item:** Something Gabriela has made, explored or experienced.

Do not introduce a core `Project` entity without explicit approval.

## Engineering rules

- EN and ES are first-class locales.
- Preserve stable Item identity across locales.
- Do not force every Item into one template.
- Prefer composable primitives.
- Do not invent abstractions before needed.
- Favor accessibility, performance and maintainability.
- Image performance is first-class.
- Respect `prefers-reduced-motion`.
- Do not communicate essential information only through hover.
- Avoid client JS where it adds no product value.
- Motion reveals; it does not decorate.
- Do not turn the UI into a generic card-based SaaS interface.
- Do not add a technology/skills section unless explicitly requested.
- Do not invent biographical facts or Item content.
- Mark placeholder content clearly.

## Workflow

For major architecture decisions:

1. inspect the repo;
2. inspect relevant Figma frames;
3. explain options/tradeoffs;
4. recommend one;
5. obtain approval;
6. implement in small coherent steps.

Do not scaffold a CMS, database, auth system or backend unless v1 requires it.

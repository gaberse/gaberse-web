# Gaberse — Product & Design Handoff

> Source of truth for the first engineering phase of `gaberse.tech`.

## 0. Instructions for Codex

Read this document before proposing architecture or writing implementation code.

Do **not** treat Gaberse as a conventional developer portfolio, résumé site, case-study template, SaaS landing page, or generic blog.

The design direction already exists in Figma. Engineering should preserve it rather than reinterpret the product from scratch.

Before scaffolding:

1. Read this file.
2. Read `docs/PRODUCT-BLUEPRINT.md`.
3. Read `docs/DESIGN-SYSTEM.md`.
4. Read `docs/CONTENT-MODEL.md`.
5. Inspect the Figma source of truth.
6. Propose the architecture and implementation plan.
7. Explicitly identify assumptions and open decisions.
8. Wait for approval before major framework/CMS/infrastructure decisions.

# 1. Product

## Name

**Gaberse**

Wordplay: **Gab + verse** — Gabriela's universe.

Primary domain: `gaberse.tech`

Desired contact email: `hello@gaberse.tech`

## What Gaberse is

Gaberse is a personal universe containing things Gabriela has made, explored, experienced, learned, photographed, cared about, or kept returning to.

There is no requirement for everything to fit into one narrative. Different facets can coexist because their shared authorship is Gabriela.

> Every artifact should reveal a piece of the person behind it.

> No single narrative. Different things that kept pulling my attention — together, Gaberse.

## What Gaberse is not

Do not turn it into:

- a résumé with decorative case studies;
- a skills matrix;
- a list of technologies;
- a generic frontend portfolio;
- a project grid with identical cards;
- a blog-first site;
- a dashboard;
- a SaaS-looking interface;
- a system where every Item is forced into the same template.

# 2. Core concepts

## Interest

> Anything that keeps pulling your attention.

Initial examples:
- AI
- Design Systems
- Travel Photography

Interests are not rigid categories.

## Item

> Something Gabriela has made, explored, or experienced.

Initial Items:
1. AI Engineering Path
2. Design System
3. Travel Photography
4. React Miami 2025
5. Laboratoria
6. Gabriela

Do **not** create a core `Project` entity.

# 3. Visitor journey

## First 5 seconds
The visitor understands the things currently pulling Gabriela's attention.

## Around 30 seconds
The visitor discovers what Gabriela is working on now.

## Around 2 minutes
The visitor discovers more of the person behind the work, including that Gabriela is a woman in technology.

## Around 5 minutes
The visitor should feel enough familiarity and trust to contact Gabriela if something resonated.

Accessibility/contactability is a product requirement.

# 4. Homepage requirements

Must:
- Interests
- selected Items/artifacts
- route into the full Archive
- direct contact invitation

Useful:
- Currently / what Gabriela is doing now

Do not overcrowd the homepage.

# 5. Visual direction

Approved direction:

- editorial
- minimal
- spacious
- monochromatic
- strong typography
- soft physical/tactile objects
- restrained motion
- interactive without becoming flashy

## Typography

Primary: Geist Sans

Metadata/system: Geist Mono

Large typography should carry real weight.

## Surfaces

Do not rely on decorative divider lines.

Use:
- warm off-white canvas
- near-black text
- neutral grayscale surfaces
- rounded objects
- extremely soft shadows
- generous whitespace

> Artifacts are objects. Content is free.

Text/navigation/metadata often sit directly on the canvas. Media/artifacts can have rounded surfaces and subtle elevation.

Avoid turning every section into a card.

## Monochrome

The main visual system is monochromatic. Photography and artifacts may be presented in grayscale in index contexts. Original media may retain its identity inside an Item when appropriate.

# 6. Motion

> Nothing moves to decorate. Things move to reveal.

> Fast interaction. Slow atmosphere.

Approved hero sequence:

`REST → INTEREST HOVER → ARTIFACT FOCUS → EXIT`

Desktop:
- slow ambient artifact movement
- hover on Interest interrupts ambient motion
- related artifact moves forward
- siblings lose depth/opacity
- focus clarifies metadata/navigation
- exit settles smoothly
- hover/focus pauses ambient motion

Mobile:
- no fake hover
- tactile deck
- swipe/tap discovery
- tap/focus interaction

Always respect `prefers-reduced-motion`.

Motion must never be required to understand or navigate content.

# 7. Responsive

Desktop and mobile are first-class.

Mobile is not simply compressed desktop.

Mobile favors:
- vertical flow
- tactile deck
- horizontal rails where appropriate
- touch-first focus behavior

# 8. EN / ES

Gaberse is bilingual from the beginning.

Locales:
- `en`
- `es`

Both are first-class.

Suggested routes:
- `/en/...`
- `/es/...`

Keep Item slugs stable across locales.

Example:
- `/en/items/ai-engineering-path`
- `/es/items/ai-engineering-path`

The language switch should preserve the current route.

Initial direction:
- English may be the default for global reach.
- Remember explicit user locale selection.
- Use localized metadata and hreflang.
- Adapt voice and meaning; do not blindly translate word-for-word.

# 9. Initial Items

## AI Engineering Path

A living path for expanding Gabriela's problem-solving abilities through AI and learning AI engineering/agents alongside frontend architecture.

It must not read like “I completed an AI course.”

It should feel like an evolving practice accumulating knowledge, experiments and things built.

Conceptual phases used in design:
1. Foundations
2. Building
3. Agents
4. Systems

These labels are provisional.

Possible data:
- current phase
- phases
- latest update
- path log
- experiments
- GitHub repos
- external sources

Mock artifact names used only for design:
- Context Explorer
- Eval Notes
- Agent Lab

These are placeholders, not commitments.

## Design System

A living library of components, patterns, architecture and reusable decisions.

The system does not exist yet. The Item is partly aspirational and will document it as it is built.

Do not hardcode invented mockup counts as real data.

## Travel Photography

Strongly visual.

Selected photographic frames from past trips.

Mallorca was only an example. The architecture must support arbitrary trips/selections.

## React Miami 2025

A personal experience/story, not a technical conference report.

Known real context:
- conference already happened
- first time in the United States
- met people from the industry
- interacted with well-known people in the developer community
- used/spoke English
- has photos

Do not invent sessions, speakers, quotes or events not provided by Gabriela.

## Laboratoria

Origin/transition story.

Tell how Gabriela entered technology through Laboratoria.

Relevant background available for later public-content review:
- moved to Peru at 20
- had not completed prior university studies
- previous field: Sound Engineering / Music Production
- Laboratoria led to the first developer job

Only publish details Gabriela approves.

## Gabriela

Person/About, not a conventional CV.

Themes:
- curiosity
- empathy
- confidence
- perseverance
- technology
- photography
- travel
- animals
- philanthropy/care
- women in STEAM
- being reachable/accessibile

# 10. Archive / Index

Archive is a view over Items, not a separate taxonomy.

Conceptual headline:

> everything that ended up here.

Principle:

> THE INDEX IS NEVER FINISHED.

New Items must be able to enter without requiring a redesign.

Avoid excessive filtering/taxonomy in v1.

# 11. Figma source of truth

Figma file: **Gaberse — Web Design**

File key: `7aNV0w4jq8PLmbfOM3tul0`

URL:
`https://www.figma.com/design/7aNV0w4jq8PLmbfOM3tul0`

Important frames:
- Home desktop refined
- Hero Motion / Interaction
- Home mobile
- AI Engineering Path
- Design System
- Travel Photography
- React Miami 2025
- Laboratoria
- Gabriela
- Archive / Index
- Language System EN/ES

Treat Figma as the visual source of truth and these docs as the product/behavior source of truth.

# 12. Engineering principles

Prefer boring, legible architecture over clever abstractions.

Do not over-model before real content requires it.

Requirements:
- strong SEO
- excellent image performance
- accessibility
- responsive behavior
- reduced-motion support
- bilingual content
- flexible Item composition
- future GitHub integration
- maintainability by one person
- easy content updates
- avoid editing JSX for every copy change if a simpler content workflow exists

The architecture should allow Items to have different layouts while sharing primitives.

# 13. Open decisions

Not decided yet:
- framework: Next.js vs Astro vs another appropriate option
- content storage: MDX vs typed TS/JSON vs CMS vs hybrid
- deployment provider
- image pipeline
- animation library/approach
- GitHub integration strategy
- analytics
- email provider
- preview/editorial workflow

Evaluate these for Gaberse instead of assuming fashionable defaults.

# 14. Immediate objective

Before building the entire site, Codex should deliver:

1. recommended architecture
2. rationale/tradeoffs
3. proposed repository structure
4. i18n strategy
5. content strategy
6. image/media strategy
7. motion strategy
8. accessibility strategy
9. SEO strategy
10. testing strategy
11. staged implementation plan

Then scaffold after approval.

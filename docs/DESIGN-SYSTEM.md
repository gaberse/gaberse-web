# Gaberse — Design System v1

## Visual DNA

- Geist Sans — heavy/oversized editorial voice
- Geist Mono — small/precise metadata
- generous whitespace
- warm monochrome palette
- rounded artifact objects
- very subtle shadows
- no reliance on decorative divider lines
- invisible structural grid
- fast interaction
- slow atmosphere

## Fundamental rule

> Artifacts are objects. Content is free.

Use rounded surfaces for media/artifacts/interactive objects.

Do not wrap ordinary copy, headings and navigation in cards by default.

## Typography

### Display

Geist Sans, semibold/heavy feel.

Large headings use tight leading and negative tracking.

Exact values: inspect Figma.

### Body

Geist Sans Regular.

Keep long-form lines comfortably readable.

### Metadata

Geist Mono.

Often uppercase, subtle tracking, neutral secondary contrast.

Examples:

- CURRENTLY
- PHASE 01 / FOUNDATIONS
- ACTIVE
- UPDATED ...
- 01 / 05

## Color

Monochromatic:

- warm off-white background
- near-black primary text
- neutral gray secondary text
- grayscale artifact surfaces

Avoid stark pure white + pure black everywhere unless intentionally used.

## Radius

Conceptual ranges:

- small object ~12px
- image/inner object ~14–16px
- artifact/card ~20–24px
- large block ~24–30px

Use Figma for exact values.

## Shadows

Extremely subtle.

Approximate intent:
`0 8px 28px rgba(0,0,0,0.03–0.05)`

Avoid obvious floating dashboard cards.

## Spacing

Whitespace is a first-class design element.

Do not compress layouts simply to fit more content above the fold.

## Motion

> Nothing moves to decorate. Things move to reveal.

> Fast interaction. Slow atmosphere.

Hero:

- rest
- interest hover
- artifact focus
- exit

Desktop:

- ambient deck motion
- Interest interaction takes control
- focus reveals metadata
- exit returns smoothly

Mobile:

- tap/swipe behavior
- no hover simulation

Always support reduced motion.

## Hero Artifact Deck

Should feel like a collection of objects, not an obvious carousel.

Avoid conventional dot pagination if possible.

At rest:

- slight positional/rotational differences
- ambient depth movement

On Interest interaction:

- related artifact emerges
- others recede
- metadata resolves
- ambient motion pauses

## Accessibility

- visible focus states
- keyboard support
- no info only on hover
- meaningful alt text
- reduced motion
- sufficient contrast
- semantic document structure

## Token Reference

All tokens live in `src/styles/tokens.css`. Component styles should reference
these instead of hardcoding hex values.

### Base color

- `--color-canvas` — page background.
- `--color-ink` — primary text.
- `--color-ink-soft` — secondary body copy, softer than ink (e.g. the
  "Currently" paragraph).
- `--color-muted` — secondary/metadata text (eyebrows, mono labels).
- `--color-surface` — default neutral fill for artifact surfaces.
- `--color-surface-soft` — lighter neutral surface, used for small pill/badge
  backgrounds (e.g. the header locale switcher).
- `--color-border-muted` — shared hairline border color (Contact section
  divider, Contact profile dialog rules).
- `--color-media-placeholder` — background behind unloaded/placeholder photos.

### Tone scale — Selected grid

Backgrounds/foregrounds for the "Selected" artifact cards. `dark` and `ink`
share the same value on purpose (`--tone-dark-*` covers both).

- `--tone-dark-bg` / `--tone-dark-fg` / `--tone-dark-surface`
- `--tone-mid-bg` / `--tone-mid-fg` / `--tone-mid-surface`
- `--tone-light-bg` / `--tone-light-fg` / `--tone-light-surface`

### Tone — Hero ("Currently") object

Standalone dark feature object in the "Currently" section — not shared with
any other component.

- `--tone-hero-bg` / `--tone-hero-fg` — object background/foreground.
- `--tone-hero-ring` — decorative ring border.
- `--tone-hero-dot` — decorative center dot.

### Tone — Interest explorer artifacts

Per-artifact tones for the Hero deck (`a`/`b`/`c`), each with its own
background/placeholder shade. These are visually close to, but not the same
values as, the Selected grid's tone scale — kept distinct to avoid changing
either component's rendered output.

- `--tone-explorer-glow` — ambient glow behind the deck.
- `--tone-explorer-a-bg` / `--tone-explorer-a-fg` / `--tone-explorer-a-placeholder`
- `--tone-explorer-b-bg` / `--tone-explorer-b-placeholder`
- `--tone-explorer-c-bg` / `--tone-explorer-c-placeholder`
- `--tone-explorer-placeholder-bg` / `--tone-explorer-placeholder-fg` —
  default placeholder shade when no artifact tone is active.

### Typography

- `--font-sans` / `--font-mono` — Geist Sans (display/body) and Geist Mono
  (metadata).
- `--text-meta` / `--leading-meta` / `--tracking-meta` — the mono metadata
  text style (eyebrows, labels).

### Radius

- `--radius-object` — small interactive/media objects.
- `--radius-artifact` — artifact/card-level objects.

### Shadow

- `--shadow-object` — subtle shadow for standalone objects.
- `--shadow-artifact` — deeper shadow for the Hero artifact deck.

### Spacing / layout

- `--space-page` — responsive page gutter.
- `--content-max-width` — shared shell max-width (112.5rem), applied via the
  `.site-shell` utility in `global.css`.
- `--measure-readable` — max line length for long-form text.

## Artifact Surface Primitive

Considered extracting a single shared `.artifact-surface` class for the
"Currently" object, the Selected grid objects, and the explorer artifact
deck, since all three implement the DNA rule "rounded surfaces for
media/artifacts/interactive objects."

In practice the three already diverge in ways that matter: the Currently
object uses `--radius-artifact` (1.5rem) with `--shadow-object`, the explorer
deck uses its own 1.25rem radius with `--shadow-artifact`, and the Selected
cards use `--radius-object` (1rem) with no shadow at all. Forcing one shared
class would have meant either changing one of these three looks, or wrapping
the class in enough per-caller custom-property overrides that it stopped
reducing duplication and just added a layer of indirection.

Per `AGENTS.md` ("do not invent abstractions before needed"), that tradeoff
isn't worth it yet. Instead, this pass:

- kept each component's own radius/shadow choice, applying `--radius-artifact`
  directly where it was already an exact match (the Currently object),
- moved every tone's colors into the token scales above, so the _palette_
  layer is already shared and ready if a real shared primitive becomes
  worth building later (e.g. once Item cards need the same look).

Revisit a shared primitive if a third real caller shows up needing the exact
same radius/shadow/background combination — not before.

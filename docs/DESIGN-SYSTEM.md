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

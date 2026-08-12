# Codex start prompt

You are starting the engineering phase of **Gaberse** in this repository.

Do not begin by generating the entire website.

First:

1. Read `GABERSE-HANDOFF.md`.
2. Read every file under `docs/`.
3. Read `AGENTS.md`.
4. Inspect the current repository state.
5. Inspect the Figma source of truth:
   `https://www.figma.com/design/7aNV0w4jq8PLmbfOM3tul0`
6. Identify the relevant Home, Mobile, Motion, Item, Archive and EN/ES frames.

Then propose an engineering architecture for v1.

The proposal must include:

- framework recommendation and alternatives considered;
- rationale specific to Gaberse;
- repository/folder structure;
- content storage recommendation (MDX vs structured TypeScript/JSON vs CMS vs hybrid);
- bilingual EN/ES routing and content strategy;
- SEO/hreflang strategy;
- image/media handling;
- motion strategy for desktop and mobile;
- reduced-motion strategy;
- accessibility considerations;
- approach for heterogeneous Item layouts;
- GitHub integration approach for living Items, but only if it should be in v1;
- deployment recommendation;
- testing strategy;
- staged implementation plan.

Constraints:

- Gaberse is not a conventional developer portfolio.
- `Interest` and `Item` are the core content concepts.
- Do not introduce a core `Project` model.
- Items must be allowed to have distinct compositions.
- Design is monochromatic, spacious, editorial and tactile.
- Motion reveals; it does not decorate.
- Both EN and ES are first-class.
- Do not invent content not present in the handoff.
- Do not implement major architecture until you have presented the plan for review.

End with:

1. your recommended stack;
2. the decisions that still require Gabriela's approval;
3. the exact first implementation milestone after approval.

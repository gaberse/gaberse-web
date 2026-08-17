import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomeExplorer, {
  type ExplorerCard,
  type ExplorerLabels,
} from "./HomeExplorer";
import {
  getExplorerState,
  getNextInterest,
  initialExplorerState,
  reduceExplorerInteraction,
  shouldResetExplorerOnFocusExit,
  shouldResetExplorerOnPointerExit,
} from "./home-explorer-state";

const labels: ExplorerLabels = {
  heading: "Explore the deck",
  interests: "Interests",
  unavailable: "Not published yet",
  placeholder: "Placeholder media",
  touchHint: "Tap or swipe to explore",
};

const linkedCard: ExplorerCard = {
  id: "linked",
  label: "Linked",
  title: "Linked Item",
  meta: "A living practice",
  tone: "a",
  href: "/en/linked",
};
const plainCard: ExplorerCard = {
  id: "plain",
  label: "Plain",
  title: "Plain Item",
  meta: "No destination yet",
  tone: "b",
};
const decorativeCard: ExplorerCard = {
  id: "decor",
  label: "",
  title: "",
  meta: "",
  tone: "c",
};

const render = (cards: ExplorerCard[], showInterests?: boolean) =>
  renderToStaticMarkup(
    createElement(HomeExplorer, { cards, labels, showInterests }),
  );

describe("explorer interaction state", () => {
  it("keeps the deck at rest until an interest is active", () => {
    expect(getExplorerState(initialExplorerState)).toEqual({
      activeInterest: null,
      committedInterest: null,
      isInteractive: false,
    });
  });

  it("marks an active interest as an interaction", () => {
    expect(
      getExplorerState({ activeInterest: "ai", committedInterest: null }),
    ).toEqual({
      activeInterest: "ai",
      committedInterest: null,
      isInteractive: true,
    });
  });

  it("previews on hover and commits the same artifact on click instead of toggling it off", () => {
    const previewed = reduceExplorerInteraction(initialExplorerState, {
      type: "preview",
      id: "ai",
    });
    const clicked = reduceExplorerInteraction(previewed, {
      type: "activate",
      id: "ai",
    });

    expect(previewed).toEqual({
      activeInterest: "ai",
      committedInterest: null,
    });
    expect(clicked).toEqual({ activeInterest: "ai", committedInterest: "ai" });
  });

  it("previews on keyboard focus and commits on Enter's click event", () => {
    const focused = reduceExplorerInteraction(initialExplorerState, {
      type: "preview",
      id: "design-systems",
    });
    const entered = reduceExplorerInteraction(focused, {
      type: "activate",
      id: "design-systems",
    });

    expect(entered).toEqual({
      activeInterest: "design-systems",
      committedInterest: "design-systems",
    });
  });

  it("only toggles an artifact off after it is intentionally committed", () => {
    const committed = reduceExplorerInteraction(initialExplorerState, {
      type: "activate",
      id: "travel",
    });

    expect(
      reduceExplorerInteraction(committed, { type: "activate", id: "travel" }),
    ).toEqual(initialExplorerState);
  });

  it("returns to rest only when focus leaves the explorer scope", () => {
    const inside = {} as Node;
    const outside = {} as Node;
    const scope = { contains: (node: Node) => node === inside };

    expect(shouldResetExplorerOnFocusExit(scope, inside)).toBe(false);
    expect(shouldResetExplorerOnFocusExit(scope, outside)).toBe(true);
    expect(shouldResetExplorerOnFocusExit(scope, null)).toBe(true);
  });

  it("keeps the active artifact when the pointer leaves but keyboard focus remains inside", () => {
    const focusedInterest = {} as Element;
    const scope = { contains: (node: Node) => node === focusedInterest };

    expect(shouldResetExplorerOnPointerExit(scope, focusedInterest)).toBe(
      false,
    );
    expect(shouldResetExplorerOnPointerExit(scope, null)).toBe(true);
  });
});

describe("swipe cycling", () => {
  const ids = ["ai", "design-systems", "travel"];

  it("cycles through whichever ids the consumer configured", () => {
    expect(getNextInterest(null, 1, ids)).toBe("ai");
    expect(getNextInterest("ai", 1, ids)).toBe("design-systems");
    expect(getNextInterest("ai", -1, ids)).toBe("travel");
  });

  it("cycles a differently sized deck without hardcoded knowledge of it", () => {
    const pair = ["one", "two"];

    expect(getNextInterest("one", 1, pair)).toBe("two");
    expect(getNextInterest("two", 1, pair)).toBe("one");
  });

  it("leaves the state untouched when a swipe has no cards to cycle", () => {
    const committed = { activeInterest: "ai", committedInterest: "ai" };

    expect(
      reduceExplorerInteraction(committed, {
        type: "swipe",
        direction: 1,
        ids: [],
      }),
    ).toBe(committed);
  });
});

describe("explorer rendering", () => {
  it("renders whatever cards it is given rather than a hardcoded deck", () => {
    const html = render([linkedCard, plainCard]);

    expect(html).toContain("Linked Item");
    expect(html).toContain("Plain Item");
    expect(html).toContain("Explore the deck");
    expect(html).toContain("Tap or swipe to explore");
    expect(html.match(/explorer__artifact /g)).toHaveLength(2);
  });

  it("gives cards with a destination real links and the rest real toggles", () => {
    const html = render([linkedCard, plainCard]);

    expect(html.match(/<a href="\/en\/linked"/g)).toHaveLength(1);
    expect(html.match(/<button/g)).toHaveLength(1);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(1);
    expect(html.match(/aria-controls=/g)).toHaveLength(1);
  });

  it("flags a card with neither media nor a destination as unpublished", () => {
    const html = render([linkedCard, plainCard]);

    expect(html).toContain("Linked Item. A living practice.");
    expect(html).toContain("Plain Item. No destination yet. Not published yet");
  });

  it("renders the interests row by default", () => {
    const html = render([linkedCard, plainCard]);

    expect(html).toContain("explorer__intro");
    expect(html).toContain("explorer__interests");
    expect(html).toContain(">Linked<");
  });

  it("omits the interests row when the consumer turns it off", () => {
    const html = render([linkedCard, plainCard], false);

    expect(html).not.toContain("explorer__intro");
    expect(html).not.toContain("explorer__interests");
    expect(html).not.toContain("aria-labelledby");
    expect(html).toContain(`aria-label="${labels.heading}"`);
  });

  it("moves the interaction onto the cards themselves when the interests row is hidden", () => {
    const html = render([linkedCard, plainCard], false);

    // The link and the toggle are now the artifacts, so the reveal stays reachable.
    expect(
      html.match(/<a [^>]*href="\/en\/linked"[^>]*class="explorer__artifact/g),
    ).toHaveLength(1);
    expect(html.match(/<button [^>]*class="explorer__artifact/g)).toHaveLength(
      1,
    );
    expect(html).not.toContain("explorer__interest ");
  });

  it("keeps a card with nothing to say out of the tab order instead of naming it emptily", () => {
    const html = render([decorativeCard], false);

    expect(html).not.toContain("<button");
    expect(html).not.toContain("<a ");
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toContain("explorer__detail");
    expect(html).not.toMatch(/aria-label="\s*\.?\s*"/);
  });

  it("renders configured media instead of the placeholder", () => {
    const withMedia: ExplorerCard = {
      ...plainCard,
      media: {
        src: "/photo-480.webp",
        srcSet: "/photo-480.webp 480w",
        alt: "A described photo",
      },
    };
    const html = render([withMedia]);

    expect(html).toContain('src="/photo-480.webp"');
    expect(html).toContain('alt="A described photo"');
    expect(html).not.toContain("Placeholder media");
  });
});

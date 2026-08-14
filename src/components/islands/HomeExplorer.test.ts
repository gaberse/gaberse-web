import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import HomeExplorer from "./HomeExplorer";
import { getExplorerState, getNextInterest, initialExplorerState, reduceExplorerInteraction, shouldResetExplorerOnFocusExit, shouldResetExplorerOnPointerExit } from "./home-explorer-state";

describe("getExplorerState", () => {
  it("keeps the deck at rest until an interest is active", () => {
    expect(getExplorerState(initialExplorerState)).toEqual({
      activeInterest: null,
      committedInterest: null,
      isInteractive: false,
    });
  });

  it("marks an active interest as an interaction", () => {
    expect(getExplorerState({ activeInterest: "ai", committedInterest: null })).toEqual({
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

    expect(previewed).toEqual({ activeInterest: "ai", committedInterest: null });
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
      id: "travel-photography",
    });

    expect(
      reduceExplorerInteraction(committed, {
        type: "activate",
        id: "travel-photography",
      }),
    ).toEqual(initialExplorerState);
  });

  it("renders real toggle semantics and controlled artifact relationships", () => {
    const html = renderToStaticMarkup(
      createElement(HomeExplorer, { locale: "en" }),
    );

    expect(html.match(/<button/g)).toHaveLength(3);
    expect(html.match(/aria-pressed="false"/g)).toHaveLength(3);
    expect(html.match(/aria-controls=/g)).toHaveLength(3);
    expect(html).toContain("AI Engineering Path. A living practice · Active. Not published yet");
  });

  it("cycles through artifacts for touch swipe discovery", () => {
    expect(getNextInterest(null, 1)).toBe("ai");
    expect(getNextInterest("ai", 1)).toBe("design-systems");
    expect(getNextInterest("ai", -1)).toBe("travel-photography");
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

    expect(shouldResetExplorerOnPointerExit(scope, focusedInterest)).toBe(false);
    expect(shouldResetExplorerOnPointerExit(scope, null)).toBe(true);
  });
});

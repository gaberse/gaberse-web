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

    // All three interests now have real destination pages, so they're genuine links, not toggle buttons.
    expect(html.match(/<a href="\/en\/ai-engineering-path"/g)).toHaveLength(1);
    expect(html.match(/<a href="\/en\/design-system"/g)).toHaveLength(1);
    expect(html.match(/<a href="\/en\/travel-photography"/g)).toHaveLength(1);
    expect(html.match(/<button/g)).toBeNull();
    expect(html.match(/aria-pressed=/g)).toBeNull();
    expect(html.match(/aria-controls=/g)).toBeNull();
    expect(html).toContain('AI Engineering Path. A living practice · Active."');
    expect(html).toContain("Explore what keeps pulling me in");
    expect(html).toContain("Design Systems");
    expect(html).toContain("Travel Photography");
    expect(html).toContain("Tap or swipe to explore");
  });

  it("renders the concise touch instruction in Spanish", () => {
    const html = renderToStaticMarkup(
      createElement(HomeExplorer, { locale: "es" }),
    );

    expect(html).toContain("Últimamente, por acá");
    expect(html).toContain("Toca o desliza para explorar");
    expect(html).toContain(">AI<");
    expect(html).toContain("AI Engineering Path");
    expect(html).toContain("Design System");
    expect(html).toContain("Sistemas de diseño");
    expect(html).toContain("Fotografía de viajes");
    expect(html).not.toContain("Explorá lo que sigue llamando mi atención");
    expect(html).not.toContain("Tocá o deslizá para explorar");
    expect(html).not.toContain(">IA<");
    expect(html).not.toContain("Camino de Ingeniería de IA");
    expect(html).not.toContain("Sistema de diseño.");
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

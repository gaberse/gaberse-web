/** Card ids are defined by whoever configures the explorer, not by this module. */
export type InterestId = string;

export type ExplorerInteractionState = {
  activeInterest: InterestId | null;
  committedInterest: InterestId | null;
};

export type ExplorerInteraction =
  | { type: "preview"; id: InterestId }
  | { type: "activate"; id: InterestId }
  | { type: "swipe"; direction: 1 | -1; ids: InterestId[] }
  | { type: "reset" };

export const initialExplorerState: ExplorerInteractionState = {
  activeInterest: null,
  committedInterest: null,
};

export function reduceExplorerInteraction(
  state: ExplorerInteractionState,
  interaction: ExplorerInteraction,
): ExplorerInteractionState {
  if (interaction.type === "reset") return initialExplorerState;

  if (interaction.type === "swipe") {
    const activeInterest = getNextInterest(
      state.activeInterest,
      interaction.direction,
      interaction.ids,
    );

    if (activeInterest === null) return state;

    return { activeInterest, committedInterest: activeInterest };
  }

  if (interaction.type === "preview") {
    return {
      activeInterest: interaction.id,
      committedInterest:
        state.committedInterest === interaction.id
          ? state.committedInterest
          : null,
    };
  }

  const isAlreadyCommitted =
    state.activeInterest === interaction.id &&
    state.committedInterest === interaction.id;

  return isAlreadyCommitted
    ? initialExplorerState
    : {
        activeInterest: interaction.id,
        committedInterest: interaction.id,
      };
}

export function getExplorerState(state: ExplorerInteractionState) {
  return { ...state, isInteractive: state.activeInterest !== null };
}

/** Cycles through whichever ids the consumer configured, wrapping at both ends. */
export function getNextInterest(
  current: InterestId | null,
  direction: 1 | -1,
  ids: InterestId[],
): InterestId | null {
  if (ids.length === 0) return null;
  const currentIndex = current ? ids.indexOf(current) : direction === 1 ? -1 : 0;
  return ids[(currentIndex + direction + ids.length) % ids.length];
}

export function shouldResetExplorerOnFocusExit(
  scope: Pick<HTMLElement, "contains">,
  nextFocusedElement: EventTarget | null,
) {
  return nextFocusedElement === null || !scope.contains(nextFocusedElement as Node);
}

export function shouldResetExplorerOnPointerExit(
  scope: Pick<HTMLElement, "contains">,
  activeElement: Element | null,
) {
  return activeElement === null || !scope.contains(activeElement);
}

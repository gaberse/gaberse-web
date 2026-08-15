import { useEffect, useId, useReducer, useRef, useState, type FocusEvent, type ReactNode, type TouchEvent } from "react";
import { getExplorerState, initialExplorerState, reduceExplorerInteraction, shouldResetExplorerOnFocusExit, shouldResetExplorerOnPointerExit } from "./home-explorer-state";
import "./home-explorer.css";

export type ExplorerCardMedia = { src: string; srcSet: string; sizes?: string; alt: string };

export type ExplorerCard = {
  id: string;
  /** Text shown in the interests row. Unused when `showInterests` is false. */
  label: string;
  title: string;
  meta: string;
  tone: "a" | "b" | "c";
  /** Present → the card navigates. Absent → the card toggles focus in place. */
  href?: string;
  media?: ExplorerCardMedia;
};

export type ExplorerLabels = {
  heading: string;
  interests: string;
  unavailable: string;
  placeholder: string;
  touchHint: string;
};

type Props = {
  cards: ExplorerCard[];
  labels: ExplorerLabels;
  showInterests?: boolean;
};

const DEFAULT_MEDIA_SIZES = "(max-width: 44rem) 60vw, 21rem";

export default function HomeExplorer({ cards, labels, showInterests = true }: Props) {
  const [interaction, dispatch] = useReducer(
    reduceExplorerInteraction,
    initialExplorerState,
  );
  const [touchMode, setTouchMode] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const scopeRef = useRef<HTMLElement>(null);
  const labelId = useId();
  const state = getExplorerState(interaction);
  const { activeInterest, committedInterest } = state;
  const ids = cards.map((card) => card.id);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    const update = () => setTouchMode(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  function leave() {
    if (!touchMode && scopeRef.current && shouldResetExplorerOnPointerExit(scopeRef.current, document.activeElement)) {
      dispatch({ type: "reset" });
    }
  }

  function onBlurCapture(event: FocusEvent<HTMLElement>) {
    if (scopeRef.current && shouldResetExplorerOnFocusExit(scopeRef.current, event.relatedTarget)) {
      dispatch({ type: "reset" });
    }
  }

  function onTouchStart(event: TouchEvent<HTMLElement>) {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  }

  function onTouchEnd(event: TouchEvent<HTMLElement>) {
    const start = touchStartX.current;
    const end = event.changedTouches[0]?.clientX;
    touchStartX.current = null;
    if (start === null || end === undefined || Math.abs(start - end) < 36) return;
    dispatch({ type: "swipe", direction: end < start ? 1 : -1, ids });
  }

  const preview = (id: string) => dispatch({ type: "preview", id });
  const hover = (id: string) => () => !touchMode && preview(id);

  function cardBody(card: ExplorerCard, index: number): ReactNode {
    return <div className="explorer__artifact-drift">
      <span className="explorer__number">0{index + 1}</span>
      {card.media ? (
        <div className="explorer__placeholder explorer__placeholder--photo">
          <img
            src={card.media.src}
            srcSet={card.media.srcSet}
            sizes={card.media.sizes ?? DEFAULT_MEDIA_SIZES}
            width="480"
            height="640"
            alt={card.media.alt}
            loading="eager"
            decoding="async"
          />
        </div>
      ) : (
        <div className="explorer__placeholder" aria-hidden="true">{labels.placeholder && <span>{labels.placeholder}</span>}</div>
      )}
      {(card.title || card.meta) && (
        <div className="explorer__detail"><strong>{card.title}</strong><span>{card.meta}</span></div>
      )}
    </div>;
  }

  return <section
    ref={scopeRef}
    className={`explorer ${state.isInteractive ? "explorer--active" : ""}`}
    aria-labelledby={showInterests ? labelId : undefined}
    aria-label={showInterests ? undefined : labels.heading}
    onBlurCapture={onBlurCapture}
    onMouseLeave={leave}
  >
    {showInterests && <div className="explorer__intro">
      <p id={labelId} className="explorer__label">{labels.heading}</p>
      <div className="explorer__interests" aria-label={labels.interests}>
        {cards.map((card, index) => {
          const label = <><span>{String(index + 1).padStart(2, "0")}</span>{card.label}</>;
          const className = `explorer__interest ${activeInterest === card.id ? "is-active" : ""}`;

          return card.href ? (
            <a key={card.id} href={card.href} className={className} onMouseEnter={hover(card.id)} onFocus={() => preview(card.id)}>
              {label}
            </a>
          ) : (
            <button key={card.id} type="button" className={className} onMouseEnter={hover(card.id)} onFocus={() => preview(card.id)} onClick={() => dispatch({ type: "activate", id: card.id })} aria-pressed={committedInterest === card.id} aria-controls={`${labelId}-${card.id}`}>
              {label}
            </button>
          );
        })}
      </div>
    </div>}
    <div className="explorer__stage" aria-live="polite" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {cards.map((card, index) => {
        const active = activeInterest === card.id;
        const status = (card.media || card.href) ? "" : ` ${labels.unavailable}`;
        const named = [card.title, card.meta].filter(Boolean);
        const ariaLabel = named.length ? `${named.join(". ")}.${status}` : undefined;
        // No detail text means no reserved room for it — the surface fills the card.
        const bare = !card.title && !card.meta ? " explorer__artifact--bare" : "";
        const className = `explorer__artifact explorer__artifact--${card.tone}${bare} ${active ? "is-focused" : ""} ${activeInterest && !active ? "is-muted" : ""}`;
        const id = `${labelId}-${card.id}`;

        if (showInterests) {
          return <article id={id} key={card.id} className={className} aria-label={ariaLabel}>
            {cardBody(card, index)}
          </article>;
        }

        // A card with nothing to say and nowhere to go is decoration: it keeps the
        // pointer-driven reveal but stays out of the tab order and the a11y tree,
        // rather than becoming a focusable control with no accessible name.
        if (!card.href && !card.title && !card.meta) {
          return <article id={id} key={card.id} className={className} aria-hidden="true" onMouseEnter={hover(card.id)}>
            {cardBody(card, index)}
          </article>;
        }

        // With the interests row hidden, the cards themselves carry the interaction —
        // otherwise the reveal is unreachable by pointer or keyboard.
        return card.href ? (
          <a id={id} key={card.id} href={card.href} className={className} aria-label={ariaLabel} onMouseEnter={hover(card.id)} onFocus={() => preview(card.id)}>
            {cardBody(card, index)}
          </a>
        ) : (
          <button id={id} key={card.id} type="button" className={className} aria-label={ariaLabel} aria-pressed={committedInterest === card.id} onMouseEnter={hover(card.id)} onFocus={() => preview(card.id)} onClick={() => dispatch({ type: "activate", id: card.id })}>
            {cardBody(card, index)}
          </button>
        );
      })}
    </div>
    {labels.touchHint && <p className="explorer__hint">{labels.touchHint}</p>}
  </section>;
}

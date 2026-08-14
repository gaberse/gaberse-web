import { useEffect, useId, useReducer, useRef, useState, type FocusEvent, type TouchEvent } from "react";
import { getExplorerState, initialExplorerState, reduceExplorerInteraction, shouldResetExplorerOnFocusExit, shouldResetExplorerOnPointerExit, type InterestId } from "./home-explorer-state";
import "./home-explorer.css";

type Locale = "en" | "es";
type Artifact = { id: InterestId; interest: string; title: string; meta: string; tone: string };

const artifacts: Record<Locale, Artifact[]> = {
  en: [
    { id: "ai", interest: "AI", title: "AI Engineering Path", meta: "A living practice · Active", tone: "a" },
    { id: "design-systems", interest: "Design Systems", title: "Design System", meta: "A library in progress", tone: "b" },
    { id: "travel-photography", interest: "Travel Photography", title: "Travel Photography", meta: "Places kept close", tone: "c" },
  ],
  es: [
    { id: "ai", interest: "AI", title: "AI Engineering Path", meta: "Una práctica viva · Activa", tone: "a" },
    { id: "design-systems", interest: "Sistemas de diseño", title: "Design System", meta: "Una biblioteca en progreso", tone: "b" },
    { id: "travel-photography", interest: "Fotografía de viajes", title: "Fotografía de viajes", meta: "Lugares que permanecen", tone: "c" },
  ],
};

export default function HomeExplorer({ locale }: { locale: Locale }) {
  const [interaction, dispatch] = useReducer(
    reduceExplorerInteraction,
    initialExplorerState,
  );
  const [touchMode, setTouchMode] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const scopeRef = useRef<HTMLElement>(null);
  const labelId = useId();
  const copy = artifacts[locale];
  const state = getExplorerState(interaction);
  const { activeInterest, committedInterest } = state;
  const labels = locale === "en"
    ? { heading: "Explore what keeps pulling me in", interests: "Interests", unavailable: "Not published yet", placeholder: "Placeholder media", touchHint: "Tap or swipe to explore" }
    : { heading: "Últimamente, por acá", interests: "Intereses", unavailable: "Aún no publicado", placeholder: "Media provisional", touchHint: "Toca o desliza para explorar" };

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
    dispatch({ type: "swipe", direction: end < start ? 1 : -1 });
  }

  return <section ref={scopeRef} className={`explorer ${state.isInteractive ? "explorer--active" : ""}`} aria-labelledby={labelId} onBlurCapture={onBlurCapture} onMouseLeave={leave}>
    <div className="explorer__intro">
      <p id={labelId} className="explorer__label">{labels.heading}</p>
      <div className="explorer__interests" aria-label={labels.interests}>
        {copy.map((artifact, index) => <button key={artifact.id} type="button" className={`explorer__interest ${activeInterest === artifact.id ? "is-active" : ""}`} onMouseEnter={() => !touchMode && dispatch({ type: "preview", id: artifact.id })} onFocus={() => dispatch({ type: "preview", id: artifact.id })} onClick={() => dispatch({ type: "activate", id: artifact.id })} aria-pressed={committedInterest === artifact.id} aria-controls={`${labelId}-${artifact.id}`}>
          <span>{String(index + 1).padStart(2, "0")}</span>{artifact.interest}
        </button>)}
      </div>
    </div>
    <div className="explorer__stage" aria-live="polite" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {copy.map((artifact, index) => {
        const active = activeInterest === artifact.id;
        return <article id={`${labelId}-${artifact.id}`} key={artifact.id} className={`explorer__artifact explorer__artifact--${artifact.tone} ${active ? "is-focused" : ""} ${activeInterest && !active ? "is-muted" : ""}`} aria-label={`${artifact.title}. ${artifact.meta}. ${labels.unavailable}`}>
          <div className="explorer__artifact-drift">
            <span className="explorer__number">0{index + 1}</span>
            <div className="explorer__placeholder" aria-hidden="true"><span>{labels.placeholder}</span></div>
            <div className="explorer__detail"><strong>{artifact.title}</strong><span>{artifact.meta}</span></div>
          </div>
        </article>;
      })}
    </div>
    <p className="explorer__hint">{labels.touchHint}</p>
  </section>;
}

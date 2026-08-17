import { useEffect, useRef } from "react";
import type { Locale } from "../../lib/i18n";
import "./contact-profile.css";

const profileCopy = {
  en: {
    trigger: "Contact",
    dialogLabel: "Gabriela — contact profile",
    closeLabel: "Close Gabriela profile",
    closeVisible: "CLOSE",
    photoAlt: "Gabriela standing on a rocky beach beside the sea.",
    statement: "I make things, follow curiosities, and document what happens along the way.",
  },
  es: {
    trigger: "Contacto",
    dialogLabel: "Gabriela — perfil de contacto",
    closeLabel: "Cerrar el perfil de Gabriela",
    closeVisible: "CERRAR",
    photoAlt: "Gabriela de pie en una playa rocosa junto al mar.",
    statement:
      "Hago cosas, me obsesiono con otras y voy dejando registro de lo que pasa en el camino.",
  },
} as const;

const socialLinks = [
  { name: "GitHub", href: "https://github.com/gaberse" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/magalopez/" },
  { name: "Instagram", href: "https://www.instagram.com/gaberse_/" },
] as const;

type Props = {
  locale: Locale;
  /** "inline" is the header pill. "block" renders the trigger as a full CTA block. */
  variant?: "inline" | "block";
  /** Block variant only: the headline and supporting line shown on the trigger. */
  title?: string;
  description?: string;
};

export default function ContactProfile({ locale, variant = "inline", title, description }: Props) {
  const copy = profileCopy[locale];
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previousBodyOverflow = useRef("");

  const restoreBodyScroll = () => {
    document.body.style.overflow = previousBodyOverflow.current;
  };

  const openDialog = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    previousBodyOverflow.current = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
  };

  const closeDialog = () => {
    dialogRef.current?.close();
  };

  const handleDialogClose = () => {
    restoreBodyScroll();
    triggerRef.current?.focus();
  };

  useEffect(() => () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    restoreBodyScroll();
  }, []);

  return (
    <div className={variant === "block" ? "contact-profile contact-profile--block" : "contact-profile"}>
      {variant === "block" ? (
        <button
          ref={triggerRef}
          className="item__next-link contact-profile__block-trigger"
          type="button"
          aria-haspopup="dialog"
          onClick={openDialog}
        >
          <span>{title} <span aria-hidden="true">→</span></span>
          <small>{description}</small>
        </button>
      ) : (
        <button
          ref={triggerRef}
          className="contact-profile__trigger"
          type="button"
          aria-haspopup="dialog"
          onClick={openDialog}
        >
          {copy.trigger} <span aria-hidden="true">↗</span>
        </button>
      )}

      <dialog
        ref={dialogRef}
        className="contact-profile__dialog"
        aria-label={copy.dialogLabel}
        onClose={handleDialogClose}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            closeDialog();
          }
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) closeDialog();
        }}
      >
        <div className="contact-profile__surface">
          <div className="contact-profile__bar">
            <button
              className="contact-profile__close"
              type="button"
              aria-label={copy.closeLabel}
              onClick={closeDialog}
              autoFocus
            >
              {copy.closeVisible} <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="contact-profile__body">
            <figure className="contact-profile__photo">
              <img
                src="/media/profile/gabriela-by-the-sea-800.webp"
                srcSet={[
                  "/media/profile/gabriela-by-the-sea-480.webp 480w",
                  "/media/profile/gabriela-by-the-sea-800.webp 800w",
                  "/media/profile/gabriela-by-the-sea-1200.webp 1200w",
                ].join(", ")}
                sizes="(max-width: 44rem) 100vw, 32vw"
                width="1200"
                height="1600"
                alt={copy.photoAlt}
                loading="lazy"
                decoding="async"
              />
            </figure>

            <div className="contact-profile__identity">
              <h2>GABRIELA</h2>
              <p className="contact-profile__statement">{copy.statement}</p>

              <div className="contact-profile__links" aria-label={copy.dialogLabel}>
                {socialLinks.map(({ name, href }) => (
                  <a
                    href={href}
                    key={name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {name} <span aria-hidden="true">↗</span>
                  </a>
                ))}
                <a href="mailto:hello@gaberse.tech">
                  hello@gaberse.tech <span aria-hidden="true">↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
}

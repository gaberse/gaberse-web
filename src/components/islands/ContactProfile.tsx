import { useEffect, useRef } from "react";
import type { Locale } from "../../lib/i18n";
import "./contact-profile.css";

const profileCopy = {
  en: {
    trigger: "Contact",
    dialogLabel: "Gabriela — contact profile",
    close: "Close profile",
    photo: "Editorial photograph pending",
    statement: "Gaberse is where I keep the things I make, explore, and experience.",
    urlPending: "URL pending",
  },
  es: {
    trigger: "Contacto",
    dialogLabel: "Gabriela — perfil de contacto",
    close: "Cerrar perfil",
    photo: "Fotografía editorial pendiente",
    statement: "Gaberse es donde guardo las cosas que hago, exploro y vivo.",
    urlPending: "URL pendiente",
  },
} as const;

const socialNames = ["GitHub", "LinkedIn", "Instagram"] as const;

export default function ContactProfile({ locale }: { locale: Locale }) {
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
    <div className="contact-profile">
      <button
        ref={triggerRef}
        className="contact-profile__trigger"
        type="button"
        aria-haspopup="dialog"
        onClick={openDialog}
      >
        {copy.trigger} <span aria-hidden="true">↗</span>
      </button>

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
            <p aria-hidden="true">GABERSE / 01</p>
            <button
              className="contact-profile__close"
              type="button"
              onClick={closeDialog}
              autoFocus
            >
              {copy.close} <span aria-hidden="true">×</span>
            </button>
          </div>

          <div className="contact-profile__body">
            <div className="contact-profile__photo" role="img" aria-label={copy.photo}>
              <span>{copy.photo}</span>
            </div>

            <div className="contact-profile__identity">
              <p className="contact-profile__eyebrow">GABRIELA</p>
              <h2>GABRIELA</h2>
              <p className="contact-profile__statement">{copy.statement}</p>

              <div className="contact-profile__links" aria-label={copy.dialogLabel}>
                {socialNames.map((name) => (
                  <span className="contact-profile__pending" key={name}>
                    <span>{name}</span>
                    <small>{copy.urlPending}</small>
                  </span>
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

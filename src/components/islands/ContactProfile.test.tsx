import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactProfile from "./ContactProfile";

describe("ContactProfile", () => {
  it("renders a semantic English contact surface with safe external social links", () => {
    const html = renderToStaticMarkup(createElement(ContactProfile, { locale: "en" }));

    expect(html).toContain("<dialog");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("Contact");
    expect(html.match(/>GABRIELA</g)).toHaveLength(1);
    expect(html).not.toContain("GABERSE / 01");
    expect(html).toContain('aria-label="Close Gabriela profile"');
    expect(html).toContain('>CLOSE <span aria-hidden="true">×</span>');
    expect(html).toContain('src="/media/profile/gabriela-by-the-sea-800.webp"');
    expect(html).toContain("/media/profile/gabriela-by-the-sea-480.webp 480w");
    expect(html).toContain('sizes="(max-width: 44rem) 100vw, 32vw"');
    expect(html).toContain("Gabriela standing on a rocky beach beside the sea.");
    expect(html).toContain("GitHub");
    expect(html).toContain("LinkedIn");
    expect(html).toContain("Instagram");
    expect(html).toContain('href="https://github.com/gaberse"');
    expect(html).toContain('href="https://www.linkedin.com/in/magalopez/"');
    expect(html).toContain('href="https://www.instagram.com/gaberse_/"');
    expect(html.match(/target="_blank"/g)).toHaveLength(3);
    expect(html.match(/rel="noopener noreferrer"/g)).toHaveLength(3);
    expect(html).not.toContain("URL pending");
    expect(html).toContain('href="mailto:hello@gaberse.tech"');
    expect(html).toContain(
      "I make things, follow curiosities, and document what happens along the way.",
    );
    expect(html).not.toContain(
      "Gaberse is where I keep the things I make, explore, and experience.",
    );
  });

  it("localizes interface and temporary profile copy for Spanish", () => {
    const html = renderToStaticMarkup(createElement(ContactProfile, { locale: "es" }));

    expect(html).toContain("Contacto");
    expect(html).toContain('aria-label="Cerrar el perfil de Gabriela"');
    expect(html).toContain('>CERRAR <span aria-hidden="true">×</span>');
    expect(html).toContain("Gabriela de pie en una playa rocosa junto al mar.");
    expect(html).toContain(
      "Hago cosas, me obsesiono con otras y voy dejando registro de lo que pasa en el camino.",
    );
    expect(html).not.toContain("Gaberse es donde guardo las cosas que hago, exploro y vivo.");
    expect(html).not.toContain("URL pendiente");
  });
});

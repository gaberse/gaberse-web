import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import ContactProfile from "./ContactProfile";

describe("ContactProfile", () => {
  it("renders a semantic English contact surface without fake social links", () => {
    const html = renderToStaticMarkup(createElement(ContactProfile, { locale: "en" }));

    expect(html).toContain("<dialog");
    expect(html).toContain('aria-haspopup="dialog"');
    expect(html).toContain("Contact");
    expect(html).toContain("GABRIELA");
    expect(html).toContain("Editorial photograph pending");
    expect(html).toContain("GitHub");
    expect(html).toContain("LinkedIn");
    expect(html).toContain("Instagram");
    expect(html.match(/URL pending/g)).toHaveLength(3);
    expect(html).toContain('href="mailto:hello@gaberse.tech"');
    expect(html).not.toContain('href="https://');
  });

  it("localizes interface and temporary profile copy for Spanish", () => {
    const html = renderToStaticMarkup(createElement(ContactProfile, { locale: "es" }));

    expect(html).toContain("Contacto");
    expect(html).toContain("Cerrar perfil");
    expect(html).toContain("Fotografía editorial pendiente");
    expect(html).toContain("Gaberse es donde guardo las cosas que hago, exploro y vivo.");
    expect(html.match(/URL pendiente/g)).toHaveLength(3);
  });
});

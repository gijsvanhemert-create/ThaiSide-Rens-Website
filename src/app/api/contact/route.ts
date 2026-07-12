// Server-side contact endpoint. Reads RESEND_API_KEY from the server env only —
// the key never reaches the client, which just POSTs the form here.

import { Resend } from "resend";
import { validateContact } from "@/lib/contact";

/**
 * Where submissions are delivered. Overridable via env so a staging/test
 * environment can redirect mail away from the live inbox.
 */
const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? "rens@thaisiderens.nl";

/**
 * Sender address. Must be on a domain verified in Resend. Overridable via env
 * so the verified domain can change without a code edit.
 */
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ??
  "ThaiSide Rens Website <contact@thaisiderens.nl>";

/** Escape user input before interpolating it into the HTML email body. */
function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] ?? char,
  );
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Ongeldige aanvraag." },
      { status: 400 },
    );
  }

  // Authoritative server-side validation (mirrors the client checks).
  const { valid, errors, data } = validateContact(body);
  if (!valid) {
    return Response.json({ errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("Contact form: RESEND_API_KEY is not set.");
    return Response.json({ error: "unavailable" }, { status: 500 });
  }

  const resend = new Resend(apiKey);

  const { data: sent, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: data.email, // so Rens can reply straight to the sender
    subject: `Nieuw contactbericht van ${data.name}`,
    text: `Naam: ${data.name}\nE-mail: ${data.email}\n\nBericht:\n${data.message}`,
    html: `<p><strong>Naam:</strong> ${escapeHtml(data.name)}</p>
<p><strong>E-mail:</strong> ${escapeHtml(data.email)}</p>
<p><strong>Bericht:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`,
  });

  if (error) {
    console.error("Contact form: Resend send failed:", error);
    return Response.json({ error: "unavailable" }, { status: 502 });
  }

  return Response.json({ ok: true, id: sent?.id });
}

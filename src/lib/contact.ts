// Shared contact-form validation. Pure and dependency-free so it can run in
// both the Client Component (for instant feedback) and the API route (as the
// authoritative check). Never import secrets here.

export type ContactInput = {
  name: string;
  email: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 100,
  email: 200,
  messageMin: 10,
  messageMax: 5000,
} as const;

/**
 * Validate and normalize (trim) an untrusted contact submission. Accepts
 * `unknown` so it can guard raw request bodies safely.
 */
export function validateContact(input: unknown): {
  valid: boolean;
  errors: ContactErrors;
  data: ContactInput;
} {
  const obj =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};

  const data: ContactInput = {
    name: typeof obj.name === "string" ? obj.name.trim() : "",
    email: typeof obj.email === "string" ? obj.email.trim() : "",
    message: typeof obj.message === "string" ? obj.message.trim() : "",
  };

  const errors: ContactErrors = {};

  if (data.name.length === 0) {
    errors.name = "Vul je naam in.";
  } else if (data.name.length > LIMITS.name) {
    errors.name = `Naam mag maximaal ${LIMITS.name} tekens zijn.`;
  }

  if (data.email.length === 0) {
    errors.email = "Vul je e-mailadres in.";
  } else if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)) {
    errors.email = "Vul een geldig e-mailadres in.";
  }

  if (data.message.length === 0) {
    errors.message = "Schrijf een bericht.";
  } else if (data.message.length < LIMITS.messageMin) {
    errors.message = `Je bericht is te kort (minimaal ${LIMITS.messageMin} tekens).`;
  } else if (data.message.length > LIMITS.messageMax) {
    errors.message = `Je bericht is te lang (maximaal ${LIMITS.messageMax} tekens).`;
  }

  return { valid: Object.keys(errors).length === 0, errors, data };
}

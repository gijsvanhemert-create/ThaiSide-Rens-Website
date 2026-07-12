"use client";

import { useId, useState } from "react";
import {
  validateContact,
  type ContactErrors,
  type ContactInput,
} from "@/lib/contact";

type Status = "idle" | "submitting" | "success" | "error";

const EMPTY: ContactInput = { name: "", email: "", message: "" };

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");

  const baseId = useId();
  const fieldId = (field: keyof ContactInput) => `${baseId}-${field}`;
  const errorId = (field: keyof ContactInput) => `${baseId}-${field}-error`;

  function update(field: keyof ContactInput, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Clear a field's error as the user corrects it.
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (status === "error") setStatus("idle");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    // Instant client-side check; the server re-validates authoritatively.
    const { valid, errors: clientErrors } = validateContact(values);
    if (!valid) {
      setErrors(clientErrors);
      return;
    }
    setErrors({});
    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          errors?: ContactErrors;
        };
        // Surface server-side field errors and let the user fix them.
        if (res.status === 400 && data.errors) {
          setErrors(data.errors);
          setStatus("idle");
          return;
        }
        throw new Error("send failed");
      }

      setValues(EMPTY);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-border bg-background-card p-8 text-center">
        <h2 className="font-display text-2xl uppercase text-text">
          Bericht <span className="text-accent-yellow">verzonden</span>
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-text-muted">
          Bedankt voor je bericht! Ik kom zo snel mogelijk bij je terug.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 rounded-lg border border-border px-5 py-2.5 text-sm text-text-muted transition-colors hover:text-text"
        >
          Nog een bericht sturen
        </button>
      </div>
    );
  }

  const submitting = status === "submitting";

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {status === "error" && (
        <p
          role="alert"
          className="rounded-lg border border-accent-red/40 bg-accent-red/10 px-4 py-3 text-sm text-accent-red"
        >
          Er ging iets mis bij het verzenden. Probeer het later opnieuw.
        </p>
      )}

      <Field
        label="Naam"
        id={fieldId("name")}
        error={errors.name}
        errorId={errorId("name")}
      >
        <input
          id={fieldId("name")}
          type="text"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(e) => update("name", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorId("name") : undefined}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <Field
        label="E-mail"
        id={fieldId("email")}
        error={errors.email}
        errorId={errorId("email")}
      >
        <input
          id={fieldId("email")}
          type="email"
          name="email"
          autoComplete="email"
          value={values.email}
          onChange={(e) => update("email", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(errors.email)}
          aria-describedby={errors.email ? errorId("email") : undefined}
          className={inputClass(Boolean(errors.email))}
        />
      </Field>

      <Field
        label="Bericht"
        id={fieldId("message")}
        error={errors.message}
        errorId={errorId("message")}
      >
        <textarea
          id={fieldId("message")}
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          disabled={submitting}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? errorId("message") : undefined}
          className={`${inputClass(Boolean(errors.message))} resize-y`}
        />
      </Field>

      <div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent-red px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-red/90 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        >
          {submitting ? "Versturen…" : "Verstuur bericht"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  error,
  errorId,
  children,
}: {
  label: string;
  id: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-text">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-accent-red">
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean): string {
  return [
    "w-full rounded-lg border bg-background-card px-4 py-3 text-text",
    "placeholder:text-text-muted focus:outline-none",
    hasError
      ? "border-accent-red focus:border-accent-red"
      : "border-border focus:border-text-muted",
  ].join(" ");
}

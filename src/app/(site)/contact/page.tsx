import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — ThaiSide Rens",
  description:
    "Neem contact op met Rens voor vragen, samenwerkingen of een berichtje.",
};

export default function ContactPage() {
  return (
    <section className="mx-auto w-full max-w-2xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Contact
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          Neem <span className="text-accent-yellow">contact</span> op
        </h1>
        <p className="mt-6 text-text-muted">
          Een vraag, een samenwerking of gewoon een berichtje? Vul het formulier
          in en ik kom zo snel mogelijk bij je terug.
        </p>
      </header>

      <ContactForm />
    </section>
  );
}

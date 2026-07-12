import type { Metadata } from "next";
import Link from "next/link";
import { getSamenwerken } from "@/sanity/lib/queries";

export const metadata: Metadata = {
  title: "Samenwerken — ThaiSide Rens",
  description:
    "Samenwerken met Rens: bereik, mogelijkheden en hoe je contact opneemt.",
};

export default async function SamenwerkenPage() {
  const samenwerken = await getSamenwerken();

  if (!samenwerken) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Samenwerken
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          Binnenkort <span className="text-accent-yellow">meer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-text-muted">
          De mogelijkheden voor samenwerkingen worden binnenkort toegevoegd. Kom
          snel terug of neem alvast contact op.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Samenwerken
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          {samenwerken.title}
        </h1>
      </header>

      {samenwerken.intro && (
        <p className="whitespace-pre-line text-lg text-text-muted">
          {samenwerken.intro}
        </p>
      )}

      {samenwerken.reachStats && samenwerken.reachStats.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 font-display text-2xl uppercase text-text">
            Bereik
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {samenwerken.reachStats.map((stat, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-background-card p-5 text-center"
              >
                <p className="font-display text-3xl text-text sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {samenwerken.collaborationTypes &&
        samenwerken.collaborationTypes.length > 0 && (
          <div className="mt-12">
            <h2 className="mb-4 font-display text-2xl uppercase text-text">
              Samenwerkingsvormen
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {samenwerken.collaborationTypes.map((type, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-background-card p-5"
                >
                  <h3 className="font-display text-xl uppercase text-text">
                    {type.title}
                  </h3>
                  {type.description && (
                    <p className="mt-2 text-text-muted">{type.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      <div className="mt-12">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-lg bg-accent-red px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
        >
          Neem contact op
        </Link>
      </div>
    </section>
  );
}

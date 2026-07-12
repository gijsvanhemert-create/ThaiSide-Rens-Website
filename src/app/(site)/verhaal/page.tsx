import type { Metadata } from "next";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import { portableTextComponents } from "@/components/portable-text";
import { getVerhaal } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Verhaal — ThaiSide Rens",
  description: "Het persoonlijke verhaal van Rens in Thailand.",
};

export default async function VerhaalPage() {
  const verhaal = await getVerhaal();

  if (!verhaal) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Verhaal
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          Binnenkort <span className="text-accent-yellow">meer</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-text-muted">
          Rens is zijn verhaal aan het schrijven. Kom snel terug — hier lees je
          binnenkort alles over zijn avontuur in Thailand.
        </p>
      </section>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-10">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Verhaal
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          {verhaal.title}
        </h1>
      </header>

      {verhaal.heroImage && (
        <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-xl border border-border bg-background-card">
          <Image
            src={urlFor(verhaal.heroImage).width(1600).height(900).url()}
            alt={verhaal.heroImage.alt ?? verhaal.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
          />
        </div>
      )}

      {verhaal.content && (
        <div className="text-lg">
          <PortableText
            value={verhaal.content}
            components={portableTextComponents}
          />
        </div>
      )}

      {verhaal.gallery && verhaal.gallery.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 font-display text-2xl uppercase text-text">
            Foto&apos;s
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {verhaal.gallery.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-lg border border-border bg-background-card"
              >
                <Image
                  src={urlFor(image).width(600).height(600).url()}
                  alt={image.alt ?? `${verhaal.title} — foto ${index + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

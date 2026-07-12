import type { Metadata } from "next";
import Image from "next/image";
import { getGear } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";

export const metadata: Metadata = {
  title: "Gear — ThaiSide Rens",
  description:
    "De spullen die Rens gebruikt voor zijn content en leven in Thailand.",
};

// Affiliate disclosure — legally required (Dutch advertising rules) and shown
// permanently near the top of the page, whether or not products exist yet.
function AffiliateDisclosure() {
  return (
    <p className="rounded-lg border border-border bg-background-card px-4 py-3 text-sm text-text-muted">
      Dit zijn affiliate-links — als je hierop koopt, ontvang ik een kleine
      commissie, zonder extra kosten voor jou.
    </p>
  );
}

export default async function GearPage() {
  const gear = await getGear();

  if (!gear) {
    return (
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <AffiliateDisclosure />
        <div className="py-16 text-center sm:py-24">
          <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
            Gear
          </p>
          <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
            Binnenkort <span className="text-accent-yellow">meer</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-text-muted">
            Rens stelt zijn gear-lijst samen. Kom snel terug — hier vind je
            binnenkort de spullen die hij gebruikt en aanraadt.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header className="mb-8">
        <p className="mb-3 text-sm uppercase tracking-widest text-text-muted">
          Gear
        </p>
        <h1 className="font-display text-4xl uppercase text-text sm:text-5xl">
          {gear.title}
        </h1>
      </header>

      <AffiliateDisclosure />

      {gear.intro && (
        <p className="mt-8 whitespace-pre-line text-lg text-text-muted">
          {gear.intro}
        </p>
      )}

      {gear.products && gear.products.length > 0 && (
        <div className="mt-10 space-y-6">
          {gear.products.map((product, index) => (
            <article
              key={index}
              className="overflow-hidden rounded-xl border border-border bg-background-card sm:flex"
            >
              {product.image && (
                <div className="relative aspect-square bg-background-raised sm:w-48 sm:shrink-0">
                  <Image
                    src={urlFor(product.image).width(400).height(400).url()}
                    alt={product.image.alt ?? product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, 192px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <h2 className="font-display text-2xl uppercase text-text">
                  {product.name}
                </h2>
                {product.description && (
                  <p className="text-text-muted">{product.description}</p>
                )}
                {product.whyIUse && (
                  <div>
                    <p className="mb-1 text-xs uppercase tracking-widest text-text-muted">
                      Waarom ik dit gebruik
                    </p>
                    <p className="text-text">{product.whyIUse}</p>
                  </div>
                )}
                <div className="mt-auto pt-2">
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="sponsored noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text transition-colors hover:border-text-muted"
                  >
                    Bekijk product
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

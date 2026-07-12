import type { PortableTextBlock } from "@portabletext/react";
import type { SanityImageSource } from "@sanity/image-url";
import { client } from "./client";

export type SanityImage = SanityImageSource & {
  alt?: string;
};

export type Verhaal = {
  title: string;
  content?: PortableTextBlock[];
  heroImage?: SanityImage;
  gallery?: SanityImage[];
};

const VERHAAL_QUERY = `*[_type == "verhaal"][0]{
  title,
  content,
  heroImage,
  gallery
}`;

/**
 * Fetch the Verhaal singleton. Returns null when Sanity is not yet configured
 * (client is null) or when no document has been authored — callers render a
 * placeholder in that case.
 */
export async function getVerhaal(): Promise<Verhaal | null> {
  if (!client) return null;
  return client.fetch<Verhaal | null>(
    VERHAAL_QUERY,
    {},
    { next: { revalidate: 60 } },
  );
}

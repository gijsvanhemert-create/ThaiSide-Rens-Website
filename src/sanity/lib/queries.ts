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

export type GearProduct = {
  name: string;
  image?: SanityImage;
  description?: string;
  affiliateLink: string;
  whyIUse?: string;
};

export type Gear = {
  title: string;
  intro?: string;
  products?: GearProduct[];
};

const GEAR_QUERY = `*[_type == "gear"][0]{
  title,
  intro,
  products[]{
    name,
    image,
    description,
    affiliateLink,
    whyIUse
  }
}`;

/** Fetch the Gear singleton. Null when unconfigured or unauthored — see getVerhaal. */
export async function getGear(): Promise<Gear | null> {
  if (!client) return null;
  return client.fetch<Gear | null>(
    GEAR_QUERY,
    {},
    { next: { revalidate: 60 } },
  );
}

export type ReachStat = {
  label: string;
  value: string;
};

export type CollaborationType = {
  title: string;
  description?: string;
};

export type Samenwerken = {
  title: string;
  intro?: string;
  reachStats?: ReachStat[];
  collaborationTypes?: CollaborationType[];
};

const SAMENWERKEN_QUERY = `*[_type == "samenwerken"][0]{
  title,
  intro,
  reachStats[]{
    label,
    value
  },
  collaborationTypes[]{
    title,
    description
  }
}`;

/** Fetch the Samenwerken singleton. Null when unconfigured or unauthored — see getVerhaal. */
export async function getSamenwerken(): Promise<Samenwerken | null> {
  if (!client) return null;
  return client.fetch<Samenwerken | null>(
    SAMENWERKEN_QUERY,
    {},
    { next: { revalidate: 60 } },
  );
}

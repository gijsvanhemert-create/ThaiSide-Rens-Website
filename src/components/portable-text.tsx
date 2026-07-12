import type { PortableTextComponents } from "@portabletext/react";

// Maps Sanity Portable Text to the ThaiSide Rens design system.
// Headings use font-display (Anton); body copy stays muted for comfortable
// long-form reading on the dark background.
export const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 leading-relaxed text-text-muted">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-display text-2xl uppercase text-text sm:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-display text-xl uppercase text-text sm:text-2xl">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-2 border-border pl-4 italic text-text">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 ml-5 list-disc space-y-2 text-text-muted">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 ml-5 list-decimal space-y-2 text-text-muted">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-text">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-accent-red underline underline-offset-2 hover:opacity-90"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
  },
};

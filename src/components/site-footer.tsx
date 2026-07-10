import Link from "next/link";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border bg-background-raised">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="font-display text-xl uppercase tracking-wide text-text">
            ThaiSide <span className="text-accent-yellow">Rens</span>
          </p>
          <p className="text-sm text-text-muted">
            Volg Rens' avontuur in Thailand.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Primary membership CTA — the one red element in the footer */}
          <Link
            href="/word-thaisider"
            className="inline-flex items-center justify-center rounded-lg bg-accent-red px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Word ThaiSider
          </Link>
          <Link
            href="/samenwerken"
            className="inline-flex items-center justify-center rounded-lg border border-border px-5 py-2.5 text-sm text-text-muted transition-colors hover:text-text"
          >
            Samenwerken
          </Link>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <p className="text-xs text-text-muted">
            © {year} ThaiSide Rens. Alle rechten voorbehouden.
          </p>
        </div>
      </div>
    </footer>
  );
}

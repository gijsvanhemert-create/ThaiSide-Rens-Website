import Studio from "./Studio";
import { isSanityConfigured } from "@/sanity/env";

// Embedded Sanity Studio. The catch-all segment lets the Studio own all of /studio/*.
// The actual Studio lives in the client component ./Studio to keep `sanity` out of
// the RSC module graph (see the note there).
export const dynamic = "force-static";

export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  if (!isSanityConfigured) {
    return (
      <div className="mx-auto flex min-h-screen max-w-xl flex-col justify-center gap-4 p-8">
        <h1 className="font-display text-2xl uppercase text-text">
          Studio nog niet geconfigureerd
        </h1>
        <p className="text-text-muted">
          Maak een project aan op{" "}
          <a
            href="https://www.sanity.io/manage"
            className="text-accent-red underline"
          >
            sanity.io/manage
          </a>{" "}
          en zet <code>NEXT_PUBLIC_SANITY_PROJECT_ID</code> in{" "}
          <code>.env.local</code> (zie <code>.env.local.example</code>).
        </p>
      </div>
    );
  }

  return <Studio />;
}

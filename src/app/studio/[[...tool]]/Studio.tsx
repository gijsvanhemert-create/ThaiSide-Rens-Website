"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

// Client boundary so the Studio config (and all of `sanity`) resolves with
// browser/client module conditions. Importing it directly in the server page
// pulls `sanity` into the RSC graph, where `swr` resolves to its react-server
// build (no default export) and the build fails.
export default function Studio() {
  return <NextStudio config={config} />;
}

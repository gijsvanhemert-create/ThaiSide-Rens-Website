import { createClient } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

// `null` until a project id is configured — callers must guard on it so the
// build and runtime stay green before Sanity is wired to a real project.
export const client = isSanityConfigured
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: true, // published content served from the edge cache
    })
  : null;

// Sanity project configuration, read from environment.
// Until a real project is created at sanity.io/manage and NEXT_PUBLIC_SANITY_PROJECT_ID
// is set, `isSanityConfigured` stays false and the site falls back to placeholder UI.

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-10-01";

export const dataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";

/** True once a Sanity project id is present. Gates client/studio usage. */
export const isSanityConfigured = projectId.length > 0;

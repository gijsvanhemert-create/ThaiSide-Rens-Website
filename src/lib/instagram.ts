// Server-only Instagram feed helper.
//
// Uses the Instagram Graph API (graph.instagram.com) with a long-lived access
// token generated in the Meta App Dashboard — see CLAUDE.md; there is no custom
// OAuth callback route. INSTAGRAM_ACCESS_TOKEN is server env only; never expose
// it client-side. The public feed reaches this through /api/instagram.

import "server-only";

/** How long (seconds) fetched posts stay cached before revalidating. */
const REVALIDATE_SECONDS = 3600; // 1 hour

/** True once an Instagram access token is configured. */
export const isInstagramConfigured = Boolean(
  process.env.INSTAGRAM_ACCESS_TOKEN,
);

export type InstagramPost = {
  id: string;
  caption: string;
  permalink: string;
  imageUrl: string;
  mediaType: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  timestamp: string;
};

type MediaItem = {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  permalink?: string;
  thumbnail_url?: string;
  timestamp?: string;
};

/**
 * Fetch the account's most recent posts, newest first. Returns `[]` when no
 * token is configured so the UI can render a graceful fallback instead of
 * erroring. Throws on a non-OK API response so the Route Handler can surface a
 * 502. Cached and revalidated hourly via the Data Cache (not per request).
 */
export async function getLatestPosts(limit = 8): Promise<InstagramPost[]> {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  const params = new URLSearchParams({
    fields:
      "id,caption,media_type,media_url,permalink,thumbnail_url,timestamp",
    access_token: token,
    limit: String(limit),
  });

  const res = await fetch(
    `https://graph.instagram.com/me/media?${params.toString()}`,
    { next: { revalidate: REVALIDATE_SECONDS, tags: ["instagram"] } },
  );

  if (!res.ok) {
    throw new Error(`Instagram API responded with ${res.status}`);
  }

  const data: { data?: MediaItem[] } = await res.json();

  return (data.data ?? []).flatMap((item) => {
    const id = item.id;
    const permalink = item.permalink;
    // Videos expose a still via thumbnail_url; images/albums use media_url.
    const imageUrl =
      item.media_type === "VIDEO" ? item.thumbnail_url : item.media_url;
    if (!id || !permalink || !imageUrl) return [];

    return [
      {
        id,
        caption: item.caption ?? "",
        permalink,
        imageUrl,
        mediaType:
          (item.media_type as InstagramPost["mediaType"]) ?? "IMAGE",
        timestamp: item.timestamp ?? "",
      },
    ];
  });
}

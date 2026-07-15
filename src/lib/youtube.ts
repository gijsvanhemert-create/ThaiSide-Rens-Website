// Server-only YouTube Data API helper.
//
// The API key lives in YOUTUBE_API_KEY (server env only — never NEXT_PUBLIC_*),
// so this module must never be imported into a Client Component. The
// `server-only` import turns any such import into a build error. The public
// feed reaches this code through the /api/youtube Route Handler instead.

import "server-only";

/** Rens' YouTube channel. */
export const YOUTUBE_CHANNEL_ID = "UCzoTNtmfjVms1LBebeqhd6A";

/** How long (seconds) the fetched results stay cached before revalidating. */
const REVALIDATE_SECONDS = 3600; // 1 hour

/** True once a YouTube API key is configured. */
export const isYouTubeConfigured = Boolean(process.env.YOUTUBE_API_KEY);

export type YouTubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
  thumbnail: { url: string; width: number; height: number };
  url: string;
};

type Thumbnail = { url: string; width: number; height: number };

type PlaylistItem = {
  snippet?: {
    title?: string;
    publishedAt?: string;
    resourceId?: { videoId?: string };
    thumbnails?: {
      high?: Thumbnail;
      medium?: Thumbnail;
      default?: Thumbnail;
    };
  };
};

/** Decode the HTML entities the Search API returns in video titles. */
function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

const API_BASE = "https://www.googleapis.com/youtube/v3";

const fetchOptions = {
  next: { revalidate: REVALIDATE_SECONDS, tags: ["youtube"] },
};

/**
 * Videos at or below this length are treated as Shorts and filtered out.
 * 180s matches YouTube's Shorts maximum since the Oct 2024 update. Note this is
 * a duration heuristic — the Data API has no definitive "is a Short" flag, so a
 * long-form video of ≤3 min would also be excluded, and a Short is only ever
 * ≤3 min so none slip through on length.
 */
const SHORTS_MAX_SECONDS = 180;

/** Parse an ISO 8601 duration (e.g. "PT1H2M3S", "PT45S") into seconds. */
function parseIsoDuration(iso: string): number {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!match) return 0;
  const [, h, m, s] = match;
  return Number(h ?? 0) * 3600 + Number(m ?? 0) * 60 + Number(s ?? 0);
}

/**
 * Fetch durations (seconds) for up to 50 video IDs in one videos.list call.
 * Costs 1 quota unit on top of the playlist lookups — a small addition, but
 * worth noting since it runs on every uncached feed load.
 */
async function getDurations(
  apiKey: string,
  videoIds: string[],
): Promise<Map<string, number>> {
  const durations = new Map<string, number>();
  if (videoIds.length === 0) return durations;

  const params = new URLSearchParams({
    key: apiKey,
    id: videoIds.slice(0, 50).join(","),
    part: "contentDetails",
    maxResults: "50",
  });

  const res = await fetch(
    `${API_BASE}/videos?${params.toString()}`,
    fetchOptions,
  );
  if (!res.ok) {
    throw new Error(`YouTube videos API responded with ${res.status}`);
  }

  const data: {
    items?: { id?: string; contentDetails?: { duration?: string } }[];
  } = await res.json();

  for (const item of data.items ?? []) {
    if (item.id && item.contentDetails?.duration) {
      durations.set(item.id, parseIsoDuration(item.contentDetails.duration));
    }
  }

  return durations;
}

/**
 * Look up the channel's "uploads" playlist ID. Every channel has one system
 * playlist that contains all its uploads in reverse-chronological order.
 * Costs 1 quota unit.
 */
async function getUploadsPlaylistId(apiKey: string): Promise<string | null> {
  const params = new URLSearchParams({
    key: apiKey,
    id: YOUTUBE_CHANNEL_ID,
    part: "contentDetails",
  });

  const res = await fetch(
    `${API_BASE}/channels?${params.toString()}`,
    fetchOptions,
  );
  if (!res.ok) {
    throw new Error(`YouTube channels API responded with ${res.status}`);
  }

  const data: {
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
  } = await res.json();

  return data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads ?? null;
}

/**
 * Fetch the channel's most recent videos, newest first. Returns `[]` when no
 * API key is configured (or the channel has no uploads) so the UI can render an
 * empty state instead of erroring. Throws on a non-OK API response so the Route
 * Handler can surface a 502.
 *
 * Uses the channels → uploads-playlist → playlistItems flow, then one
 * videos.list call to read durations so Shorts (≤180s) can be filtered out
 * (~3 quota units total, vs ~100 for the search endpoint). Because filtering
 * removes items, it over-fetches playlist items and slices to `limit` after.
 * Results are cached and revalidated hourly via the Data Cache.
 */
export async function getLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const uploadsPlaylistId = await getUploadsPlaylistId(apiKey);
  if (!uploadsPlaylistId) return [];

  // Over-fetch: a channel may have many Shorts, so grab extra uploads to still
  // yield `limit` long-form videos after filtering. Capped at 50 (API max, and
  // the most a single videos.list duration call covers).
  const fetchCount = Math.min(limit * 4, 50);

  const params = new URLSearchParams({
    key: apiKey,
    playlistId: uploadsPlaylistId,
    part: "snippet",
    maxResults: String(fetchCount),
  });

  const res = await fetch(
    `${API_BASE}/playlistItems?${params.toString()}`,
    fetchOptions,
  );
  if (!res.ok) {
    throw new Error(`YouTube playlistItems API responded with ${res.status}`);
  }

  const data: { items?: PlaylistItem[] } = await res.json();

  const candidates = (data.items ?? []).flatMap((item) => {
    const snippet = item.snippet;
    const videoId = snippet?.resourceId?.videoId;
    if (!videoId || !snippet) return [];

    const thumb =
      snippet.thumbnails?.high ??
      snippet.thumbnails?.medium ??
      snippet.thumbnails?.default;
    if (!thumb) return [];

    return [
      {
        id: videoId,
        title: decodeEntities(snippet.title ?? ""),
        publishedAt: snippet.publishedAt ?? "",
        thumbnail: {
          url: thumb.url,
          width: thumb.width,
          height: thumb.height,
        },
        url: `https://www.youtube.com/watch?v=${videoId}`,
      },
    ];
  });

  // Filter out Shorts by duration. If a video's duration is missing for any
  // reason, keep it rather than silently dropping real content.
  const durations = await getDurations(
    apiKey,
    candidates.map((v) => v.id),
  );

  const longForm = candidates.filter((v) => {
    const seconds = durations.get(v.id);
    return seconds === undefined || seconds > SHORTS_MAX_SECONDS;
  });

  return longForm.slice(0, limit);
}

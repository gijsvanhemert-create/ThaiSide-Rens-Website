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
 * Uses the channels → uploads-playlist → playlistItems flow (~2 quota units)
 * rather than the search endpoint (~100 units). Results are cached and
 * revalidated hourly via the Data Cache.
 */
export async function getLatestVideos(limit = 6): Promise<YouTubeVideo[]> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) return [];

  const uploadsPlaylistId = await getUploadsPlaylistId(apiKey);
  if (!uploadsPlaylistId) return [];

  const params = new URLSearchParams({
    key: apiKey,
    playlistId: uploadsPlaylistId,
    part: "snippet",
    maxResults: String(limit),
  });

  const res = await fetch(
    `${API_BASE}/playlistItems?${params.toString()}`,
    fetchOptions,
  );
  if (!res.ok) {
    throw new Error(`YouTube playlistItems API responded with ${res.status}`);
  }

  const data: { items?: PlaylistItem[] } = await res.json();

  return (data.items ?? []).flatMap((item) => {
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
}

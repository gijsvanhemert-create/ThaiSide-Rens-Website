// Server-side proxy for the YouTube feed. Keeps YOUTUBE_API_KEY on the server:
// the client never talks to the YouTube API directly, only to this route.
// The underlying fetch is cached/revalidated hourly (see src/lib/youtube.ts).

import { getLatestVideos } from "@/lib/youtube";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const videos = await getLatestVideos(6);
    return Response.json({ videos });
  } catch (error) {
    console.error("Failed to load YouTube feed:", error);
    return Response.json(
      { videos: [], error: "unavailable" },
      { status: 502 },
    );
  }
}

// Server-side proxy for the Instagram feed. Keeps INSTAGRAM_ACCESS_TOKEN on the
// server: the client only talks to this route, never to Instagram directly.
// The underlying fetch is cached/revalidated hourly (see src/lib/instagram.ts).

import { getLatestPosts } from "@/lib/instagram";

export const revalidate = 3600; // 1 hour

export async function GET() {
  try {
    const posts = await getLatestPosts(8);
    return Response.json({ posts });
  } catch (error) {
    console.error("Failed to load Instagram feed:", error);
    return Response.json(
      { posts: [], error: "unavailable" },
      { status: 502 },
    );
  }
}

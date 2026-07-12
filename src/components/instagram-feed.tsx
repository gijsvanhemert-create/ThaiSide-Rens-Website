"use client";

import { useEffect, useState } from "react";
import type { InstagramPost } from "@/lib/instagram";

type FeedState =
  | { status: "loading" }
  | { status: "ready"; posts: InstagramPost[] }
  | { status: "error" };

export function InstagramFeed() {
  const [state, setState] = useState<FeedState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    fetch("/api/instagram")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<{ posts: InstagramPost[] }>;
      })
      .then((data) => {
        if (active) setState({ status: "ready", posts: data.posts ?? [] });
      })
      .catch(() => {
        if (active) setState({ status: "error" });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
      <div className="mb-8 flex items-center gap-3">
        <span
          className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent-red"
          aria-hidden
        />
        <h2 className="font-display text-3xl uppercase text-text sm:text-4xl">
          Instagram
        </h2>
      </div>

      <FeedBody state={state} />
    </section>
  );
}

function FeedBody({ state }: { state: FeedState }) {
  if (state.status === "loading") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg border border-border bg-background-card"
          />
        ))}
      </div>
    );
  }

  // Both a failed call and a missing token (empty list) fall back gracefully to
  // a friendly notice rather than an error-looking state.
  if (state.status === "error" || state.posts.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-background-card px-5 py-8 text-center text-text-muted">
        De Instagram-feed is momenteel niet beschikbaar. Kom snel terug voor de
        laatste posts.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {state.posts.map((post) => (
        <PostTile key={post.id} post={post} />
      ))}
    </div>
  );
}

function PostTile({ post }: { post: InstagramPost }) {
  return (
    <a
      href={post.permalink}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-background-card"
    >
      {/*
        Plain <img>, not next/image: Instagram serves media from many regional
        CDN hosts (scontent-*.cdninstagram.com), which are impractical to
        allowlist in next.config remotePatterns.
      */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={post.imageUrl}
        alt={post.caption ? post.caption.slice(0, 120) : "Instagram-post"}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {post.caption && (
        <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/90 to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="line-clamp-2 text-xs text-text">{post.caption}</span>
        </span>
      )}
    </a>
  );
}

"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { YouTubeVideo } from "@/lib/youtube";

type FeedState =
  | { status: "loading" }
  | { status: "ready"; videos: YouTubeVideo[] }
  | { status: "error" };

const CHANNEL_URL = "https://www.youtube.com/channel/UCzoTNtmfjVms1LBebeqhd6A";

export function YouTubeFeed() {
  const [state, setState] = useState<FeedState>({ status: "loading" });

  useEffect(() => {
    let active = true;

    fetch("/api/youtube")
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<{ videos: YouTubeVideo[] }>;
      })
      .then((data) => {
        if (active) setState({ status: "ready", videos: data.videos ?? [] });
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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent-red"
            aria-hidden
          />
          <h2 className="font-display text-3xl uppercase text-text sm:text-4xl">
            Nieuwste video&apos;s
          </h2>
        </div>
        <a
          href={CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-lg border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text sm:inline-block"
        >
          Kanaal bekijken
        </a>
      </div>

      <FeedBody state={state} />
    </section>
  );
}

function FeedBody({ state }: { state: FeedState }) {
  if (state.status === "loading") {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <VideoSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (state.status === "error") {
    return (
      <p className="rounded-xl border border-border bg-background-card px-5 py-8 text-center text-text-muted">
        De video&apos;s zijn even niet beschikbaar. Probeer het later opnieuw.
      </p>
    );
  }

  if (state.videos.length === 0) {
    return (
      <p className="rounded-xl border border-border bg-background-card px-5 py-8 text-center text-text-muted">
        Er zijn nog geen video&apos;s om te tonen.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {state.videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

function VideoCard({ video }: { video: YouTubeVideo }) {
  // Click-to-load: the YouTube iframe is only mounted once the user chooses to
  // play, so the page never loads six embeds up front.
  const [playing, setPlaying] = useState(false);

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background-card transition-colors hover:border-text-muted">
      <div className="relative aspect-video overflow-hidden bg-background-raised">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Speel af: ${video.title}`}
            className="absolute inset-0 h-full w-full cursor-pointer"
          >
            <Image
              src={video.thumbnail.url}
              alt=""
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/70 ring-1 ring-white/20 backdrop-blur-sm transition group-hover:bg-background/90">
                <PlayIcon />
              </span>
            </span>
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-sans font-semibold leading-snug text-text">
          {video.title}
        </h3>
        <time
          dateTime={video.publishedAt}
          className="mt-auto text-sm text-text-muted"
        >
          {formatDate(video.publishedAt)}
        </time>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className="ml-0.5 h-6 w-6 text-text"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function VideoSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-background-card">
      <div className="aspect-video animate-pulse bg-background-raised" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-4 w-11/12 animate-pulse rounded bg-background-raised" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-background-raised" />
        <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-background-raised" />
      </div>
    </div>
  );
}

function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

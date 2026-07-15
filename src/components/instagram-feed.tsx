"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { InstagramPost } from "@/lib/instagram";

type FeedState =
  | { status: "loading" }
  | { status: "ready"; posts: InstagramPost[] }
  | { status: "error" };

const PROFILE_URL = "https://www.instagram.com/wattimenarens/";

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
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className="inline-block h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-accent-red"
            aria-hidden
          />
          <h2 className="font-display text-3xl uppercase text-text sm:text-4xl">
            Instagram
          </h2>
        </div>
        <a
          href={PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-lg border border-border px-4 py-2 text-sm text-text-muted transition-colors hover:text-text sm:inline-block"
        >
          Volg op Instagram
        </a>
      </div>

      <FeedBody state={state} />
    </section>
  );
}

function FeedBody({ state }: { state: FeedState }) {
  if (state.status === "loading") {
    return (
      <div className="flex gap-6 overflow-hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] basis-[86%] shrink-0 animate-pulse rounded-xl border border-border bg-background-card sm:basis-[47%] lg:basis-[calc((100%-3rem)/3)]"
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

  return <Carousel posts={state.posts} />;
}

function Carousel({ posts }: { posts: InstagramPost[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Sound state, shared across cards:
  // - `soundOn` is the user's preference (toggled via each card's mute button).
  // - `unlocked` flips true after the first real interaction (click/tap/key).
  //   Browsers block unmuted autoplay until then, so hover-autoplay stays muted
  //   on first visit no matter what — this tracks when sound becomes allowed.
  const [soundOn, setSoundOn] = useState(true);
  const [unlocked, setUnlocked] = useState(false);

  // Only one video may play at a time. Each playing card registers its own
  // pause fn here; starting a new one pauses the previous so we never get two
  // videos (or two soundtracks) at once.
  const activePauseRef = useRef<(() => void) | null>(null);

  const setActive = useCallback((pause: () => void) => {
    if (activePauseRef.current && activePauseRef.current !== pause) {
      activePauseRef.current();
    }
    activePauseRef.current = pause;
  }, []);

  const clearActive = useCallback((pause: () => void) => {
    if (activePauseRef.current === pause) activePauseRef.current = null;
  }, []);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  // Unlock unmuted playback after the first genuine user gesture anywhere.
  useEffect(() => {
    if (unlocked) return;
    const unlock = () => setUnlocked(true);
    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, [unlocked]);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setAtStart(el.scrollLeft <= 1);
    setAtEnd(el.scrollLeft >= max - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    // Advance by roughly one viewport of cards; the browser animates it.
    el.scrollBy({ left: direction * el.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            canHover={canHover}
            soundOn={soundOn}
            soundUnlocked={unlocked}
            onToggleSound={() => setSoundOn((on) => !on)}
            setActive={setActive}
            clearActive={clearActive}
          />
        ))}
      </div>

      {/* Arrows: shown on hover-capable (desktop) devices; touch users swipe. */}
      {canHover && (
        <>
          <CarouselArrow
            direction={-1}
            disabled={atStart}
            onClick={() => scrollByPage(-1)}
          />
          <CarouselArrow
            direction={1}
            disabled={atEnd}
            onClick={() => scrollByPage(1)}
          />
        </>
      )}
    </div>
  );
}

function CarouselArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 1 | -1;
  disabled: boolean;
  onClick: () => void;
}) {
  const isNext = direction === 1;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={isNext ? "Volgende posts" : "Vorige posts"}
      className={`absolute top-[35%] z-30 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-background-raised/90 text-text shadow-lg backdrop-blur transition disabled:pointer-events-none disabled:opacity-0 hover:scale-110 hover:bg-background-raised lg:flex ${
        isNext ? "-right-3" : "-left-3"
      }`}
    >
      <ChevronIcon direction={direction} />
    </button>
  );
}

function PostCard({
  post,
  canHover,
  soundOn,
  soundUnlocked,
  onToggleSound,
  setActive,
  clearActive,
}: {
  post: InstagramPost;
  canHover: boolean;
  soundOn: boolean;
  soundUnlocked: boolean;
  onToggleSound: () => void;
  setActive: (pause: () => void) => void;
  clearActive: (pause: () => void) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const isVideo = post.mediaType === "VIDEO" && Boolean(post.videoUrl);

  // pause is stable (no deps) so it can serve as this card's identity token in
  // the carousel's single-active-video registry.
  const pause = useCallback(
    (reset = true) => {
      const v = videoRef.current;
      if (v) {
        v.pause();
        if (reset) v.currentTime = 0;
      }
      setPlaying(false);
      clearActive(pause);
    },
    [clearActive],
  );

  const play = useCallback(
    // viaGesture = the play was triggered by a direct tap/click (a user
    // gesture), which lets us go unmuted immediately; hover cannot.
    (viaGesture = false) => {
      const v = videoRef.current;
      if (!v) return;
      setActive(pause); // pauses any other playing card first
      const wantSound = soundOn && (viaGesture || soundUnlocked);
      v.muted = !wantSound;
      v.play().catch(() => {
        // Unmuted autoplay can be rejected before interaction — retry muted so
        // the video still plays silently rather than not at all.
        v.muted = true;
        v.play().catch(() => {
          /* give up quietly */
        });
      });
      setPlaying(true);
    },
    [pause, setActive, soundOn, soundUnlocked],
  );

  // Keep a live video's muted state in sync when the sound preference changes
  // (e.g. user hits the mute toggle while a video is already playing).
  useEffect(() => {
    const v = videoRef.current;
    if (v && playing) v.muted = !(soundOn && soundUnlocked);
  }, [soundOn, soundUnlocked, playing]);

  // Desktop: autoplay on hover, reset on leave. Touch devices handle play via
  // an explicit tap (see below), so no hover wiring there.
  const hoverHandlers =
    canHover && isVideo
      ? { onMouseEnter: () => play(), onMouseLeave: () => pause() }
      : {};

  const soundActive = soundOn && soundUnlocked;

  const media = isVideo ? (
    <video
      ref={videoRef}
      src={post.videoUrl ?? undefined}
      poster={post.imageUrl}
      muted
      loop
      playsInline
      preload="none"
      className="h-full w-full object-cover"
    />
  ) : (
    // Plain <img>, not next/image: Instagram serves media from many regional
    // CDN hosts (scontent-*.cdninstagram.com), impractical to allowlist.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={post.imageUrl}
      alt={post.caption ? post.caption.slice(0, 120) : "Instagram-post"}
      loading="lazy"
      className="h-full w-full object-cover"
    />
  );

  return (
    <article
      {...hoverHandlers}
      className="group basis-[86%] shrink-0 snap-start sm:basis-[47%] lg:basis-[calc((100%-3rem)/3)]"
    >
      {/* Raised, button-like effect on hover: subtle scale + shadow + border. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl border border-border bg-background-card transition duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-[1.02] group-hover:border-text-muted group-hover:shadow-2xl group-hover:shadow-black/40">
        {media}

        {/* Media-type badge (reel / album) */}
        {post.mediaType !== "IMAGE" && (
          <span
            className="pointer-events-none absolute right-3 top-3 z-20 text-text drop-shadow-md"
            aria-hidden
          >
            {post.mediaType === "VIDEO" ? <ReelIcon /> : <AlbumIcon />}
          </span>
        )}

        {/* Engagement + gradient scrim for legibility */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 bg-gradient-to-t from-background/85 via-background/30 to-transparent p-3 pt-10">
          <div className="flex items-center gap-4 text-sm font-medium text-text">
            {post.likeCount !== null && (
              <span className="flex items-center gap-1.5">
                <HeartIcon />
                {formatCount(post.likeCount)}
              </span>
            )}
            {post.commentsCount !== null && (
              <span className="flex items-center gap-1.5">
                <CommentIcon />
                {formatCount(post.commentsCount)}
              </span>
            )}
          </div>

          {/* Mute toggle: the reliable sound control (and its click is itself a
              gesture that unlocks unmuted playback). Only shown for videos. */}
          {isVideo && (
            <button
              type="button"
              onClick={onToggleSound}
              aria-label={soundActive ? "Geluid uit" : "Geluid aan"}
              aria-pressed={soundActive}
              className="pointer-events-auto z-30 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background/70 text-text ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-background/90"
            >
              {soundActive ? <SoundOnIcon /> : <SoundOffIcon />}
            </button>
          )}
        </div>

        {/* Play affordance for videos, hidden while playing */}
        {isVideo && (
          <span
            className={`pointer-events-none absolute inset-0 z-20 flex items-center justify-center transition-opacity duration-200 ${
              playing ? "opacity-0" : "opacity-100"
            } ${canHover ? "group-hover:opacity-0" : ""}`}
            aria-hidden
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-background/70 ring-1 ring-white/20 backdrop-blur-sm">
              <PlayIcon />
            </span>
          </span>
        )}

        {/* Navigation / interaction layer.
            Desktop: whole card links to the profile (hover already plays video).
            Touch video: tap toggles playback; a corner link reaches the profile.
            Touch image: whole card links to the profile. */}
        {canHover || !isVideo ? (
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Bekijk op Instagram"
            className="absolute inset-0 z-10"
          />
        ) : (
          <>
            <button
              type="button"
              onClick={() => (playing ? pause(false) : play(true))}
              aria-label={playing ? "Pauzeer video" : "Speel video af"}
              className="absolute inset-0 z-10 cursor-pointer"
            />
            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Bekijk op Instagram"
              className="absolute left-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-background/70 text-text ring-1 ring-white/20 backdrop-blur-sm"
            >
              <ExternalIcon />
            </a>
          </>
        )}
      </div>

      {post.caption && (
        <p className="mt-3 line-clamp-2 px-0.5 text-sm leading-snug text-text-muted">
          {post.caption}
        </p>
      )}
    </article>
  );
}

function formatCount(n: number): string {
  if (n >= 1000) {
    return `${(n / 1000).toFixed(n % 1000 >= 100 ? 1 : 0)}k`;
  }
  return String(n);
}

function ChevronIcon({ direction }: { direction: 1 | -1 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      {direction === 1 ? (
        <path d="M9 6l6 6-6 6" />
      ) : (
        <path d="M15 6l-6 6 6 6" />
      )}
    </svg>
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

function SoundOnIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

function SoundOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M23 9l-6 6M17 9l6 6" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="h-4 w-4">
      <path d="M12 21s-7.5-4.6-10-9.3C.5 8.2 2 5 5.2 5 7 5 8.3 6 12 9.3 15.7 6 17 5 18.8 5 22 5 23.5 8.2 22 11.7 19.5 16.4 12 21 12 21z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.5 8.6 8.6 0 0 1-3.9-.9L3 21l1.9-5.6a8.4 8.4 0 0 1-.9-3.9A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z" />
    </svg>
  );
}

function ReelIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M7 2l3 5M13 2l3 5M2 7h20M10 12l5 3-5 3z" />
    </svg>
  );
}

function AlbumIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-5 w-5"
    >
      <rect x="8" y="3" width="13" height="13" rx="2" />
      <path d="M4 8v10a3 3 0 0 0 3 3h10" />
    </svg>
  );
}

function ExternalIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className="h-4 w-4"
    >
      <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </svg>
  );
}

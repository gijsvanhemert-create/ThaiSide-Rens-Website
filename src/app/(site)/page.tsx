import { YouTubeFeed } from "@/components/youtube-feed";
import { InstagramFeed } from "@/components/instagram-feed";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto w-full max-w-6xl px-4 py-20 text-center sm:px-6 sm:py-28">
        <h1 className="font-display text-5xl uppercase tracking-tight text-text sm:text-7xl">
          ThaiSide <span className="text-accent-yellow">Rens</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-lg text-text-muted">
          Volg mijn avontuur in Thailand. Nieuwe video&apos;s, verhalen en
          tips — recht vanuit de tropen.
        </p>
      </section>

      <YouTubeFeed />
      <InstagramFeed />
    </main>
  );
}

# ThaiSide Rens — Website

Personal website for **ThaiSide Rens**, a content creator documenting life in
Thailand. The site brings his channels and offerings together in one place:

- His **personal story** (emigration to and life in Thailand)
- Live **YouTube** and **Instagram** feeds
- Sales of a paid **Thailand Starter Guide**
- A **sponsorship** page for brand collaborations

UI copy is in **Dutch**.

## Tech stack

- **[Next.js](https://nextjs.org)** 16 — App Router, Turbopack, React 19, TypeScript
- **[Tailwind CSS](https://tailwindcss.com)** v4 — configured via CSS (`@theme` in `src/app/globals.css`); no `tailwind.config.js`
- **[Sanity CMS](https://www.sanity.io)** v6 (`next-sanity`) — embedded Studio at `/studio`
- **[YouTube Data API v3](https://developers.google.com/youtube/v3)** — powers the homepage video feed

## Setup

```bash
npm install
```

Copy the example env file and fill in your own values:

```bash
cp .env.local.example .env.local
```

### Required environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID (from [sanity.io/manage](https://www.sanity.io/manage)). Until set, the site renders placeholder content and `/studio` shows a config notice. |
| `NEXT_PUBLIC_SANITY_DATASET` | Sanity dataset name (e.g. `production`). |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version date (e.g. `2024-10-01`). |
| `YOUTUBE_API_KEY` | YouTube Data API v3 key for the homepage feed. **Server-side only** — never prefix with `NEXT_PUBLIC`. |

> `.env.local` is gitignored. Never commit real keys.

### Run

```bash
npm run dev      # dev server (Turbopack) at http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # ESLint
```

## Status

### Built

- **Shared layout** — header, footer, and navigation frame applied across all
  public pages (`src/app/(site)/`)
- **Sanity CMS + Verhaal page** — embedded Studio at `/studio`; the `verhaal`
  (story) singleton is editable and rendered on the site
- **YouTube feed** — homepage feed of the channel's latest uploads, fetched
  server-side (key never reaches the client), cached and revalidated hourly.
  Thumbnails are click-to-load facades that mount an inline embed on click.

### Pending

- **Instagram feed** — live feed via the Facebook Page → Instagram Graph API
- **Contact form** — email delivery via [Resend](https://resend.com)
- **Remaining pages** — "Word ThaiSider" (YouTube membership signup), the paid
  Thailand Starter Guide, gear/affiliate page, and sponsorship

## License

**Private client project — not open source.** All rights reserved. This code is
not licensed for reuse, redistribution, or public deployment.

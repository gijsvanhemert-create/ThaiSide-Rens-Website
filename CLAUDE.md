# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Project

Personal website for **ThaiSide Rens** — a content creator documenting life in Thailand. The site is greenfield; planning docs (Dutch) live at the repo root (`intake-vragenlijst`, `aanleverlijst-rens`, `stappenplan-instagram-*`, `draaiboek-thaiside-rens.md`) and describe the intended pages: personal story, "Word ThaiSider" (YouTube membership signup), a paid Thailand Starter Guide, gear/affiliate page, sponsorship, and contact. Planned integrations: a live Instagram feed (Facebook Page → Instagram Graph API) and YouTube API content.

UI copy is in **Dutch**.

## Stack

- **Next.js 16** (App Router, Turbopack) — note the `@AGENTS.md` warning above: this is a newer Next.js than training data; check `node_modules/next/dist/docs/` before relying on remembered APIs.
- **React 19**, **TypeScript**, **Tailwind CSS v4**.
- **Sanity CMS** is planned but intentionally not yet installed — the content model is still being defined. Do not add Sanity until the content model is agreed.

## Commands

- `npm run dev` — dev server (Turbopack) at http://localhost:3000
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — ESLint (`eslint-config-next`)

No test runner is configured yet.

## Notes

- `src/app/` is the App Router root; `@/*` aliases `src/*`.
- Tailwind v4 is configured via CSS (`src/app/globals.css` uses `@import "tailwindcss"` and `@theme`) — there is no `tailwind.config.js`.
- `next.config.ts` pins `turbopack.root` to this directory to avoid Next inferring the workspace root from an unrelated lockfile in the home directory.
- The `.docx` and `.html`/`.md` planning files at the repo root are reference material, not build inputs.

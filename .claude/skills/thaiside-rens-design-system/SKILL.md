---
name: thaiside-rens-design-system
description: Apply the ThaiSide Rens visual design system when creating or editing any page, layout, or UI component in this project. Use whenever building new pages, sections, buttons, forms, or any visual element.
---

## Overview
This site follows a consistent dark, energetic visual identity derived from Rens' own YouTube thumbnail style. Apply these rules to every page and component so the whole site feels like one product, not assembled from separate sessions.

## Colors
Always use the Tailwind theme tokens (never raw hex in component code):
- `bg-background` — page base (#171412)
- `bg-background-raised` — header, cards that sit slightly above base (#1F1A17)
- `bg-background-card` — nested cards, inputs (#221D19)
- `border-border` — all borders (#33291F)
- `text-text` — primary text (#F5F1EA)
- `text-text-muted` — secondary/muted text (#A69D91)
- `bg-accent-red` / `text-accent-red` — CTAs, buttons, badges, links that need urgency
- `text-accent-yellow` — highlight words only, never large blocks or backgrounds

## Color discipline (important)
Red and yellow are accents, not themes. On any given section, use at most one red element (e.g. a button) and one yellow element (e.g. one highlighted word). Never combine red and yellow in the same component. When in doubt, leave it neutral (background/border/text-muted) rather than adding color.

## Typography
- Headings (h1, h2, section titles): font-display (Anton). Keep headings short — this font is bold and loud, long headings become hard to read.
- Everything else (body text, nav, buttons, labels): font-sans (Inter).
- Never use font-display for more than a headline or short label — it's not a body font.

## Component conventions
- Buttons: solid bg-accent-red for primary actions, border border-border outline style for secondary actions. Rounded corners (rounded-lg), never sharp.
- Cards: bg-background-card with border border-border, rounded-lg or rounded-xl.
- Badges (e.g. episode numbers): small, bg-accent-red, font-display, white text.
- Live/dynamic content sections (YouTube feed, Instagram feed): include a small red "live" dot indicator next to the section title.

## Layout
- Mobile-first. This audience (travel/emigration content) is majority mobile.
- Reuse the shared header/footer on every page — don't rebuild navigation per page.

## When unsure
If a design decision isn't covered here, default to restraint: neutral colors, Inter typography, generous spacing. It's easier to add emphasis later than to remove visual noise.

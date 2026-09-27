---
version: alpha
name: WebCloner-design-v3-whitespace
description: "Whitespace is WebCloner as a calm, premium SaaS landing page in the light. A pure white canvas (#ffffff) with near-black ink (#101418), one electric blue accent (#2563eb), pill-shaped controls, and very generous spacing. There is no noise: no gradients, no card shadows worth mentioning, no decorative graphics — just hierarchy, rounded geometry, and whitespace as the design. Space Grotesk supplies a confident geometric display, Inter the body, and IBM Plex Mono makes the eyebrows and statuses quietly technical. Clean, fast, and unambiguous — the mental model is Vercel's old Docs, Linear's whitespace, and Stripe's clarity."

colors:
  canvas: "#ffffff"
  canvas-soft: "#f7f8fa"
  ink: "#101418"
  muted: "#5b6470"
  faint: "#8b93a1"
  line: "#e6e8ec"
  line-strong: "#cdd3da"
  accent: "#2563eb"
  accent-dark: "#1d4ed8"
  accent-soft: "#eef4ff"
  success: "#0f9d6e"
  success-soft: "#ecfaf5"
  danger: "#dc2626"
  danger-soft: "#fdecec"
  amber: "#b45309"
  amber-soft: "#fdf4e7"

typography:
  display:
    fontFamily: "Space Grotesk"
    fontSize: 76px
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -0.045em
  headline:
    fontFamily: "Space Grotesk"
    fontSize: 36px
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: -0.03em
  subhead:
    fontFamily: "Space Grotesk"
    fontSize: 20px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.02em
  body:
    fontFamily: "Inter"
    fontSize: 17px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  label:
    fontFamily: "IBM Plex Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.12em
  button:
    fontFamily: "Inter"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em

rounded:
  xs: 8px
  sm: 10px
  md: 14px
  lg: 18px
  pill: 999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 128px

components:
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    padding: "14px 22px"
    border: "1px {colors.line-strong}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-dark}"
    textColor: "{colors.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.pill}"
  card:
    backgroundColor: "{colors.canvas}"
    border: "1px {colors.line}"
    rounded: "{rounded.lg}"
    padding: "44px"
  status-tag:
    backgroundColor: "{colors.canvas-soft}"
    textColor: "{colors.muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    border: "1px {colors.line}"
---

## Overview

Whitespace argues that the fastest thing a capture tool can do is disappear.
The product console is deliberately restrained: a floating white card on a
soft canvas, a pill input, a blue pill CTA. Nothing competes with the one
promise — paste a URL, get a ZIP.

Hierarchy is monotone ink + blue. Cards use a hairline border with a 2px
offset shadow at most; the capture card itself carries the only
structured shadow, and even that stays faint. Every radius is a pill or a
soft 8–18px round. Eyebrows and statuses run in IBM Plex Mono with wide
tracking; numeric badges are set in Space Grotesk with negative tracking.

## Colors

- **Canvas** `{colors.canvas}` white — the page and cards.
- **Canvas Soft** `{colors.canvas-soft}` — panels under cards (progress,
  preview) and status tags.
- **Ink / Muted / Faint** — the three-step text ladder.
- **Line / Line Strong** — hairline borders and separations.
- **Accent** `{colors.accent}` blue — the single interaction color: CTA,
  links, focus rings, selected steps.
- **Success / Danger / Amber** — soft-tinted chips for dock states.

## Typography

- **Space Grotesk** — geometric display and number system, 600/700 with tight
  tracking; capitalizes the hero.
- **Inter** — the neutral body workhorse at 17px/1.75.
- **IBM Plex Mono** — eyebrows, section labels, badges, and the log.

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| display | 76px | 700 | 1.02 | -.045em | Hero headline |
| headline | 36px | 700 | 1.1 | -.03em | Section titles, modal |
| subhead | 20px | 600 | 1.3 | -.02em | Card titles |
| body | 17px | 400 | 1.75 | 0 | Hero lede, paragraphs |
| body-sm | 14px | 400 | 1.7 | 0 | Cards, meta, footer |
| label | 12px | 500 | 1.4 | .12em | Eyebrows, badges |
| button | 15px | 600 | 1.2 | -.01em | Buttons |

## Layout

- A centered column: `min(1120px, calc(100% - 48px))`, hero copy max
  `min(760px, 100%)` on its own row, the capture card below at `max 560px`.
  Everything reads top-down, nothing races side-by-side.
- Header is a floating white bar pinned with a hairline bottom; the nav is
  14px Inter with one pill CTA.
- Sections alternate `{colors.canvas}` and `{colors.canvas-soft}` bands, or
  simply change spacing. Feature cards sit in a 3-up grid with hairline
  borders; the workflow is a two-column split; the safety card is a soft-blue
  tinted panel.

## Components

- **Capture card** — white, `{rounded.lg}` 18px, hairline border, gentle
  0/12/30 shadow. Inside: a mono eyebrow, a headline, the URL input as a
  full-width pill, and a pill CTA beneath.
- **Input** — pill, hairline border, focus turns border blue with a soft
  ring `0 0 0 4px rgba(37,99,235,.12)`.
- **Status tags** — pill chips with soft fills (blue soft for ZIP, violet-gray
  for Adaptive).
- **Progress** — the orbit is a clean ring; inner disc `{colors.canvas-soft}`.
  Steps are rows with pill step-dots; active = blue fill, complete = success
  green fill, failed = red.
- **Dock** — a bordered card with a status chip; waiting button amber-soft
  fill, ready button blue, failed red.
- **Modal** — white card, 20px radius, backdrop `rgba(16,20,24,.5)` soft blur.

## Motion

- 150ms ease transitions; focus rings fade in; the track pulse is a soft blue.
- Reduced-motion collapses to static.

## Agent Prompt Guide

```
canvas      #ffffff   page/cards
canvas-soft #f7f8fa   under-panels, tags
ink         #101418   headings/copy
muted       #5b6470   secondary
line        #e6e8ec   hairline borders
accent      #2563eb   CTA/links/focus
success     #0f9d6e   success chips
Fonts: Space Grotesk (display) · Inter (body) · IBM Plex Mono (labels)
Radii: pill inputs/buttons, 18px cards.
```

Prompt: *"Design a WebCloner SaaS landing page in a premium light minimal
style: pure white canvas, near-black text, one blue accent, pill-shaped input
and CTA, hairline borders instead of shadows, Space Grotesk display with
negative tracking, IBM Plex Mono eyebrows in uppercase, generous whitespace,
and a centered capture card with a rounded URL pill and a progress ring.
Restraint everywhere."*
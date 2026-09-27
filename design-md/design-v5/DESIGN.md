---
version: alpha
name: WebCloner-design-v5-radix
description: "Radix is WebCloner as an aurora-lit monument in the dark. A true noir canvas (#0a0a0c) barely registers any panel — surfaces are black glass with hairlines and faint aurora bleed. Color lives in light, not paint: a magenta-violet-cyan aurora is used for the hero headline, the CTA, focus, and the capture ring, never as large painted surfaces. Unbounded drives the headline system at 700–800 weight with wide, luxurious letterforms; Inter stays quiet for body; Space Mono makes cold technical labels. The mood is synthwave architecture — statement type over an abyss, crisp details, and one electric gradient as the brand's heartbeat."

colors:
  canvas: "#0a0a0c"
  canvas-deep: "#050507"
  surface: "rgba(255,255,255,0.03)"
  surface-raised: "rgba(255,255,255,0.055)"
  hairline: "rgba(255,255,255,0.08)"
  hairline-strong: "rgba(255,255,255,0.14)"
  text: "#f4f4f7"
  text-muted: "#a6a6b0"
  text-faint: "#6b6b76"
  aurora-a: "#ff3fb0"   # magenta
  aurora-b: "#8b5cf6"   # violet
  aurora-c: "#22d3ee"   # cyan
  success: "#4ade80"
  success-soft: "rgba(74,222,128,0.12)"
  danger: "#fb7185"
  danger-soft: "rgba(251,113,133,0.12)"
  amber: "#fbbf24"
  amber-soft: "rgba(251,191,36,0.12)"

gradients:
  aurora-text:
    background: "linear-gradient(100deg, {colors.aurora-a}, {colors.aurora-b} 55%, {colors.aurora-c})"
    backgroundClip: "text"
    textColor: "transparent"
  aurora-fill:
    background: "linear-gradient(100deg, {colors.aurora-b}, {colors.aurora-a})"
    textColor: "{colors.canvas}"
  aurora-ring:
    background: "conic-gradient(from 180deg, {colors.aurora-a}, {colors.aurora-b}, {colors.aurora-c}, {colors.aurora-a})"

typography:
  display:
    fontFamily: "Unbounded"
    fontSize: 76px
    fontWeight: 800
    lineHeight: 1.04
    letterSpacing: -0.01em
  headline:
    fontFamily: "Unbounded"
    fontSize: 34px
    fontWeight: 700
    lineHeight: 1.16
    letterSpacing: -0.01em
  subhead:
    fontFamily: "Unbounded"
    fontSize: 18px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
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
    fontFamily: "Space Mono"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0.14em
  button:
    fontFamily: "Inter"
    fontSize: 15px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.01em

rounded:
  xs: 6px
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
  section: 140px

components:
  text-input:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    border: "1px {colors.hairline-strong}"
  button-primary:
    backgroundColor: "{gradients.aurora-fill.background}"
    textColor: "{perspective.canvas}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    boxShadow: "0 12px 40px rgba(139,92,246,0.4)"
  status-chip:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    border: "1px {colors.hairline}"

---

## Overview

Radix inverts the glassmorphism approach: instead of many backlit panes, the
page is almost *nothing* — a black void with a few hairline-edged surfaces —
and the aurora gradient does all the talking. Only three things glow: the
hero headline, the primary CTA, and the capture ring.

Deep blacks give the space authority: canvas `#0a0a0c`, panels at 3–5%
white with `blur(2px)` at most. Text hierarchy is strict and uppercase:
Unbounded"s angular, wide letterforms at 800 weight for big moments, Space
Mono for cold descriptors, Inter for the rare full sentences. Every accent
gradient travels the same magenta → violet → cyan axis so the electric color
reads as one coherent brand energy rather than a rainbow.

## Colors

- **Noir surfaces** — canvas `#0a0a0c`, panels at 3%/5.5% white, hairlines at
  8%/14% white. No shadows; edges do the work.
- **Text ladder** — `#f4f4f7` / `#a6a6b0` / `#6b6b76`.
- **Aurora** — magenta `{colors.aurora-a}`, violet `{colors.aurora-b}`, cyan
  `{colors.aurora-c}`. Used for display headline (text-clip), CTA (fill),
  focus rings, ring track, and small sparkle marks.
- **Status** — 12%-tint chips: mint success, rose failed, gold waiting.

## Typography

- **Unbounded** — a wide, angular, unmistakably display face; 800 weight for
  the hero, 600–700 everywhere else. Letterspacing stays tight; the font earns
  capitals on its own.
- **Space Mono** — technical eyebrows, chips, counts, and the log. Uppercased,
  tracked wide (.14em).
- **Inter** — restrained body copy at normal weight (no semibold headers
  stealing from Unbounded).

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| display | 76px | 800 | 1.04 | -.01em | Hero headline |
| headline | 34px | 700 | 1.16 | -.01em | Section titles, modal |
| subhead | 18px | 600 | 1.35 | 0 | Card titles |
| body | 17px | 400 | 1.75 | 0 | Hero lede, paragraphs |
| body-sm | 14px | 400 | 1.7 | 0 | Cards, meta, footer |
| label | 12px | 400 | 1.4 | .14em | Eyebrows, chips |
| button | 15px | 700 | 1.2 | -.01em | Buttons |

## Layout

- Centered column `min(1140px, width - 40px)`; everything is uppercase-first
  and architectural. Generous vertical rhythm (sections ~140px) so the type
  can breathe against the void.
- The capture card is the only near-solid surface: a 5.5% white panel with a
  hairline and a faint aurora rim-light along its top.

## Components

- **Hero headline** — Unbounded 800 with the aurora text gradient; a small
  mono kicker sits above with an aurora square mark.
- **Input** — dark well, 14px radius; focus blooms an aurora border + soft
  magenta glow `0 0 24px rgba(139,92,246,0.25)`.
- **CTA** — aurora fill, near-black ink text, violet shadow.
- **Progress** — the ring track is the full conic aurora, rotating slowly; the
  inner disc is deep black so the arc reads as pure light. Steps: mono square
  markers flipping to aurora (active), mint (complete), rose (failed).
- **Dock** — waiting is an amber-soft line button, ready the aurora CTA,
  failed rose.
- **Modal** — raised noir panel with an aurora icon block over a blurred black
  backdrop (`rgba(5,5,7,0.7)`).

## Motion

- The conic ring arc rotates 6deg/s; a faint aurora haze breathes behind the
  hero; everything else is 160ms micro-interactions. Reduced-motion freezes
  all of it.

## Agent Prompt Guide

```
canvas      #0a0a0c   near-black void; panels 3–5.5% white hairlines
text        #f4f4f7 / #a6a6b0 / #6b6b76
aurora      #ff3fb0 → #8b5cf6 → #22d3ee (headline text-clip, CTA fill, ring)
status      12% tint chips (mint #4ade80 / rose #fb7185 / gold #fbbf24)
Fonts: Unbounded (display, 800) · Inter (body) · Space Mono (labels, uppercase .14em)
Radii: 14px controls, 18px panels, pill chips. No shadows — hairlines + light.
```

Prompt: *"Design a WebCloner tool as a noir synthwave monument: near-black
canvas, almost invisible hairlined panels, a magenta-to-violet-to-cyan aurora
gradient reserved for the Unbounded 800 display headline, the primary CTA,
and the progress ring; Space Mono uppercase eyebrows with wide tracking;
uppercase angular UI copy; a dark input well that blooms an aurora glow on
focus; 12% tinted status chips; and a raised noir modal over a blurred black
backdrop. Monumental, electric, minimal."*
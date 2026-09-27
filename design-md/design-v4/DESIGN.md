---
version: alpha
name: WebCloner-design-v4-frost
description: "Frost is WebCloner as a cold, backlit night scene behind a pane of glass. A deep navy-blue atmosphere (#0a0f1a) with layered aurora glows drifting behind frosted panels — every card is a translucent pane (rgba white ~6%) with a hairline ice border and a soft backdrop blur. The one confident accent is ice cyan (#6ee7ff), balanced by a muted periwinkle violet for secondary roles. Outfit brings a chic geometric display; Inter handles the body; IBM Plex Mono does the cold technical labels. The mental model: a sleek developer console wrapped in frosted glass on a winter night, like an iOS glass dashboard crossed with a polar data center."

colors:
  canvas: "#0a0f1a"
  canvas-tint: "#0e1526"
  panel: "rgba(255,255,255,0.055)"
  panel-raised: "rgba(255,255,255,0.08)"
  ice-hairline: "rgba(255,255,255,0.1)"
  ice-hairline-strong: "rgba(255,255,255,0.18)"
  text: "#eaf4ff"
  text-muted: "#9fb0c9"
  text-faint: "#64748f"
  accent: "#6ee7ff"
  accent-strong: "#22c8ec"
  accent-soft: "rgba(110,231,255,0.12)"
  periwinkle: "#a5b7ff"
  success: "#6be0a8"
  success-soft: "rgba(107,224,168,0.14)"
  danger: "#ff7a9c"
  danger-soft: "rgba(255,122,156,0.14)"
  amber: "#ffcf7a"
  amber-soft: "rgba(255,207,122,0.14)"

typography:
  display:
    fontFamily: "Outfit"
    fontSize: 78px
    fontWeight: 600
    lineHeight: 1.0
    letterSpacing: -0.03em
  headline:
    fontFamily: "Outfit"
    fontSize: 40px
    fontWeight: 600
    lineHeight: 1.06
    letterSpacing: -0.02em
  subhead:
    fontFamily: "Outfit"
    fontSize: 22px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: -0.01em
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
  panel: 20px
  card: 16px
  control: 12px
  pill: 999px

glass:
  blur: 18px
  saturate: 140%
  border: 1px "{colors.ice-hairline}"
  highlight: "inset 0 1px 0 rgba(255,255,255,0.12)"

spacing:
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 128px

components:
  glass-panel:
    backgroundColor: "{colors.panel}"
    border: "{glass.border}"
    rounded: "{rounded.panel}"
    boxShadow: "{glass.highlight}"
    backdropFilter: "blur({glass.blur}) saturate({glass.saturate})"
  text-input:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.text}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.control}"
    border: "{glass.border}"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "#071019"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    boxShadow: "0 10px 30px rgba(110,231,255,0.22)"
  button-primary-hover:
    backgroundColor: "{colors.accent-strong}"
    textColor: "#071019"
    typography: "{typography.button}"
    boxShadow: "0 14px 40px rgba(110,231,255,0.3)"
  status-chip:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    padding: "6px 12px"
    border: "1px rgba(110,231,255,0.28)"

aurora:
  - "radial-gradient(42% 55% at 12% 8%, rgba(110,231,255,0.12), transparent 60%)"
  - "radial-gradient(40% 50% at 88% 22%, rgba(165,183,255,0.1), transparent 60%)"
  - "radial-gradient(55% 60% at 50% 105%, rgba(56,189,248,0.12), transparent 65%)"

---

## Overview

Frost is glass first. The page is a night sky; the interface is a set of
frosted panes laid over it. Every surface you interact with — the header, the
capture card, the progress panel, the section cards, the footer — is a
translucent pane: `rgba(255,255,255,0.055)` on canvas `#0a0f1a`, with a 1px
ice-glow border and `blur(18px) saturate(140%)`. Behind the glass, three
aurora gradients breathe slowly and never move the layout.

Because the panels are translucent, depth comes from *stacked* panes rather
than shadows: the hero content sits over an aurora layer, the capture card
floats one level higher, and inner panels (progress, preview, dock) sit
inside the capture card with the `panel-raised` tint. Borders are the primary
stroke; soft inner highlights along the top edge of panes supply the
"lit from behind" read.

## Colors

- **Canvas** `{colors.canvas}` — the night backdrop, with layered aurora.
- **Panel tints** — white at 5.5% (page panes) and 8% (inset panes); border at
  10% with an 18% strong for inputs.
- **Text ladder** — `#eaf4ff` on glass, `#9fb0c9` secondary, `#64748f` faint.
- **Accent** ice cyan `{colors.accent}` on ink `#071019` for the CTA and all
  primary interactive moments; violet `#a5b7ff` for adaptive tags and
  secondary highlights.
- **Status** — frosted success/danger/amber chips at 14% tint.

## Typography

- **Outfit** — light-geometric display with a distinctive rounded-spur
  character; 600 weight does all headings with open tracking.
- **Inter** — the glass dashboard's neutral interface text.
- **IBM Plex Mono** — cold, technical eyebrows, chips, and log lines.

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| display | 78px | 600 | 1.0 | -.03em | Hero headline |
| headline | 40px | 600 | 1.06 | -.02em | Section titles, modal |
| subhead | 22px | 500 | 1.3 | -.01em | Card titles |
| body | 17px | 400 | 1.75 | 0 | Hero lede, paragraphs |
| body-sm | 14px | 400 | 1.7 | 0 | Cards, meta, footer |
| label | 12px | 500 | 1.4 | .12em | Eyebrows, chips |
| button | 15px | 600 | 1.2 | -.01em | Buttons |

## Layout

- Centered column `min(1120px, width - 48px)`; hero center-locked.
- Mobile feel: single-column stack of frosted panes; desktop grids when the
  content benefits (three-up features, split workflow).
- Header is a frosted pane hugging the top edge (full-bleed, hairline bottom),
  sticky with `blur(20px)`.

## Components

- **Capture card** — the hero pane: `panel` tint, 20px radius, ice border,
  top inner highlight. Contains an intent strip (frosted mini-pane), the URL
  input, and the CTA.
- **Input** — frosted well at 5% tint, 12px radius; focus glows the border
  cyan with `0 0 0 4px rgba(110,231,255,0.12)`.
- **CTA** — solid ice cyan on deep navy text, with a cool cyan shadow.
- **Progress** — the ring is a translucent disc with a cyan conic fill; inner
  core is `panel-raised`. Steps: translucent chips whose dots freeze over to
  cyan (active) and mint (complete).
- **Dock** — inner pane; status chip tinted by state; result button follows
  the same tint language (amber waiting, cyan ready, rose failed).
- **Modal** — a raised frosted card over a navy `rgba(10,15,26,0.6)` blur
  backdrop.

## Motion

- Aurora pans by 6% and swells with a 14s cycle; all interactive transitions
  are 160ms; reduced-motion freezes the aurora and collapses effects.

## Agent Prompt Guide

```
canvas      #0a0f1a   night sky
panel       rgba(255,255,255,.055) + blur(18px) saturate(140%), 1px rgba border
text        #eaf4ff / #9fb0c9 / #64748f
accent      #6ee7ff on #071019 (CTA), violet #a5b7ff secondary
status      14% tint chips (mint #6be0a8 / rose #ff7a9c / amber #ffcf7a)
Fonts: Outfit (display) · Inter (body) · IBM Plex Mono (labels)
Radii: 20px panels, 12px controls, pill chips.
```

Prompt: *"Design a WebCloner tool in a dark glassmorphism style: deep navy
night backdrop with drifting aurora glows, every card a frosted translucent
pane with a 1px ice border and backdrop-blur, ice-cyan accent buttons on dark
navy text, hairline light-navy secondary text, Outfit display type, IBM Plex
Mono technical eyebrows in uppercase, pill chips with 14% tinted fills for
status, a translucent progress ring with a cyan conic fill, and a frosted
modal over a blurred navy backdrop. Cold, backlit, premium."*
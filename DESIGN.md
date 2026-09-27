---
version: alpha
name: WebCloner-design-analysis
description: "A dark, product-focused capture console for WebCloner — a website archiver. The canvas is a deep forest-black (#0b110f) with a faint green tint; a single emerald accent (#10c184) drives the primary CTA, focus rings, and emphasis, while a scarce coral (#ff7763) is reserved for the signpost accent (brand-mark, hero emphasis, errors) and mint (#63e2a8) signals success. Type is Manrope with aggressive negative tracking on display (up to -0.05em) and DM Mono for eyebrows, labels, and log output. Cards live as charcoal-green surface panels (#111917 → #1b2723) separated by hairline borders rather than drop shadows, echoing the 'product UI framed in dark panels' rhythm used by Linear, Vercel, and Resend."

colors:
  canvas: "#0b110f"
  surface-1: "#111917"
  surface-2: "#16201d"
  surface-3: "#1b2723"
  hairline: "#20312a"
  hairline-strong: "#2b4036"
  ink: "#e9efeb"
  ink-muted: "#aab9b2"
  ink-subtle: "#7c8d85"
  ink-tertiary: "#5b6a63"
  primary: "#10c184"
  primary-hover: "#2ad69b"
  on-primary: "#06130e"
  primary-soft: "#0b2a20"
  coral: "#ff7763"
  coral-soft: "#2c1512"
  violet: "#8f83f2"
  violet-soft: "#1c1831"
  mint: "#63e2a8"
  mint-soft: "#0c2b1f"
  amber: "#f0b26b"
  amber-soft: "#2e2113"
  semantic-success: "#34d399"
  semantic-danger: "#ff6b5e"
  overlay: "#030806a8"

typography:
  display-xl:
    fontFamily: Manrope
    fontSize: 86px
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: -0.05em
  display-lg:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: -0.045em
  display-md:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: 800
    lineHeight: 1.12
    letterSpacing: -0.04em
  headline:
    fontFamily: Manrope
    fontSize: 27px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: -0.035em
  card-title:
    fontFamily: Manrope
    fontSize: 21px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: -0.03em
  subhead:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: 400
    lineHeight: 1.8
    letterSpacing: 0
  body:
    fontFamily: Manrope
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: 0
  caption:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  button:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: -0.01em
  eyebrow:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.3
    letterSpacing: 0.08em
  mono:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0

rounded:
  xs: 6px
  sm: 8px
  md: 10px
  lg: 14px
  xl: 18px
  pill: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 104px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 14px 20px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  button-primary-disabled:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    opacity: 0.62
    typography: "{typography.button}"
    rounded: "{rounded.md}"
  nav-pill:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button}"
    rounded: "{rounded.md}"
    padding: 10px 15px
  text-input:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: 16px
  capture-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 34px
    border: "1px {colors.hairline}"
  feature-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 30px
    border: "1px {colors.hairline}"
  feature-card-tall:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 30px
    border: "1px {colors.hairline-strong}"
  progress-panel:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 17px
    border: "1px {colors.hairline}"
  progress-orbit-idle:
    backgroundColor: "conic-gradient({colors.primary} 0deg, {colors.hairline} 0deg)"
  progress-orbit-complete:
    backgroundColor: "conic-gradient({colors.mint} 360deg, {colors.mint} 360deg)"
  progress-orbit-failed:
    backgroundColor: "conic-gradient({colors.coral} 360deg, {colors.coral} 360deg)"
  status-badge:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.mono}"
    rounded: "{rounded.pill}"
    padding: 5px 9px
    border: "1px {colors.hairline}"
  download-dock:
    backgroundColor: "linear-gradient(135deg, {colors.surface-2} 0%, {colors.surface-1} 100%)"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: 18px
    border: "1px {colors.hairline-strong}"
  safety-card:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: 32px 38px
    border: "1px {colors.hairline}"
  modal-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.xl}"
    padding: 30px
    border: "1px {colors.hairline-strong}"
  modal-backdrop:
    backgroundColor: "{colors.overlay}"
  raw-log:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink-subtle}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
---

## Overview

WebCloner is a focused utility: paste a URL, capture the accessible source and
assets, download a ZIP. The redesign leans into that "one job, done well"
feeling — a dark premium canvas in the mold of Linear, Vercel, and Resend,
where the product (the capture console) is the protagonist of the page.

The canvas `{colors.canvas}` (#0b110f) is a deep forest-black with a faint
green tint. Above it sits a three-step surface ladder
(`{colors.surface-1}` → `{colors.surface-3}`) carrying cards, the capture
console, and status docks. Hierarchy comes from surface steps and hairline
borders (`{colors.hairline}`), not from drop shadows: shadows would smear the
dark canvas, so depth reads through 1px hairlines and a *very* subtle
`inset 0 1px 0 rgba(255,255,255,.04)` top highlight on lifted panels.

The single chromatic workhorse is emerald `{colors.primary}` (#10c184):
primary CTA, brand mark, input focus rings, selected-step accents. Coral
`{colors.coral}` (#ff7763) is reserved for emphasis that must pop on a dark
surface — the brand `em` in the hero, the step numbers, and error/stopped
states. Mint `{colors.mint}` (#63e2a8) is exclusively the success signal.
Amber `{colors.amber}` appears only on the "archive waiting" handoff button.
There are no decorative gradients, no atmospheric color washes, and no second
competing chromatic system.

**Key Characteristics:**
- Dark-canvas console; the capture panel IS the hero product. No hero product
  screenshot needed — the capture card, with its live progress orbit and
  source preview, is the product UI shown "in action."
- Emerald scarcity: CTA, brand mark, focus ring, active progress states.
- Coral for pop, mint for success, amber for "waiting" handoff. Three roles,
  three hues, never decorative.
- Type: Manrope 800 display with -0.05em tracking at the top of the scale;
  DM Mono eyebrows, badges, and log output.
- Cards are charcoal-green panels with hairline borders, radius 14–18px.
- No blank-white flashes: the canvas color is applied to `html` itself.

## Colors

> Source: this document governs the `/` page (hero, capture console, features,
> workflow, safety, footer). All values are concrete hex touchpoints used in
> `public/stylesheets/style.css`.

### Brand & Accent
- **Emerald** (`{colors.primary}`): primary CTA, brand mark, focus rings,
  active progress states, eyebrow text.
- **Emerald Hover** (`{colors.primary-hover}`): lighter hover of the CTA.
- **On Primary** (`{colors.on-primary}`): near-black green used for text on
  the emerald CTA — the emerald is bright enough that pure white text would
  glare; the dark green text keeps the button high-contrast and premium.
- **Coral** (`{colors.coral}`): hero `em`, step numbers, error/stopped states,
  link emphasis. Used sparingly.
- **Violet** (`{colors.violet}`): only the secondary feature icon chip.
- **Mint** (`{colors.mint}`): success — completed progress, ready dock, ✓ marks.

### Surface
- **Canvas** (`{colors.canvas}`): page background, applied to `html` too.
- **Surface 1** (`{colors.surface-1}`): capture card, feature cards, modal.
- **Surface 2** (`{colors.surface-2}`): inputs, progress panel, tall feature,
  safety card, preview panel, status chips.
- **Surface 3** (`{colors.surface-3}`): deepest lifted panel (rare; dock hover).
- **Hairline** (`{colors.hairline}`): 1px borders and rules.
- **Hairline Strong** (`{colors.hairline-strong}`): stronger borders — input
  focus, featured/tall cards, dock.

### Text
- **Ink** (`{colors.ink}`): headings and primary copy.
- **Ink Muted** (`{colors.ink-muted}`): secondary copy (lede, card bodies).
- **Ink Subtle** (`{colors.ink-subtle}`): tertiary (captions, meta, footers).
- **Ink Tertiary** (`{colors.ink-tertiary}`): disabled and hints.

### Semantic
- **Success** (`{colors.semantic-success}`): file counts, completed orbits.
- **Danger** (`{colors.semantic-danger}`): failed states and stopped dock.
- **Warning** (`{colors.amber}`): "archive waiting" handoff, warning chips.
- **Overlay** (`{colors.overlay}`): modal scrim.

## Typography

- **Manrope** is the single sans voice (weights 400 / 500 / 700 / 800),
  loaded from Google Fonts with `-apple-system` fallbacks. Display and body
  are one continuous family, like Linear's Display/Text pairing.
- **DM Mono** (weights 400 / 500) is the technical voice: eyebrows, status
  badges, step numbers, the technical log, the ZIP/Adaptive tags.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 86px | 800 | 1.02 | -0.05em | Hero headline |
| `{typography.display-lg}` | 56px | 800 | 1.08 | -0.045em | Section openers |
| `{typography.headline}` | 27px | 700 | 1.2 | -0.035em | Card headings, modal title |
| `{typography.card-title}` | 21px | 700 | 1.25 | -0.03em | Feature card titles |
| `{typography.body-lg}` | 18px | 400 | 1.8 | 0 | Hero lede |
| `{typography.body}` | 15px | 400 | 1.7 | 0 | Default copy |
| `{typography.body-sm}` | 13px | 400 | 1.65 | 0 | Card body, footer |
| `{typography.caption}` | 12px | 500 | 1.5 | 0 | Meta, status |
| `{typography.button}` | 14px | 800 | 1.2 | -0.01em | Buttons |
| `{typography.eyebrow}` | 12px | 500 | 1.3 | 0.08em | Section eyebrows (positive tracking) |
| `{typography.mono}` | 12px | 400 | 1.6 | 0 | Log, badges, tech labels |

### Principles
- Aggressive negative tracking on the display extreme (-0.05em at 86px);
  body holds at 0.
- Eyebrows run in DM Mono with +0.08em positive tracking — the terminal-style
  contrast against the negative-tracked display.
- Mono only for technical chrome (eyebrows, badges, log) — never in body copy.
- Headlines use `text-wrap: balance`; paragraphs use `text-wrap: pretty`.

## Layout

### Spacing System
- Base unit: 4px. Tokens run `{spacing.xxs}` 4px → `{spacing.section}` 104px.
- Capture card interior padding 34px; feature cards 30px; dock/safety 18–38px.
- Buttons run 14px vertical · 20px horizontal.
- Form input padding 16px with a 42px leading-icon inset.

### Grid & Container
- Header/footer/stats/feature/safety widths: `min(1280px, calc(100% - 64px))`
  at desktop (18px base font), 1160px in the base scale.
- Hero grid: `1fr minmax(380px, 500px)` — copy left, capture console right.
- Feature grid: `1.1fr 1fr 1fr`. Stats strip: 3 columns.
- Section rhythm uses `clamp()` vertical space (e.g. hero
  `clamp(5.25rem, 9vw, 6.75rem)` paddings).

### Whitespace Philosophy
The dark canvas IS the whitespace. Sections separate by switching surface or
by `{spacing.section}` 104px gaps, not by bright interstitials. The hero glow
is a single very-low-opacity radial of emerald tint at 83% right; nothing
else blooms.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 (flat) | Canvas, no border | Hero copy, workflow, footer |
| 1 (lift) | `{colors.surface-1}` + 1px `{colors.hairline}` | Capture card, feature cards, modal |
| 2 (higher) | `{colors.surface-2}` + `{colors.hairline-strong}` | Inputs, progress, tall card, safety, preview |
| 3 (focus) | 2px `rgba(16,193,132,.45)` outline, 2px offset | Focused inputs, focused buttons |

Depth is carried by the surface ladder and hairline borders. Drop shadows on
dark are avoided; the only allowed shadow is on the floated capture card and
buttons at low opacity, to seat them in front of the canvas without fogging it.

## Components

### Buttons
- **`button-primary`** — emerald CTA. Background `{colors.primary}`, text
  `{colors.on-primary}`, type `{typography.button}`, radius `{rounded.md}`,
  padding 14px 20px. Hover shifts to `{colors.primary-hover}` with a 1px lift;
  :active presses down. Disabled at 0.62 opacity.
- **`nav-pill`** — same emerald fill, tighter 10px 15px padding, used for the
  header "Start a capture" CTA.
- **`result-button`** — full-width handoff button inside the dock. Orange
  ("waiting") → coral gradient ("ready") as the archive completes; label and
  icon swap via `[data-ready]`.

### Inputs
- **`text-input`** — `{colors.surface-2}` fill, `{colors.hairline}` border,
  `{colors.ink}` text, 16px padding, leading coral icon. Focus: border to
  `{colors.primary}` + 4px `rgba(16,193,132,.18)` ring. Referenced from the
  `#website` capture field.

### Cards & Panels
- **`capture-card`** — The hero product. `{colors.surface-1}`, radius
  `{rounded.xl}` 18px, 1px hairline, `inset 0 1px 0 rgba(255,255,255,.05)` top
  highlight. Contains the URL form, the progress orbit + steps, and the site
  preview.
- **`feature-card`** — 3-up tile; icon chip top (coral / violet / mint
  soft-fill variants), mono label, title, body, link.
- **`feature-card-tall`** — spans first column with a mini-browser chrome
  mockup at the bottom (a tiny dark browser frame whose skeleton reads as
  "page structure": bars, lines, a coral block).
- **`progress-panel`** — appears inside the capture card once a capture
  starts: orbit ring, 4-stage step list, thin track bar, status line,
  collapsible raw log.
- **`download-dock`** — persistent archive handoff: eyebrow, title, state
  pill, the result button, the "Download not starting?" help toggle, hint.

### Status Elements
- **`status-badge`** — mono, `{rounded.pill}`, `{colors.surface-2}` fill with
  `{colors.hairline}` border. Variants: ZIP (mint-soft), Adaptive (violet-soft),
  dock waiting (amber-soft), ready (mint-soft), failed (coral-soft).
- **`progress-orbit`** — conic ring driven by `[data-state]`: coral sweeps for
  discover/collect/package, full mint on completed, full coral on failed.
- **`step-dot`** — mono number circle; active = coral fill, complete = mint
  fill with ✓, failed = coral with !.
- **`preview-live-dot`** — blinking coral dot on the source-preview header.

### Log & Meta
- **`raw-log`** — `<details>` toggle; `{colors.canvas}` pre with mono two-tones.
- **Badges** — `ZIP` / `Adaptive` mono tags inside the capture-intent row.

## Do's and Don'ts

### Do
- Anchor the system on `{colors.canvas}` and use the surface ladder + hairlines
  for hierarchy; almost never reach for shadows.
- Use emerald ONLY for: CTA, brand mark, focus rings, active progress, and the
  eyebrow. Keep it scarce.
- Use coral for one signpost at a time (hero `em`, an icon, a step number) —
  never a fill behind copy.
- Set `html { background: {colors.canvas} }` so a dark page never white-flashes.
- Pair display weight 800 with body weight 400.
- Compose CTAs at 10px radius, cards at 14–18px, pills for statuses.
- Keep the capture console as the visual protagonist of the hero.

### Don't
- Don't ship light surfaces inside the dark system (no white cards, no light
  modal, no bright footer).
- Don't introduce a second full chromatic accent (no blue, no pink system).
- Don't add dark-canvas-fogging drop shadows; use hairlines.
- Don't pill-round CTAs; pills are only for status badges and the ring.
- Don't put mono in body copy; mono is technical chrome only.
- Don't reintroduce the amber "waiting" style anywhere except the handoff dock.

## Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|---|---|---|
| Desktop-XL | >1200px | 18px base font; 1280px containers |
| Tablet | ≤900px | Hero stacks to 1 column; feature grid 2-up |
| Mobile | ≤650px | Single column; nav links collapse; stats stack |
| Mobile-Sm | ≤480px | Progress grid stacks; modal full-ish; dock pills stack |

### Touch Targets
- CTA and result buttons hold ≥48px height.
- Form input holds ≥54px height.
- Nav CTA holds ≥40px.
- Dock state pills grow to ≥44px where used as toggles.

### Collapsing Strategy
- Hero copy centers on mobile; the capture card becomes full-width.
- Feature grid 3-up → 2-up (≤900px) → 1-up (≤650px).
- The `capture-progress-grid` (orbit + steps) stacks on ≤480px with the orbit
  centered.
- The download modal pads to 25px 21px on ≤480px and stacks its actions.

### Motion
- All interactions ease 160–200ms. Indeterminate progress uses a translating
  pulse on the track; the preview shows a one-directional shine.
- `prefers-reduced-motion: reduce` collapses every animation/transition to
  effectively instant.

## Agent Prompt Guide

Quick color reference for generating matching UI:

```
canvas      #0b110f    page background (also set on <html>)
surface-1   #111917    capture card, feature cards, modal
surface-2   #16201d    inputs, progress panel, tall card, safety
hairline    #20312a    1px borders/rules
hairline-2  #2b4036    strong borders
ink         #e9efeb    headlines + primary copy
muted       #aab9b2    secondary copy
subtle      #7c8d85    captions/meta
primary     #10c184    CTA, focus, active, eyebrows
on-primary  #06130e    text on emerald
coral       #ff7763    signpost emphasis + errors
violet      #8f83f2    secondary icon chip
mint        #63e2a8    success
amber       #f0b26b    archive-waiting only
```

Prompt: *"Build a WebCloner-style dark capture console: forest-black canvas,
surface-1 charcoal cards with hairline borders, one emerald CTA, mono eyebrows
and status badges, a bordered input with emerald focus ring, and a conic
progress orbit. No light surfaces, no decorative gradients, no shadows beyond a
faint inset highlight."*
---
version: alpha
name: WebCloner-design-v1-inkwell
description: "Inkwell is an editorial, print-shop treatment of WebCloner. The canvas is warm aged paper (#f5f0e4) with a deep ink (#201b13) and generous rules (#d9ccaa) — the page reads like a well-set broadsheet or a letterpress specimen sheet. Fraunces supplies a high-contrast serif display (used at -0.02em in headlines with italic accents), Instrument Sans carries body copy, and DM Mono types every label, serial, and status. A single persimmon accent (#e14b2a) does all the signposting: the one CTA, the active step, the live dot. Hierarchy comes from hairline rules, numbered systems (01/02/03), and type scale — never from cards floating on shadows."

colors:
  paper: "#f5f0e4"
  paper-deep: "#ece4d2"
  ink: "#201b13"
  ink-50: "#5f5747"
  ink-30: "#8a816e"
  rule: "#d9ccaa"
  rule-strong: "#b8a67c"
  accent: "#e14b2a"
  accent-deep: "#b93a1e"
  forest: "#1f5c44"
  forest-deep: "#163f2e"
  success: "#1f7a52"
  danger: "#a83a24"
  white: "#fffdf8"

typography:
  display:
    fontFamily: "Fraunces"
    fontSize: 76px
    fontWeight: 400
    lineHeight: 0.98
    letterSpacing: -0.02em
  display-xl:
    fontFamily: "Fraunces"
    fontSize: 88px
    fontWeight: 420
    lineHeight: 0.96
    letterSpacing: -0.025em
  headline:
    fontFamily: "Fraunces"
    fontSize: 34px
    fontWeight: 420
    lineHeight: 1.05
    letterSpacing: -0.015em
  subhead:
    fontFamily: "Fraunces"
    fontSize: 21px
    fontWeight: 420
    lineHeight: 1.25
    letterSpacing: -0.01em
  body:
    fontFamily: "Instrument Sans"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: 0
  body-sm:
    fontFamily: "Instrument Sans"
    fontSize: 13.5px
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: 0
  label:
    fontFamily: "DM Mono"
    fontSize: 11px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.14em
  button:
    fontFamily: "Instrument Sans"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: -0.01em

rounded:
  none: 0px
  control: 3px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 56px
  section: 112px

components:
  header-rule:
    borderTop: "1px {colors.rule}"
    borderBottom: "1px {colors.rule}"
  paper-panel:
    backgroundColor: "{colors.paper}"
    border: "1px {colors.rule}"
    rounded: "{rounded.control}"
  ledger-control:
    borderBottom: "1px {colors.rule-strong}"
    padding: "14px 4px"
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
    padding: "16px 24px"
  button-primary-hover:
    backgroundColor: "{colors.accent-deep}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.control}"
  status-tag:
    backgroundColor: "transparent"
    textColor: "{colors.ink-50}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "4px 8px"
    border: "1px {colors.rule-strong}"
---

## Overview

Inkwell reimagines WebCloner as a printer's bill of work: every panel is a
sheet, every heading a display letter, every status a typed annotation. The
page is structured like an editorial spread — a masthead, a folio rule, a
numbered production ledger — so the capture console feels like equipment in a
print shop rather than a floating widget.

The guiding image is the *specimen sheet*: paper, rules, and a single ink-plus-
one-accent system. Nothing is pill-rounded; corners are sharp or 3px. Cards do
not exist as shadows; surfaces separate by paper tone (`{colors.paper}` vs
`{colors.paper-deep}`) and hairline rules.

## Colors

- **Paper** `{colors.paper}` — canvas and panels; warm, slightly yellowed.
- **Paper Deep** `{colors.paper-deep}` — the capture console, dock, and
  preview stage; one step darker than the canvas.
- **Ink** `{colors.ink}` — display and primary copy, near-black with warm
  cast.
- **Ink 50 / Ink 30** — secondary and tertiary copy.
- **Rule** `{colors.rule}` / **Rule Strong** `{colors.rule-strong}` — hairline
  borders and ledger lines.
- **Accent** `{colors.accent}` (persimmon) — the ONE chromatic voice: primary
  CTA, active progress step, live dot, hero italic, footer serial.
- **Forest** `{colors.forest}` — quietly used for the safety panel and the
  check symbol; a second tint only, near the bottom of the page.
- **Success / Danger** — mint-green and brick for dock states.

## Typography

- **Fraunces** is the display voice, used soft at weight ~420 with negative
  tracking; the hero italicizes one accent word. It runs large (to 88px) with
  `line-height .96–.98`.
- **Instrument Sans** is the body voice, neutral and highly legible on paper.
- **DM Mono** is the technical voice — the masthead label, section folios,
  status tags, and the log. Uppercased with wide `0.14em` tracking.

### Hierarchy

| Token | Size | Weight | Line Height | Tracking | Use |
|---|---|---|---|---|---|
| display-xl | 88px | 420 | .96 | -.025em | Hero headline |
| display | 76px | 400 | .98 | -.02em | Big section titles |
| headline | 34px | 420 | 1.05 | -.015em | Section openers, modal |
| subhead | 21px | 420 | 1.25 | -.01em | Card titles, step titles |
| body | 16px | 400 | 1.75 | 0 | Default copy |
| body-sm | 13.5px | 400 | 1.7 | 0 | Card body, footer |
| label | 11px | 500 | 1.4 | .14em | Eyebrows, tags, serials |

## Layout

- A single column `min(1120px, calc(100% - 56px))`; hero splits
  `1.05fr .95fr` (copy left, console right).
- The masthead sits under a folio rule; navigation is a right-aligned mono
  serial list.
- Sections carry folio eyebrows: `01 / Capture`, `02 / Develop`,
  `03 / Export`; each section is bounded top and bottom by hairline rules.
- Ledger rows (features, steps, stats) use top rules instead of card borders.

## Components

- **Console** — `{colors.paper-deep}`, 1px ink rule, 3px corner, an inner left
  "SHEET" spine with the mono serial. Input field is an underlined ledger
  control (borderless, bottom rule only). CTA is solid persimmon, sharp corner.
- **Status tags** — mono, hairline-bordered, 3px corner. ZIP and Adaptive tags
  sit in the console header like printer's marks.
- **Progress** — the orbit is an ink ring on paper; the inner disc is
  `{colors.paper}`. Active step numerals are persimmon on solid; completed
  steps show a ✓ in success green. Steps are ledger rows with bottom rules.
- **Dock** — paper-deep ledger with a state tag. Waiting → amber-ink;
  ready → persimmon; failed → brick. The result button is full-width paper
  band: waiting = warm amber fill, ready = persimmon fill.
- **Modal** — paper sheet with a strong rule border; eyebrow in mono, serif
  headline, persimmon direct action.
- **Footer** — small print with a mono serial: `NO. 001-05 · INKWELL EDITION`.

## Motion

- Transitions 140–180ms ease. The live dot blinks; the progress track pulses
  a persimmon band. Reduced-motion collapses all.

## Agent Prompt Guide

```
paper      #f5f0e4   canvas + panels
paper-deep #ece4d2   console, dock, preview stage
ink        #201b13   display + body ink
ink-50     #5f5747   secondary copy
ink-30     #8a816e   tertiary copy
rule       #d9ccaa   hairline rules/ledger
acc        #e14b2a   CTA, active step, live dot
forest     #1f5c44   safety panel
Fonts: Fraunces (display, 400-420, italic ok) · Instrument Sans (body) · DM Mono (labels, +.14em)
```

Prompt: *"Design a WebCloner page as a letterpress specimen sheet: warm paper
canvas, sharp 3px corners, hairline ledger rules, Fraunces serif display with
one italic accent, DM Mono eyebrows and serial numbers, and a single persimmon
CTA. Number the sections 01/02/03, keep the capture console as a paper-deep
panel with an underlined URL ledger input, and use flat color buttons — no
shadows, no pills."*
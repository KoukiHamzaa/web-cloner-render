---
version: alpha
name: WebCloner-design-v2-phosphor
description: "Phosphor dresses WebCloner as a CRT terminal: a near-black olive-green phosphor screen (#0d120b) glowing with JetBrains Mono and a bright phosphor green (#7dff9a). Every element reads as a terminal primitive — a window chrome with traffic dots, a mono menu bar, `$`-prompted commands, bracket tags, and a caret that blinks. Hierarchy is built from foreground/background layers of the phosphor scale plus an amber highlight (#ffb454) for warnings and a red (#ff6b57) for errors. The page is one big shell session: the hero is an EOF banner, the console is the running command, sections are man-page entries, and the footer is a status line."

colors:
  screen: "#0d120b"
  screen-2: "#0a0e08"
  panel: "#10170e"
  panel-line: "#1a2414"
  phosphor: "#7dff9a"
  phosphor-dim: "#4d6a52"
  phosphor-dark: "#24351f"
  amber: "#ffb454"
  red: "#ff6b57"
  cyan: "#7de6f4"
  white: "#efffe9"

typography:
  all:
    fontFamily: "JetBrains Mono"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  display:
    fontFamily: "JetBrains Mono"
    fontSize: 54px
    fontWeight: 700
    lineHeight: 1.02
    letterSpacing: -0.01em
    textTransform: "uppercase"
  headline:
    fontFamily: "JetBrains Mono"
    fontSize: 22px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
    textTransform: "uppercase"
  label:
    fontFamily: "JetBrains Mono"
    fontSize: 12px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0.06em
  button:
    fontFamily: "JetBrains Mono"
    fontSize: 14px
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: 0.02em
    textTransform: "uppercase"

rounded:
  none: 0px
  ray: 7px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  section: 88px

components:
  terminal-frame:
    backgroundColor: "{colors.screen-2}"
    border: "1px {colors.panel-line}"
    rounded: "{rounded.ray}"
    padding: "10px"
  title-bar:
    backgroundColor: "{colors.panel}"
    borderBottom: "1px {colors.panel-line}"
    padding: "9px 12px"
  menu-bar:
    backgroundColor: "{colors.panel}"
    borderBottom: "1px {colors.panel-line}"
    padding: "7px 12px"
  command-input:
    backgroundColor: "transparent"
    textColor: "{colors.phosphor}"
    border: "1px {colors.panel-line}"
    rounded: "{rounded.none}"
    padding: "12px 14px 12px 38px"
  button-primary:
    backgroundColor: "{colors.phosphor}"
    textColor: "{colors.screen}"
    typography: "{typography.button}"
    rounded: "{rounded.ray}"
    padding: "14px 18px"
  status-tag:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.phosphor-dim}"
    typography: "{typography.label}"
    rounded: "{rounded.ray}"
    padding: "4px 8px"
    border: "1px {colors.panel-line}"
---

## Overview

Phosphor is WebCloner as a mainframe you happen to be sitting at. The canvas
is a CRT phosphor screen, the content is a shell transcript, and each section
is a man-page entry. Scanning lines and a gentle vignette land the "CRT"
feeling; nothing else animates except the caret and the live progress pulses.

Everything uppercase, everything monospaced. Color is the phosphor scale
(foreground `{colors.phosphor}` over screen `{colors.screen}`), and exactly
two highlights exist: amber for the waiting state and red for failures.

## Colors

- **Screen** `{colors.screen}` — canvas; **Screen-2** `{colors.screen-2}` for
  embedded frames (the preview stage, raw log).
- **Panel** `{colors.panel}` and **Panel Line** `{colors.panel-line}` — chrome:
  title bars, menu bars, tags, and borders.
- **Phosphor** `{colors.phosphor}` — the primary foreground: text, active
  accents, the CTA fill (which then carries `{colors.screen}` text).
- **Phosphor Dim** `{colors.phosphor-dim}` — secondary text.
- **Phosphor Dark** `{colors.phosphor-dark}` — subtle fills and stripes.
- **Amber** `{colors.amber}` — the "archive waiting" handoff and warnings.
- **Red** `{colors.red}` — failed states.
- **Cyan** `{colors.cyan}` — sparse tertiary accents (secondary feature icon,
  adaptive tag).

## Typography

Single family, **JetBrains Mono**, in four strokes: body 400 (15px/1.6),
label 500 (12px, uppercase), headline 700 (22px uppercase), and display 700
(54px uppercase). Uppercase everywhere with `textTransform` set globally;
headlines get `-0.01em`. Verbose prose is used sparingly — the page prefers
terse, command-like copy.

## Layout

- Container `min(1120px, calc(100% - 56px))`; hero splits copy/console
  `1fr 1fr`.
- The masthead is a *title bar* (traffic dots left, app id centered) over a
  *menu bar* (mono labels: `FILE EDIT CAPTURE VIEW`).
- The hero reads as a banner: an ASCII-eyebrow line, a two-line uppercase
  headline with a blinking block caret, proof as an indented list with `>`.
- Sections are *man entries*: a mono eyebrow like `SECTION 01 · CAPTURE`, a
  headline, then rows bounded by `──` rules.
- The console is the big terminal frame: a `$`-prompted URL command line, the
  progress stages as `[01] discover`, and the archive handoff as a status
  block.

## Components

- **Terminal frame** — `{colors.screen-2}` with a `{colors.panel-line}`
  border, 7px radius, an inset content area; title bar and menu bar on top.
- **Command input** — transparent field with a `$` prompt prefix rendered in
  phosphor; amber caret on focus.
- **Primary button** — phosphor fill with screen-colored text, sharp corners,
  uppercase. Hover brightens to white-green; active translates down.
- **Status tags** — `[ZIP]`, `[ADAPT]` and dock states as bracket-wrapped mono
  pills (`{colors.panel}` fill, `{colors.panel-line}` border).
- **Progress orbit** — a phosphor ring on screen-2; completed = solid
  phosphor, failed = solid red, in-progress sees a phosphor sweep.
- **Dock** — `── ARCHIVE ──` heading row with a state tag; waiting button is
  amber, ready button is phosphor, failed is red.
- **Raw log** — a screen-2 `<pre>` with `$`-prefixed lines in phosphor-dim.
- **Footer** — a status line: `webcloner v2.0.1 │ capture-ok │ uptime 04:11:07`.

## Motion

- Caret blinks at 1Hz (background of the inline block). Progress track pulses
  amber→phosphor. Scanlines are static. Reduced-motion freezes everything and
  hides the caret blink.

## Agent Prompt Guide

```
screen      #0d120b   canvas
screen-2    #0a0e08   frames, log, preview
panel       #10170e   chrome, tags
line        #1a2414   borders
phosphor    #7dff9a   text + active + CTA fill
ph-dim      #4d6a52   secondary text
amber       #ffb454   waiting/warnings
red         #ff6b57   failures
Font: JetBrains Mono, uppercase. Chrome: dot-grid title bar + menu bar.
```

Prompt: *"Build a WebCloner page as a CRT terminal: black-olive phosphor
screen with scanlines, JetBrains Mono everywhere in uppercase, a window title
bar with traffic dots and a FILE/EDIT/CAPTURE menu bar, a `$`-prompted URL
command input, phosphor-green CTA, bracket status tags, and a headline with a
blinking block caret. Square-ish 7px radii, rules as `──` dashed lines."*
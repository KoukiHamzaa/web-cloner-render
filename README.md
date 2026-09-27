## Complete Website Downloader 💾
Download the complete source code of any website (including all assets) 🔨.

👉 Live Demo: https://web-cloner-x3a3.onrender.com

![enter image description here](https://github.com/AhmadIbrahiim/Website-downloader/blob/master/public/Record.gif?raw=true)

## Description 📒
Website downloader works with `wget` and `archiver` to download website assets, compress them, and send the archive back through a Socket.IO channel.

**wget parameters used:**

`wget --mirror --convert-links --adjust-extension --page-requisites --no-parent http://example.org`

- `--mirror` makes the download recursive.
- `--convert-links` converts links to relative paths for offline viewing.
- `--adjust-extension` adds suitable extensions to downloaded files.
- `--page-requisites` downloads assets required to display the page.
- `--no-parent` prevents recursion above the requested path.

## Adaptive capture engine 🕷️

Many sites now answer wget's plain client with a 403, a robots.txt exclusion, or
a TLS refusal while happily serving the same content to a browser. So the
download runs in two tiers:

1. **Tier 1 — wget mirror.** The classic recursive, link-converting mirror above.
   Fast and polite on cooperative sites.
2. **Tier 2 — adaptive engine.** If the first pass saves *no files*, the engine
   automatically retries the same capture the way a browser would: realistic
   Chrome request headers, bounded concurrency, a throttle that backs off on
   `429`/`403`, robots.txt respect, a live `Summary` line streamed every few
   seconds, and link rewriting that keeps the archive fully viewable offline —
   styled after the adaptive scraper ideas in
   [Scrapling](https://github.com/D4Vinci/Scrapling).

Both tiers write the same job-directory layout and emit the same progress shape,
so zipping, cleanup, and the Socket.IO UI are unchanged. The adaptive engine is
pure Node (native `fetch`, no extra runtime) and keeps the same quota and
timeout, so a blocked bot challenge no longer means a failed download.

### Design system 🎨

The main interface is the **Phosphor** design — a retro terminal built from
`design-md/design-v2/DESIGN.md`. The look: a near-black CRT screen
(`#0d120b`) with faint scanlines, hairline green-border panels, a single
phosphor-green accent (`#7dff9a`) for the CTA and focus states, amber for
warnings, red for errors, and cyan for adaptive badges. JetBrains Mono covers
everything — headings, labels, badges, and the technical log — topped by a
window chrome with traffic lights and a menu bar. The styling lives entirely
in `public/stylesheets/style.css` (no CSS framework), so it renders offline.

#### Design gallery 🎪

The five from-scratch designs (each with its own `DESIGN.md` under
`design-md/`) remain live as preview routes, with the main page now running the
chosen winner. The gallery:

| Preview | Look | Palatte | Type |
| --- | --- | --- | --- |
| `/` (main) | **Phosphor** ★ chosen | CRT green, scanlines, amber/red | JetBrains Mono everywhere |
| [/design-v1](/design-v1) | **Inkwell** · editorial notebook | warm paper, ink text, persimmon CTA | Fraunces + Instrument Sans + DM Mono |
| [/design-v2](/design-v2) | **Phosphor** · retro terminal | CRT green, scanlines, amber/red | JetBrains Mono everywhere |
| [/design-v3](/design-v3) | **Whitespace** · premium minimal SaaS | white, hairline borders, one blue accent | Space Grotesk + Inter + IBM Plex Mono |
| [/design-v4](/design-v4) | **Frost** · dark glassmorphism | navy night, aurora glows, ice cyan | Outfit + Inter + IBM Plex Mono |
| [/design-v5](/design-v5) | **Radix** · noir synthwave | near-black void, magenta→violet→cyan aurora | Unbounded, heavy display |

All five share the exact same capture UI logic
(`public/js/capture.js` — Socket.IO, progress ring, step states, source
preview, download dock, and the direct-download modal) and the same page
content; only the presentation layer differs. Every route keeps the happy
path: paste an authorized URL → live progress → ready ZIP.

### Deploy on cloud providers

[![Run on Replit](https://binbashbanana.github.io/deploy-buttons/buttons/remade/replit.svg)](https://replit.com/github/AhmadIbrahiim/Website-downloader)
[![Remix on Glitch](https://binbashbanana.github.io/deploy-buttons/buttons/remade/glitch.svg)](https://glitch.com/edit/#!/import/github/AhmadIbrahiim/Website-downloader)
[![Deploy on Railway](https://binbashbanana.github.io/deploy-buttons/buttons/remade/railway.svg)](https://railway.app/new/template?template=https://github.com/AhmadIbrahiim/Website-downloader)
[![Deploy to Cyclic](https://binbashbanana.github.io/deploy-buttons/buttons/remade/cyclic.svg)](https://app.cyclic.sh/api/app/deploy/AhmadIbrahiim/Website-downloader)
[![Deploy to Koyeb](https://binbashbanana.github.io/deploy-buttons/buttons/remade/koyeb.svg)](https://app.koyeb.com/deploy?type=git&repository=github.com/AhmadIbrahiim/Website-downloader&branch=main&name=Website-downloader)
[![Deploy to Render](https://binbashbanana.github.io/deploy-buttons/buttons/remade/render.svg)](https://render.com/deploy?repo=https://github.com/AhmadIbrahiim/Website-downloader)

### Deployment requirements

This repository is a **Node.js/Express backend**, not a static site. It starts a long-running HTTP and Socket.IO server, invokes the `wget` executable, writes temporary files, and creates ZIP archives. Therefore it cannot run as a functional application on **Cloudflare Pages**, which only serves static build output (or Pages Functions) and does not provide a Node process, `wget`, or the required filesystem/runtime APIs. Do not use `npx wrangler deploy` or an Expo build command for this repository.

Deploy it to a container/Node service instead. The included `Dockerfile` installs `wget`, installs the locked dependencies, starts the server, and exposes port `3000`. Configure the service to use the repository Dockerfile and set its health check to `GET /healthz`. The application honors the platform's `PORT` variable and also supports `DOWNLOAD_QUOTA` and `DOWNLOAD_TIMEOUT_MS`.

For Render, use **New → Blueprint** and select this repository. The included `render.yaml` configures a Free Docker web service, the health check, and the safe default download limits automatically. You can also create a Web Service manually and select Docker with `Dockerfile` as the Dockerfile path.

If Cloudflare is required, use Cloudflare only as a proxy/custom domain in front of the Node service. A Pages deployment can host a separate static frontend, but it cannot host this downloader backend without a separate compatible server.

### Optional Cloudflare Worker proxy

The repository also includes a small Cloudflare Worker proxy in
`cloudflare/worker.js`. It lets Cloudflare provide the public hostname while
Render runs the downloader backend. The proxy preserves normal requests,
Socket.IO polling, and WebSocket upgrade requests.

The root `wrangler.jsonc` points Wrangler at this Worker and sets
`BACKEND_URL` to the Render service. In Cloudflare Workers & Pages, the
deployment settings should be:

| Setting | Value |
| --- | --- |
| Build command | Leave empty / None |
| Deploy command | `npx wrangler deploy` |
| Version command | `npx wrangler versions upload` |
| Root directory | `/` |

In **Settings → Variables and Secrets**, add a plain-text variable named
`BACKEND_URL` with the Render URL, for example
`https://web-cloner-x3a3.onrender.com`. Add it for the production environment
and redeploy. This is a proxy configuration value, not a secret.

### Automatic Render deploys from GitHub

Render only fetches repositories that its GitHub integration has access to, and
`KoukiHamzaa/Web-cloner` is private. To keep deploying without exposing this
repository, updates flow through a public build mirror,
`KoukiHamzaa/web-cloner-render`, which the workflow keeps in sync:

1. A push to `master` in this (private) repository runs
   `.github/workflows/sync-render-mirror.yml`.
2. The workflow mirrors `master` to the public `web-cloner-render` repository
   using an SSH deploy key stored as the Actions secret `DEPLOY_RENDER_KEY`.
3. Render auto-deploys whenever the mirror's `master` changes (`autoDeploy` is
   enabled on the service, deploy trigger `new_commit`).

The public `web-cloner-render` repository is only ever updated by this workflow;
do not edit it directly. If you later grant the Render GitHub integration access
to private repositories, you can point the service back at this repository and
drop the mirror.

You can also run the workflow manually from the GitHub **Actions** tab. A
Cloudflare dashboard-only change does not create a GitHub push; only changes
committed to this repository trigger both deployments.

## Requirements 📦

- Node.js 20 or newer (the adaptive engine uses the native `fetch` API)
- `wget` on the `PATH` powers the primary tier; without it the adaptive engine still downloads:
  - Debian/Ubuntu: `apt install wget`
  - macOS: `brew install wget`
  - Windows: `winget install JernejSimoncic.Wget`

## How to run it 🤔

- `git clone https://github.com/KoukiHamzaa/Web-cloner.git`
- `cd Web-cloner`
- `npm ci`
- `npm start`
- Open `http://localhost:3000/`

## Optional settings

| Variable | Default | What it does |
| --- | --- | --- |
| `PORT` | `3000` | Port the server listens on |
| `DOWNLOAD_QUOTA` | `100m` | Size ceiling passed to both engines, so one request cannot fill the disk |
| `DOWNLOAD_TIMEOUT_MS` | `300000` | How long a single download (both tiers combined) may run before it is stopped |
| `STEALTH_ENABLED` | `true` | `false` disables the adaptive engine and reports tier-1 failures directly |
| `STEALTH_CONCURRENCY` | `6` | How many pages/requisites the adaptive engine fetches at once |
| `STEALTH_MAX_PAGES` | `200` | Cap on recursive page fetches per capture |
| `STEALTH_RESPECT_ROBOTS` | `true` | `false` lets the adaptive engine ignore robots.txt Disallow rules |
| `STEALTH_REQUEST_TIMEOUT_MS` | `30000` | Per-request timeout for the adaptive engine's fetches |

## Tests

`npm test` runs `node --check` across the application and stealth modules plus
two offline suites: `test/wget-acceptance.test.js` (URL parsing and crawl
domains) and `test/stealth-links.test.js` (link rewriting, path safety, and
robots parsing). Requires Node 20 or newer, like the app itself.

# How To Contribute:
- Open issues with any bugs you notice.
- Please create pull requests if you think they add value.

## Liked it? You can buy a coffee:

<a href="https://www.buymeacoffee.com/aibrahim" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0 3px 2px rgba(190, 190, 190, 0.5) !important;"></a>

Thank you,
Email: me@ahmed-ibrahim.com
https://www.ahmed-ibrahim.com

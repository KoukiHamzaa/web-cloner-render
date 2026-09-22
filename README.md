## Complete Website Downloader 💾
Download the complete source code of any website (including all assets) 🔨.

👉 Live Demo: https://website-downloader.onrender.com

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

If Cloudflare is required, use Cloudflare only as a proxy/custom domain in front of the Node service. A Pages deployment can host a separate static frontend, but it cannot host this downloader backend without a separate compatible server.

## Requirements 📦

- Node.js 20 or newer
- `wget` on the `PATH`. The app shells out to it, and nothing will download without it:
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
| `DOWNLOAD_QUOTA` | `100m` | Size ceiling passed to wget, so one request cannot fill the disk |
| `DOWNLOAD_TIMEOUT_MS` | `300000` | How long a single download may run before it is stopped |

# How To Contribute:
- Open issues with any bugs you notice.
- Please create pull requests if you think they add value.

## Liked it? You can buy a coffee:

<a href="https://www.buymeacoffee.com/aibrahim" target="_blank"><img src="https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png" alt="Buy Me A Coffee" style="height: 41px !important;width: 174px !important;box-shadow: 0 3px 2px rgba(190, 190, 190, 0.5) !important;"></a>

Thank you,
Email: me@ahmed-ibrahim.com
https://www.ahmed-ibrahim.com

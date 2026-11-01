# bilalhassan.online

The portfolio of Bilal Hassan (bilal builds). The whole site is one hand-written HTML file: no framework, no build step, no external JavaScript.

## What's in this folder

| Path | What it is |
|------|------------|
| `index.html` | The entire site: HTML, CSS and JavaScript in one file |
| `assets/fonts/` | Quicksand, Nunito and Martian Mono, hosted with the site (SIL Open Font License) |
| `assets/kavoor-photo.webp`, `assets/kavoor-screen.webp` | Kavoor's homepage photo, and a phone screenshot of the live store |
| `assets/momin-desktop.webp`, `assets/momin-mobile.webp` | Screenshots of mominbyahmed.com |
| `assets/bilal.webp` | The portrait on the page |
| `assets/bilal.jpg` | The same portrait for Google and link previews (the page's structured data points to it) |
| `assets/logo.png`, `assets/logo-96.png` | Logo for link previews and the nav |
| `assets/favicon.svg`, `assets/favicon.png` | Browser tab icons |
| `robots.txt` | Lets search engines and AI crawlers in, and points them to the sitemap |
| `sitemap.xml` | Tells Google the page exists |
| `_headers` | Cache settings for Cloudflare Pages. Other hosts ignore it |

## Deploy

Upload everything in this folder, with `index.html` at the top level and the `assets` folder next to it. If any file in `assets` is missing, the photos, fonts or icons break on the live site.

On Cloudflare Pages: open the project, create a new deployment, and upload this folder. If you upload a zip instead, zip the files inside the folder (not the folder itself), so `index.html` sits at the top of the zip.

## Preview it locally

Open `index.html` in Chrome. For a preview that behaves exactly like the live site, run this inside the folder and open http://localhost:8000:

```
python3 -m http.server 8000
```

Add `?reduced=1` to the address to see the version people get when their device has "reduce motion" switched on.

## Editing

- **Text:** search `index.html` for the words you want to change.
- **Work cards:** the `<article class="wcard">` blocks in the work section.
- **Project graveyard:** the `<article class="lcard">` blocks.
- **Field notes numbers:** the `.stats` block. They come from the outreach audits (465 small-business websites, 21 to 31 October 2026). If you update them, update the source line under them too.
- **Kavoor's 99:** shown in three places (the gauge in the build section, stage 5's text, and the Kavoor card). Local Lighthouse runs on 1 November 2026 gave 97 and 98; scores vary by run and by where the test runs from. Update all three together when the score changes.
- **Colours:** the CSS variables in `:root` at the top of the `<style>` block.

## How the effects work

- A small scroll engine at the bottom of `index.html` turns the scroll position into a 0 to 1 progress value for each scene, and writes it into CSS variables. The CSS does all the drawing.
- **Hero:** the wordmark zooms towards its full stop and fades out by 6x. The blue circle is a separate clip-path that keeps growing until it fills the screen. Scaling text much further than 6x makes Chrome drop parts of the page, so keep that limit.
- **The build:** the phone holds two copies of a mock Kavoor homepage. The top copy is wiped in over the bottom one, stage by stage, and the last stage is the real screenshot.
- **The build section sits under the hero's last screen** (`margin-top: -100svh`), so it starts the moment the zoom ends. The hero hides itself once its scene is done.
- **"Switch the design off"** at the bottom turns off all CSS, so people see the raw HTML underneath.
- People with "reduce motion" switched on get all the same content without the scroll scenes.

## Performance

Lighthouse, November 2026 (local test before deploy): mobile 97 performance, 100 accessibility, 100 best practices, 100 SEO. Desktop: 100 performance. Run it again on the live site after deploying.

Keep new images as WebP and under about 100 KB each, so the page stays fast.

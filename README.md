# bilalhassan.online

The portfolio of Bilal Hassan (bilal builds). Hand-written HTML, CSS and JavaScript: no framework, no third-party scripts. The home page is one file, and each service has its own page under `services/`. One small script, `tools/sync.mjs`, copies the shared service styles into each page and keeps the security headers in step with the inline scripts (see Editing).

## What's in this folder

| Path | What it is |
|------|------------|
| `index.html` | The home page: HTML, CSS and JavaScript in one file |
| `services/index.html` | The Services hub: one card per service, linking to each page. The nav's "Services" link goes here on every page |
| `services/<name>/index.html` | One page per service: websites, web-apps, mobile-apps, seo, geo, ai-automations, api-integrations. Each has its own demo, with its CSS and script inside the page |
| `assets/service.css`, `assets/service.js` | Shared by the Services hub and all seven service pages: fonts, colours, nav, menu, cards, questions, scroll effects. The CSS is copied into each page by `tools/sync.mjs` (inline CSS means no extra request before the first paint); the script is loaded as a file |
| `tools/sync.mjs` | Run it after editing `service.css` or any inline `<script>`. Stays out of the published site |
| `assets/apps/` | Screenshots of the graveyard apps: `<app>.webp` (16:10, used on cards) and `<app>-phone.webp` (one screen, used in the mobile apps carousel), each with smaller copies (`-400`, `-260`, `-420` and so on) for `srcset`. `ca-portal-*.webp` are the private invoicing app, taken from a local copy with sample data and every personal detail blurred |
| `assets/og/` | The 1200x630 preview images that LinkedIn, WhatsApp and X show when a page is shared, one per page |
| `assets/site-home.webp` | A screenshot of the home page, used on the service pages' "This site" cards |
| `assets/fonts/` | Quicksand, Nunito and Martian Mono, hosted with the site (SIL Open Font License) |
| `assets/kavoor-photo.webp`, `assets/kavoor-screen.webp` | Kavoor's homepage photo, and a phone screenshot of the live store |
| `assets/momin-desktop.webp`, `assets/momin-mobile.webp` | Screenshots of mominbyahmed.com |
| `assets/bilal.webp` | The portrait on the page |
| `assets/bilal.jpg` | The same portrait for Google and link previews (the page's structured data points to it) |
| `assets/logo.png`, `assets/logo-96.webp` | Logo for link previews, and the small one in the nav |
| `assets/favicon.svg`, `assets/favicon.png` | Browser tab icons |
| `robots.txt` | Lets search engines and AI crawlers in, and points them to the sitemap |
| `llms.txt` | A plain-text summary of the site for AI tools, built only from facts on the pages. Update it when the services, work or numbers change |
| `sitemap.xml` | Lists the home page, the Services hub and the seven service pages for Google |
| `_headers` | Cache settings and security headers Cloudflare reads, including the Content-Security-Policy with every inline script's hash. Other hosts ignore it |
| `.assetsignore` | Files that stay out of the published site (this README and `tools/`, for example) |
| `9dceb5451677b6ced6f8d10bd45d7907.txt` | IndexNow key. Lets this site tell Bing (and so ChatGPT search and Copilot) about new or changed pages instantly. Keep it published |

## Deploy

The site runs on a Cloudflare Worker called `wispy-firefly-ce53` that only serves these files (there is no Worker script). Deploy with Wrangler from any folder, pointing `--assets` at this one. Run the sync script first, so the pages and `_headers` match:

```
node tools/sync.mjs
wrangler versions upload --name wispy-firefly-ce53 --assets /path/to/bilalhassan.online --compatibility-date 2026-11-01
wrangler versions deploy <version-id>@100% --name wispy-firefly-ce53 --yes
```

The first command prints the version ID that the second one needs. If Wrangler says you're logged out, run `wrangler login` first. To roll back, deploy an older version ID the same way (the dashboard lists them under the Worker's Deployments tab).

After a deploy that adds or changes pages, tell Bing and other IndexNow search engines about them:

```
curl -s -X POST https://api.indexnow.org/indexnow -H 'Content-Type: application/json' \
  -d '{"host":"bilalhassan.online","key":"9dceb5451677b6ced6f8d10bd45d7907","keyLocation":"https://bilalhassan.online/9dceb5451677b6ced6f8d10bd45d7907.txt","urlList":["https://bilalhassan.online/","https://bilalhassan.online/services/"]}'
```

For Google, submit the sitemap in Search Console and use URL Inspection, then Request indexing.

## Preview it locally

Open `index.html` in Chrome. For a preview that behaves like the live site, run this inside the folder and open http://localhost:8000 (only Cloudflare applies `_headers`, so the preview runs without them):

```
python3 -m http.server 8000
```

Add `?reduced=1` to the address to see the version people get when their device has "reduce motion" switched on. The service pages live at http://localhost:8000/services/websites/ and so on.

## Editing

- **Text:** search `index.html` for the words you want to change.
- **Work cards:** the `<article class="wcard">` blocks in the work section.
- **Project graveyard:** the `<article class="lcard">` blocks.
- **Field notes numbers:** the `.stats` block. They come from the outreach audits (465 small-business websites, 21 to 31 October 2026). If you update them, update the source line under them too.
- **Kavoor's 99:** shown in three places (the gauge in the build section, stage 5's text, and the Kavoor card). Local Lighthouse runs on 1 November 2026 gave 97 and 98; scores vary by run and by where the test runs from. Update all three together when the score changes.
- **Colours:** the CSS variables in `:root` at the top of the `<style>` block. The service pages have the same variables at the top of `assets/service.css` (run `node tools/sync.mjs` after changing them).
- **Service pages:** each page is plain HTML, so edit the text in place. The list of services on the home page and the "Other things I do" links at the bottom of every service page should stay in sync if you add or rename one, and so should `sitemap.xml`.
- **Breadcrumbs:** every service page and the hub has a small breadcrumb trail in the footer (Home > Services > page), and the same trail in its structured data. Keep the two matching if you rename a page.
- **Fonts:** all three use `font-display: optional` with preloads (Martian Mono only on the pages that show code or labels in it) and size-matched stand-ins (Arial, Arimo, Liberation Sans or Roboto). If a font arrives late on a slow first visit, the stand-in stays for that page instead of swapping, so text never jumps. Google's Linux test machines have no Arial, which is why the earlier `swap` setting cost CLS there.
- **After changing `assets/service.css` or any inline `<script>`:** run `node tools/sync.mjs`. It copies the CSS into every service page and writes each inline script's hash into `_headers`. The Content-Security-Policy only runs inline scripts whose hash is listed, so a script edited without this step won't run on the live site.
- **No HTML strings in scripts:** the CSP also switches on Trusted Types, so `el.innerHTML = '...'` throws an error. Build elements with `document.createElement` and `textContent` instead (the page scripts have a small `make()` helper for it).
- **After changing `service.js` or an image:** files in `assets/` are cached for 30 days. Bump the `?v=2` at the end of `service.js`'s links (on the hub and all seven service pages) to `?v=3` and so on, and give a changed image a new file name. Otherwise returning visitors keep the old file.

## How the effects work

- A small scroll engine at the bottom of `index.html` turns the scroll position into a 0 to 1 progress value for each scene, and writes it into CSS variables. The CSS does all the drawing.
- **Hero:** the wordmark zooms towards its full stop and fades out by 6x. The blue circle is a separate clip-path that keeps growing until it fills the screen. Scaling text much further than 6x makes Chrome drop parts of the page, so keep that limit.
- **The build:** the phone holds two copies of a mock Kavoor homepage. The top copy is wiped in over the bottom one, stage by stage, and the last stage is the real screenshot.
- **The build section sits under the hero's last screen** (`margin-top: -100svh`), so it starts the moment the zoom ends. The hero hides itself once its scene is done.
- **"Switch the design off"** at the bottom turns off all CSS, so people see the raw HTML underneath.
- People with "reduce motion" switched on get all the same content without the scroll scenes.
- **Service page demos:** websites has a resizable mock site (container queries), web apps a working invoice builder, mobile apps a phone carousel, SEO a search-results illustration, GEO a before and after of what an AI assistant reads, AI automations a step-by-step flow with sample emails, and API integrations a request console.
- **The API demo makes one real request:** pressing Send on "Prayer times" calls api.aladhan.com from the visitor's browser. If that fails, it shows a saved response and says so. Nothing else on the site contacts another server.

## Performance

Lighthouse 13.6 (the version PageSpeed Insights uses), 2 November 2026, on all nine pages, mobile and desktop: 100 in performance, accessibility, best practices, SEO and agentic browsing. The only items the report still lists are the two it shows for every site: "LCP breakdown" (a timing breakdown, shown whenever the main content loads in time) and "Baseline" (a list of the web features the page uses). Accessibility and SEO also keep their collapsed "manual checks" lists. Run it again on the live site after deploying.

What keeps it there:

- **Images:** WebP, under about 100 KB, and big ones get smaller copies plus `srcset` and `sizes`, so a phone and a laptop each download a file close to the size they show. `sizes` has to describe how wide the image really is on screen (the service cards are narrower when a page has three or more of them).
- **No layout reads while the page loads.** Scripts measure the page in a `ResizeObserver` callback (the browser calls it right after its own first layout), never straight away. Reading sizes any earlier forces an extra layout, which Lighthouse reports as a forced reflow or a long task.
- **Animations use only `transform` and `opacity`**, so they run off the main thread. Animating `box-shadow`, `clip-path` or a custom property gets reported as a non-composited animation.
- **Service pages lay out only their first screen in the first render.** The sections below wait (`content-visibility: auto` in `service.css`), and `service.js` shows them one per frame right after the first paint, so no single task lays out the whole page and everything is rendered long before anyone, Lighthouse's accessibility check included, looks at it. Keep page demos in the hero section: a script that measures something further down while the page loads would force those sections to render early.
- **No `Intl` or `toLocale...` calls while a page loads.** The browser's first one costs about 7 ms (it loads its locale data), which is why the invoice demo formats dates and money by hand.
- **Nothing changes size after the first paint.** Boxes whose text arrives later keep their size from the start (the live speed line on the home page, the readout in the websites demo).
- **The inline scripts stay under 2 KB of comments and spaces each** (Lighthouse's "minify JavaScript" check). That's why the home page has two scripts: the scroll scenes, and the extras that don't touch them.

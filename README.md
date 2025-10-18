# Techy Static PWA (No Folders, GitHub Pages Ready)

A pretty, multi-page static site that still offers:
- ✅ Installable PWA + offline caching (`sw.js`, `manifest.json`)
- 🔎 Client-side search across pages (`data.js`, `search.js`)
- 🎯 WCAG color contrast checker with auto-fix (`contrast.js`)
- 🌀 Generative SVG art + "Save SVG" (`gallery.js`)

Everything sits at the repo root (no folders), so you can upload directly.

## Quick Start

1. Create a new GitHub repository.
2. Drop these files into the root of the repo.
3. Enable GitHub Pages: Settings → Pages → Branch: `main` → `/ (root)`.
4. Visit your Pages URL and enjoy. Service Worker requires HTTPS or localhost.

## Files

- `index.html` – Home
- `contrast.html` – WCAG Contrast Checker
- `search.html` – Client-side search
- `gallery.html` – Generative art
- `articles.html` – Sample content
- `about.html` – Project explanation
- `contact.html` – Demo form
- `style.css` – Styling (light/dark aware)
- `main.js` – Theme, SW, nav, footer year
- `contrast.js` – Contrast logic + auto-fix
- `data.js` – Search index
- `search.js` – Ranker and UI
- `gallery.js` – SVG generator
- `sw.js` – Precache + runtime caching
- `manifest.json` – PWA manifest
- `favicon.svg` – Icon
- `README.md` – This file

## Local Preview

Open `index.html` in a static server (recommended to test SW):

```bash
python3 -m http.server 8080
# then open http://localhost:8080
```

*(Direct file:// opens fine for most pages, but service worker requires http(s).)*

## Accessibility Notes

- Semantic HTML and labeled controls
- Skip link, focus-visible styles via browser defaults
- Contrast checker to help keep your UI readable

## License

MIT

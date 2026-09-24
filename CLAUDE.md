# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static personal portfolio/CV site for Hasebul Hassan Chowdhury, deployed via GitHub Pages (`Hasebul21.github.io`). No build system, no package manager, no framework — plain HTML/CSS/JS served as-is. Jekyll is explicitly disabled (`.nojekyll` present); `_config.yml` only carries `title`/`description` metadata as a comment-documented no-op.

## Running / previewing

There is no build or dev server. Open the HTML files directly in a browser, or serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000/index.html` (or any other page).

## Architecture

- One `.html` file per page at the repo root: `index.html`, `about.html`, `experience.html`, `education.html`, `skills.html`, `projects.html`, `publications.html`, `achievements.html`, `contact.html`. There is no templating — every page repeats the same `<head>`, nav header, and footer markup verbatim.
- `assets/css/style.css` — single shared stylesheet for all pages (no per-page CSS).
- `assets/js/site.js` — single shared script, IIFE with three responsibilities: stamping the footer copyright year, toggling the mobile nav, and marking the active nav link via `data-page` attributes matched against `location.pathname`.
- `assets/img/` — static assets referenced with absolute paths (`/assets/...`).
- `README.md` is the source CV/bio content (About Me, experience, publications, achievements, skills) — it is *not* documentation about the codebase. When updating facts on the site (job history, publications, stats), check `README.md` first since it's often the most up-to-date record of that content and should stay consistent with the HTML pages.

## Conventions to follow when editing pages

- Every page shares identical `<header class="nav">` and `<footer class="footer">` blocks, including the same nav link list and `data-page` values. When adding/renaming/removing a nav destination, update it identically across **every** HTML file — there is no shared partial.
- Fonts are loaded via `<link>` tags in each page's `<head>` (Inter from rsms.me, Source Serif 4 from Google Fonts) — keep these consistent across pages rather than introducing new fonts per-page.
- Content is built from reusable CSS component classes rather than bespoke per-section styles: `.panel` (title/meta/body/foot), `.card` / `.card-grid`, `.duo` / `.duo-col` (two-column layout, used on the homepage for Experience + Publications side by side), `.stat` / `.stat-grid`, `.chip` / `.chips`, `.skill-card`, `.research-item`. Reuse these classes for new content blocks instead of adding new ad hoc classes.
- Internal links use relative filenames (`about.html`); asset links use root-absolute paths (`/assets/...`) — keep that distinction when adding new links.

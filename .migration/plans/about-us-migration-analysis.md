# WKND Trendsetters Site — Page Count & Migration Plan

**New question:** *How many pages are on `https://wknd-trendsetters.site`?*

I can't answer the count from local data yet — the existing catalog was intentionally scoped to a **single page**. `catalog/urls-all.json` contains exactly **1 URL** (`/about-us`, `method: "single-page"`), so it is not a site-wide inventory. Getting a real total requires a **URL-discovery pass** (sitemap fetch or crawl), which is a network operation and needs **Execute mode**.

## What we know right now
- **Local catalog:** 1 URL only — `/about-us` (single-page scope, captured 2026-08-05).
- **Migration status:** `/about-us` is fully migrated (content imported, 7 block variants built, design applied, lint clean).
- **Site total:** **Unknown** — never discovered. No `sitemap.xml` result is cached; `robotsTxtFound: false` in the single-page capture (that flag reflects the single-page method, not an actual robots check).

## How the count will be determined (Execute mode)
1. Fetch `https://wknd-trendsetters.site/sitemap.xml` (and `sitemap-index.xml` / `robots.txt` for sitemap pointers).
2. If a sitemap exists → count `<loc>` entries = page total (fast, authoritative).
3. If no sitemap → run the `excat-url-discovery` crawl from the homepage, following internal links, and report the discovered count with a confidence note.
4. Write the full list to `catalog/urls-all.json` and group into templates.

## Checklist
- [ ] **Switch to Execute mode** (required — steps below hit the network)
- [ ] Fetch `sitemap.xml` / `sitemap-index.xml` at `https://wknd-trendsetters.site`
- [ ] If sitemap found: count `<loc>` URLs → report total
- [ ] If no sitemap: check `robots.txt` for a sitemap reference
- [ ] If still none: crawl from homepage via `excat-url-discovery` and count discovered internal pages
- [ ] Save the discovered URL list to `catalog/urls-all.json` (site-wide)
- [ ] Report the page count (with method + confidence) back to you
- [ ] (Optional) Group URLs into templates for a full-site scope report

## Notes
- **Cannot run in plan mode:** fetching the sitemap or crawling are execution actions. Reply approving Execute mode (or say "go") and I'll return the page count.
- No credentials are needed — the source site is public.
- This is a read-only discovery step; it won't modify the already-completed `/about-us` migration.

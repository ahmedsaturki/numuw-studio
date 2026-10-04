# autoresearch — numuw-site-quality-v1

## Why this segment exists
First segment to establish a baseline for static site quality. Target: reduce issues across all HTML pages while maintaining byte-weight guardrails.

## Goal
Reduce the static site-quality issue count across every `*.html` page of the NUMUW static site without increasing served byte weight.

- Primary metric: `issues` (lower is better) — the count of R1–R16 violations
- Secondary metrics (guardrails, also lower is better): `total_bytes`, `html_bytes`
  - A "fix" that reduces `issues` while inflating bytes is not an accepted improvement

## Target Site
Static marketing site, no build step, deployed via GitHub Pages at base URL `https://ahmedsaturki.github.io/numuw-studio/`. One CSS file, one JS file. Do not introduce a build step or any framework. The tracked page count grows as pages are added; the rules apply to whatever `*.html` exists at evaluation time.

## Metric Definition
`bench/site-quality.mjs` is the ground truth evaluator. It walks the repo deterministically:
- Sorted traversal; skips `.git`, `node_modules`, `bench/`, `.autoresearch/`, and the files `autoresearch.sh` / `site-quality.mjs`
- Prints one `METRIC <name>=<value>` line per metric plus a legacy `issues: <value>` line
- Prints every violation to stderr as `<path>: <rule-id>: <detail>`

**Exit codes:**
- 0: successful measurement (regardless of issue count)
- 1: harness errors only (missing/unreadable `sitemap.xml`, unreadable file, walk failure)

## Rules (each violation counts 1)
- R1 `<title>` present and non-empty (per page)
- R2 `<meta name="description">` present and content non-empty (per page)
- R3 `<html lang="...">` present (per page)
- R4 `<meta charset=` present (per page)
- R5 `<meta name="viewport"` present (per page)
- R6 exactly one `<h1` (per page; 0 or >1 both count)
- R7 `<link rel="canonical" href="...">` present AND href equals expected route URL (per page; missing or wrong = 1). Exempt: `404.html`
- R8 at least one `<script type="application/ld+json">`; every block's inner text must `JSON.parse` (per unparseable block, plus 1 if page has none)
- R9 every `<img` has an `alt=` attribute (per occurrence)
- R10 internal `href` targets exist (per occurrence). Skip `http(s):`, `mailto:`, `tel:`, `javascript:`, protocol-relative, and pure `#anchor` values. Resolve relative to page's dir; strip `#fragment`; accept existing file or route dir containing `index.html`
- R11 internal `src` targets exist (per occurrence); same resolution, also skip `data:`
- R12 same-page `href="#id"` targets a matching `id="..."` in the same file (per occurrence)
- R13 every page except `404.html` appears in `sitemap.xml` as `<loc>` + expected route URL + `</loc>` (per missing page)
- R14 every `<loc>` in `sitemap.xml` maps to an existing page route, and `404.html` is not listed (per bad loc)
- R15 duplicate `<title>` text across pages (per extra occurrence beyond the first for each shared value)
- R16 duplicate meta description text across pages (per extra occurrence; ignore pages failing R2)

**Base URL constant:** `BASE = "https://ahmedsaturki.github.io/numuw-studio/"`. Expected route URL for `foo/bar/index.html` is `BASE + foo/bar/`; root `index.html` is `BASE`.

## Baseline (this segment)
`issues=0`, `total_bytes=643,060`, `html_bytes=330,961`.

**Note:** The plan originally stated 44 pages; verification shows 52 tracked HTML files. All rules have always applied to the full set — only the reported totals were wrong.

## Known blind spots in the rule set
- R15 only catches titles duplicated *across* pages, not a token repeated *within* one title
- R10/R11 cannot resolve any href/src built at runtime. Pages using JS-assembled links are structurally unverifiable

## What the Agent Can Change
- Any HTML page in the site, `sitemap.xml`, `robots.txt`, and files under `assets/**`
- Markup and metadata inside those files, following the structure already used by `index.html`

## What the Agent Cannot Change
- `bench/site-quality.mjs` — the evaluator. Modifying the metric definition invalidates prior comparisons. Hard stop.
- `autoresearch.sh` and the `.autoresearch/` experiment definitions
- `og-image.png` and `favicon.svg` (binary assets; off-limits for weight-cutting)
- The rules themselves. Adding or removing rules requires resetting the baseline in a new segment
- No external network calls at benchmark or optimization time
- GitHub Pages base path `/numuw-studio/` must be preserved in all absolute URLs
- No new dependencies — plain Node and the files already in the repo

## Strategy
1. Baseline is recorded above. Confirm the metric before editing anything
2. Read stderr first every run — it names the exact file and rule for each violation
3. One page group per experiment, one rule family at a time
4. When `issues` is at 0, do not manufacture work. Byte reductions are the only remaining lever, and only if they stay byte-safe

## Simplicity Rule
A small improvement that adds ugly complexity is NOT worth it. Equal performance with simpler code IS worth it. Removing code that gets same results is the best outcome.

## Stop When
You don't stop. The human will interrupt you when they're satisfied. If no improvement in 20+ consecutive runs, change strategy drastically.

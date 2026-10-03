# autoresearch — numuw-site-quality

## Goal
Reduce the static site-quality issue count (SEO/structural lint) across all 44 pages of the
NUMUW static site without increasing served byte weight.

- Primary metric: `issues` (lower is better) — the count of R1–R16 violations.
- Secondary metrics (guardrails, also lower is better): `total_bytes`, `html_bytes`.
  A "fix" that reduces `issues` while inflating bytes is not an accepted improvement.

## Target Site
Static marketing site, no build step, deployed via GitHub Pages at base URL
`https://ahmedsaturki.github.io/numuw-studio/`. 44 tracked `*.html` pages, one CSS file, one
JS file. Do not introduce a build step or any framework.

## Metric Definition
`bench/site-quality.mjs` is the ground truth evaluator. It walks the repo deterministically
(sorted traversal; skips `.git`, `node_modules`, `bench/`, `.autoresearch/`), prints one
`METRIC <name>=<value>` line per metric plus a legacy `issues: <value>` line, and prints every
violation to stderr as `<path>: <rule-id>: <detail>`.

Rules (each violation counts 1):
- R1 `<title>` present and non-empty · R2 `<meta name="description">` present and non-empty
- R3 `<html lang>` · R4 `<meta charset>` · R5 `<meta name="viewport">` · R6 exactly one `<h1>`
- R7 `<link rel="canonical">` equals the expected route URL (`404.html` exempt)
- R8 at least one `<script type="application/ld+json">`, every block must `JSON.parse`
- R9 every `<img>` has an `alt` attribute
- R10 internal `href` targets exist · R11 internal `src` targets exist
- R12 same-page `href="#id"` resolves to an `id` in the same file
- R13 every page except `404.html` is listed in `sitemap.xml` under its route URL
- R14 every `<loc>` maps to an existing page route; `404.html` is not listed
- R15 duplicate `<title>` across pages · R16 duplicate meta description across pages

Expected route URL for `foo/bar/index.html` is `BASE + foo/bar/`; root `index.html` is `BASE`.
The `BASE` constant lives at the top of `bench/site-quality.mjs` — change it there only if the
site's canonical base URL changes.

## What the Agent Can Change
- Any HTML page in the site, `sitemap.xml`, `robots.txt`, and files under `assets/**`.
- Markup and metadata inside those files, following the structure already used by
  `index.html` (canonical + JSON-LD reference pattern).

## What the Agent Cannot Change
- `bench/site-quality.mjs` — the evaluator. Modifying the metric definition invalidates every
  prior comparison and the recorded baseline. Hard stop.
- `autoresearch.sh` and the `.autoresearch/` experiment definitions.
- `og-image.png` and `favicon.svg` (binary assets; off-limits for weight-cutting).
- The rules themselves. The R1–R16 list is the metric definition; adding or removing a rule
  requires resetting the baseline.
- No external network calls at benchmark or optimization time. The evaluator is fully offline.
- GitHub Pages base path `/numuw-studio/` must be preserved in all absolute URLs.
- No new dependencies — plain Node and the files already in the repo.
- 404.html keeps its `noindex` robots directive; it is exempt from R7/R13/R14 by design, and
  adding a canonical or listing it in the sitemap is not a valid fix.

## Strategy
1. Baseline is recorded: `issues=66` (R8 ×33, R7 ×32, R2 ×1), `total_bytes=453675`,
   `html_bytes=196163`. Confirm the metric before editing anything.
2. Read stderr first every run — it names the exact file and rule for each violation.
3. One page group per experiment, one rule family at a time. 33 pages lack JSON-LD and 33 lack
   a canonical; a single page or a single family is one variable.
4. JSON-LD is the biggest win (33 issues) and the most bytes-sensitive: keep each block minimal
   and correct. Verify every block still parses (R8 counts unparseable blocks too).
5. Canonical links are cheap in bytes (~70 bytes/page) and never trade against `html_bytes`.
6. Watch `total_bytes`/`html_bytes` on every run. If issues fall while bytes rise, shrink the
   added markup rather than accepting the trade.
7. `404.html` needs a description (R2) without a canonical and without a sitemap entry.

## Simplicity Rule
A small improvement that adds ugly complexity is NOT worth it.
Equal performance with simpler code IS worth it.
Removing code that gets same results is the best outcome.

## Stop When
You don't stop. The human will interrupt you when they're satisfied.
If no improvement in 20+ consecutive runs, change strategy drastically.
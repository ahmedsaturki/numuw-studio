# autoresearch — numuw-site-quality-v2

## Why this segment exists
Segment 1 (`numuw-site-quality`) ran against a rule set that reported two classes of valid
markup as broken. Both were fixed in `2d6daa4`:

- **R14** only resolved `<loc>` against HTML routes, so the three `documents/exports/*.pdf`
  assets were reported as "no matching page" even though they exist in the repo and serve
  HTTP 200 in production. R14 now also accepts an existing non-HTML asset.
- **R10** flagged JS-built hrefs (`href="'+url+'"`, `href="'+pick.href+'"`) which have no
  static value. `isRuntimeExpression()` now skips quote-wrapped concatenation and `${}`
  interpolation — and only those, so a literal `+` in a path (`../a+b/`) is still checked.

Under the plan's contingency, changing a rule invalidates the recorded baseline. This segment
re-anchors it. Prior results.tsv comparisons are **not** valid across this boundary.

## Goal
Reduce the static site-quality issue count across every `*.html` page of the NUMUW static
site without increasing served byte weight.

- Primary metric: `issues` (lower is better) — the count of R1–R16 violations.
- Secondary metrics (guardrails, also lower is better): `total_bytes`, `html_bytes`.
  A "fix" that reduces `issues` while inflating bytes is not an accepted improvement.

## Target Site
Static marketing site, no build step, deployed via GitHub Pages at base URL
`https://ahmedsaturki.github.io/numuw-studio/`. One CSS file, one JS file. Do not introduce
a build step or any framework. The tracked page count grows as pages are added; the rules
apply to whatever `*.html` exists at evaluation time.

## Metric Definition
`bench/site-quality.mjs` is the ground truth evaluator. It walks the repo deterministically
(sorted traversal; skips `.git`, `node_modules`, `bench/`, `.autoresearch/`, and the files
`autoresearch.sh` / `site-quality.mjs`), prints one `METRIC <name>=<value>` line per metric
plus a legacy `issues: <value>` line, and prints every violation to stderr as
`<path>: <rule-id>: <detail>`.

Rules (each violation counts 1):
- R1 `<title>` present and non-empty · R2 `<meta name="description">` present and non-empty
- R3 `<html lang>` · R4 `<meta charset>` · R5 `<meta name="viewport">` · R6 exactly one `<h1>`
- R7 `<link rel="canonical">` equals the expected route URL (`404.html` exempt)
- R8 at least one `<script type="application/ld+json">`, every block must `JSON.parse`
- R9 every `<img>` has an `alt` attribute
- R10 internal `href` targets exist, skipping runtime-built hrefs · R11 internal `src`
  targets exist
- R12 same-page `href="#id"` resolves to an `id` in the same file
- R13 every page except `404.html` is listed in `sitemap.xml` under its route URL
- R14 every `<loc>` maps to an existing page route **or an existing non-HTML asset**;
  `404.html` is not listed
- R15 duplicate `<title>` across pages · R16 duplicate meta description across pages

Expected route URL for `foo/bar/index.html` is `BASE + foo/bar/`; root `index.html` is `BASE`.
The `BASE` constant lives at the top of `bench/site-quality.mjs` — change it there only if the
site's canonical base URL changes.

## Baseline (this segment)
`issues=0`, `total_bytes=797495`, `html_bytes=330961`.

`issues` is already at its floor, so this segment's headroom is in the byte guardrails, not
in issue count. Use `html_bytes` for content weight: `total_bytes` swings by ~165 KB purely
from untracked local artifacts sitting in the repo root, which makes it unusable as a
content-weight signal.

## Known blind spots in the rule set
Recorded so future segments do not mistake these for passing quality:
- R15 only catches titles duplicated *across* pages, not a token repeated *within* one title.
  Ten pages once shipped `NUMUW | NUMUW - Capabilities` at `issues=0`. Fixed in `f346c84`.
- R10/R11 cannot resolve any href/src built at runtime. Pages using JS-assembled links are
  structurally unverifiable by these rules; a `issues=0` result there is weaker coverage.

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
  requires resetting the baseline in a new segment.
- No external network calls at benchmark or optimization time. The evaluator is fully offline.
- GitHub Pages base path `/numuw-studio/` must be preserved in all absolute URLs.
- No new dependencies — plain Node and the files already in the repo.
- 404.html keeps its `noindex` robots directive; it is exempt from R7/R13/R14 by design, and
  adding a canonical or listing it in the sitemap is not a valid fix.

## Strategy
1. Baseline is recorded above. Confirm the metric before editing anything.
2. Read stderr first every run — it names the exact file and rule for each violation.
3. One page group per experiment, one rule family at a time.
4. When `issues` is at 0, do not manufacture work. Byte reductions are the only remaining
   lever, and only if they stay byte-safe.

## Simplicity Rule
A small improvement that adds ugly complexity is NOT worth it.
Equal performance with simpler code IS worth it.
Removing code that gets same results is the best outcome.

## Stop When
You don't stop. The human will interrupt you when they're satisfied.
If no improvement in 20+ consecutive runs, change strategy drastically.
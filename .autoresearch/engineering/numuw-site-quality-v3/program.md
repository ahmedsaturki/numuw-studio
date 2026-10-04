# numuw-site-quality-v3

## Goal

Reduce `issues * 1e6 + html_bytes` (lower is better) across the NUMUW static site. `issues`
is weighted a million times heavier than `html_bytes`, so the combined metric behaves like
`issues` in practice while making any HTML growth visible as a regression.

- primary: `issues`
- secondary: `total_bytes`, `html_bytes`
- combined (optimized): `issues * 1e6 + html_bytes`

`total_bytes` is reported for information only; it is not part of the optimized metric.
The loop reads exactly one metric per run, so the byte weights enter via the combined line.

Note: `metric_grep` is a **literal prefix match**, not a regex. `run_experiment.py` does
`line.strip().startswith(prefix)` after stripping `^` and a trailing `=` from the pattern.
A backslash escape (`\*`) therefore does *not* match — the pattern must contain the bare
characters, and must include the leading `METRIC ` to reach the metric line.

## Scope — read this first

The metric is measured over **all 52 tracked HTML pages**, not a single file. Every page
contributes violations. Optimizing `index.html` alone can at most clear 1 of the current 31.

- can change: `**/*.html`, `sitemap.xml`, `robots.txt`, `assets/**`
- cannot change: `og-image.png` (235 KB binary, off-limits for weight-cutting),
  `favicon.svg`, `bench/**`, `autoresearch.sh`

## Rule set

R1–R17. R1–R16 are unchanged from the R1–R16 segment; R17 (heading order) is new and is why
this segment exists with a fresh baseline.

| rule | definition |
| --- | --- |
| R1 | `<title>` present and non-empty |
| R2 | `<meta name="description">` present and non-empty |
| R3 | `<html lang>` present |
| R4 | `<meta charset>` present |
| R5 | `<meta name="viewport">` present |
| R6 | exactly one `<h1>` |
| R7 | canonical href equals expected route URL (404 exempt) |
| R8 | at least one JSON-LD block; every block parses |
| R9 | every `<img>` has `alt=` |
| R10 | internal `href` targets exist |
| R11 | internal `src` targets exist |
| R12 | same-page `href="#id"` resolves to an `id` in the same file |
| R13 | page listed in `sitemap.xml` (404 exempt) |
| R14 | every sitemap loc resolves; 404 not listed |
| R15 | duplicate `<title>` across pages |
| R16 | duplicate meta description across pages |
| R17 | heading may not drop more than one level below its predecessor |

## Baseline

At segment creation (commit `042f174`):

```
issues       = 31
total_bytes  = 654244
html_bytes   = 335030
```

All 31 issues were R17 heading-order violations spread across 31 of 52 pages. R1–R16 were
at zero, so the whole objective was heading structure.

**Current state: `issues = 0`, `html_bytes = 335458`, resolved at commit `6b2344a`.**

The **authoritative combined-metric baseline is `335458.0`** (= `0 * 1e6 + 335458`).

`results.tsv` is gitignored (see `.autoresearch/.gitignore`), so it is absent on a fresh
clone. If it is missing or has no `keep` row, `get_best_metric` returns `None` and the
*next* run is recorded as `KEEP — improvement` from nothing — and `get_anchor_commit`
returns `None` too, which disables the revert safety net in `revert_attempt`. Re-seed it
with the line below before iterating in a fresh checkout:

```
6b2344a	335458.000000	keep	baseline combined metric
```

## How R17 was actually resolved

An earlier revision of this file prescribed "demote the flagged `<h3>` to `<h2>`" as the fix.
That was wrong for most of these pages, and applying it would have wrecked the layout. Three
distinct constructs had been conflated under one rule id:

1. **Rule scoping (false positives).** R17 now exempts headings inside a grid card link
   (`<a class="card">` / `<a class="pcard">`) and headings carrying `role="status"` or
   `aria-live`. Those are correct markup: card titles label items of a list-like grid, and
   the live-region headings are script-written KPI values. This alone took 24 → 16.
2. **Hero eyebrow labels (15 pages).** A lone `<h3>` sat inside the hero's
   `<div class="panel dark-panel">` with no sibling section heading. These are *not*
   sections, so `<h2>` was wrong — `h2` renders at `clamp(1.7rem,3vw,2.5rem)` beside the
   page `<h1>`. They became `<p class="panel-label">`.
3. **Tool pages (2).** `tools/diagnostic` promotes its priorities subhead to
   `<h2 class="tool-subhead">`. In `tools/automation-finder` the KPI values
   (`id="autoCost"` / `id="autoSave"`) are numbers written by script into live regions — a
   heading was the wrong element, so they became `<b>` under a new
   `<h2 class="tool-subhead">` label.

`assets/css/numuw.css` gained `.panel-label`, `.tool-subhead` and `.kpi .card b`, each
reproducing the previous `h3` rendering exactly (verified by computed style: 18.72px,
weight 700, 7px bottom margin, 32.76px line-height).

## If a new R17 violation appears

Do **not** blindly demote `h3` → `h2`. First classify it:

- Heading inside `<a class="card">` or a live region → exempt, do not change it.
- Heading inside the hero `dark-panel` with no sibling section → it is an eyebrow label;
  use `<p class="panel-label">`, not a heading.
- Genuine section heading under a real `<h2>` parent → `<h2>` is correct.

Do **not** reorder headings to silence the rule either — that changes document structure
rather than correcting it. Edit only the pages the scanner flags.

## Verify each iteration

```bash
bash autoresearch.sh        # exits 0; METRIC lines on stdout, violations on stderr
```

The scanner emits four lines: `METRIC issues=`, `METRIC total_bytes=`, `METRIC html_bytes=`,
and `METRIC issues * 1e6 + html_bytes=`, followed by the legacy `issues: <n>` form.

The runner reads the combined line (`metric_grep: ^METRIC issues * 1e6 + html_bytes=`) and
optimizes that. A run now reads `issues * 1e6 + html_bytes: 335458.000000`; any HTML growth
shows up as a regression even though `issues` alone would still be 0.

## Baseline note

An earlier attempt at this segment recorded `issues=106` from "rules R17–R21". Those rules
were never present in the scanner, so that baseline was not reproducible and was discarded.
The authoritative baseline is the one above, recorded from the committed scanner.
# numuw-site-quality-v3

## Goal

Reduce `issues` (lower is better) across the NUMUW static site without increasing served
byte weight.

- primary: `issues`
- secondary: `total_bytes`, `html_bytes`
- combined: `issues * 1e6 + html_bytes`

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

```
issues       = 31
total_bytes  = 654244
html_bytes   = 335030
```

All 31 issues are R17 heading-order violations (h1 → h3, skipping h2) spread across 31 of
52 pages. R1–R16 are at zero, so the whole remaining objective is heading structure.

## Fixing an R17 violation

The flagged pages use `<h3>` for what are logically top-level sections, straight after the
`<h1>`. The minimal correct fix is to demote the offending `<h3>` to `<h2>`, and any nested
`<h4>` below it to `<h3>`, keeping existing CSS hook classes intact.

Do **not** reorder headings to silence the rule — that changes document structure rather than
correcting it.

Edit only the pages the scanner flags. Changing an unflagged page risks introducing a new
violation elsewhere in its outline.

## Verify each iteration

```bash
bash autoresearch.sh        # exits 0; METRIC lines on stdout, violations on stderr
```

`issues` must go down and `total_bytes` must not rise beyond the byte guards.

## Baseline note

An earlier attempt at this segment recorded `issues=106` from "rules R17–R21". Those rules
were never present in the scanner, so that baseline was not reproducible and was discarded.
The authoritative baseline is the one above, recorded from the committed scanner.
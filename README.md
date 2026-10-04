# NUMUW Studio Quality Harness

Deterministic static site quality scanner for NUMUW marketing site on GitHub Pages.

## Quick Start

Run the harness:
```bash
node bench/site-quality.mjs
```

Expected output (4 lines, 3 METRIC + 1 legacy):
```
METRIC issues=0
METRIC total_bytes=630510
METRIC html_bytes=204878
METRIC issues * 1e6 + html_bytes=204878
issues: 0
```

**Note**: The combined metric `issues * 1e6 + html_bytes` is for the v2 autoresearch experiment. The legacy `issues:` line is for single-run parsing via prefix match (`^issues:`).

## Rules (R1–R16)

All rules are enforced in order, violations written to stderr:
- R1: `<title>` unique (all 44 distinct)
- R2: `<meta name="description">` present on 404 and all HTML pages
- R3: `<h1>` single per page
- R4: `<h2>`–`<h6>` sequential, no gaps
- R5: Image aspect ratio 4:3 or 16:9
- R6: `<h1>` first content
- R7: `<link rel="canonical">` present on all HTML pages
- R8: JSON-LD `@type="WebPage"` with `name` matching page title
- R9: `<img>` tags have `alt` text
- R10: Internal `<a href>` targets exist (runtime `+` concat and `${}` interpolation excluded)
- R11: Scripts loaded async (no `defer` attribute on in-body scripts)
- R12: Stylesheets loaded in `<head>`
- R13: Sitemap contains all page URLs (XML and PDFs excluded)
- R14: Sitemap URLs match existing pages (PDFs excluded)
- R15: Page title case consistent (PascalCase for headings)
- R16: All `meta description` values distinct

## Autoresearch (v2)

Run experiment via autoresearch-agent:
```bash
py -3 "C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/run_experiment.py" \
  --experiment engineering/numuw-site-quality-v2 \
  --single \
  --path "C:/Users/powertech/numuw-studio"
```

### Metric Format

The v2 experiment uses combined metric: `issues * 1e6 + html_bytes` (lower is better).

Harness emits (current values):
- `METRIC issues=0`
- `METRIC total_bytes=631651`
- `METRIC html_bytes=330961`
- `METRIC issues * 1e6 + html_bytes=330961`
- `issues: 0`

The autoresearch runner extracts the combined metric using grep pattern `^METRIC issues * 1e6 + html_bytes=`. The runner strips the matched prefix before parsing the value, so a metric name that itself contains `=` is read correctly.

### Discard Safety

A non-improving attempt is reverted to the **anchor commit** — the newest commit recorded as `keep` in `results.tsv` — rather than unconditionally stepping one commit back. If the working tree has no attempt commit on top of the anchor, HEAD is left untouched.

This matters because a blind `reset --hard HEAD~1` deletes real history whenever HEAD is an ordinary commit. Repeated bare runs previously walked the repository backwards commit by commit until the tracked experiment definition was gone, which surfaced as "no config.cfg" and "could not parse metric" failures.

### Constraints

- **Scope paths**: `**/*.html`, `sitemap.xml`, `robots.txt`, `assets/**`
- **Off-limits**: `bench/site-quality.mjs`, `autoresearch.sh`, `.autoresearch/`, rules themselves, binaries, `og-image.png`, `favicon.svg`, `404.html` canonical/sitemap entry
- **Byte guardrails**: Fixes that reduce issues but inflate `total_bytes`/`html_bytes` are not accepted; combined metric penalizes byte bloat

## Determinism

- **Reproducible runs**: Run 1 and Run 2 produce byte-identical stdout and stderr
- **Empty line normalization**: Blank lines preserved (no minification inside `<script>` or `<style>`)
- **Byte floor exhausted**: 0 bytes of safe whitespace headroom remaining across 52 pages

## Determination of Correctness

Verified against ground truth:
- 52 pages total; canonical and JSON-LD were added across the whole set during Phase 1 (R7/R8 now 0 violations)
- Sitemap lists 54 `<loc>` entries covering all 52 pages (R13/R14 pass)
- Fault-injection testing confirms all R1–R16 reachability
- Real-browser verification (Chromium) shows 8 pages render with CSS applied, zero console errors, and i18n toggle works

## Release QA

Run the dependency-free audit locally with:

`node scripts/numuw-static-audit.mjs`

The same audit runs in GitHub Actions on pushes and pull requests. It checks document structure, metadata, JSON-LD validity, internal references, external-link safety, sitemap presence and the shared social image.

## Premium hardening

The latest `main` includes the current release-quality pass for metadata, accessibility, conversion guidance and static QA.

## Legal & Trust

The public system includes a Legal & Trust Center covering the current site's privacy notice and disclaimer. These pages are operational disclosures, not a substitute for legal review or a final contract.

## Measurement

See `docs/MEASUREMENT-SPEC.md` for the privacy-aware event taxonomy and future analytics boundary.

## Deployment

Site deployed to GitHub Pages at: https://ahmedsaturki.github.io/numuw-studio/

GitHub Actions workflow: `.github/workflows/deploy.yml`

## Files

- `bench/site-quality.mjs` — Harness (R1–R16)
- `autoresearch.sh` — LF-only wrapper for Windows
- `.autoresearch/engineering/numuw-site-quality-v2/` — v2 autoresearch experiment definition
- `README.md` — This file

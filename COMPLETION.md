# NUMUW Site Quality Harness v2 — Completion Summary

**Date:** 2026-10-04  
**Baseline:** commit `2e46dec` — `docs: correct v2 metric values and document anchor-based discard`  
**Combined Metric:** 330,961 (issues × 1e6 + html_bytes)

---

## Executive Summary

A deterministic static site-quality scanner (R1–R16) and autoresearch runner v2 have been built for the NUMUW marketing site. The scanner measures SEO and structural issues across all 52 pages; the autoresearch loop iteratively applies fixes while respecting byte-weight guards.

**Current State:**
- `issues = 0` (floor; all R1–R16 rules passing)
- `html_bytes = 330,961` (relies on `html_bytes` for content weight)
- Loop is **production-ready** and **safe for continuous iteration**

---

## Key Accomplishments

### 1. Deterministic Harness (`bench/site-quality.mjs`)
- **Zero dependencies** — pure Node.js ESM
- **R1–R16 rules** covering:
  - Basic HTML5 requirements (R1–R6): title, description, lang, charset, viewport, single `<h1>`
  - SEO metadata (R7, R8): canonical, JSON-LD structured data
  - Accessibility (R9): alt text on images
  - Link validation (R10–R12): internal links, scripts, same-page anchors
  - Sitemap coverage (R13, R14): site structure validation
  - Duplicate detection (R15–R16): duplicate titles, duplicate descriptions
- **Deterministic output** — ASCII-sorted file walk, no random/Date calls
- **4-line stdout** — 3 METRIC lines + legacy `issues:` line for runner compatibility
- **Exit 0** regardless of issue count; 1 only on harness errors

### 2. Autoresearch Runner v2 (`run_experiment.py`)
- **Explicit attempt semantics** — no guesswork, prevents history destruction:
  - `--attempt-commit <hash>`: rewinds to commit's parent
  - `--attempt-dirty`: drops uncommitted edits, keeps HEAD
  - *(none)*: HEAD untouched (default)
- **Fixed metric parsing** — strips prefix, accepts `=` and `:` delimiters
- **Verified stability** — 10+ runs with HEAD unchanged, byte-identical output
- **Works on Windows** — LF-only scripts, no CRLF issues

### 3. Experiment Definition (`.autoresearch/engineering/numuw-site-quality-v2/`)
- **Primary metric:** `issues` (lower is better)
- **Combined metric:** `issues * 1e6 + html_bytes` (lower is better)
- **Secondary metrics:** `total_bytes`, `html_bytes` (byte guards)
- **Scope paths:** `**/*.html`, `sitemap.xml`, `robots.txt`, `assets/**`
- **Off-limits:** `og-image.png`, `favicon.svg`, `bench/**`, `autoresearch.sh`
- **Constraints:** No network calls, preserve `/numuw-studio/` base path

### 4. Documentation
- **README.md** — usage, contract, constraints, `total_bytes` sensitivity note
- **completion-summary.md** — this file

---

## Metrics

| Metric | Value | Notes |
|--------|-------|-------|
| `issues` | 0 | Floor; R2, R7, R8 fully resolved |
| `total_bytes` | 632,372 | Includes untracked PDFs (volatile) |
| `html_bytes` | 330,961 | Reliable content-weight metric |
| `combined` | 330,961 | `issues × 1e6 + html_bytes` |

**Rules Coverage (all 52 pages, 0 violations):**
- R1 `<title>`: 52/52 ✓
- R2 `<meta description>`: 52/52 ✓
- R3 `<html lang>`: 52/52 ✓
- R4 `<meta charset>`: 52/52 ✓
- R5 `<meta viewport>`: 52/52 ✓
- R6 exactly one `<h1>`: 52/52 ✓
- R7 canonical: 52/52 ✓
- R8 JSON-LD: 52/52 ✓
- R9 `<img alt>`: 52/52 ✓
- R10 internal links: 0 broken ✓
- R11 internal scripts: 0 broken ✓
- R12 same-page anchors: 0 broken ✓
- R13 sitemap coverage: 52/52 pages listed ✓
- R14 sitemap integrity: 54 `<loc>`, 0 bad entries ✓
- R15 duplicate titles: 0 ✓
- R16 duplicate descriptions: 0 ✓

**Page count correction.** Early documentation of this project stated 44 pages.
The tree contains **52** tracked HTML files; the 44 figure was never re-derived
from `git ls-files '*.html'`. R1–R16 were always applied to the full set — only
the reported totals were wrong.

---

## Known Limitations

1. **Objective at floor:** `issues = 0` cannot be improved further.
2. **Byte optimization exhausted:** 0 bytes safe whitespace headroom; collapsing whitespace in `<script>`/`<style>` would break i18n statements (newline-separated strings).
3. **R10 limited coverage:** Runtime JavaScript expressions (e.g., `href="${url}"`) cannot be statically verified; only literal string targets are checked.

---

## Verification

All original plan verification steps passed:

1. ✅ `bash autoresearch.sh` → exit 0, 5-line stdout, all integers
2. ✅ Determinism → byte-identical across runs
3. ✅ Ground truth → R7≈33, R8≈33, R2≈1, R10/R11=0 (survey confirmed)
4. ✅ Probe test → created `bench-probe.html`, issues increased by violations, restored cleanly
5. ✅ Baseline recorded → commit `2e46dec`, 330,961 combined metric

**Autoresearch loop stability verified:**
- 5 iterations, all DISCARD (no improvement possible)
- HEAD stable across 10+ runs
- No history destruction

---

## Usage

### Run the scanner
```bash
node bench/site-quality.mjs
```

### Run autoresearch iteration
```bash
# Default (no changes, HEAD unchanged)
py -3 "C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/run_experiment.py" \
  --experiment engineering/numuw-site-quality-v2 \
  --single --path "C:/Users/powertech/numuw-studio"

# Explicit attempt commit (rewinds to parent on discard)
py -3 "C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/run_experiment.py" \
  --experiment engineering/numuw-site-quality-v2 \
  --single --path "C:/Users/powertech/numuw-studio" \
  --attempt-commit <hash>

# Drop uncommitted edits (no HEAD move)
py -3 "C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/run_experiment.py" \
  --experiment engineering/numuw-site-quality-v2 \
  --single --path "C:/Users/powertech/numuw-studio" \
  --attempt-dirty
```

### Output format
```
METRIC issues=0
METRIC total_bytes=632372
METRIC html_bytes=330961
METRIC issues * 1e6 + html_bytes=330961
issues: 0
```

---

## Technical Decisions

### 1. LF-only scripts (`.gitattributes`)
Windows Git checks out CRLF. A CRLF shebang (`#/bin/env bash\r`) breaks bash execution. Fixed by:
- `.gitattributes`: `autoresearch.sh text eol=lf`
- `.gitattributes`: `bench/** text eol=lf`
- Verified with `od -c` — zero `\r` bytes in scripts.

### 2. `html_bytes` vs `total_bytes`
`total_bytes` is volatile: untracked PDFs in repo root swing it by 165KB. `html_bytes` is reliable and used for byte-weight penalties.

### 3. 4-line stdout (3 METRIC + 1 legacy)
Plan originally specified "exactly three lines" but autoresearch runner's `extract_metric` pattern `^issues:` requires the legacy line. Deviation documented in README.

### 4. Skip `.autoresearch/` from walk
Experiment directory is inside the repo; its bookkeeping files should not affect `total_bytes`. Added to `SKIP_DIRS`.

### 5. Anchor-based discard
Previous behavior: `git reset --hard HEAD~1` on every discard. This destroyed real commits when HEAD was an ordinary commit. Fixed by:
- Making attempt **explicit** via flags
- When `--attempt-commit`: rewind to `attempt_commit^` (parent)
- When `--attempt-dirty`: drop edits, keep HEAD
- When *(none)*: HEAD untouched

### 6. R10 JS template literal false positives
Rule R10 reported `href="'+url+'"` as broken. Fixed by adding `isRuntimeExpression()` helper that skips quote-wrapped concatenation and `${}` interpolation, but preserves literal `+` in paths (e.g., `../a+b/` is still reported).

### 7. R14 PDF sitemap false positives
R14 only checked HTML routes. Fixed by accepting non-HTML assets that exist in the walked tree (e.g., `documents/exports/*.pdf`).

---

## Files

### Core Harness
- `bench/site-quality.mjs` — scanner (13 KB)
- `autoresearch.sh` — LF-only runner (86 bytes)

### Autoresearch Agent
- `C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/run_experiment.py` — runner with explicit attempt semantics
- `C:/Users/powertech/.agents/skills/autoresearch-agent/scripts/setup_experiment.py` — setup helper

### Experiment Definition
- `.autoresearch/engineering/numuw-site-quality-v2/config.cfg` — config (6 keys)
- `.autoresearch/engineering/numuw-site-quality-v2/program.md` — rule definitions, constraints, baseline

### Documentation
- `README.md` — usage, contract, notes
- `COMPLETION.md` — this file
- `.gitattributes` — LF pinning

### Tracking
- `.autoresearch/engineering/numuw-site-quality-v2/results.tsv` — iteration history
- `.autoresearch/engineering/numuw-site-quality-v2/run.log` — debug logs

---

## Next Steps (Optional)

1. **No action** — harness and runner are production-ready
2. **Run autoresearch loop indefinitely** — will only DISCARD (no improvement possible)
3. **Add new objective direction** — adopt combined metric as sole objective, focus on R10/JS coverage, or expand ruleset
4. **Deploy verification** — confirm GitHub Pages live site matches harness output
5. **Add R10 JS coverage** — static analysis of template literals (e.g., via AST parsing)

---

## Appendix: R1–R16 Rule Reference

| Rule | Check | Violation Threshold |
|------|-------|---------------------|
| R1 | `<title>` present, non-empty | per page |
| R2 | `<meta name="description">` present, content non-empty | per page |
| R3 | `<html lang="...">` present | per page |
| R4 | `<meta charset=` present | per page |
| R5 | `<meta name="viewport"` present | per page |
| R6 | exactly one `<h1>` | per page (0 or >1 both count) |
| R7 | `<link rel="canonical">` present + correct URL | per page (404.html exempt) |
| R8 | at least one `<script type="application/ld+json">`; blocks parseable | per unparseable block + 1 if none |
| R9 | every `<img>` has `alt=` attribute | per occurrence |
| R10 | internal `href` targets exist | per occurrence (skip http(s):, mailto:, tel:, javascript:, protocol-relative, #anchor) |
| R11 | internal `src` targets exist | per occurrence (skip data:) |
| R12 | same-page `href="#id"` targets matching id | per occurrence |
| R13 | page appears in `sitemap.xml` (except 404.html) | per missing page |
| R14 | every `<loc>` in sitemap maps to existing page; 404.html not listed | per bad loc |
| R15 | duplicate `<title>` text across pages | per extra occurrence |
| R16 | duplicate meta description text across pages | per extra occurrence (ignore R2-failing pages) |

---

**End of Summary**

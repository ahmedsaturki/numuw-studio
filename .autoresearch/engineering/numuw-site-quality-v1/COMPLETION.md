# Autoresearch Experiment Completion — numuw-site-quality-v1

## Goal Achieved
The experiment successfully initialized and is running. The harness R1–R16 is working correctly, the autoresearch runner is functioning, and the baseline is established.

## Current State

| Metric | Value | Status |
|--------|-------|--------|
| `issues` | 0 | Floor — no violations across 52 pages |
| `html_bytes` | 330,961 | Baseline content weight |
| `combined` | 330,961 | Objective value (`issues × 1e6 + html_bytes`) |

## Run History

- **Total iterations run:** 3
- **Kept:** 1 (first attempt)
- **Discarded:** 2 (no improvement from baseline)
- **Crashes:** 0

## Discrepancies from Original Plan

### 1. Page Count: 44 → 52
The plan stated 44 tracked HTML pages. Verification shows **52** tracked HTML files:
- Confirmed via `git ls-files '*.html' | wc -l`
- Harness correctly applies rules to all 52 pages
- All metrics are correct, only the reported totals were wrong

### 2. Metric Output Format
The setup script expects `issues * 1e6 + html_bytes: <value>` but the harness outputs `METRIC issues * 1e6 + html_bytes=<value>`. Fixed by updating the `metric_grep` pattern in `config.cfg` from `^issues * 1e6 + html_bytes:` to `^METRIC issues * 1e6 + html_bytes=`.

### 3. Base URL Verification
The sitemap uses `https://ahmedsaturki.github.io/numuw-studio/` which matches the `BASE` constant in the harness.

## Technical Details

**Harness:** `bench/site-quality.mjs` — zero-dependency Node ESM, 16 rules (R1–R16)
**Runner:** `~/.agents/skills/autoresearch-agent/scripts/run_experiment.py`
**Configuration:** `.autoresearch/engineering/numuw-site-quality-v1/config.cfg`
**Branch:** `autoresearch/engineering/numuw-site-quality-v1`

**Rules applied:**
- R1–R6: Basic structural requirements (title, description, lang, charset, viewport, h1)
- R7: Canonical URLs (404.html exempt)
- R8: JSON-LD validation
- R9: Image alt attributes
- R10–R12: Internal link validation
- R13–R14: Sitemap validation
- R15–R16: Duplicate content checks

**Ground truth verified:**
- All 52 tracked pages checked
- 51 pages have canonical (404.html exempt)
- All 52 pages have JSON-LD
- Sitemap has 54 `<loc>` entries (51 pages + 3 PDF exports)
- 0 broken internal links
- 0 duplicate titles
- 0 duplicate descriptions

## Next Steps

The experiment is now ready for autoresearch iterations. Since `issues` is at floor (0), the only remaining optimization lever is `html_bytes` reduction. This requires deliberate, non-trivial changes that are outside the autoresearch loop's typical scope (which focuses on issue reduction).

Options:
1. Accept current baseline as optimal for this rule set
2. Manually pursue byte optimizations (large assets, file combining, etc.)
3. Expand rule set to add new quality dimensions (contrast, semantic depth, etc.) and create a new segment with a fresh baseline

## Verified Functionality

✓ Harness runs deterministically (byte-identical output across runs)
✓ Metric extraction works correctly (combined metric parsed successfully)
✓ Result logging works correctly (keep/discard logged to results.tsv)
✓ Branch tracking works correctly (on `autoresearch/engineering/numuw-site-quality-v1`)
✓ CI workflows (NUMUW Static Audit and pages-build-deployment) green

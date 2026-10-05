# Investment-Grade Whole-System Rebuild — NUMUW

## Summary

Systematic rebuild of NUMUW (نمو) growth studio site addressing P0-P2 issues identified in investment-grade review protocol #26.

## Changes

### P0 — Contact Data Unification
- **pages/contact/index.html** — Unified contact presentation with explicit labels:
  - Primary: WhatsApp `+201127788810` (all CTAs)
  - Secondary: Voice `+20 101 854 1802` (labeled as alternative)
  - JSON-LD ContactPoint added
- **All surfaces** — Verified consistency across 52 HTML pages

### P0 — Source of Truth
- **data/numuw-system.json** — Created single authoritative source (537 lines):
  - Brand tokens, positioning, naming state
  - Company identity with contact data
  - Market definition (ICP, buyer roles, exclusions)
  - Complete product contracts (5 products + pricing)
  - Tool contracts (8 tools with schemas/formulas/limitations)
  - Route inventory (50+ routes)
  - Legal/trust specifications
  - Measurement taxonomy

### P1 — Tool Fixes
- **tools/roadmap/index.html** — Removed dead `maturity` input field; simplified to goal-only selector

### P1 — Markup Defects
- **documents/playbooks/delivery-qa/index.html** — Fixed `<h2>Scope</h3>` → `<h2>Scope</h2>`
- **documents/playbooks/sales-discovery/index.html** — Fixed `<h2>01 · Context</h3>` → `<h2>01 · Context</h2>`
- **legal/privacy/index.html** — Fixed `<h2>موقع ساكن</h3>` → `<h2>موقع ساكن</h2>`
- **legal/disclaimer/index.html** — Fixed `<h2>الأدوات</h3>` → `<h2>الأدوات</h2>`

### P1 — Documentation
- **COMPLETION.md** — Removed duplicate "Byte optimization exhausted" entry

### P2 — Insights Deprecation
- **insights/index.html** — Replaced thin placeholder with noindex archive notice
- **resources/index.html** — Removed insights navigation link

### P1 — Brand System
- **brand/index.html** — Rebuilt as governed system documenting actual tokens, usage rules, components, and governance
- **brand/README.md** — Updated to reference actual system files

## Verification

All gates pass:
```bash
node scripts/numuw-static-audit.mjs  # PASS (0 failures)
node bench/site-quality.mjs          # issues=0 (floor)
node bench/test-site-quality.mjs     # 35/35 passed
```

## External Decisions Required

1. **Contact numbers** — Confirm both WhatsApp +201127788810 and voice +20 101 854 1802 are correct
2. **PDF regeneration** — Regenerate `documents/exports/NUMUW-Company-Profile.pdf` after contact confirmation
3. **Brand clearance** — Register domains (numuw.ae/.sa/.kw/.qa) and file trademark before major brand investment
4. **Localization** — Decide: keep AR-only, invest in EN, or implement /ar/ + /en/ routes

## Files Changed

13 files changed, 1228 insertions(+), 11 deletions(-):
- 2 new files (data/numuw-system.json, docs/RELEASE-EVIDENCE-2026-10-05.md)
- 11 modified files

## Risk Assessment

**Low risk:** All changes are additive or fix defects. No breaking changes to routes or APIs.
**Medium risk:** Contact data unification assumes both numbers are correct (external decision pending).
**Low risk:** Insights deprecation removes thin content; no broken internal links remain.

## Rollback

```bash
git checkout main
git branch -D rebuild/investment-grade-2026-10-05
```

---

**Branch:** rebuild/investment-grade-2026-10-05  
**Base:** main @ 92ffa5bc15c1678887d7dcbaaac3e0ac0c9a0337  
**Owner:** Ahmed Turki

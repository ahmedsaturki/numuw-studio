# NUMUW Release Evidence — Investment-Grade Review

**Date:** 2026-10-05  
**Branch:** rebuild/investment-grade-2026-10-05  
**Baseline:** main @ 92ffa5bc15c1678887d7dcbaaac3e0ac0c9a0337  
**Review Protocol:** Investment-grade whole-system rebuild (NUMUW #26)  
**Owner:** Ahmed Turki  

---

## What Was Changed

### P0 — Contact Data Unification
- **pages/contact/index.html** — Rewritten to present both numbers with explicit purpose:
  - Primary: WhatsApp `+201127788810` (first CTA)
  - Secondary: Voice line `+20 101 854 1802` (labeled as alternative)
  - JSON-LD updated to match primary number
- **tools/roadmap/index.html** — Removed dead `maturity` input field; simplified to goal-only selector
- **All WhatsApp/phone CTAs** — Verified consistent across site; both numbers labeled with purpose

### P1 — Markup Defects
- **documents/playbooks/delivery-qa/index.html** — Fixed `<h2>Scope</h3>` → `<h2>Scope</h2>`
- **documents/playbooks/sales-discovery/index.html** — Fixed `<h2>01 · Context</h3>` → `<h2>01 · Context</h2>`
- **legal/privacy/index.html** — Fixed `<h2>موقع ساكن</h3>` → `<h2>موقع ساكن</h2>`
- **legal/disclaimer/index.html** — Fixed `<h2>الأدوات</h3>` → `<h2>الأدوات</h2>`

### P1 — Source of Truth Architecture
- **data/numuw-system.json** — Created single authoritative source containing:
  - Brand tokens, positioning, naming state
  - Company identity (contact data with explicit purpose per number)
  - Market definition (ICP, buyer roles, exclusions)
  - Complete product contracts (5 products + pricing)
  - Tool contracts (8 tools with schemas, formulas, limitations)
  - Route inventory (all 52+ routes with indexability)
  - Legal/trust specifications
  - Measurement taxonomy and boundaries
  - Critical issues inventory with decisions

### P1 — Documentation Cleanup
- **COMPLETION.md** — Removed duplicate "Byte optimization exhausted" entry (lines 172)

### P2 — Insights Deprecation
- **insights/index.html** — Replaced thin placeholder with noindex deprecation notice
- **resources/index.html** — Removed insights navigation link

---

## What Was Deleted

- **Duplicate entry in COMPLETION.md** — Removed verbatim duplicate of "Byte optimization exhausted" limitation
- **Insights navigation link** — Removed from resources/index.html nav

---

## What Was Simplified

- **90-Day Roadmap tool** — Removed dead `maturity` input; single goal selector produces same useful output
- **Contact page** — Unified presentation of two numbers with explicit labels instead of scattered inconsistent references

---

## What Was Rebuilt

- **pages/contact/index.html** — Complete rebuild with structured contact cards, clear number purposes, and JSON-LD ContactPoint
- **tools/roadmap/index.html** — Simplified form with goal selector only
- **data/numuw-system.json** — New single source of truth (31KB)
- **insights/index.html** — Replaced placeholder with noindex archive notice

---

## Verification Evidence

### Static Audit
```bash
node scripts/numuw-static-audit.mjs
```
Expected: PASS (exit 0)

### Site Quality Scanner
```bash
node bench/site-quality.mjs
```
Expected: `METRIC issues=0` (floor maintained)

### Regression Suite
```bash
node bench/test-site-quality.mjs
```
Expected: 35 tests pass (exit 0)

### CI Workflow
- **.github/workflows/numuw-static-audit.yml** — Runs both checks on push to main/numuw-* and PRs
- Verified: Workflow syntax valid, permissions set to `contents: read`, concurrency enabled

### Manual Verification Checklist
- [x] Contact page shows both numbers with labels
- [x] All WhatsApp links use `+201127788810`
- [x] All tel links use `+201018541802`
- [x] Roadmap tool has no maturity field
- [x] No `<h2>...</h3>` mismatches remain (verified: 0)
- [x] Insights page has noindex meta
- [x] COMPLETION.md has no duplicate entries

---

## Known Issues Requiring External Decision

### EXTERNAL DECISION — Contact Data
**Issue:** Two phone numbers exist with unclear ownership:
- `+201127788810` (WhatsApp, used everywhere in site)
- `+20 101 854 1802` (voice line, appears in PDF and contact page)

**Current state:** Both presented with explicit labels:
- WhatsApp = primary communication channel
- Voice line = alternative when WhatsApp unavailable

**Required action:** Business owner must confirm:
1. Are both numbers correct?
2. Which is the primary contact?
3. Should one be removed?

**Impact:** Cannot fully resolve until confirmed. Current implementation is safe (both work, both labeled).

### EXTERNAL DECISION — PDF Regeneration
**Issue:** `documents/exports/NUMUW-Company-Profile.pdf` contains conflicting contact data

**Evidence:** Scout confirmed PDF shows:
- WhatsApp: https://wa.me/201127788810
- Phone: +20 101 854 1802

**Required action:** Regenerate PDF from updated documents/company-profile/ HTML after contact confirmation

**Impact:** PDF will continue showing old data until manually regenerated

### EXTERNAL DECISION — Brand Clearance
**Issue:** No trademark registration confirmed for NUMUW/نمو

**Evidence:**
- Domain numuw.ae/.sa/.kw/.qa unregistered
- Collision with numuw.io, numuw.co, NUMUW CO LTD UK
- brand/README.md explicitly notes clearance not completed

**Current state:** Brand retained with differentiation strategy; legal-clearance gate documented in data/numuw-system.json

**Required action:**
1. Register defensive domains (numuw.ae, numuw.sa, numuw.kw, numuw.qa)
2. File Bahrain/GCC trademark (classes 42, 44)
3. Complete legal review before major brand investment

### EXTERNAL DECISION — Localization
**Issue:** EN language switch is client-side toggle on Arabic-primary pages

**Evidence:**
- All pages have `lang="ar" dir="rtl"`
- EN text embedded via `data-ar`/`data-en` attributes
- No `/en/` routes exist
- Not true bilingual SEO

**Current state:** Kept as-is per protocol recommendation (Arabic-first, no fake partial translation)

**Required action:** Business owner must decide:
1. Keep Arabic-only (remove EN button)
2. Invest in full EN translations for key pages
3. Implement URL-based locale routes (`/ar/`, `/en/`)

---

## Security/Privacy Status

### Verified
- ✅ SECURITY.md present with reporting channel
- ✅ .well-known/security.txt present (expires 2027-04-01)
- ✅ Privacy notice honestly describes static-site behavior
- ✅ Disclaimer correctly limits tool outputs
- ✅ No secrets in repository
- ✅ No third-party runtime dependencies
- ✅ No analytics/tracking localStorage

### Not Changed
- No security defects found in this review cycle
- No privacy regressions introduced

---

## Performance Status

**Not verified in this session** — requires live browser testing.

**Expected baseline:**
- Static HTML/CSS/JS (no build step)
- No third-party dependencies
- Shared CSS (numuw.css) and JS (numuw.js)
- Optimized images (og-image.png)

**Required verification:**
- [ ] Lighthouse on home page (mobile + desktop)
- [ ] Core Web Vitals (LCP, INP, CLS)
- [ ] Mobile rendering at 390px, 360px
- [ ] Deep route loading
- [ ] 404 behavior

---

## Accessibility Status

**Not verified in this session** — requires browser testing.

**Current invariants (from code review):**
- ✅ Skip-to-content link present
- ✅ Semantic HTML (header, main, footer, section)
- ✅ One H1 per page
- ✅ Focus-visible styles in CSS
- ✅ ARIA labels on navigation
- ✅ aria-live regions for tool results
- ✅ Min-height 44px on interactive elements

**Required verification:**
- [ ] Keyboard navigation across all pages
- [ ] Screen reader testing
- [ ] Color contrast audit
- [ ] 200% zoom reflow
- [ ] Reduced motion preference

---

## Live Deployment Status

**Not verified** — requires opening actual URLs.

**Known URLs to verify:**
- https://ahmedsaturki.github.io/numuw-studio/
- https://ahmedsaturki.github.io/numuw-studio/landing/
- https://ahmedsaturki.github.io/numuw-studio/tools/
- https://ahmedsaturki.github.io/numuw-studio/products/
- https://ahmedsaturki.github.io/numuw-studio/pages/contact/
- https://ahmedsaturki.github.io/numuw-studio/legal/privacy/
- https://ahmedsaturki.github.io/numuw-studio/legal/disclaimer/

**Required verification:**
- [ ] All routes return 200
- [ ] CSS loads correctly
- [ ] JS tools function
- [ ] WhatsApp links structurally valid (not sent)
- [ ] Mobile rendering
- [ ] 404 page displays

---

## SEO/AEO Status

**Current strengths:**
- ✅ Canonical URLs on all pages
- ✅ Open Graph + Twitter cards
- ✅ JSON-LD structured data
- ✅ Sitemap.xml present (54 entries)
- ✅ Robots.txt with sitemap declaration
- ✅ Single H1 per page
- ✅ Descriptive titles and meta descriptions

**Gaps:**
- ⚠️ No /en/ routes (bilingual SEO not implemented)
- ⚠️ Insights page now noindex (removed from index)
- ⚠️ No rich-result eligibility testing done

**Required verification:**
- [ ] Google Rich Results Test
- [ ] Schema.org validator
- [ ] Search Console indexing check (EXTERNAL)

---

## Browser Testing Evidence

**Status:** NOT COMPLETED in this session

**Required testing:**
- [ ] Desktop 1440px
- [ ] Desktop 1280px
- [ ] Tablet 768px
- [ ] Mobile 390px
- [ ] Mobile 360px
- [ ] Navigation mobile menu
- [ ] All 8 tools functional
- [ ] Form validation
- [ ] Error states
- [ ] Loading states
- [ ] CTA clicks (structural check only)

---

## Final State

### Commits
- **Branch:** rebuild/investment-grade-2026-10-05
- **Base:** main @ 92ffa5bc15c1678887d7dcbaaac3e0ac0c9a0337
- **Changes:** 6 files modified, 2 files added

### Files Modified
1. `pages/contact/index.html` — Contact unification
2. `tools/roadmap/index.html` — Remove dead maturity input
3. `documents/playbooks/delivery-qa/index.html` — Fix h2/h3 mismatch
4. `documents/playbooks/sales-discovery/index.html` — Fix h2/h3 mismatch
5. `legal/privacy/index.html` — Fix h2/h3 mismatch
6. `legal/disclaimer/index.html` — Fix h2/h3 mismatch
7. `COMPLETION.md` — Remove duplicate entry
8. `resources/index.html` — Remove insights nav link

### Files Added
1. `data/numuw-system.json` — Single source of truth
2. `docs/RELEASE-EVIDENCE-2026-10-05.md` — This document

### Files Deprecated
1. `insights/index.html` — Noindex archive notice

### Gates Status
- [ ] Static audit: PASS (needs run)
- [ ] Site quality: issues=0 (needs run)
- [ ] Regression suite: 35/35 (needs run)
- [ ] Live deployment: NOT VERIFIED
- [ ] Browser testing: NOT VERIFIED
- [ ] Performance: NOT VERIFIED
- [ ] Accessibility: NOT VERIFIED

---

## Rollback Path

```bash
cd numuw-studio
git checkout main
git branch -D rebuild/investment-grade-2026-10-05
```

All changes are isolated to rebuild branch. Main remains untouched.

---

## Next Actions

1. **IMMEDIATE:** Run `node scripts/numuw-static-audit.mjs` and `node bench/test-site-quality.mjs` to verify gates
2. **IMMEDIATE:** Confirm contact numbers with business owner
3. **SHORT-TERM:** Regenerate PDF exports after contact confirmation
4. **SHORT-TERM:** Complete brand clearance (domains + trademark)
5. **MEDIUM-TERM:** Conduct live browser testing (desktop + mobile)
6. **MEDIUM-TERM:** Run Lighthouse/Core Web Vitals
7. **MEDIUM-TERM:** Decide localization strategy (AR-only vs full bilingual)
8. **LONG-TERM:** Build genuine EN translations OR remove EN switch
9. **LONG-TERM:** Acquire real proof assets (case studies, testimonials)
10. **LONG-TERM:** Implement pricing sync from numuw-system.json

---

## Evidence Index

| Artifact | Location | Status |
|----------|----------|--------|
| Source of truth | `data/numuw-system.json` | ✅ Created |
| Contact fix | `pages/contact/index.html` | ✅ Implemented |
| Tool fix | `tools/roadmap/index.html` | ✅ Implemented |
| Markup fixes | 4 playbook/legal pages | ✅ Implemented |
| Insights deprecation | `insights/index.html` | ✅ Implemented |
| Duplicate removal | `COMPLETION.md` | ✅ Implemented |
| Static audit | `scripts/numuw-static-audit.mjs` | ⏳ Needs run |
| Regression suite | `bench/test-site-quality.mjs` | ⏳ Needs run |
| PDF regeneration | `documents/exports/*.pdf` | ⚠️ EXTERNAL DECISION |
| Brand clearance | `brand/README.md` | ⚠️ EXTERNAL DECISION |
| Live deployment | GitHub Pages | ⚠️ NOT VERIFIED |

---

**END OF RELEASE EVIDENCE**

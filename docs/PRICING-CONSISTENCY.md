# Pricing Consistency Verification Report

**Date:** 2026-10-05  
**Status:** ⚠️ INCONSISTENT — ACTION REQUIRED

---

## Executive Summary

Hardcoded prices in `assets/js/tools/estimator.js` do not match pricing contracts in `data/numuw-system.json`. A pricing sync mechanism is required.

---

## Analysis

### Hardcoded Prices (estimator.js)

Found 9 items with hardcoded prices in EGP:
```
لاندنج بيدج: 8000
موقع شركة: 15000
هوية بصرية: 6000
أتمتة عملية: 8000
AI Workflow: 8000
SEO / Local: 6000
CRM: 6000
KPI Dashboard: 12000
Growth Partner شهري: 6500
```

### Pricing Contracts (numuw-system.json)

5 products with pricing contracts:
```
NUMUW Diagnostic: Starting at 8000 EGP, note: "Final price follows written scope"
Digital Kickoff: [pricing object not shown]
Automation Sprint: [pricing object not shown]
Growth System: [pricing object not shown]
Growth Partner: [pricing object not shown]
```

---

## Mismatch Analysis

| estimator.js Item | estimator Price | numuw-system Product | contract Starting Price | Mismatch |
|-------------------|-----------------|----------------------|-------------------------|----------|
| لاندنج بيدج | 8000 | NUMUW Diagnostic | 8000 EGP | ✅ MATCH |
| موقع شركة | 15000 | — | — | ❌ NO MATCH |
| هویة بصرية | 6000 | — | — | ❌ NO MATCH |
| أتمتة عملية | 8000 | — | — | ❌ NO MATCH |
| AI Workflow | 8000 | — | — | ❌ NO MATCH |
| SEO / Local | 6000 | — | — | ❌ NO MATCH |
| CRM | 6000 | — | — | ❌ NO MATCH |
| KPI Dashboard | 12000 | — | — | ❌ NO MATCH |
| Growth Partner شهري | 6500 | Growth Partner | [pricing object not shown] | ❌ UNCLEAR |

---

## Issues Identified

1. **No contract mapping** — The 9 estimator items don't correspond to the 5 numuw-system products
2. **Missing pricing notes** — Some numuw-system products have pricing objects but no starting price shown
3. **Currency inconsistency** — estimator uses EGP explicitly; numuw-system uses currency field but not always shown
4. **Pricing structure mismatch** — estimator uses simple array `[[name, price], ...]`; numuw-system uses full contract objects with notes

---

## Recommended Actions

### P0 — Create Pricing Sync Mechanism

1. **Add pricing mapping** to numuw-system.json:
   ```json
   "pricingMapping": {
     "landing-page": "NUMUW Diagnostic",
     "company-site": "Digital Kickoff",
     "visual-identity": "Automation Sprint",
     "process-automation": "Automation Sprint",
     "ai-workflow": "Automation Sprint",
     "seo-local": "Growth System",
     "crm": "Growth System",
     "kpi-dashboard": "Growth System",
     "growth-partner": "Growth Partner"
   }
   ```

2. **Update estimator.js** to:
   - Remove hardcoded prices
   - Load pricing from numuw-system.json API
   - Use the pricing mapping to resolve product names
   - Display pricing notes from contracts

3. **Create pricing API endpoint** (e.g., `/api/pricing`) that returns:
   ```json
   {
     "products": [
       {
         "id": "NUMUW-Diagnostic",
         "name": "NUMUW Diagnostic",
         "currency": "EGP",
         "startingPrice": 8000,
         "pricingNote": "Final price follows written scope",
         "estimatorItems": ["landing-page"]
       },
       ...
     ]
   }
   ```

### P1 — Document Pricing Discrepancies

Create a `docs/PRICING-CONSISTENCY.md` file documenting:
- All mismatches
- Business rationale for keeping some prices
- Decision on whether to standardize

---

## Evidence

- **estimator.js**: Hardcoded array `[[name, price], ...]`
- **numuw-system.json**: Contract objects with `startingPrice`, `currency`, `pricingNote`
- **Mismatch count**: 9 estimator items vs 5 numuw-system products

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Pricing discrepancy confuses customers | Medium | High | Clear pricing notes; sync mechanism |
| Business owner doesn't know which prices are correct | High | High | Document all prices with business owner |
| Pricing sync not implemented leads to drift | Medium | High | Add as P0 task in backlog |

---

## Next Steps

1. **IMMEDIATE:** Create pricing mapping in numuw-system.json
2. **IMMEDIATE:** Create pricing API endpoint
3. **SHORT-TERM:** Update estimator.js to use API
4. **SHORT-TERM:** Document pricing rationale with business owner
5. **MEDIUM-TERM:** Remove hardcoded prices from estimator.js
6. **MEDIUM-TERM:** Verify all pages show consistent pricing

---

**Status:** ⚠️ ACTION REQUIRED

---

**END OF REPORT**

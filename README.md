# NUMUW | نُمو — Growth Systems Studio

NUMUW is a static, GitHub Pages-compatible growth systems studio for Egyptian businesses, factories and B2B teams.

Public site:
https://ahmedsaturki.github.io/numuw-studio/

## System map

`Positioning → Acquisition → Diagnosis → Decision → Offer → Scope → Delivery → Handover → Proof → Measurement → Improvement`

This repository treats the website and its commercial/delivery library as one connected system rather than a collection of pages.

## Public surface

- Conversion-focused home
- 10 specialized landing pages + landing hub
- 8 decision / self-service tools + tools hub
- 5 productized offers + products hub
- Company Center: About, Method, Proof, Case Studies, Contact
- Business Library: profile, capability statement, service catalog, proposal, onboarding, handover, terms and operating playbooks
- Public PDF exports
- Legal & Trust Center
- Solution Finder + Brief Builder
- Brand / Media / Insights / Resources
- Security policy + security.txt

## Architecture

The site is intentionally build-free.

- `index.html` — primary commercial entry point
- `landing/` — audience-specific acquisition
- `tools/` — browser-only decision support
- `products/` — scoped commercial offers
- `pages/` — company, proof and contact
- `documents/` — sales and delivery operations
- `legal/` — privacy and disclaimer
- `assets/css/numuw.css` — shared visual/component primitives
- `assets/css/home.css` — homepage composition only
- `assets/js/numuw.js` — shared interaction/localization/measurement/document controls
- `docs/SITE-MANIFEST.json` — route-level source of truth
- `docs/MASTER-SYSTEM.md` — whole-system operating model
- `docs/DESIGN-SYSTEM.md` — visual and interaction contract
- `docs/REFERENCE-BENCHMARKS.md` — external patterns studied and lessons extracted
- `scripts/numuw-static-audit.mjs` — release source audit
- `.github/workflows/numuw-static-audit.yml` — CI gate
- `bench/site-quality.mjs` — deterministic regression/quality harness
- `bench/test-site-quality.mjs` — harness regression tests

## Quality gate

Run:

```bash
node scripts/numuw-static-audit.mjs
node bench/test-site-quality.mjs
```

The release audit checks structure, metadata, JSON-LD syntax, canonical/sitemap consistency, links, accessibility invariants, image alt attributes, 404 behavior, security.txt, no-third-party runtime dependencies, color contrast and route-manifest coverage.

The benchmark harness separately covers R1–R17 and protects the meaning of its objective.

## Route contract

Every indexable route has a job, audience, primary action and next step recorded in `docs/SITE-MANIFEST.json`.

A new page must add distinct user value. Search-only duplication is not an acceptable reason to create a route.

## Commercial contract

Products and business documents form one lifecycle:

`Discovery → Proposal → Agreement → Access → Build → Acceptance → Handover`

Scope, exclusions, change control, milestones, ownership and acceptance are explicit.

## Content / proof policy

Never invent testimonials, logos, awards, rankings, revenue, ROI or guaranteed search rankings.

Real evidence should identify source, scope, dates and context.

## Performance / privacy

The default architecture has no third-party runtime dependency and no analytics vendor. Measurement hooks are inert until a documented consumer exists.

See:
- `docs/PERFORMANCE-BUDGET.md`
- `docs/MEASUREMENT-SPEC.md`
- `docs/MASTER-SYSTEM.md`

## Production boundary

Repository checks and successful GitHub Pages builds do not prove browser UX, field Core Web Vitals, external CTA behavior, Search Console indexing or formal legal approval.

Those remain explicit live-release gates in `docs/QA.md`.

## Ownership

The repository is public, but no open-source reuse license is granted by default. Brand, commercial content and visual assets remain the property of their respective owners unless separately licensed.

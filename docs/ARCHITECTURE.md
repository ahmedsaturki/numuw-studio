# NUMUW Architecture

## System layers

Brand → Acquisition → Diagnosis → Fit → Product → Scope → Delivery → Handover → Improvement

`index.html` is the commercial entry point. `landing/` is acquisition. `tools/` is decision support. `products/` is commercial packaging. `documents/` is sales/delivery operations. `pages/` is company/proof. `legal/` is trust/privacy.

## Root

Homepage-specific CSS and behavior live in `assets/css/home.css` and `assets/js/home.js`.

## Landing system

Every capability/vertical route must carry a distinct problem model, evidence expectation, scope logic and next action.

## Tools

All eight tools use `assets/js/tools.js` so DOM safety, validation, interaction state and CTA construction are not duplicated across pages.

## Products

All product routes use consistent fit, scope, price language, acceptance and handover principles.

## Business Library

HTML is the editable source. Public PDFs are release copies and must be reviewed when commercial facts change.

## Canonical documentation

- `docs/MASTER-SYSTEM.md` — master product, architecture, design, conversion and release rules.
- `docs/SITE-INVENTORY.md` — route-level source of truth.
- `docs/COMMERCIAL-SOURCE-OF-TRUTH.md` — products, prices, brand and claims.
- `docs/OPERATING-CADENCE.md` — recurring maintenance and publishing cadence.

## Quality layers

Production release gate: `scripts/numuw-static-audit.mjs`.
Research benchmark: `bench/site-quality.mjs`.
Regression suite: `bench/test-site-quality.mjs`.
Canonical command: `node scripts/release-gate.mjs`.

Research metrics are not live-production proof.

## Deployment

GitHub Pages serves the static tree. Repository checks can prove source state and deployment-job status; live UX, field performance, external CTA behavior, indexing and formal legal approval require direct verification.
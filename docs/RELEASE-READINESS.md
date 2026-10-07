# NUMUW Release Readiness

## Status

**Technical baseline: GREEN. Commercial/live release: HOLD pending external evidence.**

The current `main` baseline contains the verified system-foundation hardening pass. This document intentionally separates repository evidence from gates that require real-world validation.

## Engineering state

NUMUW remains a static/no-build site with a shared shell, local assets and deterministic source-level QA.

## Internal gates verified before merge

- Static audit
- System consistency audit
- R1–R18 scanner regression suite
- Benchmark quality floor
- Product/tool/system contract checks
- Contact normalization against the structured source of truth
- Roadmap maturity behavior
- Estimator system-source pricing
- Explicit localization contract
- Proof-acquisition policy contract

## Implemented in this hardening pass

- explicit tool-page/form instrumentation contracts
- navigation accessibility label localization
- roadmap maturity input now affects the generated sequence
- estimator pricing moved to a structured system source-of-truth
- contact references normalized to the current primary public number used by the site
- fit-conversation CTAs no longer send visitors to the self-assessment Diagnostic route
- measurement documentation aligned with the implemented `cta` event name
- duplicate-attribute detection hardened against quoted `>` and opaque content in the source audit
- product/tool/system contracts extended in the consistency audit

## External release gates — still open

1. **Brand/name clearance — HOLD.** See `docs/BRAND-NAME-CLEARANCE.md`.
2. **Live browser/mobile UX — OPEN.** Needs real deployed-page inspection at desktop and mobile widths.
3. **CTA verification — OPEN.** Confirm WhatsApp and direct phone behavior on the live deployment.
4. **Performance — OPEN.** Capture Lighthouse and/or field Core Web Vitals evidence.
5. **Search/Rich Results — OPEN.** Validate deployed structured data and indexing state.
6. **Commercial approval — OPEN.** Confirm final prices, scope boundaries and payment terms before external selling.
7. **Customer proof — OPEN by design.** No public case claim should ship without a sourceable result and publication permission.

## Rule

Repository/CI green status is not equivalent to commercial, legal or live-production approval. Each external gate needs its own evidence before it is marked complete.

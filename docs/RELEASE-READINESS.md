# NUMUW Release Readiness

## Engineering state

NUMUW remains a static/no-build site with a shared shell, local assets and deterministic source-level QA.

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

## External release gates

- formal legal/name clearance
- live browser and mobile UX verification
- real WhatsApp and phone verification
- Lighthouse and/or field Core Web Vitals evidence
- Search Console/indexing and Rich Results validation
- final commercial pricing and scope approval
- permissioned, sourceable customer proof before publishing case-study claims

## Rule

Repository/CI green status is not equivalent to commercial, legal or live-production approval. Each external gate needs its own evidence before it is marked complete.

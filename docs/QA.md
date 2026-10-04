# NUMUW QA Protocol

## Gate A — route/system integrity

- Every indexable HTML route exists in `docs/SITE-MANIFEST.json`.
- Every manifest entry has family, purpose, audience, primary action and next step.
- No orphan manifest routes.
- New pages must add distinct user value.

## Gate B — static structure

Run:

`node scripts/numuw-static-audit.mjs`

Checks include:
- HTML5 structure
- title / description / H1
- language direction
- canonical / OG / Twitter metadata
- JSON-LD syntax
- main landmark
- local link and asset resolution
- no javascript URLs
- external blank-link hardening
- image alt attributes
- 404 noindex
- sitemap/robots integrity
- security.txt contract
- no third-party script/style dependency
- brand contrast
- no inline HTML event handlers
- route-manifest coverage

## Gate C — regression harness

Run:

`node bench/test-site-quality.mjs`

This protects the deterministic R1–R17 experiment rules from silently losing their detection ability.

## Gate D — commercial/content

Before shipping:
- one primary action is obvious
- diagnosis/fit precedes uncertain scope
- price is a reference or explicit written scope
- claims are evidence-backed
- product fit/non-fit is clear
- tools explain limitations
- proof is real and contextual
- no page exists only for keyword coverage

## Gate E — delivery/commercial documents

Confirm:
- scope and exclusions
- change control
- milestones/payment terms
- responsibilities/dependencies
- ownership/licensing
- acceptance criteria
- support boundaries
- secure credential handling
- handover and sign-off

## Gate F — live production

Must be verified separately:
- deployed URL serves the intended release commit
- browser/mobile UX
- keyboard/focus behavior on deployed pages
- Lighthouse / Core Web Vitals
- WhatsApp / phone CTAs
- structured-data validation against deployed URLs
- Search Console sitemap/indexing

Do not close Gate F using source inspection alone.

## Gate G — legal

Legal Center is operational disclosure, not final legal advice. Formal legal review is required before treating terms/privacy/disclaimer language as final contractual or regulatory policy.

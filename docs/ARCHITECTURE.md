# NUMUW Architecture

NUMUW is one decision-and-delivery system with a shared design/runtime foundation and one canonical commercial ladder.

## System flow

Entry → Problem context → Self-assessment → Product fit → Trust → Conversation → Scope → Delivery → Handover → Improvement

No public page should create a disconnected funnel without a deliberate business reason.

## Global runtime

Standard pages use:
- assets/css/numuw.css
- assets/js/numuw.js
- shared navigation semantics
- shared accessibility behavior
- shared measurement hooks

The homepage keeps assets/css/home.css for homepage-specific presentation. Shared navigation, localization, printing, measurement and interaction behavior come from assets/js/numuw.js, so there is no second global behavior runtime.

Trusted bilingual strings may contain inline emphasis. The shared localization runtime must preserve that markup.

## Acquisition

landing/ contains service and industry pages. Each must have:
- a defined audience
- a materially specific business problem
- a clear promise
- useful evidence/context
- one primary next action
- a route into the canonical tools/products system

Industry pages should speak the buyer's actual workflow, terminology and proof requirements, not merely replace one keyword.

## Tools

tools/ contains browser-only decision tools. Each tool must state:
- what it asks
- assumptions and units
- what it can and cannot determine
- edge-case behavior
- result meaning
- next action
- whether any data leaves the browser

## Products

products/ is the single commercial offer catalog.

Canonical ladder:

Diagnostic → Digital Kickoff → Automation Sprint → Growth System → Growth Partner

The product hub, homepage pricing, Solution Finder and sales documents must remain synchronized through docs/PRODUCT-MATRIX.md.

## Delivery

documents/ connects marketing to execution:
Profile → Capability → Service Catalog → Proposal → Terms → Onboarding → Playbooks → Handover

Delivery chain:

Discovery → Scope → Proposal → Approval → Onboarding → Build → QA → Acceptance → Handover

## Trust / legal / security

pages/proof/, pages/case-studies/, legal/, SECURITY.md and .well-known/security.txt define the evidence and disclosure boundaries.

Never invent proof, performance figures, customer logos, awards, rankings or guarantees.

## Quality system

scripts/numuw-static-audit.mjs is the release gate.
scripts/test-numuw-static-audit.mjs protects the release gate itself.
bench/site-quality.mjs and bench/test-site-quality.mjs are a separate deterministic research harness.

The research harness is not a substitute for browser QA, production monitoring or human review.

## Source-of-truth hierarchy

When information conflicts:

Signed scope / actual business record
→ Product Matrix
→ Product page
→ Landing / homepage copy
→ Generic marketing language

Public marketing copy must never override an actual commercial commitment.

## Change discipline

A change to product name, price, scope, CTA or audience is a cross-system change. Review and update:
- Product Matrix
- product page
- homepage
- relevant landing(s)
- Solution Finder / tools
- sales documents
- sitemap when routes change
- QA expectations

A visual-only change should still be checked against the shared design tokens and accessibility contract.

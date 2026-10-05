# NUMUW QA Protocol

## Static release gate

Every public HTML route must pass:

`node scripts/numuw-static-audit.mjs`

The gate validates document structure, metadata semantics, JSON-LD, canonical/sitemap alignment, local references, image alt attributes, safe external links, no-third-party runtime dependencies, security.txt, theme contrast and the absence of inline event handlers.

It also detects:
- mismatched or unclosed heading tags
- empty required Open Graph / Twitter metadata
- unknown meta attributes
- unexpected tag names or stray text inside head
- suspicious metadata corruption tokens

The release-audit regression suite is:

`node scripts/test-numuw-static-audit.mjs`

It intentionally builds bad fixtures and verifies the hardening rules remain effective.

## Commercial QA gate

Before releasing or changing a product page:
- product name and reference price match docs/PRODUCT-MATRIX.md
- audience and non-fit conditions are explicit
- deliverables and exclusions are explicit
- dependencies / client responsibilities are explicit
- acceptance criteria are explicit
- ownership/licensing and support boundaries are explicit
- CTA routes to the intended next action

The homepage, product hub, product pages and routing tools must describe the same five-product ladder.

## Landing-page QA

Every landing page must have:
- one real audience
- one specific problem
- one meaningful promise
- distinct evidence or useful context
- one primary next action
- a route into the canonical product/tool system

Changing only a keyword or industry name is not sufficient.

## Tool QA

Every calculator or decision tool must define:
- input units and assumptions
- valid ranges and zero/empty behavior
- clear result meaning
- explicit limitations
- useful next action
- no hidden server-side collection

## Delivery QA

Before acceptance:
- scope matches the signed proposal
- critical user paths work
- edge/error states are checked
- content matches approved source
- accounts / ownership are transferred as agreed
- secrets are not stored in project files
- documentation exists
- acceptance evidence is recorded

## Live release gate

Still external to source-only verification:
- real browser and mobile UX
- keyboard / screen-reader review
- Lighthouse and field Core Web Vitals
- live WhatsApp / phone behavior
- Rich Results validation
- Search Console sitemap/indexing
- formal legal review

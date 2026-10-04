# NUMUW Architecture

## Product model

NUMUW is a growth-systems studio rather than a collection of disconnected services. The public experience is organized around one decision chain:

`Problem → Diagnosis → Priority → Product → Delivery → Handover → Measurement`

Every new page, tool, product or document must strengthen that chain or provide a distinct user value.

## Information architecture

- `index.html` — primary commercial entry point and system overview.
- `landing/` — audience and service acquisition routes.
- `tools/` — browser-side decision tools.
- `products/` — bounded commercial offers.
- `pages/` — company, method, proof, case studies and contact.
- `documents/` — sales, commercial and delivery library.
- `legal/` — privacy and disclaimer.
- `brand/` + `media-kit/` — identity and external-use references.
- `assets/css/numuw.css` — single shared visual system.
- `assets/js/numuw.js` — single shared interaction layer.

## Design-system rule

The public site uses one visual language: shared design tokens, typography, controls, cards, panels, spacing, focus treatment and responsive behavior. Page-specific styling is allowed only when it creates a genuine component need and must live in the shared design system rather than inline HTML.

Do not introduce:
- a second homepage CSS/JS stack
- one-off inline visual rules
- cloned navigation systems with different semantics
- duplicate sections that describe the same destination differently

The homepage intentionally uses the same `numuw.css` and `numuw.js` contract as every other public route.

## Landing system

Each landing route must have:
- one identifiable audience or buying context
- one primary problem
- one distinct promise
- relevant objections / fit guidance
- clear next action
- meaningful information beyond keyword variation

Do not add pages only to capture search phrases.

## Tools

`tools/` contains browser-only decision aids with no external API dependency in the public code.

Each tool must state:
- the question it answers
- what inputs it uses
- what the result means
- what it does not measure
- the next decision/action

Runtime-generated links remain a separate validation surface from literal static links.

## Products

`products/` contains productized offers. Every product should make audience, scope, deliverables, exclusions, acceptance, ownership, dependencies, support and next step clear.

## Business Library

`documents/` covers the commercial and operational handoff:
- profile / capabilities
- service catalog
- proposal and terms
- onboarding
- delivery / QA
- handover
- playbooks

HTML is the editing/source format. PDF is a publication/export format and must be refreshed when source facts change.

## Proof and claims

Proof must be real, attributable and contextual. Never manufacture testimonials, logos, awards, rankings, revenue, ROI or guarantees.

## Measurement

`docs/MEASUREMENT-SPEC.md` defines the privacy-aware funnel. Client-side events describe user intent only; qualified leads, proposals and revenue remain business records.

## Release

Static correctness is enforced by `scripts/numuw-static-audit.mjs` and GitHub Actions. Live browser/mobile QA, Lighthouse/Core Web Vitals, external CTA behavior, Search Console and legal approval remain deployment-level gates and must never be inferred from source inspection alone.

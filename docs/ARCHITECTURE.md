# NUMUW Architecture

## System model

NUMUW is a connected operating system for growth work:

`Positioning → Acquisition → Diagnosis → Decision → Offer → Scope → Delivery → Handover → Proof → Measurement → Improvement`

## Route architecture

`docs/SITE-MANIFEST.json` is the route-level source of truth.

- `/` — primary acquisition and orientation
- `/landing/` — audience/service acquisition
- `/tools/` — decision support and routing
- `/products/` — commercial offers
- `/documents/` — sales and delivery enablement
- `/pages/` — company context, proof and contact
- `/legal/` — trust and usage boundaries
- `/brand/`, `/media-kit/`, `/insights/`, `/resources/` — supporting brand/content surfaces

Every indexable route must have one job, one audience, one primary action and one next step.

## Frontend architecture

The site is intentionally build-free.

### Shared layer
`assets/css/numuw.css` owns the reusable visual primitives:
- design tokens
- navigation
- buttons
- panels
- cards
- forms
- responsive shell
- focus and reduced-motion behavior

`assets/js/numuw.js` owns shared interaction:
- localization
- navigation/menu behavior
- focus handoff
- outbound-link hardening
- inert conversion events
- document printing
- year rendering

### Homepage layer

`assets/css/home.css` is composition-only. It may arrange and style homepage-specific sections, but it must reuse the shared component layer.

The homepage no longer has a separate interaction stack. The old `home.js` duplicate layer has been removed.

## Commercial architecture

Products and operating documents align to:

`Discovery → Proposal → Agreement → Access → Build → Acceptance → Handover`

Product pages must describe:
- fit
- non-fit
- scope
- deliverables
- exclusions
- dependencies
- timeline
- investment
- ownership
- acceptance
- support
- next action

## Delivery architecture

Code is not “done” until:

`Built + Tested + Content Reviewed + Accessibility Checked + Ownership Recorded + Documented + Accepted`

## Trust architecture

Proof must be evidence-based. Legal and security boundaries are explicit.

## Measurement architecture

Browser events describe intent only. They are not the source of truth for lead qualification, opportunities or revenue.

## Scaling rules

A new public route must:
1. add distinct user value
2. be added to `docs/SITE-MANIFEST.json`
3. use shared CSS/JS primitives
4. include canonical/description/social metadata
5. include valid structured data when justified
6. be added to the sitemap
7. pass the release audit
8. define its relationship to existing routes

## Performance

Third-party runtime dependencies are opt-in and require a documented business reason, privacy review and performance review.

## Research basis

External benchmarks and their lessons are documented in `docs/REFERENCE-BENCHMARKS.md`.

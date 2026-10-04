# NUMUW System Contract

## Purpose

This document is the single source of truth for the public NUMUW growth-system architecture. A page, tool, product, document or design change is not considered complete when it works in isolation; it must remain consistent with this contract.

## 1. Brand

Canonical brand:
- Display: `NUMUW | نُمو`
- Positioning: Growth Systems Studio
- Primary market language: Arabic, with English where the page is genuinely localized
- Geographic positioning: Egypt
- Core promise: diagnose the business bottleneck, choose the smallest sensible intervention, build it, prove what changed, and hand over the assets.

Do not introduce a second brand name, obsolete positioning, fabricated credentials or unverified performance claims.

## 2. Capability model

Capabilities are what NUMUW can build:
1. Positioning / Brand / Digital Presence
2. Automation / AI-assisted workflows
3. CRM / Measurement / Business Intelligence
4. Marketing / CRO / Continuous Growth

Capabilities are not products and must not be presented as interchangeable purchase tiers.

## 3. Product ladder

Products are how a client buys work:
1. **NUMUW Diagnostic** — uncertainty / distributed bottleneck
2. **Digital Kickoff** — focused digital foundation
3. **Automation Sprint** — one clear repeatable workflow
4. **Growth System** — multiple connected layers
5. **Growth Partner** — recurring optimization and operation

Canonical reference prices currently used by the public system:
- Digital Kickoff: from **8,000 EGP**
- Automation Sprint: from **8,000 EGP**
- Growth System: from **24,900 EGP**
- Growth Partner: from **6,500 EGP / month**
- Diagnostic: scoped; do not invent a public fixed price without an approved commercial decision.

The homepage, estimator and product pages must use the same reference values. A scope document remains the final authority.

## 4. Decision-tool role

Tools reduce uncertainty; they do not replace diagnosis or create a contract.

- Diagnostic → identifies likely gaps.
- Automation Finder → models repetitive-work scenarios.
- ROI Scenario → models hypothetical economics.
- Project Estimator → assembles reference components.
- 90-Day Roadmap → creates a first-pass sequence.
- Website Readiness → self-audit only.
- Solution Finder → routes users to the most sensible product/next step.
- Brief Builder → creates a human-reviewed conversation brief.

Tool output must state assumptions where they materially affect interpretation and route to a human/verifiable next step.

## 5. Audience / acquisition routes

Specialized acquisition pages:
- Website / conversion
- Automation
- Practical AI
- SEO / local visibility
- Brand / positioning
- Growth Partner
- Manufacturing
- B2B
- Real estate
- E-commerce

Industry pages must contain sector-specific buying/operating context, not merely a changed headline.

## 6. Site architecture

Primary public IA:
`Home → Solutions → Tools → Products → Company → Resources → Contact`

Secondary trust path:
`Company / Resources → Trust & Legal`

Required public hubs:
- `landing/`
- `tools/`
- `products/`
- `pages/`
- `documents/`
- `resources/`

`/landing/` is the legacy-compatible route for the Solutions hub; do not create a competing second Solutions hierarchy without an explicit migration plan.

## 7. Route contract

Every non-404 public HTML page:
- has one H1
- has one canonical URL
- has one meta description
- has valid JSON-LD
- uses the shared design system
- exposes the canonical site navigation
- preserves a meaningful no-surprises next step
- does not depend on a hidden server or paid API for its primary purpose

Internal pages use:
- `assets/css/numuw.css`
- `assets/js/numuw.js`

The homepage additionally uses:
- `assets/css/home.css`
- `assets/js/home.js`

The homepage is allowed a specialized visual composition, but it must use the canonical design tokens and IA.

## 8. Navigation / breadcrumb contract

Canonical navigation labels:
- الرئيسية / Home
- الحلول / Solutions
- الأدوات / Tools
- المنتجات / Products
- الشركة / Company
- المصادر / Resources
- التواصل / Contact

Breadcrumbs are a user-oriented hierarchy, not a blind copy of the URL. Google recommends representing a typical user path and allows the current page to be included or omitted. citeturn104579search7

Runtime JavaScript may enhance navigation and breadcrumbs, but it must not become the only representation of the site's information architecture without an explicit accessibility review.

## 9. Design contract

Canonical tokens live in `assets/css/numuw.css`:
- navy `#081321`
- navy2 `#10243d`
- teal `#08766e`
- teal2 `#21c6b6`
- gold `#d9a441`
- bg `#f5f7fa`
- paper `#ffffff`
- ink `#122033`
- muted `#5f7084`
- line `#dfe6ee`
- soft `#e8f7f5`
- max width `1160px`

Do not create a competing palette unless it is intentionally promoted into this contract.

## 10. Proof contract

Evidence hierarchy:
`Shipped → Observed → Measured → Approved Case`

Never invent:
- client logos
- testimonials
- awards
- rankings
- revenue
- ROI
- conversion lifts
- savings
- guarantees

A published case must show context, baseline, intervention, evidence, result, attribution limits and learning.

## 11. Commercial contract

Every product engagement should make clear:
- fit / non-fit
- trigger / problem
- inputs and dependencies
- deliverables
- exclusions
- timeline
- investment logic
- acceptance criteria
- ownership / licensing
- support window
- change-control rule
- next step

The signed proposal/scope/contract is the commercial source of truth.

## 12. Data / privacy contract

Public tools are browser-only unless explicitly changed through a reviewed architecture decision.

Do not collect or emit:
- phone numbers
- names
- emails
- message text
- free-form form values
- financial assumptions

through analytics events.

Client credentials must stay in client-owned accounts and controlled transfer methods, never in public source or ordinary chat/project files.

## 13. Content contract

NUMUW content should primarily help a real reader make a better decision. Google recommends people-first content with original value, first-hand expertise, clear authorship/context and a satisfying answer to the user's purpose. citeturn104579search1turn104579search2

A new page requires a distinct decision value. Page count is never, by itself, a reason to create another route.

## 14. Release contract

Repository proof:
- static audit passes
- Pages deployment succeeds
- no broken internal references
- metadata and schema contracts pass
- security disclosure files exist
- canonical content contracts remain aligned

External production proof:
- live browser/mobile UX
- Lighthouse / field Core Web Vitals
- real CTA verification
- Rich Results validation
- Search Console indexing
- formal legal review

Never mark an external gate complete from source inspection alone.

## 15. Change protocol

Before merging any public change:
1. Identify the affected contract.
2. Update the relevant source and documentation.
3. Run the static release audit.
4. Check cross-page consistency.
5. Check the commercial/SEO/accessibility impact.
6. Verify the exact deployment commit when the change reaches production.

A change that improves one page while making another page inconsistent is not a completed change.

# NUMUW Master System Specification

## 1. Product definition

NUMUW | نُمو is a growth systems studio for Egyptian businesses. It is not a generic agency directory and it is not a software catalog.

> Find the highest-value business bottleneck, design the smallest sensible system around it, build and test it, transfer ownership, then improve from evidence.

The site must make that promise legible from first visit through proposal, delivery and handover.

## 2. Audience hierarchy

### Primary ICP
Egyptian B2B and industrial businesses where growth is constrained by unclear positioning, weak digital presence, inconsistent lead capture / qualification / follow-up, repetitive operational work, or fragmented reporting.

### Secondary verticals
Real estate and e-commerce remain specialist acquisition routes, not competing identities for the master brand.

### Capability routes
1. Positioning & Brand
2. Conversion Websites
3. Search & Local Visibility
4. Automation & Practical AI
5. Measurement & Growth Operations

Do not expand the service list merely to create more URLs.

## 3. Offer architecture

### Diagnostic
Decision product. Converts uncertainty into a prioritized problem list and recommended next step.

### Digital Kickoff
Foundation product for offer, presence, measurement basics and ownership.

### Automation Sprint
One workflow, mapped, built, tested and handed over.

### Growth System
A connected multi-layer engagement where website/presence, automation and measurement need to work as one system.

### Growth Partner
Ongoing optimization for teams that already have a foundation and need recurring decisions, testing and implementation.

Every product page must answer: who it is for, what problem it solves, what is included, what is excluded, client responsibilities, acceptance point, handover, aftercare, starting investment and next action.

## 4. Site architecture

`/` = commercial entry point.

`/landing/` = acquisition routes. Every route has a distinct audience or problem.

`/tools/` = self-service decision layer. Tools are helpers, not diagnosis substitutes.

`/products/` = productized commercial offers.

`/pages/` = company, method, proof, cases and contact.

`/documents/` = sales and delivery operating library.

`/legal/` = privacy and usage boundaries.

`/brand/`, `/media-kit/`, `/insights/`, `/resources/` = supporting systems, not extra sales identities.

`/404.html` = recovery route, not an indexable page.

## 5. Conversion architecture

Discovery → Problem Recognition → Self-Assessment → Solution Fit → Trust → Commercial Scope → Delivery → Handover → Improvement

Do not force every visitor through one funnel:
- uncertain problem → Diagnostic
- clear presence problem → Website / Digital Kickoff
- clear repetitive workflow → Automation Sprint
- multi-layer system problem → Growth System
- ongoing optimization need → Growth Partner
- industry-specific intent → specialist landing → relevant product/tool

Every decision tool must provide a next action related to its output.

## 6. Page contract

Every indexable page must have:
- one audience
- one primary job
- one canonical URL
- one primary H1
- useful original content
- one dominant next action
- accurate metadata
- valid structured data representing visible content
- clear internal links to the next logical route
- no fabricated proof

A route should be removed or merged when it cannot provide enough distinct value.

Google's people-first guidance explicitly warns against producing lots of content across many topics mainly to attract search traffic without sufficient value. See https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## 7. Landing-page differentiation rules

### Website
Focus on message, information architecture, UX, proof, speed, conversion and ownership.

### Automation
Focus on process mapping, repetition, exception handling, testing and handover.

### AI
Focus on practical use cases, evaluation, human-in-the-loop controls, data boundaries and measurable work removal.

### SEO / Local
Focus on discoverability architecture, useful content, local business information, technical foundations and measurement. Never promise rankings.

### Brand
Focus on positioning, verbal identity, visual identity, design system and application across digital touchpoints.

### Growth Partner
Focus on recurring prioritization, experiments, implementation cadence, reporting and decisions.

### Manufacturing
Focus on technical product information, RFQs, distributor/dealer flows, quotation processes, lead routing and operational follow-up.

### B2B
Focus on multi-stakeholder buying, trust, proof, qualification, long sales cycles and pipeline visibility.

### Real Estate
Focus on project/unit information, lead response, qualification, pipeline status and follow-up. Never imply investment returns.

### E-commerce
Focus on merchandising, product pages, conversion UX, checkout friction, retention, measurement and unit economics.

## 8. Proof system

Until real evidence exists, do not invent logos, testimonials, awards, performance numbers or completed client cases.

A real case study must capture:
`Context → Baseline → Problem → Intervention → What changed → Evidence → Result → Limits → Lessons`

Case-study volume is less important than evidence quality.

## 9. Design system

Visual hierarchy: deep navy for structure, restrained teal for action, gold for selective emphasis, light surfaces for readability, local system fonts, generous spacing and consistent cards/components.

Rules:
- no emoji as the primary visual language of commercial cards
- no ad-hoc inline colors
- no arbitrary spacing where a shared component/utility exists
- consistent hover, active, disabled and focus states
- focused controls remain visible and unobscured
- practical touch target sizing

WCAG 2.2 includes Focus Not Obscured, Focus Appearance and Target Size requirements. See https://www.w3.org/WAI/standards-guidelines/wcag/new-in-22/

## 10. Tool system

Every tool follows the same contract:
`Inputs → Assumptions → Calculation/Logic → Result → Limitations → Next Action`

Tools must validate numeric bounds, explain units, distinguish estimates from evidence, keep private input local unless explicit storage exists, collect minimal personal data, announce results to assistive technology and avoid unsafe HTML sinks.

OWASP recommends avoiding innerHTML for untrusted data and constructing DOM safely. See https://cheatsheetseries.owasp.org/cheatsheets/JavaScript_and_TypeScript_Security_Cheat_Sheet.html

## 11. Commercial document system

The business library is part of the product, not an afterthought.

Website and commercial documents must agree on service/product names, pricing language, scope, ownership, change control, acceptance and support boundaries.

The signed proposal / agreement is the commercial source of truth.

## 12. Legal and privacy boundary

Current legal pages are operational disclosures, not a declaration of full legal compliance.

Before adding forms, analytics, pixels, CRM capture, payments, accounts, newsletters or other data systems: define purpose, data collected, retention, processors, rights/consent requirements, privacy copy and performance impact.

## 13. Security boundary

- no secrets in source
- no credentials in project files
- no untrusted HTML sinks
- minimal third-party runtime
- clear vulnerability reporting path
- client-owned accounts whenever practical
- temporary access must be removed or rotated after use

## 14. Quality architecture

Release gate: scripts/numuw-static-audit.mjs. This proves repository invariants.

Research benchmark: bench/site-quality.mjs. This optimizes an experimental metric and is not production proof.

Both layers must use the same route model and base path, and documentation must clearly label them.

## 15. Production release gate

Repository: source audit, regression suite, sitemap, robots, stale/private reference scan, security policy and documentation alignment.

Browser: desktop/mobile, keyboard-only flow, tools, errors, CTA destinations and 404 recovery.

Performance: Lighthouse/PageSpeed and LCP <= 2.5s, INP <= 200ms, CLS <= 0.1, considered separately for mobile and desktop.

Search: Rich Results, sitemap submission, indexing/canonical inspection and thin/duplicate review.

Business: live contact actions verified and proposal/terms aligned to actual offers.

## 16. Change control

Classify each future change as Bug, UX/accessibility, Content/positioning, SEO, Commercial, Security/privacy, Performance or Research.

Every change description states what changed, why, affected routes, test evidence and remaining unverified items.

## 17. External benchmark learnings

Clay demonstrates a capability architecture spanning brand, digital products, websites, content and development, supported by a substantial case-study system. https://clay.global/work

Ramotion documents a staged process with research, client synchronization, competitive analysis, positioning, deliverables and handoff. https://www.ramotion.com/process/

Refine Labs productizes the diagnostic/assessment step and combines transparent starting pricing with fit criteria and outcome-oriented case studies. https://www.refinelabs.com/pricing

These patterns are references for principles, not templates to copy.
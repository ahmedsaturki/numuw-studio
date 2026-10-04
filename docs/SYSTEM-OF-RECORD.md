# NUMUW System of Record

Status: active architecture contract
Date: 2026-10-04

## 1. Product identity
NUMUW | نُمو is a Growth Systems Studio.
The public proposition is: diagnose the bottleneck, choose the smallest sensible intervention, build an owned asset or system, prove what changed, then improve from evidence.

## 2. Audience architecture
- Egyptian B2B companies
- factories and industrial businesses
- real-estate businesses
- e-commerce businesses
- other established businesses with a real commercial or operational bottleneck

## 3. Buyer journey
Entry -> problem recognition -> self-assessment -> solution fit -> product/scope -> trust -> conversation -> discovery -> proposal -> delivery -> handover -> measurement.

Primary routing rules:
- unclear problem -> Growth Diagnostic
- clear digital presence problem -> Website / Digital Kickoff
- clear repeatable workflow -> Automation Sprint
- multi-layer connected need -> Growth System
- ongoing optimization -> Growth Partner
- unsure where to start -> Solution Finder
- ready to describe the situation -> Brief Builder

## 4. Information architecture
- landing = acquisition and audience routes
- tools = decision and self-assessment
- products = productized offers
- pages = company, proof and contact
- documents = sales and delivery library
- legal = privacy, disclaimer and trust boundary
- brand / media-kit / insights / resources = support surfaces

## 5. Page contract
Every indexable page should have one job, one primary intent, useful main content, a clear next step, correct metadata, relevant structured data, correct language and direction, accessible navigation, working internal references and factual proof.
A new page is justified only when it adds distinct decision value.

## 6. Design contract
Use the existing NUMUW navy/teal/gold/neutrals, typography hierarchy, spacing and component language.
Do not introduce a new button family, card language, color token, navigation pattern or spacing scale without a documented reason.
Specialized pages may compose the system differently, but should not create a separate visual language.

## 7. Conversion contract
Primary CTA: start diagnosis or a qualified conversation.
Secondary CTA: inspect a tool, product, proof, method or pricing.
Every route should lead to a sensible next stage instead of ending in a dead end.

## 8. Proof contract
Never invent client logos, testimonials, awards, rankings, revenue, ROI, guaranteed leads, guaranteed rankings or guaranteed outcomes.
Preferred real case-study structure: Context -> Problem -> Baseline -> Intervention -> Evidence -> Result -> Lesson.

## 9. Tool contract
Every tool must state what question it answers, what inputs it uses, what it returns, what it does not know, whether it is a scenario or a measured result, and what decision should follow.
Browser-only tools must not silently send user input to a server.

## 10. Product contract
Every product defines target buyer, trigger, fit, non-fit, scope, deliverables, client responsibilities, dependencies, acceptance, ownership, support boundary and next step.
Public pricing is a starting reference unless the final scope says otherwise.

## 11. Commercial operations
Written scope, exclusions, change control, payment milestones, client responsibilities, acceptance, ownership, secure credential handling and handover verification are first-class deliverables.
Secrets never belong in public source files, documents or chat transcripts.

## 12. Legal and privacy
The public Legal Center is operational guidance, not professional legal advice.
Adding analytics, pixels, forms, payments, accounts, newsletters, CRM synchronization or third-party embeds triggers review of privacy copy, data handling, performance and measurement.

## 13. Measurement
Current client-side intent events are limited to CTA-style events and future tool lifecycle events.
Do not record message text, names, emails, phone numbers, free-form answers or financial inputs.
A browser event is not a lead, qualified opportunity or sale.

## 14. Performance
Targets: LCP <= 2.5s, INP <= 200ms, CLS <= 0.1.
Use 75th-percentile field data segmented by mobile and desktop for the production decision.

## 15. SEO and language
Use people-first content, descriptive metadata, canonical URLs, valid structured data, sitemap coverage and meaningful internal links.
Do not create large volumes of low-value pages simply for search coverage.
The current language switch is a usability feature. A true indexable English edition should use separate crawlable URLs and reciprocal hreflang.

## 16. Release
Repository gate: source audit, content/logic review, regression review and CI success.
Deployment gate: Pages deployment succeeds from the intended main commit.
Live gate: browser/mobile UX, interaction tests, Lighthouse/Core Web Vitals, external CTA behavior, structured-data validation and indexing checks.
Business gate: factual commercial copy, matching proposal/terms, ownership boundaries and required legal review.

## 17. Change protocol
Inspect first. Find the source of truth. Reuse existing patterns. Change the smallest coherent surface. Test the change. Review adjacent routes. Document architecture or policy changes.
Do not patch the same symptom in many pages when the defect is systemic.

## 18. Definition of quality
Useful content x coherent UX x trustworthy proof x correct implementation x measurable behavior x maintainable operations.
A project is not finished while one of these dimensions is obviously broken.
# NUMUW Site System

## Purpose
NUMUW is a growth systems studio. The public site is not a catalog of disconnected services. Every public route must help a real visitor move from context to understanding to the next appropriate decision.

The system has five layers:
1. Position — what NUMUW is, who it serves, and the problem it solves.
2. Discover — landing pages that match a meaningful service or industry intent.
3. Decide — tools and diagnostic routes that reduce uncertainty.
4. Buy — productized offers and scoped commercial documents.
5. Deliver / Prove — onboarding, execution QA, handover, evidence and measurement.

## Information architecture
### Public acquisition
- / — primary brand and conversion page.
- /landing/ — acquisition index.
- /landing/<service-or-industry>/ — distinct intent pages.
- /tools/ — decision-tool index.
- /tools/<tool>/ — self-assessment / scenario tools.
- /products/ — offer architecture.
- /products/<product>/ — product-level decision and scope.
- /pages/ — company, method, proof, case studies, contact.
- /resources/, /insights/, /brand/, /media-kit/ — supporting public knowledge and brand surfaces.
- /legal/ — public trust and privacy disclosures.
- /documents/company-profile/, /documents/capability-statement/, /documents/service-catalog/ — public sales collateral.

### Internal / operating documents
These may remain reachable for direct sharing, printing or client operation, but should not compete as ordinary search landing pages:
- proposal template
- onboarding
- handover
- commercial terms
- operating playbooks
These routes use noindex,follow and are excluded from the XML sitemap.

## Decision architecture
Two clean starts:
1. I know the problem → choose the relevant service/product route.
2. I do not know the right solution → Solution Finder → Diagnostic → quantified tool where appropriate → Roadmap / Estimator → Brief Builder / conversation.
Never force a visitor to understand NUMUW's internal taxonomy before they understand their own problem.

## Page-type contract
### Landing page
Must have one audience or use case, one primary commercial problem, one distinct value proposition, problem-specific output/deliverables, relevant objections or non-fit conditions, evidence or explicit proof boundary, one primary next action, and links only to decision paths that genuinely help the visitor.
Landing pages must not be template clones with only the headline or industry name changed.

### Product page
Must answer: who it is for; when to buy it; when not to buy it; what changes; what is included; what is not included; inputs/dependencies; acceptance point; ownership/handover; pricing logic or starting price when published; next step.
Scope / Build / Test / Handover is an execution vocabulary, not enough product differentiation by itself.

### Tool page
Must state what it measures, what it does not measure, assumptions, what the result means, and what the next step is.
Client-entered values stay client-side unless there is a documented reason to transmit or store them.

### Company / proof page
Claims use an evidence level: verified, reported, scenario, or planned.
Never turn a scenario, plan or click into a claimed business result.

## Design system contract
All page types should reuse the shared visual vocabulary: navy / teal / gold tokens, shared buttons, spacing, cards/panels, focus treatment, header/navigation semantics, footer, and reduced-motion behavior.
A page may have distinctive composition, but it should not invent a parallel component vocabulary without a deliberate reason.
Inline style is an exception, not the default. New shared patterns become named classes.

## Language contract
A language switch is shown only on pages that are actually localized.
A fully localized page uses data-i18n=full, supplies Arabic and English for all user-facing variable content, updates document title and social metadata, and preserves the same information architecture and CTA intent.
Partially localized pages should not expose a language switch that implies a complete translation.

## SEO / indexing contract
Indexable commercial/knowledge pages have canonical, unique title/description and valid structured data.
Internal operating documents use noindex,follow and are not listed in the sitemap.
Canonical must match the intended route. og:url must equal canonical. og:site_name is exactly NUMUW | نُمو.
Sitemap contains only intended indexable routes and explicitly public PDF exports.
Structured data must describe visible, truthful page content.

## Conversion contract
Primary CTA hierarchy:
1. Start with the right diagnosis when uncertainty is high.
2. Choose a focused solution when the problem is already clear.
3. Start a scoped conversation when the visitor has enough context.
Do not place equal visual weight on five competing CTAs in one viewport.

## Commercial contract
Every scoped engagement should have: problem statement; current baseline when relevant; objective / success measure; deliverables; exclusions; dependencies / client responsibilities; timeline / milestones; investment / payment terms; change control; acceptance / sign-off; ownership / licensing; support window.

## Security and privacy contract
Never store secrets in source, tickets or shared project documents.
Use client-owned accounts wherever practical. Minimize permissions and rotate/revoke temporary access.
Browser measurement must not contain message text, phone numbers, names, email addresses or free-form form values.
External vendors must be justified against privacy and performance requirements.

## Release contract
A release is not complete until source audit passes, the public sitemap is coherent, deployment succeeds, live browser/mobile behavior is verified, performance is measured, core CTAs are tested, structured data is validated against deployed URLs, indexing is reviewed, and legal/trust surfaces match actual practices.
A source-only pass is a repository release candidate, not final production proof.

## Market learning
Borrow proven structural patterns, not brand language:
- Refine Labs: connect brand, demand and expansion instead of running disconnected motions, with explicit ownership.
- Growthmerce: combine a focused-service entry with a connected growth-partner entry and make the next move obvious.
- Strong B2B case studies: problem → baseline → intervention → evidence → result → lesson.
NUMUW should use these lessons to simplify decisions and improve proof density, not to imitate another company's positioning.
# NUMUW System Specification v3

## Purpose

NUMUW is not a collection of landing pages. It is a growth-system studio with one public web system supporting acquisition, self-assessment, decision support, commercial scoping, delivery, trust and handover.

This specification is the source of truth for public-information architecture and shared experience rules.

## Global information architecture

Public navigation uses the same top-level model everywhere:

1. Solutions
2. Tools
3. Products
4. Company
5. Library
6. Insights
7. Contact

A visitor should be able to move from any public page to these areas without learning a second navigation system.

## Page contracts

### Home

Job: establish positioning, explain the operating model, create confidence, expose the next decision and route visitors to diagnosis.

### Solution / landing page

Job: solve one audience problem.

Required structure:
- audience + problem
- clear promise
- why this route
- fit / non-fit
- operating logic
- deliverables or scope
- evidence / proof standard
- next step

### Tool

Job: answer one decision question.

Required:
- inputs are clearly labeled
- assumptions are explicit
- output is understandable
- limitations are visible
- result routes to an appropriate next step
- no sensitive data is persisted by default

### Product

Job: make a purchase decision easier.

Required:
- audience
- problem
- scope
- deliverables
- exclusions
- acceptance point
- ownership
- commercial model
- next step

### Company

Job: establish accountability and trust.

Required:
- who
- method
- evidence standard
- cases / proof
- contact path

### Library

Job: support the actual sales and delivery process.

Required lifecycle:
Company Profile → Capability → Service Catalog → Proposal → Terms → Onboarding → Delivery → Handover → Playbooks

### Trust / legal

Job: explain current data behavior, limitations, security reporting and commercial boundaries without pretending to be legal advice.

## Shared design system

The public visual system uses:
- navy foundation
- accessible teal action color
- restrained gold accent
- one type family stack
- consistent radius / spacing / button height
- 44px minimum interactive control height
- visible two-tone keyboard focus
- consistent cards, panels, metrics and CTA blocks

Avoid:
- arbitrary inline styling when a reusable component can express the same intent
- unexplained decorative variation
- emoji as the primary iconography on system/navigation surfaces
- one-off navigation patterns
- fake bilingual controls on pages that are not translated

## Wayfinding

All non-home public pages use:
- the same global header
- the same global footer
- visible breadcrumbs
- BreadcrumbList structured data where appropriate
- stable section names

Breadcrumbs should represent actual hierarchy, not keyword stuffing.

## Conversion system

The preferred path is:

Acquire → Understand → Self-assess → Choose a path → Validate scope → Contact → Scope → Deliver → Handover → Improve

Do not force every visitor into the largest product.

## Proof standard

Never invent:
- client logos
- testimonials
- awards
- rankings
- financial results
- ROI
- guaranteed search positions

Real evidence should carry source, date, scope and context.

## Measurement

Client-side events are limited to intent signals. Browser events are not a substitute for CRM/business truth.

Minimum funnel:
page_view → tool_start → tool_complete → cta_intent → qualified_conversation → scoped_proposal → won_work

Only the early events belong in the public-site instrumentation.

## Accessibility

Every form control must have an associated label. Dynamic results must have appropriate live-region announcements. Navigation must be keyboard reachable. Mobile interactions must use comfortably sized targets.

## Technical release contract

Every indexable HTML page must have:
- one title
- one meta description
- one canonical
- OG title/image/url
- Twitter card/image
- one or more parseable JSON-LD blocks
- exactly one H1
- lang + dir
- a main landmark
- valid local link/asset references
- no inline event handlers
- no third-party runtime script/style dependency unless explicitly reviewed

The release audit must be stronger than the minimum HTML checks and should evolve whenever a real production defect escapes it.

## Commercial operations

The operating library is treated as a product capability, not optional documentation.

Every commercial engagement should be traceable through:
discovery → scope → assumptions → approval → build → QA → acceptance → handover → support.

Credentials must never be stored in project documentation. Client-owned accounts should remain client-owned where possible.

## Live release boundary

Repository correctness, CI success and Pages deployment success do not prove:
- browser UX
- Core Web Vitals
- external CTA behavior
- Search Console indexing
- Rich Results display
- legal approval

Those require direct production verification.

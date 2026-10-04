# NUMUW Master System Audit

**Review date:** 2026-10-05  
**Scope:** complete public repository + product system + conversion system + operating library + release controls.

## Executive position

NUMUW should be operated as one coherent growth-system company, not as a collection of pages, services and calculators.

The target model is:

**Positioning → Demand → Conversion → Operations → Measurement → Optimization**

The website must make the same logic visible. Every route should help a buyer understand one of four things:

1. What problem NUMUW solves.
2. Why the proposed path is appropriate.
3. What is included, excluded and owned.
4. What evidence and next action exist.

## Findings from the system review

### Critical
- Several malformed HTML / metadata defects existed outside the previous static gate.
- Internal navigation was section-specific instead of one site-wide information architecture.
- Homepage and internal pages used different design tokens and visual systems.
- Some product pages reused nearly identical structure without enough product-specific decision content.
- Solution Finder used industry input mainly as copy context, not as a strong routing signal.
- Roadmap accepted a maturity input but did not use it.
- Estimator mixed recurring and one-time prices in one total.
- Tool forms needed stronger field semantics and recoverable feedback.
- The previous release audit did not validate heading-tag pairing, allowed `meta` attributes, or several semantic invariants.

### High priority
- Landing pages need richer audience/problem/proof/fit content rather than near-cloned four-block pages.
- Proof should become an evidence ledger with source, date, scope and permission status.
- Case-study architecture needs real case readiness without fabricated results.
- Commercial templates need to stay connected to delivery QA, ownership, acceptance and change control.
- Search content should earn its page through distinct user intent and first-hand knowledge, not page-count growth.
- All public pages need one coherent navigation, footer, breadcrumb and CTA system.
- Inline styling should continue to be reduced in favor of shared tokens/utilities.

### External release gates
Source/CI cannot prove live:
- browser/mobile UX
- Core Web Vitals
- live WhatsApp/phone behavior
- Rich Results
- Search Console indexing
- formal legal approval
- repository settings such as main-branch protection

## Target information architecture

Primary navigation:

**الرئيسية · الحلول · الأدوات · المنتجات · الشركة · المصادر · التواصل**

Secondary navigation is contextual inside hubs and pages, not a different site-wide header.

### Solutions

Solutions are grouped by capability:
- Conversion Websites
- Brand & Positioning
- Search & Local Visibility
- Automation
- Practical AI
- Growth Partner

### Industries

Industry landing pages remain useful acquisition routes:
- B2B
- Manufacturing
- Real Estate
- E-commerce

Industry pages must explain industry-specific friction, buying context, operational realities, fit/non-fit, and relevant solution paths.

### Products

The product ladder is:

**Diagnostic → Sprint / Digital Kickoff → Growth System → Growth Partner**

Each product must have:
- who it is for
- trigger/problem
- inputs/dependencies
- scope
- explicit exclusions
- deliverables
- acceptance criteria
- ownership
- timeline
- investment logic
- next step
- non-fit conditions

### Tools

Tools exist to reduce decision friction, not to simulate expertise:
- Diagnostic
- Automation Finder
- Estimator
- ROI Scenario
- Roadmap
- Website Readiness
- Solution Finder
- Brief Builder

Every tool must declare assumptions, limitations, result meaning, and next action.

## Design-system contract

One design language across the system:
- Navy / teal / gold brand palette.
- Shared spacing, radius, shadows, type scale and focus treatment.
- Shared responsive breakpoints.
- Shared header, navigation, CTA, footer, cards and form conventions.
- No section-specific visual language unless it has a clear product reason.
- No emoji as the primary interaction affordance.
- Avoid one-off inline styles when a shared component or token is appropriate.

## Content system

Every indexable page must have a distinct job.

A page should be created or kept only when it provides substantial user value beyond another existing page. Search pages are not allowed to exist only because a keyword exists.

Content standard:
- first-hand expertise where possible
- clear author / organization context
- specific problem and audience
- meaningful original information
- sources where external facts matter
- evidence instead of promotional claims
- explicit assumptions for estimates
- no fabricated proof

## Trust system

Proof maturity stages:

**No proof yet → proof in progress → verified case → quantified case with permission**

Never fill an empty proof section with invented testimonials or logos.

Every future case should record:
- client / permission
- business context
- problem
- baseline
- intervention
- period
- evidence
- result
- attribution limits
- lessons

## Commercial operating system

**Lead → Discovery → Diagnosis → Scope → Proposal → Approval → Kickoff → Build → QA → Acceptance → Handover → Support → Review**

The commercial library and delivery library must describe the same lifecycle and vocabulary.

## Technical quality gate

Source QA should cover:
- HTML structure and tag pairing
- metadata
- canonical / OG consistency
- JSON-LD validity
- links / assets
- accessibility semantics
- form labels and control names
- no inline event handlers
- security.txt
- no third-party runtime dependency without explicit approval
- sitemap integrity
- duplicate titles / descriptions
- suspicious corrupted tokens
- no accidental secrets / credentials

## Decision rule

Do not optimize one surface while degrading another.

A change is accepted only when it improves the complete system without breaking:
**clarity + trust + accessibility + performance + SEO + conversion + maintainability + operational consistency.**

## Research references

- Google Search Central — Helpful, reliable, people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google Search Central — Organization structured data: https://developers.google.com/search/docs/appearance/structured-data/organization
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
- W3C forms labeling guidance: https://www.w3.org/WAI/tutorials/forms/labels/
- Nielsen Norman Group — B2B Website Usability: https://www.nngroup.com/reports/b2b-websites-usability/
- Nielsen Norman Group — Trust and Credibility: https://www.nngroup.com/reports/ecommerce-ux-trust-and-credibility/
- Webstacks — B2B Website Information Architecture: https://www.webstacks.com/blog/information-architecture
- Clutch — Agency portfolio / case-study guidance: https://clutch.co/resources/what-website-portfolio

# NUMUW System Architecture

## 1. Product definition

NUMUW is a founder-led growth systems studio for Egyptian businesses. The primary commercial focus is businesses with meaningful sales complexity, repeated operational work, or weak handoffs between marketing and operations. The site may serve adjacent segments, but the experience should not present every market as equally primary.

The customer buys a path to a business result, not a pile of services.

## 2. Strategic model

**Audience → Problem → Diagnosis → Recommended path → Product → Delivery → Evidence → Next improvement**

Every major page should make that chain easier to understand.

## 3. Information architecture

Primary navigation:
- Solutions
- Industries
- Tools
- Products
- Proof
- About

Secondary navigation lives in the footer:
- Resources
- Business Library
- Legal & Trust
- Contact

Backward-compatible legacy routes under `/landing/` remain valid, but new acquisition links should prefer the clearer Solutions and Industries hubs.

## 4. Solution families

Service / solution pages:
- Conversion Websites
- Business Automation
- Practical AI
- SEO & Local Visibility
- Brand & Identity
- Growth Partner

Industry pages:
- B2B
- Manufacturing
- Real Estate
- E-commerce

The hub must explain when to choose a family and when not to.

## 5. Offer ladder

### Diagnose
Find the bottleneck, baseline and priority.

### Sprint
Solve one bounded problem with a fixed time box and prioritized scope.

### System
Connect multiple layers when one intervention is insufficient.

### Partner
Run a recurring improvement cycle with explicit priorities and review points.

This mirrors the principle of fixed time + controlled scope rather than open-ended task accumulation. Basecamp's Shape Up describes this as fixed time, variable scope and emphasizes shaping work before committing to it. 

## 6. Page contract

Every indexable page must answer:
- Who is this for?
- What problem does it solve?
- Why this path?
- What is actually delivered?
- What is not included?
- How is success evaluated?
- What happens next?

## 7. Proof architecture

Proof has four separate levels:
1. Capability proof — what NUMUW can build and operate.
2. Process proof — how work is controlled.
3. Artifact proof — real assets, screens, documents or outputs.
4. Outcome proof — measured client results with source, scope and context.

Do not use capability/process proof as a substitute for outcome proof.

## 8. Content architecture

Public content has three jobs:
- decision support,
- first-hand / original analysis,
- evidence-backed explanation.

Avoid producing pages only because a keyword exists. Google's current guidance explicitly favors helpful, reliable, people-first content and warns against mass search-first content with little added value.

## 9. Delivery architecture

A normal engagement flows:
**Qualify → Diagnose → Shape → Scope → Build → QA → Accept → Handover → Review**

Each transition has an explicit artifact or acceptance condition.

## 10. Measurement architecture

Browser events can measure intent:
- page_view
- tool_start
- tool_complete
- cta_intent

Business truth lives outside the browser:
- qualified conversation
- scoped proposal
- won work
- retained work

Never infer revenue from a click.

## 11. Governance

The authoritative quality gate must cover the entire public surface. The autoresearch benchmark is a supporting experiment, not the release authority.

Repository changes should be grouped by coherent outcome and reviewed at system level.

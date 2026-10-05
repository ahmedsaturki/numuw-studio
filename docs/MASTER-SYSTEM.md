# NUMUW Master System

Status: canonical internal source of truth for product, website, conversion, delivery and release decisions.

## 1. North star

NUMUW is a founder-led Growth Systems Studio for Egyptian businesses, with a deliberate bias toward B2B, industrial and operationally complex teams.

The promise is not "more marketing." The promise is a clearer path from business problem to owned growth asset:

Problem → Baseline → Priority → Build → Validate → Operate → Measure → Improve.

NUMUW should not sell every capability to every prospect. The system chooses the smallest sensible intervention that can address the current constraint, then expands only when evidence justifies it.

## 2. System layers

### Brand
Positioning, identity, tone, proof standard and ownership promise.

### Acquisition
Home, solution pages, industry pages, search/content, referrals and direct outreach.

### Diagnosis
Self-assessment tools, Solution Finder and the paid/deeper Diagnostic.

### Product
Productized offers with defined audience, scope, deliverables, dependencies, acceptance, ownership and next step.

### Conversion
One primary CTA per page, explicit fit/non-fit, confidence-building proof and a low-friction first action.

### Sales
Discovery → qualification → baseline → scope → proposal → decision. Do not sell a solution that discovery has not justified.

### Delivery
Kickoff → plan → build → QA → client review → acceptance → handover → support.

### Evidence
Case studies, before/after evidence, screenshots, source/date/scope and measurable outcomes. Never fabricate proof.

### Measurement
Browser intent events are separate from business outcomes. Qualified opportunities, proposals and revenue remain business-source-of-truth records.

### Governance
Security, privacy, ownership, commercial terms, change control, release gates and explicit verification boundaries.

## 3. Information architecture

Primary navigation must answer the five questions a prospect has:

1. What problem can NUMUW solve? → Solutions
2. Can I understand my situation myself? → Tools
3. What can I buy? → Products
4. What proof exists? → Proof
5. Who is responsible and how do we work? → Company

Business documents, legal policies and operational references belong in the footer/Company ecosystem, not the primary acquisition navigation.

## 4. Page hierarchy

Every indexable page belongs to exactly one type:

- Home — explains category + promise + next action.
- Solution — explains a problem/segment + mechanism + fit + proof + CTA.
- Tool — produces a decision aid and routes to the next action.
- Product — explains a buyable package and commercial boundary.
- Proof — shows evidence or transparently explains its current absence.
- Company — establishes responsibility, method and trust.
- Document — supports a sale or delivery and is not a competing acquisition landing page.
- Legal — describes operational/legal boundaries.
- 404 — recovers navigation; never competes for search traffic.

## 5. Offer ladder

Default path:

Self-assess → Diagnostic → Focused Sprint → Growth System → Growth Partner.

Focused Sprints include website/conversion, automation, brand/positioning, SEO/local and other explicitly bounded interventions.

No prospect should be pushed into Growth System or Growth Partner only because those products are larger.

## 6. Content architecture

Every page must add decision value. A page is justified when it changes what a qualified visitor knows, believes, chooses or does.

A page should normally answer:

- Who is this for?
- What problem does it solve?
- What changes?
- What is included?
- What is not included?
- What evidence exists?
- What does it cost or how is it scoped?
- What happens next?

Search demand informs the architecture; it does not justify thin page proliferation.

## 7. Design system rule

The shared design system is the default. A page may have a unique composition, but not a private visual language.

Reuse:
- shared tokens
- shared header/footer
- shared button hierarchy
- shared typography scale
- shared cards/panels/forms
- shared focus treatment
- shared mobile rules

Homepage-specific CSS is allowed only for homepage composition, not for re-defining foundational components.

## 8. Technical policy

- Static-first and dependency-light.
- No third-party runtime JavaScript unless there is a reviewed business reason.
- Prefer local, cacheable assets.
- Browser calculations run locally.
- No secrets in source.
- Client-owned accounts by default.
- External data collection must be explicit, documented and privacy-reviewed.
- Build-time checks must be deterministic and regression-tested.

## 9. Definition of done

A feature/page is not "done" merely because the HTML exists.

Done means:
- correct information architecture
- correct visual/system contract
- correct content and proof boundary
- accessible interaction
- working links and behaviors
- metadata/schema aligned with visible content
- documented ownership/dependencies
- tested source
- tested deployment when reachable
- known external verification gaps explicitly recorded

## 10. Release philosophy

The repository can prove source invariants and successful CI/deployment jobs.

Only direct checks can prove:
- live browser rendering
- real CTA behavior
- field performance
- indexing state
- Rich Results eligibility
- legal approval

Never convert an unverified external gate into a claimed success.

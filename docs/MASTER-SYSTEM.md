# NUMUW Master System

**Status:** Active source of truth  
**Purpose:** Keep the public site, commercial system and delivery system coherent as one product.

## 1. System model

NUMUW is not a collection of pages. It is a connected system:

`Positioning → Acquisition → Diagnosis → Decision → Offer → Scope → Contract → Delivery → Handover → Proof → Measurement → Improvement`

Every public asset must have a defined role in that chain.

## 2. Layers

| Layer | Responsibility | Primary source |
|---|---|---|
| Brand | promise, language, visual identity, credibility | `brand/`, `index.html` |
| Acquisition | audience-specific entry points | `landing/` |
| Decision | self-assessment and routing | `tools/` |
| Commercial | productized offers and proposal logic | `products/`, `documents/` |
| Delivery | onboarding, QA, playbooks, handover | `documents/` |
| Trust | proof, legal, security, ownership boundaries | `pages/proof/`, `legal/`, `SECURITY.md` |
| Measurement | intent events and business source of truth | `docs/MEASUREMENT-SPEC.md` |
| Engineering | static architecture, performance, accessibility, CI | `assets/`, `scripts/`, `.github/` |

## 3. Route contract

Every indexable HTML route must have:

- exactly one primary purpose
- a defined audience
- one primary action
- one meaningful next step
- canonical URL
- useful meta description
- OG/Twitter metadata
- valid JSON-LD that matches visible content
- accessible HTML structure
- no broken local references
- no fake proof
- no claim that cannot be supported

The route-level contract is recorded in `docs/SITE-MANIFEST.json`.

## 4. Content architecture

Do not add pages just to increase URL count.

A new page is justified only when it has a distinct audience, decision, problem, proof, offer or resource job. Search-driven duplication without distinct user value is rejected.

Google's people-first guidance explicitly recommends serving a real audience with useful, original and satisfying content rather than producing lots of search-engine-first pages. See `docs/REFERENCE-BENCHMARKS.md`.

## 5. Acquisition logic

A visitor should be able to move through a predictable funnel:

`Landing → Tool or Diagnostic → Relevant Product → Brief / Contact → Scope`

A page may also route directly to another layer when confidence is high, but it must remain obvious why that next step is appropriate.

## 6. Offer architecture

Products are not arbitrary packages.

Each product should expose:

- fit
- non-fit
- scope
- deliverables
- exclusions
- dependencies
- timeline
- investment reference
- ownership
- acceptance
- support
- next action

## 7. Commercial control

The Proposal / Terms / Onboarding / Handover documents form one commercial lifecycle:

`Discovery → Proposal → Agreement → Access → Build → Acceptance → Handover`

Changes after approval require explicit change control. Ownership, third-party costs, milestones and acceptance must be written rather than inferred from marketing copy.

## 8. Delivery control

A deliverable is not complete because code exists.

Definition of done:

`Built + Tested + Content Reviewed + Accessibility Checked + Ownership Recorded + Documented + Accepted`

Operational playbooks must make this repeatable across future clients.

## 9. Trust and proof

Proof is a ledger, not decoration.

Allowed:
- real client-approved evidence
- measurable before/after data with context
- screenshots or artifacts from real work
- dated case studies
- clearly labeled scenarios

Rejected:
- invented testimonials
- fabricated logos
- unsupported awards/rankings
- guaranteed SEO rankings
- fabricated ROI or revenue claims

## 10. Measurement

Browser events describe intent only.

`click ≠ lead`  
`lead ≠ qualified opportunity`  
`proposal ≠ won work`

Revenue and pipeline truth belong in the agreed business system, not in browser inference.

## 11. Performance

The default architecture is static, local and dependency-light.

No third-party runtime dependency is introduced without:
1. a user/business reason
2. privacy review
3. performance impact review
4. a rollback/removal plan

Live performance targets use the current Core Web Vitals good thresholds and must be checked at the 75th percentile, split by mobile and desktop.

## 12. Accessibility

The design system must preserve:
- visible keyboard focus
- focus not obscured by sticky/fixed UI
- usable target sizes
- semantic landmarks
- accessible labels
- predictable navigation
- reduced-motion respect

WCAG 2.2 is the baseline reference.

## 13. Engineering governance

The repository should remain:
- build-free unless a real need appears
- locally owned
- reproducible
- auditable
- free of secrets
- free of dead/legacy source
- protected by deterministic CI checks

## 14. Release gates

### Source gate
Must pass the dependency-free static audit.

### CI gate
The exact release commit must pass the configured GitHub Actions checks.

### Deployment gate
Pages deployment must succeed from the exact release commit.

### Live gate
Must be verified separately:
- public URL
- browser/mobile behavior
- CTA behavior
- Lighthouse / field performance
- Rich Results
- Search Console
- legal approval where required

Never convert a source-level claim into a live-production claim.

## 15. Change discipline

Every change should answer four questions:

1. What user/business problem does it solve?
2. Which system layer owns it?
3. Which other layers does it affect?
4. What proves it works?

If the answer to #3 is "none", review whether the change is genuinely integrated.

## 16. Strategic rule

The objective is not to make NUMUW larger.

The objective is to make NUMUW **more coherent, more useful, more credible, easier to buy, easier to deliver, easier to maintain, and easier to improve**.

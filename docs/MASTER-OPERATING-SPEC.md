# NUMUW Master Operating Specification

## North-star model

NUMUW is one connected commercial system:

**Audience → Problem → Diagnosis → Priority → Product → Scope → Build → QA → Handover → Measurement → Improvement**

A public artifact is successful only when it strengthens this chain or provides a distinct, defensible user value.

## Universal quality contract

Every important asset — character, sentence, CTA, HTML element, CSS rule, JavaScript behavior, page, tool, product, document, dataset or repository setting — belongs to one of four classes:

1. **Brand:** identity, voice, visual system, trust.
2. **Commercial:** audience, problem, offer, pricing, conversion.
3. **Operational:** scope, delivery, QA, ownership, documentation, handover.
4. **Infrastructure:** code, security, accessibility, performance, deployment, measurement.

No class may be optimized while another is knowingly neglected.

## Release gates

### A. Brand
- One canonical name and description.
- One visual token system.
- One typography system.
- One component language.
- No duplicate design stacks.
- No one-off inline styling unless a documented exception exists.

### B. Information architecture
- Every page has one job.
- Navigation is predictable and consistent.
- Each route has a clear parent and next action.
- No orphan page or dead-end tool.
- New pages must add decision value.

### C. Commercial proposition
- The buyer sees the problem before the service catalog.
- Products have audience, fit, non-fit, scope, deliverables, exclusions, acceptance and next step.
- Reference pricing is clearly labeled and never presented as a false fixed quote.
- No outcome guarantee without a contractual and measurable basis.

### D. Conversion
- One primary action per page.
- Secondary actions support, not compete with, the primary action.
- Tools route to a relevant next step.
- The first contact can be low-friction.
- User-entered data is not silently stored or inferred as revenue.

### E. Content and SEO
- Content is written for people first.
- Each landing page has a distinct audience, problem, proof and buying context.
- Titles, descriptions and structured data accurately describe the page.
- Sitemap and canonicals are synchronized.
- No fabricated expertise or evidence.

### F. Tools
- Every tool declares its question, inputs, output, assumptions, non-measures and next step.
- Client-side calculations are treated as scenarios or self-assessments unless externally verified.
- Runtime-generated links and outputs are tested separately from literal static references.

### G. Operations
- Scope changes require explicit re-estimation.
- Commercial milestones and acceptance criteria are documented.
- Dependencies and client responsibilities are explicit.
- Ownership and licensing are explicit.
- Secure credential handling is documented.
- Handover includes access rotation/removal where appropriate.

### H. Accessibility
- Keyboard access works.
- Focus is visible and not obscured.
- Targets have adequate size/spacing.
- Dynamic results are announced when needed.
- Reduced-motion behavior is respected.
- Arabic RTL and English LTR states remain valid.

### I. Performance
- No unnecessary third-party runtime dependencies.
- No blocking work that is not justified.
- Local assets preferred.
- LCP / INP / CLS are validated in live environments before claiming production quality.

### J. Security and privacy
- No secrets in source.
- Security reporting route exists.
- Client data collection is minimized.
- Future analytics, forms, CRM and payments require explicit privacy review.
- Security and privacy claims never exceed actual implementation.

### K. Verification
- Static audit must pass.
- Relevant dynamic behaviors must be tested.
- Deployment must be checked from the deployed environment.
- Search/structured-data checks must be run against public URLs.
- Legal pages must receive legal review before being treated as final legal documents.

### L. Governance
- Main branch protection should be explicit.
- Release changes should be reviewable.
- Documentation should describe actual state, not intended state.
- Failed experiments must remain visible as failed experiments.
- Do not mark a gate complete without evidence.

## Stop conditions

Stop adding features when:
- the current feature cannot be tied to a real business problem
- it duplicates an existing capability
- it adds more UI without improving a decision
- it creates material privacy/security/performance cost without a justified benefit
- it cannot be tested or maintained

## Definition of Done

A change is done only when:
1. implementation exists
2. related documentation is updated
3. static checks pass
4. impacted interactions are verified
5. release notes / manifests reflect the new state
6. no known regression remains
7. the evidence boundary is explicit

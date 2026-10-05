# NUMUW Master System Blueprint

Status: Active architecture baseline
Purpose: keep the commercial, content, product, UX, technical and operational layers aligned as one system.

## 1. Core position

NUMUW is an operator-led growth systems studio for Egyptian B2B, industrial and selected business segments.

The public experience should answer five questions in order:
1. Is NUMUW for a business like mine?
2. Do you understand the problem I am facing?
3. What should I do first?
4. What exactly will I receive and own?
5. What evidence and operating controls make the engagement trustworthy?

The site should not force visitors to understand the internal service catalog before they can make a useful decision.

## 2. Information architecture

Primary navigation:
- Solutions
- Industries
- Tools
- Work & Proof
- Resources
- Company
- One primary CTA: Start with the problem

Existing technical routes remain stable to protect links and sitemap integrity. User-facing labels do not have to mirror folder names.

### Solutions
- Brand & Positioning
- Web & Conversion
- SEO & Discoverability
- Automation & AI
- Growth Optimization
- Connected Growth System

### Industries
- Manufacturing
- B2B
- Real Estate
- E-commerce

An industry page must change the buyer problem, buying cycle, proof requirements and workflow. It must not be a keyword-swapped copy of another industry page.

## 3. Buyer journey

Discover -> Understand -> Diagnose -> Choose -> Scope -> Build -> Launch -> Measure -> Improve

Every public page should have one dominant job in this chain.

- Landing page: establish fit and problem understanding.
- Tool: reduce uncertainty.
- Product: define the commercial choice and scope.
- Case study / proof: reduce trust risk.
- Proposal / library: make commercial execution concrete.
- Handover: transfer ownership and operating knowledge.

## 4. Product ladder

1. NUMUW Diagnostic — clarify the problem and priorities.
2. Digital Kickoff — establish the needed digital foundation.
3. Automation Sprint — fix one clearly defined workflow.
4. Growth System — connect multiple layers when the problem is systemic.
5. Growth Partner — recurring optimization after a useful baseline exists.

The bigger product is not automatically the better product.

## 5. Decision tools

- Solution Finder: Which path should I start with?
- Growth Diagnostic: Where is the biggest gap?
- Automation Finder: Is this repeated work worth automating?
- ROI Scenario: How sensitive is this theoretical business scenario?
- Project Estimator: What might the project contain?
- 90-Day Roadmap: What should happen first?
- Website Readiness: Is the digital foundation ready?
- Brief Builder: How do I explain the problem clearly?

Tool results must state their limits and route to a useful next action.

## 6. Proof model

NUMUW uses three levels of commercial truth:

### Description
What NUMUW says it does.

### Commitment
What the signed scope / proposal / agreement commits to.

### Evidence
A measured, sourceable result that can be published.

Never collapse these levels.

No invented clients, logos, testimonials, awards, rankings, revenue, ROI or guarantees.

Real case studies should use:
Context -> Baseline -> Problem -> Intervention -> Evidence -> Limits -> Lessons

## 7. Commercial operating model

Every scoped engagement should define:
- objective
- current state
- baseline
- deliverables
- explicit exclusions
- assumptions
- dependencies
- client responsibilities
- timeline
- milestones
- payment terms
- change-request process
- acceptance criteria
- support window
- ownership
- licensing / third-party assets
- handover
- sign-off

Scope changes are re-estimated before implementation.

## 8. Ownership and security

Default principle: client-owned assets remain client-owned.

Never store passwords, API keys or private credentials in public files, chat transcripts or normal project documentation.

Temporary access should be client-owned where possible, least privilege, time-bounded, documented, and removed or rotated after use.

Handover should verify assets, access, documentation, training, backups where agreed, and acceptance.

## 9. Design system

All public pages should use the shared design language:
- shared navigation shell
- shared footer
- shared typography
- shared buttons
- shared spacing and container logic
- shared focus behavior
- shared color tokens
- local assets
- no third-party runtime dependencies

The homepage may have additional composition styles, but it must not create a second brand system.

## 10. Content rules

A page exists only when it provides distinct decision value.

Use first-hand expertise, concrete examples, buyer language, original analysis and useful tools.

Avoid search-first page generation, near-duplicate industry pages and content created only to capture keywords.

For content where authorship matters, identify the responsible author accurately and never invent credentials or authorship.

## 11. Search / AI-search readiness

Technical SEO remains foundational for search and modern generative search experiences:
- crawlable HTML
- stable canonical URLs
- useful titles and descriptions
- accurate structured data
- coherent internal linking
- unique, helpful page content
- clean sitemap and robots directives
- strong page experience

AI should be used where it improves research, workflow or output quality; it must not become a reason to publish large volumes of low-value duplicate pages.

## 12. Measurement

The browser records intent signals only when an instrumentation consumer exists.

Client-side events are limited to safe intent fields.

The business source of truth remains outside browser inference:
page_view -> tool_start -> tool_complete -> cta_intent -> qualified_conversation -> scoped_proposal -> won_work

A click is not a lead. A lead is not qualified. A proposal is not won.

## 13. Technical release gates

Required source/CI gates:
- HTML structure
- one primary H1
- canonical correctness
- sitemap integrity
- JSON-LD parseability
- Open Graph / Twitter metadata
- internal links and assets
- image alt attributes
- keyboard/accessibility invariants
- no inline event handlers
- no third-party runtime script/style dependencies
- shared shell presence
- 404 noindex behavior
- security.txt contract
- theme contrast invariant

Deployment gates remain separate:
- live browser/mobile review
- Lighthouse and field Core Web Vitals
- live WhatsApp/phone behavior
- Rich Results validation
- Search Console indexing
- legal approval

Never infer deployment proof from repository source alone.

## 14. Competitive learning without imitation

Borrow proven mechanisms, not brand surfaces.

Useful mechanisms observed in strong B2B / industrial models:
- diagnosis or roadmap before large implementation
- strong industry-specific positioning
- buyer-role awareness
- proof tied to actual outcomes
- productized scopes
- predictable onboarding / delivery
- recurring optimization after baseline

NUMUW should retain its own differentiation:
- Egyptian-market focus
- operator-led accountability
- diagnostic-first buying
- owned-asset / anti-lock-in posture
- connected marketing + operations thinking
- lightweight infrastructure where that is an advantage

## 15. Expansion rule

Before adding a page, feature, tool or product, answer:
1. What buyer question does it answer?
2. Where does it sit in the journey?
3. What unique decision value does it add?
4. What existing page should link to it?
5. What next step does it enable?
6. What maintenance cost does it introduce?
7. Does it introduce legal, privacy, performance or security risk?

If those answers are weak, do not ship the addition.

## 16. Definition of done

A component is not done because its file exists.

It is done when:
- its purpose is clear
- it is reachable
- it is visually coherent
- it works with keyboard/mobile constraints
- its metadata is correct
- its links resolve
- its structured data is valid
- it has a defined next step
- it is consistent with commercial scope
- it is covered by release checks
- it has a documented operational owner
- its deployment state is actually verified when live proof is required

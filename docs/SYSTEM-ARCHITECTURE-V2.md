# NUMUW System Architecture v2

## Purpose

NUMUW is not a collection of unrelated service pages. The public system is organized around a user journey:

**Understand → Diagnose → Choose → Build → Measure → Improve**

The website hierarchy supports that journey:

**Solutions → Tools → Products → Proof → Company → Resources**

Secondary operational areas:

**Business Library → Legal / Trust → Human Site Map**

## Information architecture

### Solutions

Answers: **What problem can NUMUW solve?**

- Website / conversion
- Automation
- AI-assisted systems
- SEO / local visibility
- Brand / positioning
- Growth partner
- Manufacturing
- B2B
- Real estate
- E-commerce

Rules:
- A solution page must name a specific audience or problem.
- It must explain the pain, desired change, fit, non-fit, scope and next action.
- It must route toward a product or diagnostic instead of ending in a generic contact CTA.

### Tools

Answers: **How can I understand my situation?**

Tools are decision aids, not substitutes for professional diagnosis.

- Solution Finder
- Growth Diagnostic
- Automation Finder
- ROI Scenario Calculator
- Project Estimator
- 90-Day Roadmap
- Website Readiness
- Brief Builder

Every tool should state:
- what it measures
- what it does not measure
- important assumptions
- what the visitor should do with the result

### Products

Answers: **What exactly can I buy?**

Product catalog:

| Product | Job | Reference |
|---|---|---|
| NUMUW Diagnostic | Understand and prioritize | Scope-based |
| Digital Kickoff | Build focused digital foundation | Starts at 7,900 EGP |
| Automation Sprint | Automate one workflow | Starts at 8,000 EGP |
| Growth System | Connect multiple growth layers | Starts at 24,900 EGP |
| Growth Partner | Continuous optimization | Starts at 6,500 EGP / month |

A product is valid only when it has:
- audience
- problem
- fit / non-fit
- deliverables
- assumptions / dependencies
- acceptance criteria
- ownership
- support boundary
- commercial reference
- next action

### Proof

Answers: **Why should I trust this?**

Proof hierarchy:
1. real client cases with permission
2. measurable before/after evidence
3. public product demonstrations
4. transparent method and acceptance criteria
5. operating documentation

Never fabricate:
- client logos
- testimonials
- awards
- rankings
- revenue
- ROI
- guaranteed outcomes

### Company

Answers: **Who is behind the system?**

- About
- Method
- Proof
- Case Studies
- Contact
- Human Site Map

### Resources

Answers: **What can help me before I buy?**

Resources can include:
- checklists
- templates
- insights
- media kit
- business documents

Resources must support decision-making, not inflate the URL count.

## Commercial journey

Default public conversion path:

**Solution / Search entry**
→ **Relevant page**
→ **Decision tool or Diagnostic**
→ **Product fit**
→ **Brief / WhatsApp**
→ **Discovery**
→ **Written scope**
→ **Build**
→ **QA**
→ **Handover**
→ **Measurement / improvement**

When the problem is already precise, a visitor may skip the diagnostic.

## Navigation rule

All inner pages load the shared design system and runtime. The shared runtime establishes a common primary navigation, page orientation aid and footer wayfinding.

The root homepage is allowed to have its own hero and visual treatment, but it must expose the same core destinations.

## Content rule

A new page is justified only when it adds distinct decision value. Do not create pages solely for keyword variants.

Google's people-first content guidance is the controlling principle for future expansion.

## Design rule

The visual system is built around:
- navy foundation
- accessible teal action color
- restrained gold accent
- high-contrast white surfaces
- rounded but not decorative cards
- clear typography hierarchy
- visible keyboard focus
- responsive layouts
- no external font/style/runtime dependency

Homepage-specific composition may be more expressive, but component semantics and interaction behavior must stay compatible with the shared system.

## Ownership rule

NUMUW should default to:
- client-owned domains
- client-owned accounts
- client-owned source code and assets where contracted
- documented access
- secure credential transfer
- least-privilege access
- explicit transfer / acceptance

## Measurement rule

Browser instrumentation describes intent only:
- CTA intent
- tool start
- tool completion

Qualified leads, proposals and revenue remain business records.

## Release rule

A repository pass is not a live production pass.

Source / CI proves:
- markup
- metadata
- links
- local assets
- static constraints
- repository invariants

Live verification must separately prove:
- actual deployment
- browser/mobile behavior
- Core Web Vitals
- CTA behavior
- search indexing
- Rich Results
- legal approval

## Maintenance rule

Every new page must:
1. reuse the shared CSS/JS system
2. have one H1
3. have unique title and description
4. have canonical + OG/Twitter metadata
5. have JSON-LD that accurately represents visible content
6. use descriptive internal link text
7. be added to sitemap
8. have a defined audience/problem
9. connect to at least one parent hub and one next-step route
10. pass the release audit

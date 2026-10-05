# NUMUW | نُمو — Growth Systems Studio

NUMUW is a static, GitHub Pages-compatible growth studio site for Egyptian businesses, factories and B2B teams.

Public site:
https://ahmedsaturki.github.io/numuw-studio/

## Current release state

Canonical branch: `main`


Latest verified repository gates on that commit:
- NUMUW Static Audit — success
- R1–R17 benchmark/regression gate — success
- GitHub Pages build and deployment — success

The remaining release boundary is tracked in GitHub Issue #7 and covers live browser/mobile UX, field performance, external CTA verification, Rich Results/Search Console validation, formal legal review and repository settings that cannot be proven from source files alone.

## What is included

- Conversion-focused home page
- 10 specialized landing pages + landing hub
- 8 decision / self-service tools + tools hub
- 5 productized offers + products hub
- Company Center: About, Method, Proof, Case Studies, Contact
- Business Library: company profile, capability statement, service catalog, proposal, onboarding, handover, terms and operating playbooks
- Public PDF exports
- Legal & Trust Center
- Solution Finder + Brief Builder
- Shared local CSS / JavaScript
- Canonical, Open Graph, Twitter and JSON-LD metadata
- Accessibility hardening for keyboard navigation and dynamic results
- Sitemap, robots.txt and resilient 404 page
- Dependency-free static audit and GitHub Actions quality gate
- Privacy-aware inert measurement hooks
- Explicit performance budget with no third-party runtime dependencies

## Architecture

The site is intentionally build-free. Pages are plain HTML, with shared assets under `assets/`.

- `index.html` — primary commercial entry point
- `landing/` — audience / service acquisition routes
- `tools/` — browser-only decision tools
- `products/` — productized offers
- `pages/` — company / proof / contact
- `documents/` — operating and sales library
- `legal/` — privacy and disclaimer
- `assets/` — shared and homepage CSS / JS
- `scripts/numuw-static-audit.mjs` — release-time source audit
- `.github/workflows/numuw-static-audit.yml` — CI quality gate
- `bench/test-site-quality.mjs` — regression suite asserting every R1–R17 rule still fires

## Quality gate

Run:

```bash
node scripts/numuw-static-audit.mjs
node bench/test-site-quality.mjs
node bench/site-quality.mjs
```

The static audit covers HTML structure, metadata, canonical URLs, JSON-LD parsing, links, social metadata, accessibility-related invariants, no-third-party runtime dependencies, sitemap integrity, the 404 contract, security.txt and duplicate HTML attributes.

The R1–R17 regression suite must remain capable of failing when each rule is intentionally violated. This protects the meaning of the quality metric itself.

The autoresearch experiment configuration currently declares the combined metric:

`issues * 1e6 + html_bytes`

with lower being better. Independently, the release gate requires the current source audit and benchmark to reach `issues=0`. Historical autoresearch baselines remain in `.autoresearch/engineering/numuw-site-quality-v3/`.

Do not optimize HTML size at the expense of buyer value, accessibility, correctness or maintainability.

## Commercial architecture

Canonical buyer journey:

`Discover → Understand → Diagnose → Choose → Scope → Build → Launch → Measure → Improve`

Commercial entry is split intentionally:

- **Free Fit Conversation** — qualification, context and next-step discovery; no implied deliverable.
- **NUMUW Diagnostic** — paid structured decision work producing a bounded decision brief.

Canonical product ladder:

1. NUMUW Diagnostic
2. Digital Kickoff
3. Automation Sprint
4. Growth System
5. Growth Partner

The correct product is the smallest sensible intervention that solves the current bottleneck. Larger scope is not automatically better.

## Content / proof policy

Do not publish invented client logos, testimonials, awards, rankings, revenue, ROI or guaranteed search rankings.

Real case studies require sourceable context, baseline, intervention, evidence, limits and learning.

The absence of fabricated proof is intentional. Building real proof is a commercial operating priority, not a copywriting shortcut.

## Brand and ownership

Brand clearance is a pre-investment gate because the name NUMUW has external market uses and can create search, trademark, domain and handle ambiguity.

See:
- `docs/STRATEGIC-SYSTEM-REVIEW-2026-10-05.md`
- `PROPRIETARY-NOTICE.md`

The repository is public, but public visibility does not grant an open-source reuse license. Third-party assets remain subject to their own licenses.

## Measurement

Client-side measurement is intentionally inert.

Implemented intent signals:
- `tool_start`
- `tool_complete`
- `cta`

Only safe intent metadata is emitted. Business stages such as qualified conversation, paid diagnostic, scoped proposal and won work belong to an external business source of truth and are not inferred from browser events.

## Deployment boundary

GitHub Pages can be proven from deployment runs, but source/CI cannot prove:
- actual browser/mobile UX
- real-user Core Web Vitals
- live WhatsApp/phone behavior
- Search Console indexing
- Rich Results validation
- formal legal approval
- repository governance settings

Those remain explicitly tracked release gates.

## Security

Never store passwords, API keys, private credentials or client-confidential information in public files.

See:
- `SECURITY.md`
- `.well-known/security.txt`

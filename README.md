# NUMUW | نُمو — Growth Systems Studio

NUMUW is a static, GitHub Pages-compatible growth studio site for Egyptian businesses, factories and B2B teams.

Public site:
https://ahmedsaturki.github.io/numuw-studio/

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

## Quality gate

Run:

```bash
node scripts/numuw-static-audit.mjs
```

The current audit covers HTML structure, metadata, canonical URLs, JSON-LD parsing, links, social metadata, accessibility-related invariants, no-third-party runtime dependencies, sitemap integrity, the 404 contract and security.txt.

The separate `bench/site-quality.mjs` harness contains the deterministic R1–R16 autoresearch experiment. Its current baseline is:

- `issues = 0`
- `html_bytes = 330,961`
- `combined = 330,961`

Those metrics evaluate the harness objective, not live user experience.

## Deployment

GitHub Pages is enabled for the repository and its current Pages build is managed by GitHub's Pages deployment workflow. The repository itself contains the static audit workflow; there is intentionally no custom application build/deploy workflow.

Source/CI verification can prove repository state and successful Pages build runs. It cannot by itself prove browser UX, Lighthouse/Core Web Vitals, live WhatsApp/phone behavior, Search Console indexing or formal legal approval.

See:

- `docs/QA.md`
- `docs/RELEASE-MANIFEST.md`
- `docs/PERFORMANCE-BUDGET.md`
- `docs/MEASUREMENT-SPEC.md`
- `docs/CONTENT-POLICY.md`
- `SECURITY.md`

## Content / proof policy

Do not publish invented client logos, testimonials, awards, rankings, revenue, ROI or guaranteed search rankings. Real proof should include its source, scope and context.

## Ownership

The repository is public, but no open-source reuse license is granted by default. Brand, commercial content and visual assets remain the property of their respective owners unless separately licensed.

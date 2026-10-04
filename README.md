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
- `bench/test-site-quality.mjs` — regression suite asserting every R1–R17 rule still fires

## Quality gate

Run:

```bash
node scripts/numuw-static-audit.mjs
```

The current audit covers HTML structure, metadata, canonical URLs, JSON-LD parsing, links, social metadata, accessibility-related invariants, no-third-party runtime dependencies, sitemap integrity, the 404 contract and security.txt.

The scanner's rule set is covered by its own regression suite, which also runs in CI:

```bash
node bench/test-site-quality.mjs
```

It builds throwaway site trees and asserts each of R1–R17 still fires on a violating
fixture, and that the deliberate exemptions (404 canonical/sitemap, R9 empty `alt`,
R17 card-grid and live-region headings) still hold. Without it a rule could stop reporting
and the autoresearch loop would keep optimising against a number that no longer means what
it claims.

The separate `bench/site-quality.mjs` harness contains the deterministic R1–R17 autoresearch experiment. Its current state (commit `6b2344a`) is:

- `issues = 0` — all 52 pages pass R1–R17; this is the tracked objective, and it is at floor
- `html_bytes = 335,458` — secondary byte-guard metric, not a tracked objective
- `total_bytes = 656,676` *(as of `6b2344a`)* — counts every walked file, Markdown docs included, so it rises when this README is edited; secondary byte-guard metric, not a tracked objective
- `combined = 335,458` (`issues × 1e6 + html_bytes`)

Reaching the floor required both rule scoping and markup fixes for R17 (heading
order): headings inside `<a class="card">` and inside `role="status"` / `aria-live`
regions are deliberately exempt from R17 because they are correct markup, not
outline defects — do not "fix" them back. The remaining genuine defects were
resolved by converting hero eyebrow `h3`s to `<p class="panel-label">`, promoting
the `tools/diagnostic` priorities subhead to `<h2 class="tool-subhead">`, and
replacing the `tools/automation-finder` KPI `h3`s with `<b>` under a new
`<h2 class="tool-subhead" id="kpiLabel">`. `assets/css/numuw.css` gained the
`.panel-label`, `.tool-subhead` and `.kpi .card b` hooks in `6b2344a` (it is no
longer frozen); each hook reproduces the previous `h3` rendering exactly.

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

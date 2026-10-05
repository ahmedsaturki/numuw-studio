# NUMUW Release Manifest

This repository is a static GitHub Pages-compatible growth hub.

Included:
- Main brand / conversion site with the shared navigation, footer and buyer-journey architecture
- 10 specialized landing pages plus landing hub
- 8 self-service tools plus tools hub
- 5 product pages plus products hub
- Company / Method / Proof / Case Studies / Contact
- Business Library and public PDF exports
- Legal / Trust Center (privacy notice and disclaimer)
- Repository Security Policy + `/.well-known/security.txt`
- Solution Finder + Brief Builder conversion layer
- Sales Discovery + Delivery QA playbooks
- Brand / Media / Insights / Resources
- Shared CSS / JavaScript
- Canonical, Open Graph, Twitter and JSON-LD metadata across public HTML pages
- Accessibility hardening for navigation, dynamic tool results and document controls
- Sitemap / robots / resilient 404
- Dependency-free static audit + GitHub Actions gate
- Explicit performance budget for third-party runtime dependencies
- Cacheable homepage CSS/JS assets
- Privacy-aware measurement specification with inert client-side hooks
- Commercial templates hardened for scope/change control, acceptance, ownership and secure handover
- Conversion, QA, architecture and content policy

Current state:
- Current main release line is consolidated after PR #24.
- Static audit, R1–R17 regression suite and benchmark floor are green on the current main release commit.
- The strategic system review is tracked in `docs/STRATEGIC-SYSTEM-REVIEW-2026-10-05.md`.

Quality boundaries:
- Git/source/tree validation can be completed in the repository.
- Live GitHub Pages browser, mobile and Lighthouse verification remain an external release gate when the published host is not reachable from the execution environment.
- Search Console submission/indexing is operational work, not a claim that source files alone can prove.
# NUMUW Release Manifest

## Product system

- Main conversion site
- 10 specialized landing pages + landing hub
- 8 self-service/decision tools + tools hub
- 5 productized offers + products hub
- Company Center
- Business Library + operating playbooks + public PDFs
- Legal / Trust Center
- Security policy + security.txt
- Solution Finder + Brief Builder

## System hardening

- Shared CSS/JS primitives
- Homepage composition-only CSS layer
- Unified homepage/shared navigation behavior
- Route-level source-of-truth manifest
- Static source audit
- R1–R17 regression harness
- Accessibility hardening
- Performance budget
- Privacy-aware measurement specification
- Commercial scope/change/acceptance controls
- Secure onboarding/handover controls

## Source truth

Current public system must keep `docs/SITE-MANIFEST.json`, sitemap, metadata and route files synchronized.

## Release boundary

### Proven in repository/CI
- source integrity
- deterministic audit rules
- route-manifest coverage
- GitHub Actions audit
- GitHub Pages deployment job

### Must be proven live
- browser/mobile UX
- field/lab Core Web Vitals
- real CTA behavior
- deployed structured data
- indexing/Search Console
- formal legal approval

Never downgrade a live gate into a source-only claim.

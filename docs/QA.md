# NUMUW QA Protocol

## Canonical source release gate

The repository is intentionally build-free and GitHub Pages-compatible. Every public HTML route must pass the dependency-free audit:

`node scripts/release-gate.mjs`

The canonical gate runs the production static audit, the R1–R17 research benchmark and its regression suite as one blocking decision. The individual scanners remain available for diagnosis.

The static audit checks:

- HTML5 doctype, viewport, title, description and one primary H1.
- A canonical URL on every indexable HTML page; `404.html` remains `noindex`.
- Open Graph title/image and Twitter summary metadata.
- Parseable JSON-LD on public pages.
- A real `<main>` landmark and Arabic RTL document language.
- Internal relative links and asset references resolve to existing repository files.
- No `javascript:` URLs.
- External `_blank` links include `rel="noopener"`.
- Images include an explicit `alt` attribute.
- `security.txt` exposes a security-reporting contact and expiry.
- No inline print/event handler is required for the business-document templates.
- `sitemap.xml` and the shared `og-image.png` exist.

## Conversion gate

Before publishing commercial copy, verify:

1. One primary action is obvious.
2. The first step is a diagnosis/fit check when scope is uncertain.
3. Pricing is framed as a reference or written scope where final price depends on requirements.
4. Claims are evidence-backed; no invented testimonials, logos, awards, rankings, revenue or ROI.
5. Product pages explain fit, non-fit, delivery and the next action.
6. Tools explain what they do not measure and route useful results toward the next step.

## Live release gate

Still required outside the source-only environment:

- GitHub Pages live build serves current `main`.
- Browser/mobile UX review.
- Lighthouse/Core Web Vitals.
- WhatsApp and phone CTA verification.
- Rich Results / structured-data validation.
- Search Console sitemap submission and indexing review.

Do not mark these complete from source inspection alone.
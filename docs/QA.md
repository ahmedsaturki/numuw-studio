# NUMUW QA Protocol

## Static release gate

The repository is intentionally build-free and GitHub Pages-compatible. Every public HTML route must pass the dependency-free audit:

`node scripts/numuw-static-audit.mjs`
`node scripts/numuw-system-consistency-audit.mjs`

The audit checks:
- HTML5 doctype, viewport, title, description and one primary H1
- canonical URL and sitemap coverage
- Open Graph / Twitter metadata
- parseable JSON-LD
- main landmark and declared lang/dir
- shared navigation/footer shell
- internal links and asset references
- no `javascript:` URLs or unsafe `target="_blank"` links
- explicit image alt attributes
- security.txt contract
- no inline HTML event handlers
- no third-party runtime script/style dependencies
- duplicate HTML attribute detection (R18)
- 404 noindex contract
- theme contrast invariant

## R1–R18 regression gate

`bench/test-site-quality.mjs` must prove that every quality rule can fail when its corresponding fixture is intentionally broken.

The scanner currently defines R1–R18. R18 rejects duplicate attributes such as repeated `class`, `id`, `aria-*` or other HTML attributes in the same start tag.

Do not weaken a rule merely to reach zero issues.

## Conversion gate

Before publishing commercial copy, verify:
1. One primary action is obvious.
2. A free fit conversation is not described as the paid Diagnostic.
3. Pricing is framed as reference or written scope when requirements determine the final price.
4. Claims are evidence-backed; no invented testimonials, logos, awards, rankings, revenue or ROI.
5. Product pages explain fit, non-fit, delivery, ownership and next action.
6. Tools explain assumptions/limits and route useful results toward a next step.

## System-consistency gate

When a product name, price, scope, CTA, language contract or navigation route changes, check:
- homepage
- landing pages
- tool outputs
- products
- Business Library
- proposals/terms
- conversion/measurement docs

A local page fix is not considered complete if another public layer still contradicts it.

## Live release gate

Still required outside the source-only environment:
- GitHub Pages serves current main
- browser/mobile UX review
- Lighthouse/Core Web Vitals
- live WhatsApp and phone verification
- Rich Results / structured-data validation
- Search Console submission/indexing
- formal legal review

Do not mark these complete from source inspection alone.

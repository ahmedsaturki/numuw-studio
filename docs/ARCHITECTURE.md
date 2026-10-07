# NUMUW Architecture

## Root
`index.html` is the primary commercial entry point. It uses the shared navigation/footer shell, shared JavaScript, and homepage-only CSS in `assets/css/home.css`.

## Landing system
`landing/` contains focused service and industry acquisition pages. Every landing should have one audience, one core problem/promise, one primary CTA and one clear next step.

## Tools
`tools/` contains browser-only decision aids with no external API dependency. They reduce uncertainty and route useful results toward a commercial next step. Numeric results are scenarios/self-assessments unless a page explicitly states otherwise.

## Products
`products/` contains bounded productized offers. The canonical ladder is Diagnostic → Digital Kickoff → Automation Sprint → Growth System → Growth Partner.

Free Fit Conversation is a separate pre-commercial qualification path and is not another name for Diagnostic.

## Business Library
`documents/` contains client-facing commercial and operating documents that can be printed or saved as PDF.

## Proof
`pages/proof/` and `pages/case-studies/` intentionally reserve space for evidence. Do not fabricate proof. The proof system is a commercial operating requirement, not a copywriting placeholder.

## Runtime architecture
The published runtime remains static and dependency-light. Shared HTML shells are currently duplicated across pages; this is a maintainability risk.

Preferred evolution:
- introduce a build-time source of truth for shell/navigation/footer/metadata/product/tool data/translations
- generate static HTML output
- keep the public runtime dependency-free
- add CI to compare generated output and source contracts

Do not add a client runtime framework solely for presentation.

## Measurement
`assets/js/numuw.js` emits inert `tool_start`, `tool_complete` and `cta` intent events. A real business source of truth remains outside browser inference.

## Language
The site is Arabic-first. Only pages explicitly marked `data-localized="true"` should expose the language switch. Long-term bilingual SEO should use explicit locale routes rather than only client-side text replacement.

## Scaling rule
A new public page must:
- reuse the shared shell
- have distinct buyer value
- include canonical/description/JSON-LD
- have a single dominant commercial job
- connect to the relevant tool/product/next step
- be represented in sitemap
- pass R1–R18 and relevant UX checks

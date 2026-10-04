# NUMUW Quality Specification

## A. Source integrity
- Valid HTML5 document structure
- Exactly one non-empty title and meta description on indexable pages
- Exactly one canonical URL and it matches the route
- One H1
- Parseable JSON-LD
- No malformed tag names
- No duplicate IDs
- No inline event handlers
- All relative links and local asset references resolve
- No accidental HTTP links for public assets
- External new-tab links have safe rel attributes

## B. Metadata
Every indexable page should expose:
- title
- description
- canonical
- og:type
- og:site_name
- og:title
- og:description
- og:url
- og:image
- twitter:card
- twitter:title
- twitter:description
- twitter:image

The social URL should equal the canonical URL.

## C. Semantics
- Heading levels should form a sensible outline.
- Navigation landmarks are named.
- Interactive controls have accessible names.
- Forms have labels and usable errors.
- Status/result regions are announced where results change.
- Skip navigation is available.
- Focus remains visible and is not hidden by sticky layers.
- Pointer targets are comfortably sized.

WCAG 2.2 includes requirements around Focus Not Obscured and a 24×24 CSS-pixel minimum target size, with context-specific exceptions. NUMUW should aim for more generous targets where practical.

## D. Commercial integrity
Every offer page must communicate:
- best fit
- not a fit
- deliverables
- exclusions
- dependencies
- time box / engagement cadence
- investment or pricing rule
- acceptance condition
- ownership
- support boundaries
- next action

## E. Content integrity
- No fabricated proof.
- No unsupported outcome claims.
- Industry pages must contain industry-specific reasoning, not only a headline swap.
- New content must add decision value.
- Articles expected to rank should expose authorship/context where appropriate.

## F. Tool integrity
Every tool must state:
- what it calculates or evaluates,
- key assumptions,
- what it does not know,
- what the user should do with the result,
- whether information stays in-browser,
- how the result routes into the next step.

## G. Performance
- No third-party runtime dependency unless justified.
- Local fonts/assets where possible.
- Avoid blocking JavaScript.
- Avoid layout shift.
- LCP target ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1 at the 75th percentile for live validation.

## H. Release
A release requires:
1. source audit pass,
2. deployment pass,
3. browser/mobile verification,
4. performance verification,
5. CTA verification,
6. structured-data validation,
7. indexing review,
8. legal/trust review when policies or data practices change.

Passing the source audit alone is not a production release certificate.

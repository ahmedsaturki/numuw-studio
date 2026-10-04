# Experiment: numuw-site-quality-v3

## Goal
Automatically improve site quality using expanded rules (R1-R21) with autoresearch loop.

## Rules
- R1: `<title>` present and non-empty
- R2: `<meta name="description">` present and non-empty
- R3: `<html lang="...">` present
- R4: `<meta charset=` present
- R5: `<meta name="viewport"` present
- R6: exactly one `<h1`
- R7: `<link rel="canonical">` equals expected route URL (404.html exempt)
- R8: JSON-LD validation
- R9: Image alt attributes
- R10: Internal `href` validation
- R11: Internal `src` validation
- R12: Same-page anchor validation
- R13: Sitemap page coverage
- R14: Sitemap integrity (accepts non-HTML assets)
- R15: Duplicate title check
- R16: Duplicate description check
- R17: H2 usage limit (max 6 per page)
- R18: Semantic HTML elements (header, main, footer, or section)
- R19: Meta robots tag for SEO
- R20: Open Graph tags for social sharing
- R21: Twitter card tags for social sharing

## Baseline
- Issues: 106
- html_bytes: 330,961
- combined: 106,330,961

## Strategy
1. Add missing meta tags (R19, R20, R21)
2. Reduce H2 usage (R17)
3. Add semantic HTML (R18)
4. Maintain existing optimizations

## Off-limits
- og-image.png (235K)
- favicon.svg
- bench/**
- autoresearch.sh

## Notes
- Expanded from 16 to 21 rules
- Baseline is higher due to new rules (106 issues vs 0)
- First improvement opportunity: add meta robots tags

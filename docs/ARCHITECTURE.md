# NUMUW Architecture

## Root
`index.html` = brand / conversion home.

## Landing system
`landing/` contains focused service and industry acquisition pages. Every landing should have one audience, one core promise, one primary CTA and one clear next step.

## Tools
`tools/` contains browser-only tools with no external API dependency. Any numeric result is a self-reported scenario unless a page explicitly says otherwise.

## Products
`products/` contains productized offers. Product pages describe scope, audience, deliverables and commercial next step.

## Business Library
`documents/` contains HTML documents that can be printed or saved as PDF.

## Proof
`pages/proof/` and `pages/case-studies/` intentionally reserve space for real evidence. Do not populate them with fabricated proof.

## Scaling rule
A new public page should reuse `assets/css/numuw.css` and `assets/js/numuw.js`, include canonical/description metadata, have a single primary CTA, and be added to the sitemap.

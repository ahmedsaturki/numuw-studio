# NUMUW | نُمو

**Growth Systems Studio for Egyptian businesses, industrial companies and B2B teams.**

NUMUW is organized as a small digital business system, not a single landing page.

## Public layers

- **Website** - the primary brand and conversion page.
- **Landing Pages** - focused pages for services, offers and industries.
- **Tools** - self-service diagnostic, estimation and scenario calculators.
- **Products** - productized offers with scope and next steps.
- **Documents** - company profile, capability statement, proposal, onboarding, handover and terms.
- **Pages** - company, method, trust, case studies and contact.
- **Brand / Media / Resources / Insights** - supporting assets.

## Principles

1. Problem first.
2. Clear scope before implementation.
3. Test before handover.
4. Ownership and third-party costs are explicit.
5. No invented testimonials, client logos, ROI, revenue or performance numbers.

## Technology

Static HTML/CSS/JS. No framework, build step or runtime backend is required for the public site. Designed for GitHub Pages.

## Local run

Any static server works:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Validation checklist

- Check every hub and landing page.
- Test mobile navigation.
- Test language toggle where enabled.
- Test WhatsApp / phone links.
- Validate canonical URLs after the final domain is chosen.
- Run Lighthouse / Core Web Vitals on the deployed site.
- Validate structured data with Google's Rich Results Test.
- Submit the sitemap in Search Console after the public URL is final.

## Brand clearance

Before major investment in **NUMUW / نُمو**, complete formal trademark, domain and social-handle clearance. The site intentionally does not claim that clearance is complete.

## Business documents

HTML business documents are print-ready. Release PDFs are generated separately and should be refreshed whenever the approved company facts, offers or contact details change.


## Release QA

Run the dependency-free audit locally with:

`node scripts/numuw-static-audit.mjs`

The same audit runs in GitHub Actions on pushes and pull requests. It checks document structure, metadata, JSON-LD validity, internal references, external-link safety, sitemap presence and the shared social image.


## Premium hardening

The latest `main` includes the current release-quality pass for metadata, accessibility, conversion guidance and static QA.


## Legal & Trust

The public system includes a Legal & Trust Center covering the current site's privacy notice and disclaimer. These pages are operational disclosures, not a substitute for legal review or a final contract.

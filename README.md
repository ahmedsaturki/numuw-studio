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
- Keep each page's canonical URL and its `sitemap.xml` entry in sync.
- Run `bash autoresearch.sh` and expect `issues=0` before publishing.

## SEO metadata

Every page carries the metadata a search engine needs to index it unambiguously:

- `<link rel="canonical">` on every page except `404.html`, pointing at its absolute
  `https://ahmedsaturki.github.io/numuw-studio/...` route.
- One `<script type="application/ld+json">` block per page, typed to what the page
  actually is — `Service` for offers and landing pages, `ItemList` for hubs,
  `WebSite` for the brand page, `AboutPage` / `ContactPage` / `HowTo` / `Blog` /
  `ImageGallery` where each fits, `WebPage` for `404.html` and the proof page.
- Schema `name` matches the page `<title>` except on the home page, where the
  block carries the short brand name `NUMUW | نُمو` rather than the longer tagline.
- `areaServed` is the plain string `"Egypt"`; the site is single-market.

Canonical URLs and `sitemap.xml` must change together. Adding or removing a page
without the matching sitemap edit will fail the quality check, by design.

## Quality harness

`bench/site-quality.mjs` is a dependency-free Node script that scores the static
site against 16 structural and SEO rules (R1-R16). It performs no network access,
reads no clock and no random source, so repeated runs are byte-identical.

```bash
bash autoresearch.sh        # or: node bench/site-quality.mjs
```

It prints three machine-readable lines on stdout and one `issues: <n>` line, and
reports every individual violation on stderr:

```text
METRIC issues=0
METRIC total_bytes=626913
METRIC html_bytes=204878
```

Exit status is `0` whenever measurement succeeds, regardless of how many issues
are found; a non-zero exit means the harness itself failed (unreadable
`sitemap.xml`, failed walk). Rule detail lives in
`.autoresearch/engineering/numuw-site-quality/program.md`.

`total_bytes` covers every file the walk reaches, so local binaries sitting in the
repo root count toward it. It is a weight guardrail, not a page-weight metric.

## Brand clearance

Before major investment in **NUMUW / نُمو**, complete formal trademark, domain and social-handle clearance. The site intentionally does not claim that clearance is complete.

## Business documents

HTML business documents are print-ready. Release PDFs are generated separately and should be refreshed whenever the approved company facts, offers or contact details change.

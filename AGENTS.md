# NUMUW Agent Operating Contract

This repository is a commercial growth-studio system, not a benchmark-only website.

## Non-negotiable working rules

1. Read `docs/SYSTEM-ARCHITECTURE.md` before changing public source.
2. Treat the whole system as one product: positioning, IA, content, UX/UI, accessibility, SEO, performance, tools, offers, proof, legal/trust, commercial operations, measurement, CI and deployment all matter.
3. Never optimize one metric, page, file, component or experiment while knowingly degrading another system layer.
4. Never create fabricated testimonials, logos, awards, rankings, revenue, ROI, client names or guarantees.
5. Never use an autoresearch result as proof of business quality. Benchmarks are evidence of the benchmark only.
6. Batch related fixes. Avoid a chain of isolated hotfix commits when one coherent change can be reviewed and reverted.
7. Preserve the build-free GitHub Pages architecture unless a deliberate architecture decision says otherwise.
8. Keep client ownership, secure credential handling, acceptance criteria and change control explicit.
9. Any new public page must have a clear job-to-be-done and a distinct reason to exist. Do not create keyword variants with near-duplicate content.
10. Before merge, run the authoritative release audit and inspect the changed user journeys, not only the modified file.

## Definition of done

A change is not done because the source compiles or CI passes. It is done only when:
- the intended user/business outcome is clear,
- related pages and cross-links remain coherent,
- metadata and structured data remain valid,
- accessibility invariants remain intact,
- the source audit passes,
- the commercial and legal implications are documented when relevant,
- no known regression remains.

## External verification boundary

Source/CI checks do not prove live browser UX, field Core Web Vitals, external-provider behavior, search-indexing state or legal approval. Those remain explicit release gates.

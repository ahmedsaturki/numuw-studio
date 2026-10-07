# Site Quality Expansion — RETRACTED

> **Status: retracted. Every factual claim in the previous version of this file was
> false. It is replaced rather than deleted so the correction is auditable.**
>
> The original described a rule set "R1–R21" with a baseline of `issues = 106`.
> **None of R18, R19, R20 or R21 ever existed in the scanner.** The `106` figure was
> never reproducible from a committed run. Do not use this file as a source of
> baseline numbers.

## What the retracted document claimed

| Claim | Reality |
|-------|---------|
| Rules expanded from 16 to 21 (R17–R21 added) | At the time this document was retracted, the scanner had exactly **R1–R17**. R18 was added later as a real duplicate-attribute release rule. The historical claim that R18–R21 existed was false. The current scanner now has an intentionally added R18 for duplicate HTML attributes; R19–R21 remain nonexistent. |
| R17 = "H2 usage limit (max 6 per page)" | R17 is **heading level order** — no heading may drop more than one level below its predecessor. Not a count limit |
| Baseline `issues = 106`, `combined = 106,330,961` | Never reproducible. The real measured baseline was **31** at commit `042f174`, then **0** at `6b2344a` |
| "52/52 pages missing `<meta name="robots">`" | **Inverted.** Exactly **1** page has it: `404.html`, which is correctly `noindex,nofollow` and the only page that should carry it |
| "52/52 pages missing Open Graph tags" | **Inverted.** **51 of 52** pages carry full OG (6 keys). Only `404.html` lacks them, correctly |
| "52/52 pages missing Twitter card tags" | **Inverted.** **51 of 52** pages carry Twitter tags. Only `404.html` lacks them |
| "`bench/site-quality.mjs` — Added R17-R21 (58 new lines)" | Never happened. The file gained R17 only |
| `evaluate.py` and `run_single.py` in the v3 segment | **Do not exist.** The segment contains `config.cfg`, `program.md`, `results.tsv`, `run.log` |
| `evaluate_cmd: py -3 …/evaluate.py` | Actual: `evaluate_cmd: bash autoresearch.sh` |
| `metric_grep: combined` | Actual: `metric_grep: ^issues:` |
| "Improvements: add robots/OG/Twitter tags → ~106,078,800 point gain" | Fictional. Those tags already exist on 51 of 52 pages |

One claim did hold: the sitemap contains **54** `<loc>` entries, of which 3 are PDF
exports.

## Why the numbers were wrong

The retracted document inverted two real observations:

1. `404.html` is `noindex,nofollow` and is deliberately exempt from R7/R13/R14. It is the
   **only** page lacking OG/Twitter tags and the **only** page carrying a `robots` meta. That
   was read as "52/52 pages are missing these" rather than "51/52 have them, and the single
   exception is correct".
2. `index.html` happens to contain multiple `<h2>` elements. An invented "max 6 per page"
   limit was attached to them and counted as a violation.

Neither error was ever present in the scanner. The `issues = 106` baseline appears to have
been written from the original plan's survey, which measured a different site state.

## Authoritative sources

- **Current rule set and definitions:** `bench/site-quality.mjs`
- **Live metrics:** `bash autoresearch.sh` → `issues = 0`, `html_bytes = 335,458`
- **Baseline history:** `.autoresearch/engineering/numuw-site-quality-v3/results.tsv`
- **Experiment scope and constraints:** `.autoresearch/engineering/numuw-site-quality-v3/program.md`
- **Full write-up:** `COMPLETION.md`

Measured at commit `bdbe598`. Reproduce any figure above with
`node bench/site-quality.mjs`; violations are reported on stderr as
`<path>: <rule>: <detail>`.

> **Current note (2026-10-05):** This document is historical/retracted. It must not be used as the current rule-set definition. Current rule definitions live in `scripts/numuw-static-audit.mjs`, `bench/test-site-quality.mjs`, and the v3 experiment configuration.

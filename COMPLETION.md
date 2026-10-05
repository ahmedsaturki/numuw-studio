# NUMUW Harness — Historical Completion Record

This file is retained as historical context for the deterministic site-quality harness.

## Historical baseline

The historical R1–R17 harness reached:
- `issues = 0`
- `html_bytes = 335,458`

The major R17 work classified false positives separately from genuine heading-order defects and then repaired the genuine defects without weakening the markup model.

## Important historical note

Older sections of this file described an intermediate state and an earlier interpretation of the autoresearch objective. Those statements are not the current governing contract.

Current authoritative sources are (the release audit has since added R18 for duplicate HTML attributes):
- `README.md`
- `.autoresearch/engineering/numuw-site-quality-v3/config.cfg`
- `.autoresearch/engineering/numuw-site-quality-v3/program.md`
- `docs/STRATEGIC-SYSTEM-REVIEW-2026-10-05.md`

The current production/release state is determined from the current `main` commit and its latest CI/Pages runs, not from this historical record.

## Current engineering principles

- The quality scanner must remain deterministic.
- Regression tests must prove that every release rule can still fail when violated.
- Do not weaken a rule simply to reach zero.
- Do not use fabricated performance, customer or revenue evidence.
- Static source correctness and live production verification are separate gates.

See `docs/QA.md` for the current release process.

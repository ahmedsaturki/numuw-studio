# NUMUW System of Truth

## Purpose

This file defines the authoritative operating model for the public NUMUW system. A page, tool, product, document or experiment is not allowed to become a separate island.

## North-star chain

**Audience → Problem → Evidence → Decision → Offer → Delivery → Acceptance → Handover → Measurement → Improvement**

Every major asset must strengthen at least one transition in this chain and must not silently break another.

## Canonical commercial model

The public product ladder is authoritative across Home, Solutions, Industries, Tools, Products and commercial documents:

Diagnostic → Digital Kickoff → Automation Sprint → Growth System → Growth Partner

The homepage may present the four execution offers plus Diagnostic as the low-commitment entry path, but must not invent substitute product names such as Presence.

Reference pricing anchors are maintained only in docs/OFFER-MATRIX.md and must match product pages.

## Information architecture

### Primary navigation
Home · Solutions · Industries · Tools · Products · Proof · About

### Primary conversion path
Start Here → Diagnostic / Solution Finder / Brief Builder → scoped conversation → proposal → delivery

### Secondary
Resources → Insights / Business Library

Trust
→ Legal & Trust → Privacy → Disclaimer → Security reporting

Legacy compatibility
→ /landing/ remains public for old links, but new acquisition links prefer Solutions / Industries.

## Surface contracts

### Page
Every indexable page needs a single job, audience/context, meaningful content, one primary action, canonical metadata, structured data appropriate to the visible content, accessible navigation and working local references.

### Solution
Explains the business problem, fit, mechanism, deliverables, constraints and next step.

### Industry
Changes the buying logic, proof, economics, workflow or measurement for the sector. A headline-only variant is invalid.

### Tool
States purpose, inputs, assumptions, limits, in-browser/privacy behavior and next action.

### Product
States fit, non-fit, scope, exclusions, dependencies, time/cadence, investment rule, acceptance, ownership, support and next action.

### Document
States its commercial/operational purpose, version status, owner, source of truth and whether it is a template or final policy.

## Source of truth hierarchy

1. Signed commercial agreement
2. Approved scope / proposal
3. Client-owned business data and source systems
4. Repository source
5. Public marketing copy
6. Experiments / scenarios

A lower layer must never overrule a higher layer.

## Evidence hierarchy

- Observed fact
- First-hand artifact
- Measured outcome with source/scope
- External benchmark
- Scenario
- Hypothesis

Never present a scenario or benchmark as a measured outcome.

## Change control

Every change belongs to one coherent objective. Before merge ask:
- What user/business problem does this solve?
- Which routes are affected?
- Which cross-links are affected?
- Which schema / SEO / accessibility contracts are affected?
- Which commercial/legal claims are affected?
- What must be retested?
- What is deliberately out of scope?

## Release authority

The whole-system audit is authoritative for source contracts.
GitHub Actions is authoritative for repository/CI pass.
Pages deployment proves the deployment job completed.
Live browser, performance, external-provider, indexing and legal checks remain separate gates.

## Anti-sprawl rule

Do not create:
- duplicate routes for the same intent,
- near-duplicate landing pages,
- extra tools without a distinct decision value,
- extra products without a distinct buying job,
- extra documentation that conflicts with the approved source of truth.

NUMUW should become deeper before it becomes larger.

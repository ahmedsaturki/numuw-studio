# NUMUW Reference Benchmarks

This document records external patterns studied for system design. NUMUW should learn the principles, not copy the brands.

## Google Search

Google's current guidance emphasizes people-first content, clear audience value, first-hand expertise, satisfying answers and an overall good page experience. It explicitly warns against producing lots of search-engine-first content without distinct user value.

Reference:
https://developers.google.com/search/docs/fundamentals/creating-helpful-content

Google also states that structured data must accurately represent visible content and does not guarantee a rich-result appearance simply because markup is valid.

Reference:
https://developers.google.com/search/docs/appearance/structured-data/sd-policies

Implication for NUMUW:
- fewer, stronger routes
- distinct decision value per route
- structured data only where it matches visible content
- validate against deployed URLs, not source syntax alone

## WCAG 2.2

WCAG 2.2 includes Focus Visible, Focus Not Obscured and Target Size (Minimum) among its criteria. These matter particularly for NUMUW because the site uses sticky navigation, fixed contact affordances and interactive decision tools.

Reference:
https://www.w3.org/TR/wcag/

Implication for NUMUW:
- keyboard states are first-class UI
- fixed elements must not hide focus
- interactive controls should be comfortably targetable
- accessibility is part of release QA, not a cosmetic pass

## Core Web Vitals

Current good thresholds used by the performance budget:
- LCP ≤ 2.5s
- INP ≤ 200ms
- CLS ≤ 0.1

References:
https://web.dev/articles/lcp
https://web.dev/articles/inp
https://web.dev/articles/cls

Implication for NUMUW:
- static/local architecture is a strategic advantage
- avoid third-party runtime dependencies by default
- measure real deployment performance rather than infer it from file size

## thoughtbot — process and case-study pattern

thoughtbot's case studies consistently connect challenge, solution/process, outcome and the client's next capability. Some examples explicitly show discovery, assumptions, validation, roadmap, technical recommendation and handoff artifacts.

References:
https://thoughtbot.com/case-studies
https://thoughtbot.com/case-studies/distribute
https://thoughtbot.com/case-studies/grandstand
https://thoughtbot.com/case-studies/steel-warriors

What NUMUW should learn:
- sell a process, not just a capability list
- make assumptions visible
- show what becomes possible after delivery
- leave clients with a repeatable operating method where appropriate

## Clay — portfolio taxonomy

Clay organizes work by categories such as branding, websites and digital products while attaching concrete service labels to individual cases.

References:
https://clay.global/work
https://clay.global/work/brand
https://clay.global/work/web

What NUMUW should learn:
- make portfolio navigation understandable
- tag work by problem/capability
- let evidence tell a story of range without creating generic SEO pages

## McKinsey — outcome and industry storytelling

McKinsey's case-study system often frames work around organizational or operational change, with a strong emphasis on context, intervention and measurable impact.

References:
https://www.mckinsey.com/about-us/case-studies
https://www.mckinsey.com/capabilities/tech-and-ai/case-studies

What NUMUW should learn:
- case studies should connect intervention to business context
- sector pages should explain the operational problem, not only repeat service names
- impact should be documented with evidence and context

## 37signals — ownership clarity

37signals explicitly documents account/data ownership and how account ownership is assigned.

Reference:
https://37signals.com/policies/ownership

What NUMUW should learn:
- ownership is part of the product experience
- client-owned accounts should be the default where practical
- handover should be explicit, not assumed

## Design implication

The benchmark set points toward one NUMUW operating principle:

**Diagnose clearly → explain the reasoning → show evidence → scope honestly → build carefully → transfer ownership → keep improving.**

That principle is now reflected in the NUMUW master system and route manifest.

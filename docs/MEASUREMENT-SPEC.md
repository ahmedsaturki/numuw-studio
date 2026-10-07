# NUMUW Measurement Specification

This document defines the safe measurement contract for the public NUMUW site.

## Current state

The repository does not ship an analytics vendor or tracking pixel. The shared JavaScript emits inert browser events for CTA intent and tool start/completion, and only forwards them to `window.dataLayer` when a consumer has already created that array.

## Core funnel

`Landing view → Tool start → Tool completion → CTA intent → Free fit conversation → Qualified conversation → Paid diagnostic or scoped proposal → Won work`

Only the first four stages are suitable for browser instrumentation. The later stages belong to the business system of record and must not be inferred from browser events.

## Event taxonomy

### cta

Generated for meaningful WhatsApp, phone, product, tool and document interactions.

Safe fields:
- `kind`
- current page pathname

Do not include message text, phone numbers, names, email addresses, form values or free-form user input.

### tool_start / tool_complete

Generated when a tool interaction starts and when its result has actually rendered successfully.

Safe fields:
- tool/page pathname
- completion signal

Do not record answers, financial assumptions or other user-provided fields unless a documented business purpose, lawful basis and retention policy exists.

## Principles

- Event names describe user intent, not marketing conclusions.
- Revenue attribution requires an agreed business source of truth.
- A click is not automatically a lead.
- A lead is not automatically qualified.
- A proposal is not automatically won.
- Separate mobile and desktop when evaluating Core Web Vitals.
- Any future analytics vendor, chat widget or tracking component must be reviewed against the Legal & Trust Center, privacy obligations and performance budget before deployment.

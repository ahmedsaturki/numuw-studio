# NUMUW Measurement Specification

This specification defines what NUMUW may measure later without forcing analytics into the public site today.

## Current state

The repository does not ship an analytics vendor or tracking pixel. The shared JavaScript exposes inert browser events and only forwards them to `window.dataLayer` when a consumer has already created that array.

## Core funnel

`page_view → tool_start → tool_complete → cta_intent → qualified_conversation → scoped_proposal → won_work`

The public site now emits inert `tool_start` / `tool_complete` events from the shared decision-tool runtime. Only the first four stages are suitable for client-side instrumentation. The later stages are business records and should not be inferred from a browser event.

## Event taxonomy

### cta
Generated for meaningful WhatsApp, phone, diagnostic, product, tool and document interactions.

Safe fields:
- `kind`
- current page pathname

Do not include message text, phone numbers, names, email addresses, form values or free-form user input.

### tool_start / tool_complete
The current shared tool runtime records only the tool name. `tool_start` fires on first user input/change and `tool_complete` fires on submission. Do not record answers or financial assumptions. This remains a first-party intent signal, not a lead or revenue signal.

## Measurement principles

- Event names describe user intent, not marketing conclusions.
- Revenue attribution requires an agreed source of truth outside the browser.
- Do not treat a click as a lead, a lead as qualified, or a proposal as won.
- Separate mobile and desktop when evaluating Core Web Vitals.
- Any future analytics vendor must be reviewed against the Legal & Trust Center, privacy notice and performance budget before deployment.
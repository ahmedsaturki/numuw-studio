# NUMUW Measurement Specification

This specification defines the safe measurement contract for the public site.

## Current state

The repository does not ship an analytics vendor or tracking pixel. The shared JavaScript emits inert browser events for CTA intent and tool start/completion, and only forwards them to `window.dataLayer` when a consumer has already created that array.

## Core funnel

`page_view → tool_start → tool_complete → cta_intent → qualified_conversation → scoped_proposal → won_work`

Only the first four are suitable for client-side site instrumentation. The later stages are business records and should not be inferred from a browser event.

## Event taxonomy

### cta
Generated for meaningful WhatsApp, phone, diagnostic, product, tool and document interactions.

Safe fields:
- `kind`
- current page pathname

Do not include message text, phone numbers, names, email addresses, form values or free-form user input.

### tool_start / tool_complete
When instrumented, record tool name and completion state. Do not record answers or financial assumptions unless the organization has a documented purpose, lawful basis and retention policy for that data.

## Measurement principles

- Event names describe user intent, not marketing conclusions.
- Revenue attribution requires an agreed source of truth outside the browser.
- Do not treat a click as a lead, a lead as qualified, or a proposal as won.
- Separate mobile and desktop when evaluating Core Web Vitals.
- Any future analytics vendor must be reviewed against the Legal & Trust Center, privacy notice and performance budget before deployment.
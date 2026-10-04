# NUMUW Performance Budget

The public site is intentionally static and dependency-light.

## Budget

- No third-party runtime JavaScript.
- No third-party stylesheet or font dependency.
- No remote CSS `@import`.
- Keep shared JavaScript small and avoid blocking work in event handlers.
- Prefer local assets and deterministic dimensions whenever imagery is introduced.
- Avoid layout-changing late injections into the viewport.
- Any future analytics, chat widget, map, video embed or third-party component must be justified, reviewed for privacy/consent impact where applicable, and measured against Core Web Vitals.

## Live targets

For production validation, target Google's current good thresholds:

- LCP: 2.5 seconds or less.
- INP: 200 milliseconds or less.
- CLS: 0.1 or less.

Use the 75th percentile and segment by mobile and desktop. Lab testing is useful for diagnosis; field data is the stronger proof of real-user performance.

## Release rule

The static audit enforces the no-third-party-script/style budget. Live Lighthouse/PageSpeed validation remains a deployment gate because source inspection cannot prove actual network, device and field performance.
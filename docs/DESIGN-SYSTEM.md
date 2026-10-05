# NUMUW Design System

## Goal

One recognizable NUMUW interface across the entire site, with controlled variation by page type.

## Tokens

Canonical tokens live in `assets/css/numuw.css`.

- Navy: primary text, headings, deep surfaces.
- Teal: primary action / accent.
- Gold: restrained supporting accent.
- Paper / white: content surfaces.
- Muted: secondary text.
- Line: borders and separators.
- Soft: highlighted utility backgrounds.

Do not create a second token vocabulary in page CSS. Homepage composition may use spacing/section-specific rules but must consume the shared semantic tokens.

## Core components

### Header
One shared structure:
- brand
- primary navigation
- optional language control only when real localization exists
- mobile menu
- one primary contact CTA

### Buttons
- Primary: the one action we most want the user to take.
- Dark: high-contrast secondary/action in dark contexts.
- Outline: navigation or lower-priority action.
- All interactive targets are at least 44px high in the shared system.

### Cards / Panels
Cards explain one decision or concept. They should not become anonymous containers for repeated filler.

### Forms
Every visible form control must have an accessible label association.
Every submit button must declare `type="submit"`.
Every non-submit control must declare `type="button"`.
Validation and result status must be announced when content changes.

### Typography
- One type family unless a reviewed brand exception exists.
- H1 is page-level only.
- H2 groups sections.
- H3 labels a subsection within an H2.
- No heading skips simply for visual size.

### Focus
Use the shared two-tone visible focus treatment. Never remove focus styling for aesthetics.

### Motion
Useful, brief and optional. Respect `prefers-reduced-motion`.

### Imagery
Use imagery when it increases understanding or trust. Decorative imagery should remain lightweight and have explicit alt behavior.

## Page-type compositions

### Home
Higher visual expression, but same tokens/components.

### Solutions
Hero → problem → mechanism → fit/non-fit → evidence → CTA.

### Tools
Input → explanation → result → interpretation → limitation → next step.

### Products
Fit → scope → deliverables → dependencies → acceptance → investment → next step.

### Proof
Case/evidence first. If no proof exists, say so and show the proof standard rather than manufacturing trust.

### Documents
Print-friendly, operational, low-distraction and optimized for scanning.

### Legal
Plain, explicit, scoped and easy to verify.

## Responsive rule

Mobile is not a reduced desktop. Content priority, CTA order, navigation, forms and touch targets must be evaluated separately.

## Accessibility rule

Design must be judged by keyboard navigation, focus visibility, reading order, target sizing, labels, contrast and reduced-motion behavior—not only by screenshots.

# NUMUW Design System

## Visual foundation

The shared public UI uses a restrained system designed for trust, clarity and speed.

### Core tokens

- Navy: `#081321`
- Navy 2: `#10243d`
- Teal: `#08766e`
- Teal 2: `#21c6b6`
- Gold: `#d9a441`
- Background: `#f5f7fa`
- Paper: `#ffffff`
- Text: `#122033`
- Muted: `#5f7084`
- Border: `#dfe6ee`

These values are defined in `assets/css/numuw.css` and should not be recreated per page.

## Typography

Default font stack:
`Segoe UI, Tahoma, Arial, sans-serif`

Use:
- large, short H1 for the page job
- H2 for section hierarchy
- compact eyebrow labels for category/context
- readable body copy with strong contrast
- mixed Arabic/English only when the English term adds useful precision

## Layout

Shared container:
`max-width: 1160px`

Default mobile gutters:
`18px`

Primary spacing should be driven by the shared component rhythm rather than arbitrary per-section values.

## Components

### Navigation

All public pages except the special 404 route should use the shared navigation contract:

- `.site-header`
- `.container.nav`
- `.brand / .brand-mark / .brand-name / .brand-sub`
- `.navlinks[data-nav]`
- `.nav-actions`
- `.lang-btn[data-lang-btn]`
- `.menu-btn[data-menu]`
- one primary contact action

Behavior belongs in `assets/js/numuw.js`.

### Buttons

Use:
- `.btn.btn-primary` for the primary action
- `.btn.btn-dark` for strong secondary navigation
- `.btn.btn-outline` for lower-emphasis actions

Do not invent a new button variant for a single page without a system reason.

### Panels and cards

- `.panel` = grouped decision / form / output area
- `.card` = reusable information unit
- `.steps` = ordered process
- `.notice` = caveat / boundary / important note

### Forms and tools

Inputs use shared `.field` and form controls. Results should use `role="status"` or `aria-live` where the user needs notification after interaction.

## Interaction states

Every interactive control must have:
- normal
- hover where meaningful
- visible keyboard focus
- usable mobile target size
- reduced-motion-safe behavior

Do not rely on color alone to communicate focus or state.

## Homepage composition

The homepage may use a custom composition layer in `assets/css/home.css`, but it must rely on shared primitives from `assets/css/numuw.css`. It must not create a second navigation, button, localization or measurement system.

## Content system

Visual hierarchy follows the commercial journey:

`Context → Problem → Method → Proof → Offer → Next action`

Tools use:

`Question → Input → Result → Interpretation → Next action`

Products use:

`Fit → Scope → Deliverables → Boundaries → Investment → Acceptance → Next action`

## Imagery

Do not add decorative imagery merely to make pages look richer.

When imagery is used:
- it must support comprehension or trust
- it must have meaningful alt text where informational
- dimensions should be deterministic
- avoid external image dependencies by default
- do not manufacture fake client environments or proof

## Localization

The site is Arabic-first. The English layer is used where the page actually provides a coherent English version.

The shared localization system supports:
- text attributes: `data-ar` / `data-en`
- authored rich labels: `data-html-ar` / `data-html-en`

Rich HTML localization must only contain trusted, authored markup.

## CSS ownership rule

- Shared component behavior/style: `assets/css/numuw.css`
- Homepage-only composition: `assets/css/home.css`
- No new page-level stylesheet unless a distinct reusable system cannot be expressed cleanly through the shared layer.

## JS ownership rule

- Shared navigation, localization, focus behavior, outbound-link hardening, measurement hooks and document controls: `assets/js/numuw.js`
- Avoid page-specific JavaScript unless a tool or interaction truly needs local logic.
- Keep user data in the browser unless a documented business requirement justifies server-side processing.

## Quality rule

A design change is accepted only when it improves at least one of:
- comprehension
- decision confidence
- conversion clarity
- accessibility
- performance
- maintainability

Adding visual complexity without one of those benefits is not a quality improvement.

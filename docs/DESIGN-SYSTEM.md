# NUMUW Design System

## Brand tokens

Canonical:
- `--navy: #081321`
- `--navy2: #10243d`
- `--teal: #08766e`
- `--teal2: #21c6b6`
- `--gold: #d9a441`
- `--bg: #f5f7fa`
- `--paper: #ffffff`
- `--ink: #122033`
- `--muted: #5f7084`
- `--line: #dfe6ee`
- `--soft: #e8f7f5`

## Layout

- Max content width: 1160px.
- Default horizontal gutter: 18px mobile / 18–22px desktop.
- Consistent section rhythm.
- Two-column layouts collapse to one column below the shared breakpoint.
- No horizontal overflow.
- Sticky header spacing must reserve scroll clearance.

## Typography

Primary UI font stack:
`"Segoe UI", Tahoma, Arial, sans-serif`

Hierarchy:
- H1 = page promise / decision
- H2 = major content block
- H3 = component-level heading
- Body = readable decision-support text

Do not use heading tags only for visual size.

## Components

Canonical components:
- skip link
- sticky site header
- global navigation
- breadcrumb
- eyebrow
- H1 / lead
- CTA group
- panel
- card
- metric block
- step
- notice
- form field
- result block
- footer

## Buttons

- Primary = one dominant action per decision area.
- Dark = secondary high-contrast action.
- Outline = tertiary / exploration.
- Minimum interactive height: 44px in this system.
- Focus ring uses a visible two-tone treatment.

## Forms

- Label every control.
- Keep labels persistent and above controls.
- Use `for/id` associations.
- Use `required`, `min/max`, `step` and input types that match the task.
- Error messages must tell users what is wrong and how to recover.
- Do not clear valid user input after recoverable errors.

## Motion

Respect `prefers-reduced-motion`.
Avoid animation that moves content unexpectedly.

## Imagery

- Local assets by default.
- Deterministic dimensions when practical.
- No image is introduced just to fill empty space.
- Proof imagery should identify source/context when published.

## Accessibility

Target WCAG 2.2 AA-compatible practices:
- visible focus
- focus not obscured
- adequate target size
- semantic headings
- semantic landmarks
- labelled form controls
- keyboard operability
- status announcements for dynamic results

## CSS discipline

Prefer shared classes and tokens over page-level inline styles.

Inline style is allowed only for documented exceptions; it should not become the default page-authoring pattern.

## Responsive verification

At minimum test:
- narrow mobile
- standard mobile
- tablet
- desktop

Check:
- nav
- CTA wrapping
- forms
- cards
- sticky elements
- fixed WhatsApp control
- focus visibility
- print documents

# NUMUW Design System

## Core tokens

- Navy: #081321
- Navy 2: #10243D
- Teal action: #08766E
- Teal accent: #21C6B6
- Gold: #D9A441
- Background: #F5F7FA
- Paper: #FFFFFF
- Ink: #122033
- Muted: #5F7084
- Line: #DFE6EE

Teal action is intentionally dark enough for white text. Changes must preserve accessible contrast.

## Typography

Primary UI font stack:
Segoe UI, Tahoma, Arial, sans-serif

Hierarchy:
- H1 = page / promise
- H2 = section
- H3 = card / subsection
- eyebrow = label, not heading
- body = decision-supporting explanation

Do not use heading tags for decorative labels.

## Components

### Header
One global destination model:
- Solutions
- Tools
- Products
- Proof
- Company
- Resources

Primary CTA remains visually distinct.

### Breadcrumb
Inner pages should expose orientation after the global header.

### Hero
Every page should answer within the first viewport:
- what this is
- who it is for
- what problem it solves
- the next action

### Cards
Cards represent a decision, not decoration.
Avoid grids where every card says approximately the same thing.

### CTA
Prefer one dominant action per section. Secondary actions should support comparison or qualification.

### Forms
Every user-input control needs an accessible name.
Do not collect information that is unnecessary for the decision.

### Focus
Keyboard focus must remain visible and must not be hidden by sticky elements.

### Motion
Motion is restrained and disabled/reduced when a user requests reduced motion.

## Responsive rule

Design for narrow screens first:
- no horizontal overflow
- touch targets at least 44px in the current implementation
- navigation collapses into a keyboard-accessible menu
- sticky/fixed elements must not obscure focused controls

## Imagery

When real images are introduced:
- use locally hosted assets by default
- provide intrinsic dimensions
- provide responsive variants when useful
- use meaningful alt text
- avoid decorative imagery that competes with the decision

Responsive images can reduce wasted data and improve image-driven LCP performance. Use width-aware variants where the image is substantial.

## No visual inconsistency rule

Do not introduce:
- a second button system
- another card radius family
- another primary color
- unrelated shadows
- decorative gradients without a decision role
- third-party font loaders

A page may use a specialized layout, but it must still feel like NUMUW.

## QA

Any design-system change should be checked for:
- desktop + mobile layout
- focus visibility
- contrast
- reduced motion
- overflow
- text wrapping at Arabic/English boundaries

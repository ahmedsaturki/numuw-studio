# NUMUW source normalization helper
# This file documents the safe normalization rules used during release review.
# It is intentionally non-destructive: it reports targets rather than rewriting files.

Rules:
1. One title and one meta description per indexable HTML page.
2. Canonical must be a real link rel="canonical" with the expected Pages URL.
3. OG/Twitter metadata must use exact attribute names and content values.
4. No malformed tag names such as h2ink or h3ink.
5. No inline event handlers.
6. Every public page uses the shared navigation contract.
7. Product pages expose fit, non-fit, scope, deliverables, ownership and acceptance.
8. Tool pages expose assumptions, limits and the next action.
9. New pages need distinct decision value; do not create keyword-only duplicates.

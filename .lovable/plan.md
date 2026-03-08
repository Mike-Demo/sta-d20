

# Merge Accessibility Schema into Main Schema

## Change

In `index.html`:

1. **Remove** the entire second `<script type="application/ld+json">` block (the `AccessibilityStatement` schema, roughly lines 95–148).

2. **Add** the following properties to the existing `SoftwareApplication` schema (which already has some accessibility fields): `accessibilityAPI`, `accessibilityControl`, `accessibilitySummary` — the three fields present in the standalone schema but missing from the main one. The main schema already contains `accessibilityFeature`, `accessibilityHazard`, `accessMode`, and `accessModeSufficient`.

The main schema already has `isAccessibleForFree: true`, author/provider info, and the accessibility arrays, so only the three missing fields need merging.


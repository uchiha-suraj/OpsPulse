# OpsPulse — Decision Log

## Document status

- Current through Step 9
- Last updated: November 5, 2026

This file records decisions that materially affect architecture, state ownership, dependencies, scope, accessibility, or debugging. Small implementation details that do not change those boundaries do not require separate entries.

## D-023 — Use Tailwind CSS v4 through the Vite plugin

- Status: confirmed
- Roadmap step: 9

OpsPulse uses Tailwind CSS v4 with `@tailwindcss/vite`. Design tokens live in CSS rather than a JavaScript configuration file. This matches the approved Figma handoff and keeps the generated interface CSS-only at runtime.

## D-024 — Use semantic CSS theme tokens

- Status: confirmed
- Roadmap step: 9

Components use semantic utilities such as canvas, surface, foreground, accent, border, focus, and status. Dark and light themes replace token values without changing component classes. Severity colours remain fixed across themes.

## D-025 — Make dark the deterministic default theme

- Status: confirmed
- Roadmap step: 9

Dark is the approved primary design. A saved manual preference overrides the default. Missing, invalid, or inaccessible storage falls back to dark.

## D-026 — Let Zustand own the theme preference

- Status: confirmed
- Roadmap step: 9

Zustand is the only runtime owner of `dark | light`. The validated preference is persisted under `opspulse:theme`. Presentation components do not access storage directly, and storage failure does not block the application.

## D-027 — Use typed class variants and conflict-safe composition

- Status: confirmed
- Roadmap step: 9

Class Variance Authority defines typed component variants. `clsx` handles conditional values, and `tailwind-merge` resolves conflicting utilities supplied through `className`.

## D-028 — Use Lucide React for the icon system

- Status: confirmed
- Roadmap step: 9

Lucide supplies consistent, tree-shakeable interface icons. Decorative icons are hidden from assistive technology, and icon-only actions still require accessible text.

## D-029 — Install Radix by primitive, not as speculative infrastructure

- Status: confirmed
- Roadmap step: 9

Only Checkbox, Select, and Tooltip were installed because the current component scope requires their accessible interaction mechanics. Dialog, Popover, Toast, and other primitives remain deferred until a real workflow requires them.

## D-030 — Keep Step 9 components domain-neutral

- Status: confirmed
- Roadmap step: 9

Step 9 implements generic buttons, controls, surfaces, feedback, loading, tooltip, identity, and empty-state primitives. Incident-specific badges, dashboard cards, filters, pagination, timelines, dialogs, and toast workflows remain with their feature steps.

## D-031 — Keep the component gallery development-only

- Status: confirmed
- Roadmap step: 9

The component gallery is exposed through a lazy route only when `import.meta.env.DEV` is true. It supports manual visual and keyboard review without adding a Version 1 production route.

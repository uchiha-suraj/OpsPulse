# OpsPulse — Decision Log

## Document status

- Current through Step 10
- Last updated: November 6, 2026

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

## D-032 — Use 1024 pixels as the application-shell breakpoint

- Status: confirmed
- Roadmap step: 10

Desktop layouts at 1024 pixels and wider use a 232-pixel sidebar that can collapse to 64 pixels, a 56-pixel top bar, and 24-pixel content padding. Smaller layouts replace the sidebar with a 52-pixel mobile top bar, a navigation drawer, and 16-pixel content padding.

## D-033 — Expose only confirmed Version 1 destinations

- Status: confirmed
- Roadmap step: 10

The shared navigation contains Dashboard and Incidents only. Services, Settings, notifications, global search, a global Create Incident action, and the multi-tenant “Acme Platform” label are excluded until they have an approved functional purpose.

## D-034 — Split desktop and mobile navigation state by scope

- Status: confirmed
- Roadmap step: 10

The desktop sidebar's collapsed state belongs to a non-persisted Zustand layout store because the sidebar and content shell both consume it. The mobile drawer belongs to local `AppShell` state because no unrelated module needs it. React Router remains the source of truth for the active route.

## D-035 — Add Radix Dialog and Dropdown Menu only for current layout needs

- Status: confirmed
- Roadmap step: 10

Radix Dialog provides focus management, Escape handling, overlay, and portal behaviour for mobile navigation and reset confirmation. Radix Dropdown Menu provides accessible user-menu interaction. These packages were introduced for implemented behaviours rather than speculative future components.

## D-036 — Use one shared demo-user configuration

- Status: confirmed
- Roadmap step: 10

Ananya Rao's name, role, on-call status, and initials live in one application configuration module reused by mock people data and the shared user menu. This prevents the identity and avatar mismatch identified in the deferred Figma backlog.

## D-037 — Keep Reset Demo Data behind the application API boundary

- Status: confirmed
- Roadmap step: 10

The layout action calls a typed application service that sends `POST /api/demo/reset`; it does not access `localStorage` or the mock repository directly. Confirmation is required, pending state prevents duplicate activation, errors preserve current data, and a successful reset clears the TanStack Query cache before returning to the dashboard.

## D-038 — Keep the component gallery outside the product shell

- Status: confirmed
- Roadmap step: 10

The development-only component-gallery route is defined beside, rather than beneath, `AppRoot`. This lets shared components be reviewed without product navigation or layout styles and keeps the production route map unchanged.

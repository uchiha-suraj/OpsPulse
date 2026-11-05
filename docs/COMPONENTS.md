# OpsPulse — Component Inventory

## Document status

- Current through Step 9
- Last updated: November 5, 2026
- Scope: domain-neutral design-system primitives

## Ownership boundary

`src/components/ui` contains components that can render without understanding incidents, services, dashboard metrics, routes, API responses, or persistence records.

Feature components may compose these primitives, but shared primitives must not import feature modules. Business values, mutations, form state, query state, and URL state remain with their documented owners.

## Styling foundation

| Module                                | Responsibility                                                       |
| ------------------------------------- | -------------------------------------------------------------------- |
| `src/styles/tokens.css`               | Semantic dark/light colours, typography, radius, and severity tokens |
| `src/styles/global.css`               | Tailwind import, token import, and browser-wide element defaults     |
| `src/lib/utils/cn.ts`                 | Conditional class composition and Tailwind conflict resolution       |
| `src/app/stores/themeStore.ts`        | Active theme and guarded preference persistence                      |
| `src/app/providers/ThemeProvider.tsx` | Synchronizes the theme store with the document attribute             |

Tailwind utilities consume semantic names such as `bg-canvas`, `bg-surface`, `text-foreground`, `border-border`, and `ring-focus-ring`. Components must not repeat raw Figma colour values.

## Implemented primitives

| Component    | Purpose                                                               | State owner                            | Important behaviour                                                               |
| ------------ | --------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------- |
| `Button`     | Primary, secondary, ghost, destructive, disabled, and loading actions | Parent owns pending and business state | Loading disables interaction and exposes `aria-busy`                              |
| `IconButton` | Accessible icon-only action                                           | Parent                                 | Requires an accessible `label`; icon is decorative                                |
| `Input`      | Labelled single-line field                                            | Parent or future React Hook Form       | Stable ID connects label, description, and error                                  |
| `Textarea`   | Labelled multiline field                                              | Parent or future React Hook Form       | Supports vertical resizing and accessible error text                              |
| `Checkbox`   | Checked, unchecked, and indeterminate choice                          | Parent or form                         | Radix owns keyboard mechanics; caller handles `true`, `false`, or `indeterminate` |
| `Select`     | Labelled custom selection control                                     | Parent or form                         | Radix owns open, highlight, focus, and portal mechanics                           |
| `Badge`      | Domain-neutral compact label                                          | Parent                                 | Tone is visual only; domain mappings remain outside the primitive                 |
| `Avatar`     | Initials-based identity marker                                        | Parent supplies identity               | Derives initials and avoids duplicate announcements when decorative               |
| `Card`       | Reusable bordered surface                                             | None                                   | Does not impose heading hierarchy or feature spacing                              |
| `Skeleton`   | Loading placeholder                                                   | Containing feature                     | Hidden from assistive technology and respects reduced motion                      |
| `Alert`      | Inline feedback surface                                               | Parent                                 | Visual tone does not automatically assign a live-region role                      |
| `Tooltip`    | Supplemental hover/focus explanation                                  | Radix owns temporary open state        | Essential meaning must still exist in visible text or an accessible label         |
| `EmptyState` | Generic empty-result presentation                                     | Feature owns cause and recovery        | Feature supplies the correct message, icon, and action                            |

## Component state rules

- Server and request state belongs to TanStack Query.
- Form values and validation will belong to React Hook Form and Zod.
- Shareable incident-list controls belong to URL parameters.
- Theme belongs to Zustand.
- Radix may own temporary focus, open, highlight, and pointer interaction state.
- A primitive receives business state through props and emits events through callbacks.
- Derived presentation values should be calculated instead of stored again.

## Re-render triggers

- `Button`, `IconButton`, `Input`, `Textarea`, `Checkbox`, `Select`, `Badge`, `Avatar`, `Alert`, and `EmptyState` re-render when their parent supplies different props.
- `ThemeProvider` re-renders only when the selected theme value changes.
- The development component gallery uses local state only to demonstrate controlled checkbox and select behaviour.
- CSS pseudo-classes handle hover, focus, disabled, open, checked, invalid, and highlighted presentation without React state.

## Accessibility rules

- Keyboard focus must remain visibly distinguishable in both themes.
- Status, severity, success, and failure must not depend on colour alone.
- Icon-only actions require an accessible name.
- Decorative icons and skeletons are hidden from assistive technology.
- Labels use explicit `htmlFor` relationships.
- Validation messages are referenced through `aria-describedby` and invalid controls expose `aria-invalid`.
- Dynamic critical feedback may use `role="alert"`; persistent informational content should not announce itself automatically.
- Tooltips supplement rather than replace accessible names.

## Deferred components

The following components require real feature context and are intentionally deferred:

- Severity and incident-status badges
- KPI and service-health cards
- Dashboard charts and accessible chart summaries
- Filter controls, active-filter chips, tables, mobile incident cards, and pagination
- Timeline items, internal notes, metadata, and related-link sections
- Dialog, drawer, toast, optimistic feedback, and workflow-specific form composition
- Sidebar, header, mobile navigation, and responsive application shell

## Development gallery

`src/app/dev/ComponentGalleryPage.tsx` exercises shared primitives in one place. `src/app/router/router.tsx` exposes it at `/dev/components` only when `import.meta.env.DEV` is true. The route is lazy-loaded and is not part of the production route configuration.

The gallery is a development verification surface, not a product feature and not a substitute for automated tests.

## Step 9 verification

Manual verification covered:

- Dark and light themes
- Persisted theme selection after refresh
- Visible keyboard focus
- Button variants, loading, and disabled behaviour
- Label, description, invalid, and disabled field states
- Checkbox checked and indeterminate behaviour
- Select keyboard navigation and Escape handling
- Tooltip keyboard focus behaviour
- Alert tones, badge tones, avatar sizes, skeletons, and empty-state composition
- Browser console review

Automated unit and component coverage remains scheduled for the approved testing roadmap steps.

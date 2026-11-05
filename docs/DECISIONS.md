# OpsPulse — Decision Log

## Document status

- Current through the Step 11 preparation checkpoint
- Last updated: November 6, 2026

This file records decisions that materially affect architecture, state ownership, dependencies, scope, accessibility, or debugging. Small implementation details that do not change those boundaries do not require separate entries.

Each entry records the accepted direction and its reason. A superseded decision
remains in the log so the history is understandable, but it no longer controls
current work.

## D-001 — Use a frontend-only Version 1

- Status: confirmed
- Roadmap step: 2

Use API service functions, MSW handlers, seeded records, and versioned local
persistence instead of a real backend or database. This keeps Version 1 focused
on production-style frontend behaviour while preserving a replaceable HTTP
boundary. The README must identify simulated behaviour honestly.

## D-002 — Use one predefined demo user without authentication

- Status: confirmed
- Roadmap step: 2

Use Ananya Rao (AR), SRE / Incident Responder, on call. Authentication and real
authorization do not strengthen the three core workflows, so permission denial
remains a simulated scenario until a later version introduces real users.

## D-003 — Keep Dashboard and Incidents as the only primary navigation

- Status: confirmed
- Roadmap step: 2

Do not expose standalone Services or Settings routes. Service health belongs
inside dashboard and incident workflows; theme and Reset Demo Data belong in the
demo-user menu. Every visible destination must provide meaningful functionality.

## D-004 — Make Timeline, Notes, and Resolution functional

- Status: confirmed
- Roadmap step: 2

Version 1 persists plain-text timeline updates, internal notes, and resolution
details because they are essential to incident coordination. Editing, deletion,
attachments, rich text, mentions, threads, and real-time collaboration remain
outside scope.

## D-005 — Exclude a notification system from Version 1

- Status: confirmed
- Roadmap step: 2

Remove notification bells, unread badges, inboxes, and preferences. Retain
functional toasts, validation, retry actions, banners, and incident activity.
Decorative or non-functional controls would weaken the portfolio experience.

## D-006 — Allow at most one Create Incident action per screen

- Status: confirmed
- Roadmap step: 2

The dashboard and incident list may each expose one context-appropriate action.
Incident details and full-page errors do not. An empty-state action replaces,
rather than duplicates, a page-level action.

## D-007 — Use page-based pagination on mobile

- Status: confirmed
- Roadmap step: 2

Use compact Previous, current page, and Next controls synchronized with URL
state. A single pagination model is easier to refresh, share, test, and debug
than a separate mobile Load More model.

## D-008 — Keep offline mode read-only

- Status: confirmed
- Roadmap step: 2

Show the latest available data while offline, block mutations, and refetch after
reconnection. Do not queue offline writes because ordering, conflict resolution,
duplicate protection, and recovery exceed Version 1 scope.

## D-009 — Keep the repository private through Version 2

- Status: superseded by D-039
- Roadmap step: 2

The original plan kept the repository private until Version 2. Suraj later chose
public development so recruiters can review Version 1 progress. This entry is
historical and no longer controls repository visibility.

## D-010 — Use Prettier as the formatter

- Status: confirmed
- Roadmap step: 4

Prettier owns formatting for TypeScript, React, JSON, CSS, Markdown, and
configuration. ESLint owns correctness and code quality. This separation is more
predictable than formatting through ESLint or manual convention.

## D-011 — Use strict type-aware ESLint

- Status: confirmed
- Roadmap step: 4

Use the strict and stylistic type-checked configurations with React Hooks, React
Refresh, scoped browser/Node globals, and Prettier compatibility. The stricter
baseline catches unsafe promises, assertions, comparisons, and typed values
before those patterns spread.

## D-012 — Use a feature-based modular architecture

- Status: confirmed
- Roadmap step: 5

Organize the application around `app`, shared `components`, domain `features`,
`hooks`, `lib`, `mocks`, `styles`, and genuinely shared `types`. This keeps
business logic near its owner without the extra layers of full Feature-Sliced
Design or the scattering caused by global file-type folders.

## D-013 — Keep shared domain contracts in focused type modules

- Status: confirmed
- Roadmap step: 6

Use `src/types/incident.ts`, `src/types/person.ts`, and
`src/types/service.ts` for contracts with demonstrated cross-feature consumers.
API, form, and view-specific types remain with their owning behaviour so
`src/types` does not become a miscellaneous dumping ground.

## D-014 — Model finite values with readonly tuples and derived unions

- Status: confirmed
- Roadmap step: 6

Define machine values in `as const` tuples, derive TypeScript unions, and use
exhaustive label maps. This gives runtime collections and compile-time safety
from one definition while avoiding enum runtime behaviour and duplicated arrays.

## D-015 — Normalize people and services around the incident aggregate

- Status: confirmed
- Roadmap step: 6

Incidents reference people and services by ID while owning their timeline,
notes, resolution, and links. Normalization prevents identity and service-health
drift; keeping incident subrecords together preserves understandable atomic
updates without over-normalizing the browser dataset.

## D-016 — Use serialized timestamps, stable nulls, and lifecycle unions

- Status: confirmed
- Roadmap step: 6

Persist ISO UTC strings, explicit nulls for known absence, and always-present
readonly collections. Model incidents as an active/resolved discriminated union
so a resolved incident cannot exist without resolution details. Boundary schemas
remain necessary because TypeScript does not validate persisted input.

## D-017 — Keep the incident activity taxonomy small

- Status: confirmed
- Roadmap step: 6

Support created, status-changed, timeline-update, and resolved events plus the
approved simulated link kinds. This covers Version 1 without promising assignment
or edit-audit events that the product does not implement.

## D-018 — Use a resource-oriented mock API

- Status: confirmed
- Roadmap step: 7

Use `/api` collection, detail, workflow-mutation, reference-data, dashboard, and
reset endpoints. UI components never import seed records, persistence, or MSW
handlers. The boundary resembles a replaceable backend and centralizes dashboard
derivations and workflow validation.

## D-019 — Use compact, versioned, time-relative seed data

- Status: confirmed
- Roadmap step: 7

Seed 8 people, 5 services, and 32 incidents from deterministic offsets relative
to an injected time anchor. Persist one versioned dataset. This covers filters,
pagination, lifecycle, and dashboard ranges without maintaining a large opaque
fixture or stale calendar timestamps.

## D-020 — Keep local persistence authoritative and atomic

- Status: confirmed
- Roadmap step: 7

Store one validated dataset under `opspulse:demo-data` behind the repository
boundary. Do not maintain an in-memory persistence mirror. Validate the complete
next dataset before replacing the stored JSON so failed writes preserve the
previous valid payload.

## D-021 — Standardize HTTP envelopes and deterministic latency

- Status: confirmed
- Roadmap step: 7

Return `{ data }` success envelopes, explicit pagination metadata, and stable
error codes with safe messages and optional field errors. Use fixed 300 ms reads
and 500 ms mutations so loading behaviour is reproducible rather than flaky.

## D-022 — Use React Router Data Mode with one QueryClient

- Status: confirmed
- Roadmap step: 8

Create the browser router and QueryClient once at module scope. React Router owns
location, matching, parameters, redirects, and route errors; TanStack Query owns
server cache, request status, retries, and invalidation. Router loaders do not
duplicate the query cache.

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

## D-039 — Develop Version 1 in a public repository

- Status: confirmed
- Roadmap step: project governance

Keep the repository public while Version 1 is built so recruiters and engineers
can review progress. Documentation must distinguish implemented behaviour from
planned scope, and secrets, environment files, private exports, build output,
logs, coverage, and personal data must remain excluded.

## D-040 — Make repository documentation the single source of truth

- Status: confirmed
- Roadmap step: Step 11 preparation

Retire Notion from the OpsPulse maintenance workflow. Preserve requirements,
architecture, data flow, workflow call order, component ownership, decisions,
debugging, roadmap status, and concise progress evidence in the repository.
Avoid copying the same explanation between files; `docs/README.md` defines which
document owns each subject.

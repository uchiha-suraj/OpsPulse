# OpsPulse — Frontend Architecture

## Document status

- Roadmap step: Step 5 — Project Architecture and Folder Structure
- Status: Approved on September 15, 2026
- Version covered: Version 1
- Owner: Suraj Adhikary
- Architecture style: Feature-based modular frontend
- Last reviewed: September 15, 2026

## Purpose

This document defines how OpsPulse frontend code is organized, how modules may depend on one another, where state belongs, and how the architecture should evolve.

The architecture supports the three Version 1 workflows:

1. Monitor production
2. Find an incident
3. Manage and resolve an incident

It should remain understandable and maintainable by one frontend engineer while demonstrating production-style frontend engineering.

## Architecture goals

The architecture should:

- Keep business logic close to the feature that owns it.
- Separate application composition from feature implementation.
- Keep reusable interface components independent of business domains.
- Give each type of state one authoritative owner.
- Prevent direct persistence access from React components.
- Support loading, empty, error, retry, offline, and optimistic-update behaviour.
- Make individual features testable without rendering the entire application.
- Allow simulated APIs to be replaced later without rewriting presentation components.
- Grow incrementally without creating unused folders or premature abstractions.
- Remain explainable and debuggable without AI assistance.

## Non-goals

Version 1 does not require:

- A backend-oriented architecture
- Micro-frontends
- Multiple independently deployed applications
- Full Feature-Sliced Design
- Atomic Design as the main project architecture
- A separate package for every feature
- A generic repository layer before persistence requires one
- Barrel exports for every directory
- Empty folders created only to represent a future plan

## Architecture style

OpsPulse uses a feature-based modular frontend architecture.

Feature-specific presentation, data access, validation, and business behaviour remain together inside the feature that owns them. Application-level composition and genuinely reusable code remain outside feature folders.

This provides clearer ownership than global folders such as `pages`, `api`, and `utils`, while avoiding architecture layers that the current project does not need.

## Current source structure

```text
src/
├── app/
│   └── App.tsx
├── styles/
│   └── global.css
└── main.tsx
```

The project currently contains only the files required by the implemented application shell. Additional folders will be introduced during the roadmap step that first needs them.

Empty folders and placeholder `.gitkeep` files must not be added.

## Planned source structure

```text
src/
├── app/
│   ├── providers/
│   ├── router/
│   └── App.tsx
├── components/
│   ├── layout/
│   └── ui/
├── features/
│   ├── dashboard/
│   ├── incidents/
│   └── services/
├── hooks/
├── lib/
├── mocks/
├── styles/
├── types/
└── main.tsx
```

This is a planned ownership map, not an instruction to create every directory immediately.

## Folder responsibilities

### `src/main.tsx`

Owns application startup.

Responsibilities:

- Locate and validate the root DOM element.
- Mount the React application.
- Enable React Strict Mode.
- Import global styles.
- Render the root application component.

It must not contain routes, feature logic, server-state configuration, or business rules.

### `src/app`

Owns application-wide composition.

Responsibilities include:

- Root application component
- Global provider composition
- Router creation and route boundaries
- Application-level error boundaries
- Application-wide startup configuration

The `app` layer may compose features and shared modules. It should not contain detailed incident or dashboard business logic.

### `src/app/providers`

Will contain global React providers when they are introduced.

Examples may include:

- TanStack Query provider
- Router provider composition
- Theme provider
- Global error or toast provider

Provider order must be intentional and documented when one provider depends on another.

### `src/app/router`

Will own:

- Route definitions
- Route-level lazy loading
- Route parameters
- Application 404 handling
- Route-level error boundaries
- Page-shell composition where appropriate

Feature pages may be imported by the router, but feature components must not configure the global router.

### `src/components/layout`

Will contain reusable application-layout components such as:

- Application shell
- Sidebar
- Header
- Page container
- Responsive navigation

Layout components may compose shared UI primitives but must not own incident-management business logic.

### `src/components/ui`

Will contain reusable, domain-neutral interface primitives.

Examples may include:

- Button
- Dialog
- Input
- Select
- Badge
- Skeleton
- Toast
- Pagination primitives

A component belongs here only when it is reusable without understanding incidents, services, or dashboard rules.

### `src/features/dashboard`

Will own dashboard-specific behaviour and presentation, including:

- Dashboard page composition
- Operational metrics
- Incident trend presentation
- Severity distribution
- Critical incident summary
- Dashboard-specific query hooks
- Dashboard loading, empty, and error states

The dashboard may consume public incident and service-health data contracts, but it must not reach into another feature’s internal components or hooks.

### `src/features/incidents`

Will own incident-management behaviour, including:

- Incident list
- Search, filtering, sorting, and pagination
- Incident details
- Create and edit workflows
- Commander and responder assignment
- Status changes
- Timeline updates
- Internal notes
- Resolution workflow
- Incident-specific validation
- Incident API functions and query hooks

This is the primary business feature in Version 1.

### `src/features/services`

Will own the service-health domain, including:

- Service-health data access
- Service-health status presentation
- Service-health calculations
- Service-health-specific components

Version 1 does not have a standalone Services route. This feature supplies service-health behaviour to the dashboard and incident workflows.

### `src/hooks`

Will contain genuinely shared React hooks that do not belong to one feature.

A hook must remain inside its feature when it understands feature-specific data or rules.

This folder must not become a collection of unrelated convenience hooks.

### `src/lib`

Will contain domain-neutral infrastructure and configuration.

Possible responsibilities include:

- Query-client configuration
- Generic request utilities
- Environment configuration
- Date or formatting infrastructure
- Storage infrastructure that is not tied to one feature
- Small reusable utilities

Feature-specific API requests and business calculations must remain inside their owning features.

Ambiguous files such as `helpers.ts` or `utils.ts` should be avoided. Filenames should describe their actual responsibility.

### `src/mocks`

Will contain the simulated API implementation, including:

- Mock Service Worker setup
- Request handlers
- Seeded demo data
- Simulated latency and failure scenarios
- Versioned local persistence
- Demo-data reset behaviour

React components must not import seeded data or access local persistence directly.

Mocks may depend on public domain or API contracts, but they must not depend on presentation components.

### `src/styles`

Owns global styling concerns.

It may contain:

- Global element defaults
- Design tokens when introduced
- Theme variables
- Shared animation definitions
- Global accessibility utilities

Feature-specific styles should remain close to the feature when they are not globally reusable.

### `src/types`

Will contain only types genuinely shared across multiple features or application boundaries.

Feature-specific types should stay inside the owning feature.

The exact placement of domain models will be finalized during Step 6 — Domain Models and TypeScript Types.

## Feature-internal structure

A feature may introduce the following directories when needed:

```text
feature-name/
├── api/
├── components/
├── hooks/
├── pages/
├── schemas/
├── types/
├── utils/
└── index.ts
```

These directories are optional.

A feature should create only the directories required by implemented behaviour. A small feature may keep a few clearly named files directly at its root.

### Feature ownership rules

- `api` contains feature-specific request functions and query definitions.
- `components` contains feature-specific presentation.
- `hooks` contains feature-specific orchestration and React behaviour.
- `pages` contains route-level feature composition.
- `schemas` contains runtime validation schemas.
- `types` contains feature-owned TypeScript types.
- `utils` contains pure, specifically named feature calculations.
- `index.ts` exists only when the feature needs an intentional public API.

## Dependency direction

The intended dependency direction is:

```text
main.tsx
└── app
    ├── features
    │   └── shared modules
    └── shared modules
```

Shared modules include:

```text
components
hooks
lib
styles
types
```

The rules are:

1. `main.tsx` may depend on `app` and global styles.
2. `app` may depend on features and shared modules.
3. Features may depend on shared modules.
4. Shared modules must not depend on features.
5. One feature must not deep-import another feature’s internal files.
6. Cross-feature behaviour must use an intentional public boundary or application-level composition.
7. Mock infrastructure may use public domain and API contracts but must not depend on presentation components.
8. Circular dependencies are not allowed.

## Import rules

`@/` represents the `src` directory.

Example:

```ts
import App from '@/app/App'
```

Use `@/` for imports that cross architectural areas or would otherwise require fragile parent-directory traversal.

Short relative imports are acceptable for files in the same directory or a closely related local directory.

Acceptable:

```ts
import { IncidentCard } from './IncidentCard'
import { Button } from '@/components/ui/Button'
```

Avoid:

```ts
import { Button } from '../../../../components/ui/Button'
```

Imports should omit `.ts` and `.tsx` extensions.

The alias must remain configured in both:

- `tsconfig.app.json` for TypeScript
- `vite.config.ts` for Vite

Configuring only one side can cause the editor, type checker, development server, or production build to disagree about whether an import is valid.

## Public module boundaries

An `index.ts` file is not required for every folder.

Use one only when it intentionally defines what another architectural area may import.

A public boundary should:

- Export only supported external contracts.
- Hide internal implementation files.
- Avoid exporting everything automatically.
- Remain small enough to understand.
- Prevent consumers from deep-importing internal modules.

Premature barrel files can create unclear ownership, accidental public APIs, and circular dependencies.

## Naming conventions

- React components: `PascalCase.tsx`
- React hooks: `useSomething.ts`
- TypeScript utilities: `camelCase.ts`
- Validation schemas: descriptive camelCase names
- Tests: colocated `*.test.ts` or `*.test.tsx`
- Multiword directories: lowercase kebab-case
- Constants: descriptive filenames based on ownership
- Types: descriptive domain names rather than generic aliases

Avoid ambiguous names such as:

- `helpers`
- `common`
- `misc`
- `stuff`
- `sharedUtils`

A name should explain what the module owns.

## State ownership

Each piece of state must have one authoritative owner.

| State category         | Owner                      | Examples                                       |
| ---------------------- | -------------------------- | ---------------------------------------------- |
| Simulated server state | TanStack Query             | Incidents, services, dashboard metrics         |
| Shareable list state   | URL parameters             | Search, filters, sorting, page, page size      |
| Form state             | React Hook Form            | Create, edit, note, timeline, resolution forms |
| Form validation        | Zod schemas                | Required fields and domain validation          |
| Small global UI state  | Zustand when justified     | Theme or collapsed navigation                  |
| Temporary UI state     | Nearest component          | Open menu, selected tab, local disclosure      |
| Derived data           | Calculated from its source | Active counts and filtered summaries           |
| Durable demo records   | Mock persistence layer     | Created and updated incidents                  |

These libraries describe the approved direction. They will be installed only during the roadmap step that requires them.

The same value must not be independently stored in multiple state systems unless the reason is documented.

## Rendering ownership

A component re-renders when the state it subscribes to changes.

Expected triggers include:

- A TanStack Query result changes.
- Relevant URL parameters change.
- A selected Zustand state value changes.
- React Hook Form publishes subscribed form-state changes.
- Local component state changes.
- A parent supplies different props.

Derived values should be calculated from authoritative state or memoized only when measurement demonstrates a meaningful need.

Do not copy query data into local component state merely to render it.

## Current startup flow

```text
index.html
→ src/main.tsx
→ validate #root
→ import global styles
→ render src/app/App.tsx in React Strict Mode
→ display the current OpsPulse placeholder
```

If the root element is missing, startup throws a descriptive error instead of passing an invalid value to React.

## Planned application flow

```text
index.html
→ main.tsx
→ application providers
→ router
→ application layout
→ route page
→ feature components
```

Providers and router configuration will be introduced in Step 8. The responsive application layout will be implemented in Step 10.

## Planned data flow

```text
User interaction
→ feature component or form
→ feature hook
→ API service function
→ HTTP request
→ Mock Service Worker handler
→ seeded data or versioned local persistence
→ simulated response
→ TanStack Query cache update
→ subscribed components re-render
```

Components must communicate through the API boundary. They must not read or write incident persistence directly.

Detailed query keys, invalidation rules, optimistic updates, persistence versioning, and reset behaviour will be documented in `docs/DATA_FLOW.md` when those systems are implemented.

## Error ownership

Errors should be handled at the narrowest useful boundary.

- Field validation belongs to the form.
- A failed feature request belongs to the affected feature section or page.
- Background refresh failures should preserve valid cached information.
- Route-loading failures belong to route-level boundaries.
- Unexpected rendering failures belong to an application error boundary.
- Offline behaviour belongs to the API/query and application-feedback boundaries.
- Persistence failures belong behind the mock API boundary.

Error messages should explain:

- What failed
- Whether existing information is still valid
- What the user can do next
- Whether retrying is safe

Production-facing messages must not expose internal stack traces or secrets.

## Loading and empty-state ownership

Loading, empty, error, and retry states belong close to the feature data they represent.

The application shell should remain stable while a feature loads or refreshes.

Initial loading and background updating must remain distinguishable:

- Initial loading may use a page or section skeleton.
- Background updating should preserve previously loaded information.
- Empty results must not be displayed as request failures.
- Filtered no-results states must remain distinct from an empty incident collection.

## Testing boundaries

Tests should be added with the behaviour they protect.

- Pure business calculations receive unit tests.
- Feature components receive behaviour-focused component tests.
- Query hooks and API interactions use Mock Service Worker.
- Forms test validation, submission, success, and failure behaviour.
- Optimistic changes test both success and rollback.
- Routing tests cover route parameters, navigation, not-found behaviour, and URL synchronization.
- End-to-end tests protect the three core workflows when Playwright is introduced.

Unit and component tests should be colocated with their subjects unless a later testing requirement justifies another structure.

Tests should verify user-visible outcomes rather than internal implementation details.

## Dependency policy

Dependencies are introduced only during the roadmap step that needs them.

Before adding a package, document:

- The problem it solves
- Why the platform or existing dependencies are insufficient
- Reasonable alternatives
- Its runtime or development ownership
- Its effect on bundle size and maintenance
- How its important behaviour will be tested

The complete proposed stack must not be installed in advance.

## Architecture debugging checklist

When an import or module fails:

1. Confirm the file exists with the expected filename and letter casing.
2. Confirm the module belongs in the importing layer.
3. Check whether the import violates dependency direction.
4. Check both TypeScript and Vite alias configuration.
5. Check for a stale `.ts` or `.tsx` extension in the import.
6. Check for a circular dependency.
7. Run type-checking and the production build.

When state becomes inconsistent:

1. Identify the authoritative owner.
2. Check whether the same value was copied into another state system.
3. Check query invalidation and cache updates.
4. Check URL parsing and default values.
5. Check form reset behaviour after success or failure.
6. Check persistence only through the mock API boundary.
7. Confirm derived values are recalculated from current source data.

When a feature becomes difficult to place:

1. Identify the user workflow that owns it.
2. Keep domain-specific code in that feature.
3. Move code to a shared area only after genuine reuse exists.
4. Give shared modules domain-neutral APIs.
5. Record significant boundary changes before implementation.

## Architecture change rules

An architecture change should be proposed when:

- Multiple features require the same stable capability.
- A module has conflicting responsibilities.
- Circular dependencies appear.
- Tests require excessive application-wide setup.
- Replacing the mock API would require presentation rewrites.
- State ownership becomes unclear or duplicated.

Before changing a boundary:

1. Describe the current problem with concrete examples.
2. Identify the responsible module.
3. Compare the smallest viable alternatives.
4. Record meaningful trade-offs.
5. Update this document and the Notion Decision Log.
6. Make the change in a focused commit.
7. Run the complete quality checks.

Architecture must evolve from demonstrated requirements rather than hypothetical future needs.

## Current implementation status

Implemented during Step 5:

- `src/app/App.tsx` owns the root application component.
- `src/styles/global.css` owns global styles.
- `src/main.tsx` owns startup and root validation.
- `@/` resolves to `src` in TypeScript and Vite.
- The feature-based dependency direction and naming rules are confirmed.
- Formatting, strict linting, type-checking, development startup, and production building pass.

Not yet implemented:

- Global providers
- Application router
- Feature modules
- Shared UI components
- Mock API
- Domain models
- Runtime state-management libraries
- Testing libraries
- Production feature workflows

These will be added only during their approved roadmap steps.

## Related documentation

- `docs/PROJECT_OVERVIEW.md`
- `docs/REQUIREMENTS.md`
- `docs/DATA_FLOW.md` when implemented
- `docs/COMPONENTS.md` when implemented
- `docs/DEBUGGING.md` when implemented
- Notion Architecture and Data Flow page
- Notion Decision Log

## Step 5 completion criteria

Step 5 can be completed when:

- The feature-based architecture is explicitly approved.
- The folder responsibilities are documented.
- Dependency direction and import rules are documented.
- State ownership is documented.
- The `@/` alias works in TypeScript and Vite.
- The minimal source files use their approved locations.
- No empty architectural folders were added.
- The architecture document has been reviewed.
- Formatting, linting, type-checking, and building pass.
- The change has a focused Git commit.
- Relevant Notion pages are updated.
- Suraj explicitly confirms Step 5 complete.

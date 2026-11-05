# OpsPulse — Data Flow

## Document status

- Roadmap step: Step 7 — Mock API and Seed Data
- Implementation: complete
- Project approval: awaiting Suraj's confirmation
- Last updated: November 5, 2026

## Purpose

This document explains how Version 1 data is created, validated, requested, changed, persisted, reset, and recovered. The mock boundary intentionally behaves like a remote API so the future React interface does not depend directly on `localStorage` or seed modules.

## Version 1 data boundary

```text
React feature
→ API service function
→ browser request
→ Mock Service Worker handler
→ demo-data repository
→ Zod schema and cross-record validation
→ localStorage
```

The React application must communicate with incident data through HTTP-shaped API functions. Components and query hooks must never import the repository, seed generators, or browser storage directly.

## Startup flow

```text
src/main.tsx validates #root
→ imports src/mocks/browser.ts
→ creates the MSW worker with the central handler registry
→ waits for worker.start()
→ renders the React application once
→ AppProviders supplies the stable QueryClient
→ RouterProvider selects the URL-matched page
```

If worker startup fails, the failure is logged and the application still renders. Feature requests will then fail normally and can be represented by the application error states added in later steps.

## Seed-data flow

```text
createDemoDataSeed(anchor time)
→ create people
→ create services relative to the anchor
→ create 32 incidents relative to the anchor
→ validate IDs, relationships, timestamps, and incident invariants
→ return a versioned DemoData envelope
```

The seed contains:

- 8 people
- 5 monitored services
- 32 incidents
- 4 active incidents
- 28 resolved incidents
- active severity distribution of 1 SEV-1, 2 SEV-2, 1 SEV-3, and 0 SEV-4

Seed timestamps are calculated relative to the reset time. This keeps dashboard ranges meaningful whenever a reviewer resets the demo.

## Repository flow

`src/mocks/persistence/demoDataRepository.ts` is the only durable-data owner.

### First load

```text
repository.load()
→ no stored payload exists
→ create a fresh seed
→ validate it
→ write it to localStorage
→ return the validated data
```

### Existing valid data

```text
repository.load()
→ read and parse stored JSON
→ validate its schema and cross-record invariants
→ return the validated data
```

### Invalid or incompatible data

```text
repository.load()
→ parsing or validation fails
→ log a development warning
→ create and persist a fresh compatible seed
→ return recovered data
```

### Mutation

```text
repository.update(updater)
→ load the current validated snapshot
→ derive the complete next snapshot
→ validate the complete next snapshot
→ serialize and write once
→ return the saved snapshot
```

Mutations are atomic at the repository boundary. A validation or storage failure prevents the new snapshot from replacing the previous valid payload.

The immutable `seededAt` value identifies when the dataset was generated. Incident mutations may correctly occur after that timestamp; their own chronological invariants are validated against incident creation and update times.

## HTTP response contract

Successful non-paginated requests use:

```json
{
  "data": {}
}
```

Paginated requests add metadata:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "pageSize": 25,
    "total": 32,
    "totalPages": 2
  }
}
```

Failures use:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please correct the invalid request data.",
    "fieldErrors": {
      "title": ["Too small: expected string to have >=1 characters"]
    }
  }
}
```

Supported error codes are:

| Code                      | HTTP status | Meaning                                             |
| ------------------------- | ----------: | --------------------------------------------------- |
| `VALIDATION_ERROR`        |         400 | Request data is invalid                             |
| `NOT_FOUND`               |         404 | The requested incident does not exist               |
| `INVALID_TRANSITION`      |         409 | The incident lifecycle does not allow the operation |
| `PERSISTENCE_UNAVAILABLE` |         503 | Browser persistence could not be read or written    |
| `INTERNAL_ERROR`          |         500 | An unexpected handler failure occurred              |

Unexpected implementation details and stack traces are logged for development but are not returned to the interface.

## Mock latency

- Read requests: fixed 300 milliseconds
- Mutation requests: fixed 500 milliseconds

Fixed delays make loading and pending states realistic and reproducible. Random delay is intentionally excluded because it would make debugging and automated testing less deterministic.

## Implemented endpoints

| Method  | Endpoint                              | Responsibility                                      |
| ------- | ------------------------------------- | --------------------------------------------------- |
| `GET`   | `/api/people`                         | Return all seeded people                            |
| `GET`   | `/api/services`                       | Return current service health                       |
| `GET`   | `/api/incidents`                      | Search, filter, sort, and paginate incidents        |
| `GET`   | `/api/incidents/:incidentId`          | Return one incident or a 404                        |
| `POST`  | `/api/incidents`                      | Validate, create, and persist an incident           |
| `PATCH` | `/api/incidents/:incidentId`          | Edit supported incident fields                      |
| `PATCH` | `/api/incidents/:incidentId/status`   | Change an active status and append a timeline event |
| `POST`  | `/api/incidents/:incidentId/timeline` | Append a timeline update                            |
| `POST`  | `/api/incidents/:incidentId/notes`    | Append an internal note                             |
| `POST`  | `/api/incidents/:incidentId/resolve`  | Atomically resolve an incident and append its event |
| `GET`   | `/api/dashboard?range=24h\|7d\|30d`   | Derive dashboard metrics and collections            |
| `POST`  | `/api/demo/reset`                     | Replace persisted changes with a fresh seed         |

## Incident-list request flow

The list handler supports:

- case-insensitive search across incident ID, title, and description;
- comma-separated status and severity filters;
- service and assignee filters;
- inclusive `dateFrom` and `dateTo` filters;
- sorting by creation time, update time, severity, status, or duration;
- ascending or descending order;
- page sizes of 10, 25, or 50; and
- page-based metadata.

Safe defaults are page 1, page size 25, update time sorting, and descending order. Unsupported query values fall back to those defaults or are ignored. The URL remains the future interface owner of list controls; the API only executes the supplied query.

## Incident-mutation flow

```text
handler receives request
→ wait for deterministic mutation latency
→ parse JSON with a strict Zod request schema
→ load current repository data
→ validate service and person relationships
→ validate lifecycle and timestamp rules
→ derive the complete next incident and related event/note
→ save the complete DemoData snapshot once
→ return the persisted incident
```

Important invariants include:

- every incident has at least one known affected service;
- commander and responder IDs must exist;
- the commander cannot also be a responder;
- responder IDs cannot be duplicated;
- an unavailable person cannot be assigned as commander;
- resolved incidents cannot use active-status or timeline actions;
- resolution uses the predefined demo user, Ananya Rao;
- status changes and resolution append timeline events; and
- normal editing cannot modify ID, status, creator, history, labels, or resolution metadata.

Internal notes remain append-only but may be added to active or resolved incidents. Timeline updates are limited to active incidents.

## Dashboard derivation

The dashboard handler derives its response from the authoritative incident, service, and person records. It does not store duplicated metrics.

For 24-hour, 7-day, and 30-day ranges it calculates:

- current active-incident count;
- incidents resolved within the selected range;
- mean time to acknowledge for incidents started in the range;
- mean time to resolve for incidents resolved in the range;
- opened and resolved trend buckets;
- current active severity distribution;
- the most recently updated active SEV-1 incident;
- recent timeline activity;
- current service health; and
- on-call responders.

Mutation responses return the changed incident. The global QueryClient now exists, but no query hooks consume the API yet. Later feature steps will define query keys and invalidate or update affected incident-list, detail, and dashboard queries.

## State ownership

| Information                                    | Owner in Step 7                         |
| ---------------------------------------------- | --------------------------------------- |
| Durable demo records                           | Demo-data repository and `localStorage` |
| Seed definitions                               | `src/mocks/data`                        |
| Request validation                             | Handler request schemas                 |
| Cross-record validation                        | `validateDemoData`                      |
| HTTP success and error shapes                  | `src/lib/api/apiResponse.ts`            |
| Simulated latency                              | `src/mocks/http/mockLatency.ts`         |
| Derived dashboard metrics                      | Dashboard handler                       |
| Search/filter/sort/page request interpretation | Incident-list handler                   |
| Future API cache and request state             | Application QueryClient                 |
| Current route and route parameters             | React Router                            |
| Active theme preference                        | Zustand theme store                     |
| Persisted theme preference                     | `opspulse:theme` in `localStorage`      |
| Desktop sidebar collapsed state                | Zustand layout store                    |
| Mobile navigation drawer                       | `AppShell` local state                  |
| Menu, dialog, focus, and portal mechanics      | Radix primitives                        |

TanStack Query and React Router are now configured globally. No feature query data exists until a mounted feature uses a query hook. Incident-list query parameters and form state remain deferred to their approved feature steps.

## Theme-preference flow

```text
Application module loads
→ Zustand persist middleware reads opspulse:theme
→ persisted value is validated as dark or light
→ invalid, missing, or unavailable storage falls back to dark
→ main.tsx applies data-theme before React renders
→ ThemeProvider subscribes to the theme slice
→ setTheme or toggleTheme updates Zustand
→ persistence attempts a guarded localStorage write
→ ThemeProvider updates document.documentElement.dataset.theme
→ semantic CSS variables restyle the interface
```

Zustand is the sole runtime owner. `localStorage` preserves the preference across reloads but is not read directly by presentation components. A storage read or write failure leaves the in-memory theme usable and does not block the application.

Only `ThemeProvider` subscribes to the theme value at the provider boundary. Components that need the current value or toggle action select only those fields from the store. CSS handles descendant visual changes after the document attribute changes.

## Routing and provider flow

```text
main.tsx
→ App
→ AppProviders
→ QueryClientProvider
→ RouterProvider
→ AppRoot
→ Outlet
→ matched feature page
```

`queryClient.ts` creates one cache owner outside React. `AppProviders.tsx` supplies it and mounts the closed development-only Devtools. `router.tsx` creates one browser router outside React. Navigation changes router location state and re-renders the matched outlet; it does not recreate the QueryClient or duplicate the current URL in component state.

Current query defaults are:

- 30-second query stale time;
- one automatic query retry; and
- no automatic mutation retry.

Normal TanStack Query focus and reconnect behaviour remains enabled. No global query-error toast or cache mutation policy is introduced before the relevant feature and feedback steps.

## Responsive navigation flow

```text
React Router location changes
→ NavLink derives the active destination
→ routeContext derives breadcrumbs, mobile title, and back behaviour
→ TopBar and Sidebar render the new route context
→ AppShell preserves the shared product frame around the matched Outlet
```

The URL remains the navigation source of truth. Desktop sidebar collapse is a non-persisted Zustand preference because both `Sidebar` and `AppShell` need it. The mobile drawer remains local to `AppShell`, closes after navigation, and also closes when the viewport crosses into the desktop layout.

## Reset Demo Data flow

```text
User opens the shared user menu
→ selects Reset Demo Data
→ ResetDemoDataDialog asks for confirmation
→ application API function sends POST /api/demo/reset
→ MSW reset handler restores the validated seed snapshot
→ successful response clears the TanStack Query cache
→ dialog shows success and navigation returns to /dashboard
```

The dialog owns only `idle | pending | success | error` interaction state. The mock repository owns durable demo records, and TanStack Query owns cached server data. The dialog cannot close while the reset is pending. A failed request preserves the current route and displays retryable feedback instead of clearing the cache.

## Failure and debugging points

1. If requests bypass MSW, verify the worker starts before React renders and confirm `mockServiceWorker.js` is registered for the application origin.
2. If persisted data resets unexpectedly, inspect the console warning and validate the stored payload version and relationships.
3. If a mutation returns 400, inspect `error.fieldErrors` and the strict request schema.
4. If a mutation returns 409, confirm the incident is active and the requested status differs from its current status.
5. If a request returns 503, inspect browser storage availability or quota errors.
6. If dashboard values look stale, confirm the consuming query is refreshed after the mutation.
7. If timestamps fail persistence validation, check their ordering against incident creation, update, and resolution times.
8. If the theme does not persist, inspect `opspulse:theme`, confirm the stored value is `dark` or `light`, and check whether browser storage is blocked.
9. If the theme attribute changes but colours do not, confirm `tokens.css` is imported after Tailwind in `global.css` and that components use semantic token utilities.
10. If route titles or back controls are wrong, verify the static `/incidents/new` case is evaluated before the dynamic incident-detail pattern.
11. If the mobile drawer stays open after resizing, verify the `matchMedia` desktop-boundary listener is active and closes local drawer state.
12. If demo data resets but the screen remains stale, confirm the reset response succeeded before `queryClient.clear()` runs.

## Verification completed

The Step 7 implementation was verified through the running browser service worker on November 5, 2026.

Verified behaviour included:

- people and service reads;
- filtered and paginated incident queries;
- incident details and not-found responses;
- 7-day dashboard aggregation;
- invalid create-request field errors;
- incident creation and editing;
- active status changes and duplicate-transition conflicts;
- timeline and note creation;
- resolution and duplicate-resolution conflicts; and
- persistence across subsequent detail requests.

Formatting, strict ESLint, TypeScript checking, and the production build pass. Automated unit and integration test dependencies remain deferred to the approved testing roadmap steps.

## Step boundary

Step 7 implemented the mock data boundary. Step 8 added routing and the global QueryClient. Step 9 added semantic design tokens, guarded theme persistence, global tooltip timing, and domain-neutral UI primitives. Step 10 added the responsive product shell, navigation ownership, route-derived layout context, and the reset-data entry point without fetching feature data or implementing final screens. Query hooks, URL-synchronized list controls, forms, and production mutation feedback remain part of later roadmap steps.

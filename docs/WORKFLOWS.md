# OpsPulse — Workflow and Code Flow

## Document status

- Current through completed Step 10
- Last reviewed: November 6, 2026
- Purpose: connect user actions and application events to the responsible code

## How to use this document

Each workflow records:

- the event that starts it;
- the functions and modules called in order;
- the owner of state and durable data;
- the events that cause React to render again;
- failure and debugging checkpoints; and
- whether the product interface is implemented or still planned.

Paths are repository-relative so they remain valid on every developer's machine.

## Product-workflow implementation status

| Product workflow   | Data and API boundary                                                     | Product interface           |
| ------------------ | ------------------------------------------------------------------------- | --------------------------- |
| Monitor production | Dashboard handler and derived metrics implemented                         | Step 11 not implemented     |
| Find an incident   | Search, filter, sort, and pagination handler implemented                  | Step 12 not implemented     |
| Manage an incident | Create, edit, status, timeline, note, and resolution handlers implemented | Steps 13–14 not implemented |

The mock API can support these workflows before their final pages exist. A
handler being implemented does not mean the user-facing workflow is complete.

## 1. Application startup

### Trigger

The browser loads `index.html` and executes `src/main.tsx`.

### Call order

```text
src/main.tsx module evaluation
→ useThemeStore.getState().theme
→ applyThemeToDocument(theme)
→ validate the #root element
→ createRoot(rootElement)
→ prepareApplication()
→ dynamic import of src/mocks/browser.ts
→ setupWorker(...handlers) has created worker
→ worker.start() registers MSW
→ renderApplication()
→ React renders App inside StrictMode
```

`prepareApplication()` waits for MSW before calling `renderApplication()`. This
prevents initial feature requests from escaping the mock boundary.

### Ownership and rendering

- `src/main.tsx` owns bootstrap order and root validation.
- `src/app/stores/themeStore.ts` owns the initial theme value.
- `src/mocks/browser.ts` owns the browser worker instance.
- React does not render until `renderApplication()` runs.

### Failure path

- Missing `#root` throws a descriptive startup error.
- Failed worker startup is logged, but `renderApplication()` still runs.
- If MSW is unavailable, later feature requests fail through their normal request
  error handling instead of producing a blank application.

## 2. Provider and route composition

### Trigger

`renderApplication()` renders `App`.

### Call order

```text
App
→ AppProviders
→ QueryClientProvider(queryClient)
→ ThemeProvider
→ Radix Tooltip Provider
→ RouterProvider(router)
→ matched router branch
→ AppRoot for product routes
→ AppShell
→ Outlet
→ matched feature page
```

`src/app/providers/queryClient.ts` creates one `QueryClient` at module scope.
`src/app/router/router.tsx` creates one browser router at module scope. React
renders do not recreate either owner.

### Route ownership

- React Router owns the URL, matching, redirects, route parameters, and route
  errors.
- `AppRoot` places product routes inside `AppShell`.
- `/dev/components` is development-only and intentionally remains outside
  `AppShell`.
- `RouteErrorPage` handles route errors; `NotFoundPage` handles unmatched URLs.

### Re-render triggers

- Navigation changes React Router location state and the matched `Outlet`.
- It does not recreate the QueryClient or copy the URL into component state.

## 3. Theme selection

### Trigger

The user activates the theme action in `UserMenu` or the development gallery.

### Call order

```text
UserMenu onSelect
→ useThemeStore.toggleTheme()
→ Zustand calculates dark or light
→ persist middleware attempts to write opspulse:theme
→ ThemeProvider receives the new selected theme
→ useLayoutEffect()
→ applyThemeToDocument(theme)
→ document.documentElement.dataset.theme changes
→ semantic CSS variables restyle the interface
```

### Ownership and failure path

- Zustand is the only runtime owner of the theme.
- `localStorage` persists the preference but is not another runtime owner.
- `safeThemeStorage` catches blocked reads and writes.
- Missing or invalid persistence falls back to the deterministic dark default.

## 4. Responsive navigation

### Desktop sidebar

```text
User activates collapse control in Sidebar
→ useLayoutStore.toggleSidebar()
→ isSidebarCollapsed changes
→ Sidebar changes width
→ AppShell changes desktop left padding
```

The non-persisted Zustand layout store is used because both `Sidebar` and
`AppShell` consume the same preference.

### Mobile drawer

```text
User activates the TopBar menu button
→ AppShell setIsMobileNavigationOpen(true)
→ MobileNavigation receives open=true
→ Radix Dialog manages focus, overlay, portal, and Escape
→ selecting a navigation link requests close
→ AppShell updates local state to false
```

`AppShell` also registers a `matchMedia('(min-width: 1024px)')` listener. When
the viewport crosses into the desktop layout, `handleBreakpointChange()` closes
the mobile drawer.

### Route presentation

`TopBar` reads the current location and calls `getRouteContext()` from
`src/components/layout/routeContext.ts`. That pure function derives desktop
breadcrumbs, mobile titles, and back destinations. The URL is not duplicated in
layout state.

## 5. Loading and recovering demo data

### First load or reset

```text
demoDataRepository.load()
→ readStoredValue()
→ no opspulse:demo-data payload exists
→ reset()
→ createDemoDataSeed(now)
→ save(seed)
→ parseDemoData(seed)
→ writeStoredData(validated seed)
→ return validated data
```

### Existing payload

```text
demoDataRepository.load()
→ readStoredValue()
→ JSON.parse(stored payload)
→ parseDemoData(parsed value)
→ Zod structural validation
→ validateDemoData cross-record validation
→ return validated data
```

### Invalid payload

`load()` catches invalid JSON, schema mismatch, relationship errors, and
unsupported versions. It logs a warning and calls `reset()`. A storage access or
write failure throws `DemoDataPersistenceError` rather than pretending recovery
succeeded.

### Ownership

- `src/mocks/persistence/demoDataRepository.ts` is the only durable-data owner.
- React components and feature API functions must not access demo-data storage.
- `src/mocks/data/createDemoDataSeed.ts` creates records; it does not persist
  them.

## 6. Mock HTTP request lifecycle

### General call order

```text
feature API function calls fetch()
→ MSW worker matches a handler from src/mocks/handlers.ts
→ handler applies deterministic read or mutation latency
→ request input is parsed with parseRequest() or parseJsonRequest()
→ handler loads or updates demoDataRepository
→ handler returns the shared success envelope
```

### Failure mapping

Handlers catch boundary errors and call `handleMockApiError()`:

- `MockApiError` preserves its status, stable code, message, and field errors;
- `DemoDataPersistenceError` becomes HTTP 503 with
  `PERSISTENCE_UNAVAILABLE`; and
- unexpected errors are logged and become HTTP 500 with `INTERNAL_ERROR`.

Feature code must branch on stable HTTP contracts, not console text or internal
exception messages.

## 7. Reset Demo Data

### Trigger

The user selects Reset Demo Data in `UserMenu`, confirms the warning, and
activates the destructive action.

### Call order

```text
UserMenu sets isResetDialogOpen=true
→ ResetDemoDataDialog.handleReset()
→ local status becomes pending
→ resetDemoData()
→ fetch POST /api/demo/reset
→ demoHandlers reset handler
→ delayMockMutation()
→ demoDataRepository.reset()
→ createDemoDataSeed(new Date())
→ validate and atomically save the complete dataset
→ success response
→ resetDemoData() resolves
→ queryClient.clear()
→ dialog status becomes success
→ handleFinish() closes dialog and navigates to /dashboard
```

### Failure and safety behaviour

- Pending state prevents repeated activation and closing.
- Network failure becomes a stable application-service error.
- Non-success JSON uses the server message when it is safe and valid.
- Failed reset does not clear the QueryClient or navigate away.
- The dialog owns feedback state; the repository owns records; TanStack Query
  owns cached server data.

## 8. Dashboard data request

### Current implemented boundary

```text
GET /api/dashboard?range=24h|7d|30d
→ dashboard handler
→ delayMockRead()
→ getRange() validates or falls back to 24h
→ createDashboardData(range, new Date())
→ demoDataRepository.load()
→ derive metrics, trend, severity distribution, critical incident,
  recent activity, service health, and on-call responders
→ return { data: DashboardData }
```

`createDashboardData()` derives projections from authoritative incidents,
services, and people. Components must not store or independently reconstruct the
same aggregates.

The Step 11 API service, query key, query hook, and product UI are not implemented
yet. This section must be extended as each dashboard substep is completed.

## 9. Incident discovery request

### Current implemented boundary

```text
GET /api/incidents with search, filter, sort, and page parameters
→ incident list handler
→ parseIncidentListQuery(url)
→ demoDataRepository.load()
→ getFilteredIncidents()
→ compareIncidents() for sorting
→ page slice
→ return data with pagination metadata
```

The Step 12 API service, URL synchronization, TanStack Table configuration, and
responsive table/card interface are not implemented yet.

## 10. Incident mutations

### General call order

```text
feature form submits
→ feature API function sends request
→ matching incident handler
→ parseJsonRequest(request, operation schema)
→ demoDataRepository.update(updater)
→ load current validated dataset
→ validate relationships and lifecycle
→ create a new immutable incident value
→ replaceIncident(data, updatedIncident)
→ validate and atomically save complete next dataset
→ return changed incident
→ future mutation hook updates or invalidates affected queries
```

Implemented handler operations include creation, editing, status change, timeline
update, internal note, and resolution. Their feature API services, forms, query
updates, optimistic behaviour, and product feedback remain assigned to Steps
13–15.

## Workflow documentation checklist

When implementing a feature, update this document with:

1. the user or application trigger;
2. the exact service, hook, handler, repository, and helper call order;
3. the owner of server, URL, form, global, and local state;
4. the event that causes each relevant re-render;
5. loading, empty, error, retry, and rollback behaviour;
6. manual verification steps; and
7. links to automated tests when they exist.

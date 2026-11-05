# OpsPulse — Debugging Guide

## Document status

- Current through completed Step 10
- Last reviewed: November 6, 2026
- Purpose: locate failures by ownership boundary instead of applying speculative
  fixes

## Debugging method

1. Reproduce the smallest failing action.
2. Record the URL, viewport, theme, stored-data state, and expected result.
3. Classify the failure as startup, routing, rendering, interaction, request,
   validation, persistence, cache, or styling.
4. Inspect the authoritative owner before changing a consumer.
5. Follow the matching call chain in `docs/WORKFLOWS.md`.
6. Confirm the failure at the boundary where data or state first becomes wrong.
7. Apply the smallest fix at that boundary.
8. Re-run the failing scenario, nearby scenarios, and `npm run check`.
9. Add an automated regression test when the testing step is active.

## Ownership map

| Symptom concerns                   | Inspect first                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------- |
| Startup or blank page              | `src/main.tsx`                                                                      |
| Route matching or route parameters | `src/app/router/router.tsx` and `src/app/router/paths.ts`                           |
| Server cache or request state      | `src/app/providers/queryClient.ts` and the feature query hook                       |
| URL filters and pagination         | React Router search parameters in the owning feature                                |
| Theme                              | `src/app/stores/themeStore.ts` and `src/app/providers/ThemeProvider.tsx`            |
| Sidebar collapse                   | `src/app/stores/layoutStore.ts`                                                     |
| Mobile drawer                      | local state in `src/components/layout/AppShell.tsx`                                 |
| Form values                        | the owning React Hook Form instance when introduced                                 |
| Request validation                 | `src/mocks/handlers/incidentRequestSchemas.ts` and `src/mocks/http/parseRequest.ts` |
| Persisted demo records             | `src/mocks/persistence/demoDataRepository.ts`                                       |
| API error mapping                  | `src/mocks/http/mockApiError.ts`                                                    |
| Dashboard calculations             | `createDashboardData()` in `src/mocks/handlers/dashboardHandlers.ts`                |
| Shared component mechanics         | the component in `src/components/ui` or its Radix primitive                         |

## Startup and MSW

### Blank application

Check:

1. the browser console for `Root element #root was not found`;
2. that `index.html` contains the expected root element;
3. that `renderApplication()` is reached in `src/main.tsx`; and
4. whether a render error is caught by the route boundary.

### Requests bypass the mock API

Check:

1. the console for `Failed to start the mock API worker.`;
2. Application → Service Workers for `mockServiceWorker.js`;
3. that `src/mocks/browser.ts` creates the worker with the central handlers;
4. that `src/mocks/handlers.ts` includes the expected handler collection; and
5. that the request path and method exactly match the handler.

Do not hide worker-startup failure or add direct seed-data imports to a component.

## Routing and layout

### Wrong page or 404

- Compare the URL with `APP_PATHS` in `src/app/router/paths.ts`.
- Inspect route ordering in `src/app/router/router.tsx`.
- Verify the details route receives `incidentId` through React Router rather than
  a copied state value.

### Wrong breadcrumb, mobile title, or back action

- Inspect `getRouteContext()` in `src/components/layout/routeContext.ts`.
- Confirm `/incidents/new` is evaluated before the dynamic incident-details
  pattern.
- Confirm `TopBar` reads the current location after navigation.

### Mobile drawer remains open on desktop

- Verify the `matchMedia('(min-width: 1024px)')` listener in `AppShell`.
- Confirm `handleBreakpointChange()` receives a matching desktop event.
- Check that the effect cleanup removes the same listener.

## Theme and styling

### Theme does not persist

- Inspect the `opspulse:theme` storage value.
- Confirm it contains a valid `dark` or `light` value.
- Verify `safeThemeStorage` is not blocked by browser privacy settings.
- Confirm `ThemeProvider` subscribes only to `state.theme`.

### Theme attribute changes but colours do not

- Confirm `src/styles/global.css` imports `src/styles/tokens.css`.
- Inspect `document.documentElement.dataset.theme`.
- Verify components use semantic utilities instead of raw theme-specific colours.

### Focus is missing

- Test with the keyboard before changing styles.
- Inspect the component's `focus-visible` utilities and the `focus-ring` token.
- Confirm an overlay has not left focus trapped after it closes.

## Persistence and seed data

### Demo data unexpectedly resets

Check the console warning from `demoDataRepository.load()`. Inspect the
`opspulse:demo-data` value for:

- invalid JSON;
- an unsupported `version`;
- missing required fields;
- unknown person or service IDs;
- duplicate IDs; or
- invalid lifecycle and timestamp relationships.

`parseDemoData()` validates structure and `validateDemoData()` validates
cross-record rules. Correct the source of invalid data rather than weakening the
schema.

### Changes disappear after refresh

- Confirm the mutation uses `demoDataRepository.update()`.
- Confirm `save()` runs after the immutable updater returns.
- Check the browser console for `DemoDataPersistenceError`.
- Verify storage is not blocked or over quota.

### Safe local reset during development

Use the product's Reset Demo Data action. It exercises the same API and cache
boundaries as a reviewer. Manual storage deletion is useful only when diagnosing
corrupt persistence and should not become normal application behaviour.

## Request and API failures

| HTTP result | Meaning                           | Inspect                                               |
| ----------- | --------------------------------- | ----------------------------------------------------- |
| 400         | Invalid request or JSON           | Request schema and `parseJsonRequest()` field errors  |
| 404         | Incident does not exist           | Route parameter, ID, and `findIncidentOrThrow()`      |
| 409         | Invalid lifecycle transition      | Active/resolved guard and requested next status       |
| 503         | Browser persistence unavailable   | Storage access, quota, and `DemoDataPersistenceError` |
| 500         | Unexpected implementation failure | Development console and the handler call stack        |

The interface should display stable safe messages. Internal exception details
belong in development logs, not user-facing responses.

## TanStack Query

### Screen remains stale after a mutation

Check:

1. the mutation response is successful;
2. the query key matches the consuming query;
3. the mutation updates or invalidates every affected list, detail, and dashboard
   query;
4. no component copied query data into local state; and
5. the request is not still considered fresh because the wrong key was used.

Reset Demo Data intentionally calls `queryClient.clear()` only after the reset
endpoint succeeds.

## Build and bundle output

`npm run check` is the required checkpoint command:

```text
format:check → lint → typecheck → Vite production build
```

The MSW browser chunk currently exceeds Vite's default 500 kB warning threshold.
The build still succeeds. Do not hide the warning by increasing the limit; review
code splitting during Step 20 — Performance and Lighthouse Optimization.

## Information to capture in a bug report

- exact route and action;
- expected and actual behaviour;
- viewport and theme;
- console error and failed request response;
- relevant storage key and payload version, without secrets or personal data;
- whether Reset Demo Data reproduces or clears the issue;
- smallest responsible component, hook, service, handler, or repository function;
- manual reproduction steps; and
- regression-test recommendation.

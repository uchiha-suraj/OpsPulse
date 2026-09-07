# OpsPulse — Version 1 Requirements

## Document status

- Roadmap step: Step 2 — Project Requirements and Scope Documentation
- Status: Draft awaiting review
- Version covered: Version 1
- Product: OpsPulse — Incident Management Dashboard
- Owner: Suraj Adhikary

This document defines the functional, interface, resilience, accessibility, and scope requirements for OpsPulse Version 1. Architecture and implementation details will be finalized during their relevant roadmap steps.

## Product statement

OpsPulse is an incident-management dashboard that helps engineering teams monitor service health, coordinate incident response, communicate progress, and resolve production incidents efficiently.

**Tagline:** Monitor, coordinate, and resolve incidents faster.

## Product boundary

Version 1 is a frontend-only portfolio application centred on three workflows:

1. Monitor production
2. Find an incident
3. Manage and resolve an incident

Features that do not directly support these workflows are excluded or deferred unless explicitly approved.

## Target users

Primary users:

- Site Reliability Engineers
- DevOps Engineers
- Incident Commanders

Secondary users:

- Engineering Managers
- Software Engineers participating in incident response

## Confirmed product decisions

1. Version 1 is frontend-only and uses Mock Service Worker with versioned local persistence.
2. Ananya Rao is the single predefined demo user. Authentication and authorization are not implemented.
3. Primary navigation contains only Dashboard and Incidents.
4. Timeline updates, internal notes, and incident resolution are functional and persistent.
5. Version 1 has no notification centre or non-functional notification controls.
6. No screen displays more than one Create Incident action.

## Demo user

- Name: Ananya Rao
- Role: SRE / Incident Responder
- Status: On call
- Initials: AR

The demo user must be defined once as typed application data. Screens must not contain inconsistent names or initials for the same identity.

## Terminology

### Severity

- `SEV-1`: Critical
- `SEV-2`: High
- `SEV-3`: Medium
- `SEV-4`: Low

Severity must always include a textual label and must not be communicated only by colour.

### Incident status

- `Investigating`
- `Identified`
- `Monitoring`
- `Resolved`

An active incident may move between Investigating, Identified, and Monitoring. Moving to Resolved requires the dedicated resolution workflow. Reopening a resolved incident is outside Version 1.

### Service health

Version 1 supports clear textual service states such as:

- Operational
- Degraded
- Major outage

Service health must not depend only on colour.

## Workflow 1: Monitor production

### User goal

An incident responder can quickly understand current production health, identify urgent incidents, and open an incident requiring attention.

### Functional requirements

- `MON-01`: The dashboard must display a critical-incident banner when at least one active SEV-1 incident exists.
- `MON-02`: The banner must provide a direct action for opening the highlighted incident.
- `MON-03`: The dashboard must display the current active-incident count.
- `MON-04`: The dashboard must display the number of incidents resolved during the selected period.
- `MON-05`: The dashboard must display mean time to acknowledge.
- `MON-06`: The dashboard must display mean time to resolve.
- `MON-07`: The dashboard must display incident-trend information for the selected date range.
- `MON-08`: The dashboard must display severity distribution with numeric and textual values.
- `MON-09`: The dashboard must display the current health of monitored services.
- `MON-10`: The dashboard must display recent incident activity.
- `MON-11`: The dashboard must display current on-call responders.
- `MON-12`: The dashboard must support Last 24 hours, Last 7 days, and Last 30 days.
- `MON-13`: Changing the date range must update all time-dependent metrics and charts consistently.
- `MON-14`: A user must be able to open an incident from recent activity.
- `MON-15`: The dashboard must display no more than one Create Incident action.
- `MON-16`: Relevant dashboard data must update after incident creation, status changes, edits that affect dashboard data, and resolution.

### Service-health requirements

Each service-health item must display:

- Service name
- Current operational state
- Availability or another relevant health metric
- Supporting latency or error-rate information when applicable

Service-health content must remain readable without clipped text or awkward wrapping at supported viewport sizes.

### Dashboard loading and refresh

- Initial loading must display a dashboard skeleton or equivalent reserved layout.
- Background updating must preserve successfully loaded information.
- Background updating must have a subtle status indicator when useful.
- A date-range change must provide a scoped pending state without removing the application shell.
- A background refresh failure must not erase valid cached information.

### Dashboard empty state

When no incidents exist:

- Active and resolved counts must show valid zero values.
- Charts must show labelled zero-data states rather than appearing broken.
- The dashboard must distinguish the absence of incidents from a request failure.
- The interface may communicate that services are operational only when supported by service data.
- A single Create Incident action must remain available.

### Dashboard error and offline states

- An initial dashboard request failure must show an actionable error and Retry control.
- A partial section failure should not remove unrelated successful dashboard sections.
- Offline mode must show the latest available information when possible.
- Offline information must be identified as potentially stale.
- Dashboard mutations must not be offered while offline.

### Dashboard accessibility

- Metric cards must have descriptive labels.
- Charts must provide screen-reader-friendly textual summaries.
- Chart tooltips and highlighted values must have defined meanings.
- Critical states must use text and iconography in addition to colour.
- All dashboard links and controls must be keyboard accessible.
- Focus indicators must remain visible in dark and light themes.

### Monitor-production acceptance criteria

1. A user can distinguish healthy, degraded, and unavailable services.
2. A user can identify the most urgent active incident.
3. A user can open the highlighted incident.
4. Metrics and charts respond consistently to the selected date range.
5. Incident mutations refresh affected dashboard information.
6. Initial loading, updating, empty, error, retry, and offline behaviour can be demonstrated.
7. Essential monitoring information is available on desktop and mobile.
8. Charts remain understandable without relying only on their visual presentation.
9. No dashboard control represents an excluded or non-functional capability.
10. The dashboard displays no more than one Create Incident action.

## Workflow 2: Find an incident

### User goal

An incident responder can locate relevant incidents using search, filters, sorting, and pagination, then open the correct incident.

### Functional requirements

- `FIND-01`: Incidents must be displayed in a desktop table and responsive mobile cards.
- `FIND-02`: Search must match incident IDs and titles.
- `FIND-03`: Search should match relevant description text when available.
- `FIND-04`: Search must be case-insensitive and ignore leading and trailing whitespace.
- `FIND-05`: Search must use a short debounce to avoid issuing a request for every keystroke.
- `FIND-06`: Users must be able to filter by status.
- `FIND-07`: Users must be able to filter by severity.
- `FIND-08`: Users must be able to filter by affected service.
- `FIND-09`: Users must be able to filter by incident commander or assignee.
- `FIND-10`: Users must be able to filter by a supported date range.
- `FIND-11`: Multiple filters must work together.
- `FIND-12`: Applied filters must be visibly identifiable.
- `FIND-13`: Users must be able to remove one active filter without clearing the others.
- `FIND-14`: Users must be able to clear all filters.
- `FIND-15`: Results must support ascending and descending sorting for supported fields.
- `FIND-16`: Supported sort fields must include created time, last updated time, severity, status, and duration.
- `FIND-17`: The default sort must be last updated in descending order.
- `FIND-18`: Results must use page-based pagination.
- `FIND-19`: The default page size must be 25.
- `FIND-20`: Desktop page-size options must include 10, 25, and 50.
- `FIND-21`: Desktop must provide numbered pagination.
- `FIND-22`: Mobile must provide compact Previous, current page, and Next controls.
- `FIND-23`: Desktop users must be able to configure supported column visibility.
- `FIND-24`: Incident identity information must not be completely hidden through column visibility.
- `FIND-25`: Users must be able to open an incident from its desktop row or mobile card.
- `FIND-26`: The incident list must display no more than one Create Incident action.

### URL synchronization

The URL is the authoritative owner of:

- Search text
- Active filters
- Sort field
- Sort direction
- Current page
- Page size

Requirements:

- `URL-01`: Refreshing the page must restore the same supported list state.
- `URL-02`: Browser Back and Forward must restore previous supported list states.
- `URL-03`: A copied URL must reproduce the same supported search and result view.
- `URL-04`: Changing search or a filter must reset the page to 1.
- `URL-05`: Invalid URL values must fall back to documented safe defaults.
- `URL-06`: Default values may be omitted from the URL when omission does not make the state ambiguous.
- `URL-07`: Components must not duplicate authoritative URL state in Zustand or independent local state.

Example:

```text
/incidents?q=payment&status=investigating&severity=sev1,sev2&page=1&pageSize=25&sort=updatedAt&order=desc
```

### Incident-list loading and refresh

- Initial loading must display table or card skeletons.
- Search, filter, sort, and page changes must show an appropriately scoped pending state.
- Valid previous results may remain visible during background updates.
- Results from an older search must not replace results for a newer search.
- Duplicate requests or submissions must be prevented where applicable.

### Incident-list empty states

The application must distinguish:

1. No incidents exist: explain that no incidents have been created and provide one Create Incident action.
2. No incidents match: explain that the criteria returned no results and provide Clear Filters.

The empty-state Create Incident action must replace any normal page-level duplicate.

### Incident-list error and offline states

- A failed initial request must display an actionable error and Retry.
- A background refresh failure must preserve valid existing results.
- A request failure must not be presented as an empty result.
- URL parameters must remain intact during errors and retries.
- Offline mode must show the latest available incident information when possible and identify it as potentially stale.

### Incident-list accessibility

- Search must have a persistent accessible label.
- Filters must communicate their names, selected values, and active state.
- Sort controls must announce the affected field and direction.
- Desktop tables must use appropriate header and cell semantics.
- Mobile cards must preserve a logical reading order.
- Pagination must identify the current page and unavailable actions.
- Rows and cards must be keyboard accessible without invalid nested controls.
- Status and severity must not depend only on colour.

### Find-an-incident acceptance criteria

1. A user can find an incident by ID or title.
2. Multiple filters can be combined.
3. Applied filters are visible and individually removable.
4. Clear Filters restores documented defaults.
5. Search, filters, sorting, page, and page size survive refresh through the URL.
6. Invalid URL parameters do not break the screen.
7. A user can open the correct incident on desktop and mobile.
8. No-incidents and no-results states are distinct.
9. Loading, updating, error, retry, and offline behaviour can be demonstrated.
10. The list displays no more than one Create Incident action.
11. Desktop and mobile use the same page-based query model.

## Workflow 3: Manage an incident

### User goal

An incident responder can create an incident, coordinate the response, record progress, and document its resolution.

### Incident-details requirements

- `MAN-01`: Users must be able to open an incident by its ID.
- `MAN-02`: The details screen must display the incident ID, title, description, severity, status, start time, and duration.
- `MAN-03`: The details screen must display affected services, region, commander, and responders.
- `MAN-04`: The details screen must display timeline events, internal notes, and resolution details where present.
- `MAN-05`: The details screen must display related links, creator, created time, last-updated time, and labels where present.
- `MAN-06`: Incident ID, creator, and original creation time must be read-only.
- `MAN-07`: The details screen must provide Edit and Resolve actions when applicable.
- `MAN-08`: The details screen must not display a Create Incident action.

### Create Incident

Required fields:

- Title
- Severity
- At least one affected service
- Incident commander

Optional fields:

- Description
- Region
- Responders
- Start time, defaulting to the current time

Requirements:

- `CREATE-01`: Validation errors must appear beside or be clearly associated with invalid fields.
- `CREATE-02`: An unsuccessful validation attempt must move focus to the first invalid field.
- `CREATE-03`: Submission must prevent duplicate activation.
- `CREATE-04`: The submit control must communicate its submitting state.
- `CREATE-05`: A failed request must preserve entered values.
- `CREATE-06`: A successful request must persist the incident.
- `CREATE-07`: Relevant incident-list and dashboard queries must refresh after creation.
- `CREATE-08`: Successful creation must navigate to the new incident's details screen.

Expected flow:

```text
Open form
→ enter details
→ validate
→ submit through the API service
→ simulated API processes and persists the request
→ refresh affected queries
→ navigate to the new incident
```

### Edit Incident

Editable fields:

- Title
- Description
- Severity
- Affected services
- Region
- Commander
- Responders

Labels may be displayed as incident metadata but are not editable in Version 1.

Requirements:

- `EDIT-01`: Incident ID, creator, creation time, timeline history, and resolution metadata must not be editable.
- `EDIT-02`: Status changes must use the dedicated status action rather than the edit form.
- `EDIT-03`: Cancelling must close the form without changing persisted data.
- `EDIT-04`: Failed submission must preserve the entered values and existing incident data.
- `EDIT-05`: Successful editing must persist after refresh.
- `EDIT-06`: Successful editing must refresh affected details, list, and dashboard data.

### Commander and responders

- `TEAM-01`: An active incident must have one incident commander.
- `TEAM-02`: Users must be able to replace the commander with another available seeded responder.
- `TEAM-03`: Users must be able to add and remove responders.
- `TEAM-04`: The same person must not appear more than once in the responder collection.
- `TEAM-05`: Names and initials must remain consistent everywhere the person is displayed.

### Status changes

- `STATUS-01`: Active incidents may move between Investigating, Identified, and Monitoring.
- `STATUS-02`: Resolving an incident must use the dedicated resolution workflow.
- `STATUS-03`: Every successful status change must create a timeline event.
- `STATUS-04`: A normal active-status change must use an optimistic interface update.
- `STATUS-05`: A failed optimistic request must restore the previous status and affected cached data.
- `STATUS-06`: Success and rollback outcomes must be communicated clearly.
- `STATUS-07`: Reopening resolved incidents is not supported in Version 1.

### Timeline

A timeline event contains:

- Unique event ID
- Incident ID
- Plain-text message
- Event type
- Author or automated source
- Timestamp
- Optional resulting status

Requirements:

- `TIME-01`: Users must be able to add a plain-text timeline update.
- `TIME-02`: Timeline events must use a consistent chronological presentation.
- `TIME-03`: Automated simulated events must be distinguishable from user-authored events.
- `TIME-04`: Successful updates must persist after refresh.
- `TIME-05`: Failed updates must preserve the entered text and existing timeline.
- `TIME-06`: Timeline events cannot be edited or deleted in Version 1.

### Internal notes

An internal note contains:

- Unique note ID
- Incident ID
- Plain-text content
- Author
- Timestamp

Requirements:

- `NOTE-01`: Users must be able to add a plain-text internal note.
- `NOTE-02`: Notes must identify their author and timestamp.
- `NOTE-03`: Notes must be clearly labelled as responder-only information.
- `NOTE-04`: Documentation must disclose that responder-only access is simulated.
- `NOTE-05`: Successful notes must persist after refresh.
- `NOTE-06`: Failed submissions must preserve the entered text and existing notes.
- `NOTE-07`: Editing, deletion, replies, mentions, attachments, and rich text are not supported.

### Resolve Incident

Required field:

- Resolution summary

Optional fields:

- Root-cause note
- Resolved time, defaulting to the current time

Requirements:

- `RESOLVE-01`: Resolving must require clear user confirmation.
- `RESOLVE-02`: Resolution submission must validate the required summary.
- `RESOLVE-03`: The submit control must prevent duplicate activation and display its pending state.
- `RESOLVE-04`: Successful resolution must set status to Resolved.
- `RESOLVE-05`: Successful resolution must store the summary, optional root cause, resolver, and resolution time.
- `RESOLVE-06`: The resolver must be the current demo user, Ananya Rao.
- `RESOLVE-07`: Successful resolution must add a timeline event.
- `RESOLVE-08`: Resolution details and status must be persisted as one consistent operation.
- `RESOLVE-09`: Successful resolution must refresh affected details, list, and dashboard data.
- `RESOLVE-10`: Failure must leave the incident and its resolution information in the previous consistent state.
- `RESOLVE-11`: Failed submission must preserve the entered values and provide an actionable retry path.

Expected flow:

```text
Open resolution form
→ enter resolution information
→ validate
→ submit through the API service
→ persist resolution and Resolved status consistently
→ add timeline event
→ refresh affected queries
→ show resolution details and success feedback
```

### Mutation strategy

Optimistic behaviour is required for ordinary active-status changes.

The following operations wait for a successful simulated API response before presenting their final result:

- Create incident
- Edit incident
- Add timeline update
- Add internal note
- Resolve incident

This boundary provides one meaningful optimistic-update workflow without introducing unnecessary rollback complexity into every mutation.

### Incident-management loading and failure states

- Initial incident loading must display a details skeleton.
- An unknown incident ID must display an incident-not-found state.
- A request failure must display Retry and must not be presented as not found.
- Failed forms must preserve user-entered values.
- Failed optimistic status updates must restore previous cached values.
- Successful mutations must refresh all affected query data.
- Duplicate submissions must be prevented.
- Mutating actions must be unavailable while offline.

### Incident-management accessibility

- Dialogs must receive and contain focus appropriately.
- Closing a dialog must restore focus to its triggering control.
- Form controls must have visible or accessible labels.
- Validation errors must be programmatically associated with fields.
- Pending and success states must be announced appropriately without excessive interruption.
- Tabs must support expected keyboard navigation.
- Timeline and notes must have logical reading order.
- Resolve must be presented as a clear consequential action.
- Severity and status must always have readable text.

### Manage-an-incident acceptance criteria

1. A user can create a valid incident and open its details.
2. Invalid submissions identify the fields that require correction.
3. Supported incident fields can be edited.
4. Commander and responders can be changed without inconsistent identity data.
5. Active-status changes create timeline events.
6. A user can add timeline updates and internal notes.
7. A user can resolve an incident with a required summary.
8. Successful mutations remain after refresh.
9. Failed mutations preserve existing data and entered form values.
10. A failed optimistic status update restores the previous status.
11. Dashboard and incident-list information refresh after relevant mutations.
12. Loading, not-found, error, retry, offline, and submitting states can be demonstrated.
13. Core behaviour works on desktop, mobile, keyboard, and screen-reader paths.
14. Reopening, attachments, rich text, and real-time collaboration remain excluded.

## Shared application requirements

### Navigation

Primary navigation must contain only:

- Dashboard
- Incidents

There must be no standalone Services or Settings destination in Version 1.

Theme selection and Reset Demo Data must be accessible from the Ananya Rao demo-user menu.

### Responsive interface

- `RESP-01`: The application must support desktop and mobile layouts.
- `RESP-02`: One responsive application must adapt across supported widths; separate applications are not allowed.
- `RESP-03`: Desktop incident tables must become deliberately composed mobile cards.
- `RESP-04`: Essential actions and information must remain accessible on mobile.
- `RESP-05`: Normal page content must not require horizontal scrolling.
- `RESP-06`: Tablet layouts must adapt sensibly, but separate tablet-specific designs are not required.

### Theme

- `THEME-01`: The application must support dark and light themes.
- `THEME-02`: A first visit should use the operating-system preference.
- `THEME-03`: An explicit user selection must persist locally.
- `THEME-04`: Both themes must preserve readable status, severity, error, chart, and focus presentation.

### Feedback

Version 1 must use feedback appropriate to the action:

- Inline validation
- Submitting and saving indicators
- Success toasts
- Error toasts
- Retry actions
- Optimistic-update indicators
- Rollback messages
- Operational banners

Version 1 must not include a notification bell, unread badge, notification inbox, or notification preferences.

### Production interface states

- `STATE-01`: Initial loading must preserve expected page structure using skeletons or equivalent placeholders.
- `STATE-02`: Background updating must remain distinguishable from initial loading where relevant.
- `STATE-03`: Empty collections must explain what is absent and provide a relevant next action.
- `STATE-04`: No-results states must explain that filters or search caused the absence of results.
- `STATE-05`: Request errors must be actionable and must not erase valid existing information unnecessarily.
- `STATE-06`: Retry must repeat the relevant failed operation without resetting unrelated state.
- `STATE-07`: Offline mode must show the latest available information when possible and mark it as potentially stale.
- `STATE-08`: Offline mode must be read-only; Version 1 does not queue mutations.
- `STATE-09`: Permission denial must be a deliberately simulated and testable scenario.
- `STATE-10`: Optimistic mutations must have defined success and rollback behaviour.
- `STATE-11`: Incident-not-found, application 404, and unexpected-error states must remain distinct.
- `STATE-12`: An application error boundary must provide a safe recovery action.

Recommended offline copy:

> Showing the latest available data. Fresh information will load when you reconnect.

The interface must not claim that offline changes will synchronize because Version 1 does not implement an offline mutation queue.

### Accessibility

OpsPulse targets WCAG 2.2 AA for its primary workflows.

- `A11Y-01`: All primary functionality must be keyboard accessible.
- `A11Y-02`: Interactive controls must have visible focus indicators.
- `A11Y-03`: Controls must have accessible names and instructions where required.
- `A11Y-04`: Form validation must be perceivable and programmatically associated with fields.
- `A11Y-05`: Status, severity, success, and failure must not depend only on colour.
- `A11Y-06`: Charts must include textual summaries or equivalent accessible descriptions.
- `A11Y-07`: Dialogs, menus, tabs, tables, and pagination must use appropriate semantic and keyboard behaviour.
- `A11Y-08`: Dynamic announcements must communicate important changes without overwhelming assistive-technology users.
- `A11Y-09`: Dark and light themes must meet the agreed contrast target.
- `A11Y-10`: Responsive layouts must retain logical reading and focus order.

### Error handling and recovery

- Errors must be caught at the narrowest useful boundary.
- Valid existing information must remain visible when a background operation fails.
- Error messages must explain what failed and what the user can do next.
- Retry must be offered when repeating the operation is safe and meaningful.
- Failed optimistic operations must restore the previous consistent cache state.
- Unexpected application errors must be handled by an error boundary.
- Development diagnostics must not expose secrets or appear in the production interface.

## Data and persistence requirements

### Proposed data boundary

```text
React interface
→ API service functions
→ Mock Service Worker handlers
→ seeded incident data
→ versioned local persistence
```

Components must not access browser persistence directly for incident records.

### Persistent demo data

Successful changes that must survive browser refresh:

- Created incidents
- Edited incident fields
- Commander and responder assignments
- Status changes
- Timeline updates
- Internal notes
- Resolution details
- Explicit theme preference

### Seed versioning

- Persisted demo data must include or correspond to a schema/version identifier.
- An incompatible seed or persistence version must fail safely.
- Migration or reset behaviour must be documented when the data shape changes.

### Reset Demo Data

- A Reset Demo Data action must be available from the demo-user menu.
- The action must clearly explain that local changes will be removed.
- Reset must require confirmation.
- Reset must restore the original seeded dataset.
- Reset must clear or invalidate affected query data.
- The interface must refresh to a consistent state after reset.
- Reset failure must provide actionable feedback and must not claim success.

### State-ownership direction

- Simulated API/server state: TanStack Query
- Search, filters, sorting, page, and page size: URL parameters
- Form values and validation state: React Hook Form and Zod
- Small global UI preferences: Zustand only when justified
- Temporary UI state: nearest owning component
- Derived values: calculated from authoritative source data
- Durable incident records: mock API persistence layer

The same information must not be stored in multiple state systems without a documented reason.

## Simulated integrations and scenarios

The following behaviour is simulated:

- API requests and latency
- API failures
- Datadog alerts
- Grafana dashboards and links
- Slack incident channels
- Service-health monitoring
- On-call responder availability
- Incident activity
- Permission restrictions
- Offline conditions
- Optimistic failure and rollback

The README must clearly distinguish simulations from real integrations. No control may imply that it performs an external action when it does not.

## Explicitly out of scope

- Real backend
- Real database
- Real authentication or authorization
- Multiple organizations or real multi-user accounts
- Standalone Services page
- Settings page
- Notification centre or notification preferences
- Real WebSockets
- Real-time multi-user collaboration
- Offline mutation queue
- Real Slack integration
- Real Datadog integration
- Real Grafana integration
- Email or push notifications
- Complex role management
- Billing or subscriptions
- AI incident summaries
- File uploads
- Backend audit log
- Separate admin dashboard
- Editing or deleting timeline events
- Editing or deleting internal notes
- Rich-text editing
- Incident reopening
- Custom dashboard date ranges

Any proposed addition must be mapped to a core workflow and explicitly approved before entering Version 1.

## Deferred Figma improvements

- Standardize the demo user as Ananya Rao with initials AR.
- Remove duplicate Create Incident actions.
- Remove Services and Settings navigation.
- Correct clipped service-health content.
- Reduce excessive empty space in mobile incident cards.
- Reduce the mobile filter control height.
- Replace mobile Load More with compact URL-synchronized pagination.
- Define mobile access to supporting dashboard and incident information.
- Refine Edit Incident and Resolve Incident interfaces.
- Add chart tooltips, values, highlighted-bar meaning, and accessible summaries.
- Replace inaccurate offline synchronization wording.
- Confirm design tokens and responsive behaviour.
- Confirm hover, focus, disabled, loading, error, and component variant states.

These items must be considered during their related implementation steps but do not block development or reopen the completed Figma step.

## Quality and verification requirements

Before a completed implementation checkpoint, the project should support and pass the applicable versions of:

```text
npm run format
npm run lint
npm run typecheck
npm run test
npm run build
```

End-to-end tests must protect the three core workflows once Playwright is introduced.

Tests should verify user-visible behaviour rather than internal implementation details.

## Feature definition of done

A feature is complete only when:

- Its acceptance criteria are satisfied.
- The normal flow works.
- Relevant loading, empty, error, and retry behaviour works.
- Mobile behaviour is checked.
- Keyboard behaviour is checked.
- Type-checking passes.
- Relevant automated tests pass.
- The execution and data flow are documented.
- Component and state ownership are documented.
- The change has a focused Git commit.
- Suraj can explain and debug it without AI assistance.

## Version 1 success criteria

1. A reviewer can understand current production health.
2. A reviewer can find an incident using URL-synchronized search, filters, sorting, and pagination.
3. A reviewer can create, update, coordinate, and resolve an incident.
4. Successful changes survive browser refresh.
5. Reset Demo Data restores the original dataset.
6. Required loading, empty, error, retry, offline, permission, optimistic-update, rollback, 404, and unexpected-error states can be demonstrated.
7. Primary workflows work on desktop and mobile.
8. Primary workflows are keyboard accessible and target WCAG 2.2 AA.
9. Required types, tests, builds, and automated quality checks pass.
10. Simulated behaviour is disclosed honestly.
11. Architecture, data flow, ownership, components, and important decisions are documented.
12. Suraj can explain and debug every primary workflow without AI assistance.
13. The deployed application is suitable for a portfolio, GitHub profile, interview demonstration, and development posts.

## Main risks and mitigations

### Scope expansion

Risk: Secondary ideas may dilute the three primary workflows.

Mitigation: Record new ideas in a later-version backlog and require explicit approval before changing Version 1 scope.

### Mock API and persistence drift

Risk: Stored records may no longer match the simulated API contract.

Mitigation: Keep persistence behind the mock API boundary, validate data at boundaries, version the seeded data, and test reset behaviour.

### Duplicated state

Risk: URL, query, form, component, and global state may conflict.

Mitigation: Assign one authoritative owner to each kind of state and derive values instead of copying them.

### Inconsistent optimistic updates

Risk: Failed mutations may leave the interface and persistence layer with different values.

Mitigation: Limit optimistic behaviour to active-status changes, snapshot previous cache data, roll back on failure, and test both success and failure.

### Incomplete mobile workflows

Risk: Mobile screens may omit important actions or supporting information.

Mitigation: Define mobile ownership and access patterns during each relevant feature step and manually verify every primary workflow.

### Inaccessible charts and status indicators

Risk: Important operational information may be available only visually or through colour.

Mitigation: Provide textual summaries, visible labels, keyboard-accessible interactions, and explicit status text.

### Misleading simulations

Risk: Reviewers may believe external systems or authorization are real.

Mitigation: Use honest interface wording and document all simulated behaviour in the README.

### Premature dependency growth

Risk: Installing the full proposed stack immediately may increase complexity before requirements justify it.

Mitigation: Add dependencies only during the roadmap step that requires them, with purpose, alternatives, and ownership documented.

## Step 2 completion condition

Step 2 remains in progress until:

- `PROJECT_OVERVIEW.md` is reviewed.
- This requirements document is reviewed.
- Confirmed decisions are recorded in `DECISIONS.md`.
- Relevant Notion pages are updated.
- Suraj explicitly confirms that Step 2 is complete.

Step 3 must not begin before that confirmation.

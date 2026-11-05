# OpsPulse — Project Overview

## Document status

- Roadmap coverage: Version 1, current through Step 11 preparation
- Status: Steps 1–10 completed and approved; Step 11 implementation not started
- Last reviewed: November 6, 2026
- Design status: Approved as the implementation baseline
- Version covered: Version 1

## Product summary

OpsPulse is an incident-management dashboard that helps engineering teams monitor service health, coordinate incident response, communicate progress, and resolve production incidents efficiently.

**Tagline:** Monitor, coordinate, and resolve incidents faster.

The name combines:

- **Ops:** engineering, DevOps, and production operations
- **Pulse:** the current health of a company’s technical systems

## Problem

During production incidents, engineering teams often collect information from monitoring, deployment, communication, and service-health systems. This information can become fragmented across multiple tools, making it harder to understand the incident, coordinate responders, and maintain an accurate record.

OpsPulse provides a single frontend interface for reviewing production health, finding incidents, coordinating response activity, and recording resolutions.

Version 1 simulates external monitoring and communication systems. It is not intended to replace a production incident-management platform.

## Target users

Primary users:

- Site Reliability Engineers
- DevOps Engineers
- Incident Commanders

Secondary users:

- Engineering Managers
- Software Engineers participating in incident response

## Version 1 objectives

Version 1 should:

- Demonstrate production-style frontend engineering
- Provide three complete incident-management workflows
- Remain achievable by one frontend engineer
- Be suitable for a portfolio and GitHub profile
- Support interview discussions about architecture, state ownership, testing, accessibility, and failure handling
- Establish a maintainable foundation that could later become open source
- Remain understandable and debuggable by Suraj without AI assistance

## Core workflows

Version 1 contains no more than three core workflows.

### 1. Monitor production

```text
Open dashboard
→ review active incidents
→ check service health
→ review incident metrics
→ open a critical incident
```

The dashboard provides operational metrics, incident trends, severity distribution, service health, recent activity, current on-call responders, and predefined date ranges.

### 2. Find an incident

```text
Open incidents
→ search or filter incidents
→ sort and paginate results
→ open incident details
```

Search, filters, sorting, page, and page size are synchronized with URL parameters. Desktop uses a table, while mobile uses incident cards and compact page navigation.

### 3. Manage an incident

```text
Create incident
→ assign severity and responders
→ add timeline updates
→ change incident status
→ add internal notes
→ resolve incident
```

Successful changes persist locally and update all affected interface data.

## Confirmed Version 1 decisions

### Frontend-only data architecture

Version 1 will be frontend-only.

The intended boundary is:

```text
React interface
→ TanStack Query
→ API service functions
→ Mock Service Worker handlers
→ seeded data and versioned local persistence
```

There will be no real backend or database.

### Demo user

Version 1 uses one predefined demo user:

- Name: Ananya Rao
- Role: SRE / Incident Responder
- Status: On call
- Initials: AR

There will be no login, logout, session management, or real authorization. Permission-denied behaviour is a simulated interface scenario.

### Navigation

Version 1 navigation contains:

- Dashboard
- Incidents

There will be no standalone Services or Settings page. Service-health functionality remains part of the dashboard and incident workflows.

Theme selection and Reset Demo Data will be available through the demo-user menu.

### Functional incident information

Timeline updates, internal notes, and resolution details are functional and locally persistent.

Version 1 does not support editing or deleting timeline entries or notes, attachments, rich text, threaded replies, or real-time collaboration.

### Notifications

Version 1 does not contain a notification bell, unread badge, notification centre, or notification preferences.

It retains functional feedback such as toasts, inline validation, retry actions, operational banners, and optimistic-update messages.

### Create Incident placement

No screen displays more than one Create Incident action.

It appears on the dashboard and incident list when contextually appropriate. Incident details retain Edit and Resolve actions instead.

## In scope

### Operations dashboard

- Critical incident banner
- Active and resolved incident metrics
- Mean time to acknowledge
- Mean time to resolve
- Incident trend chart
- Severity distribution
- Service-health overview
- Recent incident activity
- Current on-call responders
- Predefined date ranges
- One Create Incident action

### Incident discovery

- Search by incident ID and title
- Status filter
- Severity filter
- Service filter
- Commander or assignee filter
- Date-range filter
- Active-filter indicators
- Individual filter removal
- Clear Filters
- Sorting
- Page-based pagination
- Desktop column visibility
- URL synchronization
- Responsive mobile cards

### Incident details and actions

- Complete incident information
- Create incident
- Edit incident
- Assign commander
- Assign responders
- Change active status
- Add timeline update
- Add internal note
- Resolve incident
- Form validation
- Success and failure feedback
- Local persistence

### Production interface states

- Initial loading
- Background updating
- Empty incident collection
- No filter results
- Request failure
- Read-only offline mode
- Simulated permission denial
- Optimistic update
- Optimistic rollback
- Successful update
- Incident not found
- Application 404
- Unexpected application error

### Interface quality

- Responsive desktop and mobile layouts
- Dark and light themes
- Keyboard navigation
- Visible focus states
- Accessible labels
- Status and severity indicators that do not rely only on colour
- Accessible chart summaries
- Error boundaries
- Toast feedback
- WCAG 2.2 AA target

## Explicitly out of scope

Version 1 will not include:

- Real backend
- Real database
- Real authentication or authorization
- Multiple users or organizations
- Standalone Services page
- Settings page
- Notification centre
- Real WebSockets
- Real-time multi-user collaboration
- Offline mutation queue
- Slack integration
- Datadog integration
- Grafana integration
- Email or push notifications
- Complex role management
- Billing or subscriptions
- AI incident summaries
- File uploads
- Backend audit log
- Admin dashboard
- Editing or deleting timeline events
- Editing or deleting internal notes
- Rich-text editing
- Incident reopening
- Custom dashboard date ranges

New ideas must be recorded in a later-version backlog unless explicitly approved for Version 1.

## Simulated behaviour

The following capabilities are simulations:

- API requests and responses
- Datadog alerts
- Grafana links and dashboards
- Slack incident channels
- Service-health monitoring
- On-call availability
- Incident activity
- Permission restrictions
- Request failures
- Offline conditions
- Optimistic failures and rollback

The README must identify these simulations clearly and must not imply that real external integrations exist.

## Data persistence

Local persistence must retain:

- Created incidents
- Edited incident information
- Status changes
- Timeline updates
- Internal notes
- Resolution details
- Explicit theme preference

Reset Demo Data must restore the original seeded dataset and invalidate or refresh affected cached information.

Data exists only in the reviewer’s current browser and device.

## Status lifecycle

Version 1 supports:

- Investigating
- Identified
- Monitoring
- Resolved

Active incidents may move between Investigating, Identified, and Monitoring.

Resolving an incident requires the dedicated resolution workflow. Reopening resolved incidents is outside Version 1.

## Offline boundary

Offline mode is read-only.

When offline, OpsPulse displays the latest available information when possible, identifies it as potentially stale, prevents mutations, and refreshes data after connectivity returns.

Version 1 does not queue offline changes for later synchronization.

## Design baseline

The approved Figma export is the implementation baseline:

`OpsPulse — Incident Management Dashboard.pdf`

Design refinement must not block implementation. Relevant improvements should be addressed during their corresponding roadmap steps.

## Deferred design improvements

- Replace Aisha Khan/AK and inconsistent Priya S./AK references with Ananya Rao/AR where they represent the demo user
- Remove duplicate Create Incident actions
- Remove Services and Settings navigation
- Correct clipped service-health content
- Reduce excessive mobile incident-card spacing
- Reduce the mobile filter control height
- Replace mobile Load More with compact URL-synchronized pagination
- Define mobile access to supporting dashboard and incident information
- Refine Edit Incident and Resolve Incident interfaces
- Add chart tooltips, values, highlighted-bar meaning, and accessible summaries
- Replace inaccurate offline synchronization wording
- Confirm design tokens and responsive behaviour
- Confirm hover, focus, disabled, loading, error, and component variant states

## Preliminary technology direction

The proposed stack includes:

- React
- Vite
- TypeScript with strict mode
- React Router
- TanStack Query and Query Devtools
- TanStack Table
- Zustand
- React Hook Form
- Zod
- Recharts
- Tailwind CSS
- Accessible Radix UI or shadcn-style components
- Lucide React
- Mock Service Worker
- Vitest
- React Testing Library
- Playwright
- GitHub Actions
- Vercel

Dependencies are introduced only when required by the active roadmap step. React Router, TanStack Query, Tailwind CSS, Zustand, Lucide React, Class Variance Authority, and the required Radix primitives are now confirmed and implemented. Remaining package choices stay deferred to their relevant steps.

## State-ownership direction

- Simulated server data: TanStack Query
- Search, filters, sorting, and pagination: URL parameters
- Form values and validation: React Hook Form and Zod
- Theme preference: Zustand with guarded `localStorage` persistence
- Desktop sidebar collapsed state: non-persisted Zustand layout store
- Mobile navigation drawer: local state in the application shell
- Menu, dialog, focus, and portal mechanics: Radix primitives
- Temporary interface behaviour: nearest component
- Derived values: calculated from authoritative source data
- Durable demo records: mock API persistence layer

The same information must not be stored in multiple state systems without a documented reason.

## Design-system foundation

Step 9 established a domain-neutral interface foundation based on the approved Figma handoff.

- Tailwind CSS v4 generates utility styles through the Vite plugin.
- Semantic CSS tokens allow the same component classes to support dark and light themes.
- Dark is the deterministic default theme.
- Zustand owns the active theme; `localStorage` only persists that preference.
- Class Variance Authority defines typed component variants.
- `clsx` and `tailwind-merge` compose and resolve utility classes.
- Lucide React supplies a consistent icon vocabulary.
- Radix is installed one primitive at a time when its accessibility behaviour is required.
- Shared UI primitives remain independent of incident, service, and dashboard business rules.

The implemented generic primitives cover buttons, text controls, checkbox and select interactions, badges, avatars, cards, skeletons, alerts, tooltips, and empty states. Incident-specific badges, dashboard cards, pagination, timelines, dialogs, and toast feedback remain owned by their later feature steps.

## Responsive application-layout foundation

Step 10 established the shared product shell without implementing dashboard or incident feature content.

- Desktop layouts at 1024 pixels and wider use a 232-pixel sidebar that can collapse to 64 pixels and a 56-pixel top bar.
- Layouts below 1024 pixels use a 52-pixel mobile top bar, 16-pixel content padding, and an accessible navigation drawer.
- Version 1 navigation exposes only Dashboard and Incidents so unfinished or out-of-scope destinations are not presented as functional.
- Desktop navigation state is global because the sidebar and shell both consume it; mobile drawer state remains local to `AppShell`.
- Route context derives breadcrumbs, mobile titles, and back behaviour from React Router instead of duplicating the current location.
- The shared demo-user menu exposes theme switching and a confirmed Reset Demo Data workflow.
- The development component gallery remains outside the product shell and is still available only during development.

The shell owns layout and navigation concerns only. Incident queries, dashboard data, URL filters, forms, and feature mutations remain with their later feature steps.

## Version 1 success criteria

Version 1 succeeds when:

1. A reviewer can understand current production health.
2. A reviewer can locate an incident using search, filters, sorting, and pagination.
3. A reviewer can create, update, coordinate, and resolve an incident.
4. Successful incident changes survive browser refresh.
5. Reset Demo Data restores the original dataset.
6. Required loading, empty, error, retry, offline, permission, success, optimistic-update, rollback, 404, and unexpected-error states can be demonstrated.
7. Primary workflows work on desktop and mobile.
8. Primary workflows are keyboard accessible and target WCAG 2.2 AA.
9. Required type, test, build, and quality checks pass.
10. Simulated behaviour is disclosed honestly.
11. Architecture, data flow, ownership, components, and important decisions are documented.
12. Suraj can explain and debug every primary workflow without AI assistance.
13. The deployed result is suitable for a portfolio, GitHub profile, interview demonstration, and development posts.

## Main risks

- Expanding Version 1 beyond its three workflows
- Mock persistence drifting from the API contract
- Duplicating state between the URL, query cache, forms, and global UI
- Building all production states simultaneously instead of in vertical slices
- Omitting important information from mobile layouts
- Creating charts that are inaccessible
- Leaving cache and persistence inconsistent after optimistic failures
- Presenting simulations as real integrations
- Adding dependencies before their value is established

## Current status

| Step | Roadmap item                                  | Status                                        |
| ---- | --------------------------------------------- | --------------------------------------------- |
| 1    | Figma Design                                  | Complete                                      |
| 2    | Project Requirements and Scope Documentation  | Complete                                      |
| 3    | React, TypeScript and GitHub Setup            | Complete                                      |
| 4    | Code Quality and Development Tooling          | Complete                                      |
| 5    | Project Architecture and Folder Structure     | Complete                                      |
| 6    | Domain Models and TypeScript Types            | Complete                                      |
| 7    | Mock API and Seed Data                        | Complete                                      |
| 8    | Routing and Global Providers                  | Complete                                      |
| 9    | Design System and Reusable UI Components      | Complete                                      |
| 10   | Responsive Application Layout                 | Complete                                      |
| 11   | Operations Dashboard                          | Approved to begin; implementation not started |
| 12   | Incident List, Search and Filters             | Planned                                       |
| 13   | Incident Details and Timeline                 | Planned                                       |
| 14   | Create and Update Incident Workflows          | Planned                                       |
| 15   | Loading, Empty, Error and Offline States      | Planned                                       |
| 16   | Accessibility and Responsive Review           | Planned                                       |
| 17   | Unit and Component Testing                    | Planned                                       |
| 18   | End-to-End Testing                            | Planned                                       |
| 19   | GitHub Actions and CI                         | Planned                                       |
| 20   | Performance and Lighthouse Optimization       | Planned                                       |
| 21   | Deployment and Production Verification        | Planned                                       |
| 22   | Project Documentation and Architecture Review | Planned                                       |
| 23   | GitHub Open-Source Preparation                | Planned                                       |
| 24   | Demo Video and Screenshots                    | Planned                                       |
| 25   | Portfolio Case Study and Launch Posts         | Planned                                       |

The responsive shell, desktop and mobile navigation, route-aware top bar,
demo-user menu, Reset Demo Data action, skip link, and breakpoint behaviour were
implemented and manually verified on November 6, 2026. All final quality checks
passed, the focused commits were pushed, and Suraj explicitly confirmed Step 10
complete.

## Repository documentation policy

The repository is the only maintained OpsPulse documentation system. Notion is
retired from the workflow.

- `docs/README.md` is the documentation entry point.
- Requirements define expected behaviour and acceptance criteria.
- Architecture and Data Flow define ownership and boundaries.
- Workflow and Code Flow explains function call order for implemented behaviour.
- Decisions preserve accepted choices, alternatives, and rationale.
- Debugging maps failures to owners and recovery steps.
- Daily Progress stores concise evidence rather than duplicating design documents.

Every important feature must update its workflow, ownership, failure, debugging,
verification, and decision documentation before its roadmap step is complete.

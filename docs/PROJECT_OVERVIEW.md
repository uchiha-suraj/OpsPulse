# OpsPulse — Project Overview

## Document status

- Roadmap step: Step 2 — Project Requirements and Scope Documentation
- Status: Approved on September 7, 2026
- Implementation status: Domain-model baseline completed through Step 6
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

Dependencies will be introduced only when required by the active roadmap step. Architecture and package choices remain subject to confirmation during their relevant steps.

## State-ownership direction

- Simulated server data: TanStack Query
- Search, filters, sorting, and pagination: URL parameters
- Form values and validation: React Hook Form and Zod
- Small global interface preferences: Zustand only when justified
- Temporary interface behaviour: nearest component
- Derived values: calculated from authoritative source data
- Durable demo records: mock API persistence layer

The same information must not be stored in multiple state systems without a documented reason.

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

- Step 1 — Figma Design: completed
- Step 2 — Project Requirements and Scope Documentation: completed and approved
- Step 3 — React, TypeScript and GitHub Setup: completed and approved
- Step 4 — Code Quality and Development Tooling: completed and approved
- Step 5 — Project Architecture and Folder Structure: completed and approved
- Step 6 — Domain Models and TypeScript Types: completed and approved
- Step 7 — Mock API and Seed Data: in progress

Suraj explicitly confirmed Step 6 complete and approved Step 7 to begin on September 15, 2026.

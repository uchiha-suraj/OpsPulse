# OpsPulse — Incident Management Dashboard

> Monitor, coordinate, and resolve incidents faster.

OpsPulse is a production-style frontend portfolio project for monitoring service health, finding incidents, coordinating incident response, and documenting resolutions.

The project is being built and owned by [Suraj Adhikary](https://www.heysuraj.dev/), a frontend/software engineer focused on React, TypeScript, and maintainable user-interface architecture.

## Project status

| Area | Status |
| --- | --- |
| Figma design | Completed and approved as the implementation baseline |
| Version 1 requirements and scope | Completed and approved |
| Application implementation | Base setup completed through Step 3 |
| Repository visibility | Private through Version 2 |
| Public/open-source preparation | Deferred until Version 2 is completed and reviewed |

This README describes the approved product direction. A listed capability should not be interpreted as implemented until its roadmap step is marked complete.

## Product purpose

During production incidents, engineering teams often collect information from monitoring, deployment, communication, and service-health systems. Fragmented information makes it harder to understand impact, coordinate responders, communicate progress, and preserve an accurate incident record.

OpsPulse brings the essential incident-response information into one interface.

The name represents:

- **Ops:** engineering, DevOps, and production operations
- **Pulse:** the current health of a company's technical systems

## Target users

- Site Reliability Engineers
- DevOps Engineers
- Incident Commanders
- Engineering Managers
- Software Engineers participating in incident response

## Version 1 core workflows

Version 1 is deliberately limited to three workflows.

### Monitor production

```text
Open dashboard
→ review active incidents
→ check service health
→ review incident metrics
→ open a critical incident
```

### Find an incident

```text
Open incidents
→ search or filter incidents
→ sort and paginate results
→ open incident details
```

### Manage an incident

```text
Create incident
→ assign severity and responders
→ add timeline updates
→ change incident status
→ add internal notes
→ resolve incident
```

## Version 1 scope

### Operations dashboard

- Critical incident banner
- Active and resolved incident metrics
- Mean time to acknowledge and resolve
- Incident trend and severity-distribution charts
- Service-health overview
- Recent incident activity
- Current on-call responders
- Predefined date ranges

### Incident discovery

- Search
- Status, severity, service, assignee, and date filters
- Active-filter indicators and Clear Filters
- Sorting and page-based pagination
- URL-synchronized list state
- Desktop table and mobile cards
- Desktop column visibility

### Incident management

- Incident details
- Create and edit incident
- Assign commander and responders
- Change active incident status
- Add timeline updates
- Add internal notes
- Resolve incident
- Local persistence
- Validation and request feedback

### Interface quality

- Responsive desktop and mobile layouts
- Dark and light themes
- Keyboard navigation and visible focus states
- Accessible labels and status presentation
- Accessible chart summaries
- Loading, empty, error, retry, offline, permission, optimistic-update, rollback, 404, and unexpected-error states
- WCAG 2.2 AA target for primary workflows

## Confirmed Version 1 decisions

- The application is frontend-only.
- Mock Service Worker simulates the API boundary.
- Versioned local persistence retains successful demo changes.
- Ananya Rao is the single predefined demo user.
- Version 1 has no authentication or real authorization.
- Primary navigation contains only Dashboard and Incidents.
- Timeline, Notes, and Resolution are functional.
- Version 1 has no notification centre.
- No screen displays more than one Create Incident action.
- Offline mode is read-only and does not queue mutations.

## Demo user

```text
Name: Ananya Rao
Role: SRE / Incident Responder
Status: On call
Initials: AR
```

Authentication and authorization are not implemented in Version 1. Permission-denied behaviour is a deliberately simulated interface scenario.

## Proposed data flow

```text
React interface
→ TanStack Query
→ API service functions
→ Mock Service Worker handlers
→ seeded data and versioned local persistence
```

Components will not access browser persistence directly for incident records. The mock API layer will own seeded and persisted demo data so that a future backend can replace it without rewriting presentation components.

Successful local changes will include:

- Created incidents
- Edited incident information
- Commander and responder assignments
- Status changes
- Timeline updates
- Internal notes
- Resolution details

A Reset Demo Data action will restore the original seeded dataset for portfolio reviewers.

## State-ownership direction

- **TanStack Query:** simulated API data, request state, and cache
- **URL parameters:** incident search, filters, sorting, page, and page size
- **React Hook Form and Zod:** form values and validation
- **Zustand:** small global UI preferences only when justified
- **Local component state:** temporary interface behaviour
- **Derived calculations:** metrics and projections calculated from authoritative data
- **Mock persistence layer:** durable demo records

The same information must not be stored in multiple state systems without a documented reason.

## Proposed technology stack

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

Packages will be introduced only when required by the active roadmap step. This list is a direction, not permission to install every dependency immediately.

## Simulated behaviour

Version 1 does not connect to real operational services.

The following are simulated:

- API requests, latency, and failures
- Datadog alerts
- Grafana dashboards and links
- Slack incident channels
- Service-health monitoring
- On-call responder availability
- Incident activity
- Permission restrictions
- Offline conditions
- Optimistic failure and rollback

No interface or documentation should imply that these are real integrations.

## Out of scope for Version 1

- Real backend or database
- Real authentication or authorization
- Multiple organizations or real multi-user accounts
- Standalone Services page
- Settings page
- Notification centre
- Real WebSockets or real-time collaboration
- Offline mutation queue
- Real Slack, Datadog, or Grafana integration
- Email or push notifications
- Complex role management
- Billing or subscriptions
- AI incident summaries
- File uploads
- Backend audit log
- Separate admin dashboard
- Editing or deleting timeline events or notes
- Rich-text editing
- Incident reopening
- Custom dashboard date ranges

New ideas will be placed in a later-version backlog unless explicitly approved for Version 1.

## Repository visibility and open-source plan

This repository will remain **private during Version 1 and Version 2 development**.

After Version 2 is complete and reviewed, the project may be made public. Public-release preparation will then include, where appropriate:

- A clear release version and changelog
- An open-source licence
- `CONTRIBUTING.md`
- `CODE_OF_CONDUCT.md`
- `SECURITY.md`
- Issue and pull-request templates
- Contributor labels and scoped starter issues
- A review for secrets, private information, generated files, and repository history

No public or open-source status is implied before that review is complete.

## Documentation

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Version 1 requirements](docs/REQUIREMENTS.md)
- Decision log: `docs/DECISIONS.md` — to be added when a future project change or trade-off requires a local record
- Architecture: `docs/ARCHITECTURE.md` — pending its roadmap step
- Data flow: `docs/DATA_FLOW.md` — pending its roadmap step
- Component inventory: `docs/COMPONENTS.md` — pending its roadmap step
- Debugging guide: `docs/DEBUGGING.md` — pending implementation evidence
- Daily progress: `docs/DAILY_PROGRESS.md` — pending

Documentation should explain why decisions were made, how execution and data flow work, where state lives, what can fail, and how behaviour is verified.

## Local development

### Runtime requirements

- Node.js 24.18.0
- npm 10.4.0

The current repository contains an initial React, TypeScript, and Vite scaffold. Project setup is not considered complete until its roadmap step is reviewed and approved.

Install current dependencies:

```bash
npm install
```

Start the current development environment:

```bash
npm run dev
```

Current scaffold commands:

```bash
npm run lint
npm run build
npm run preview
```

Formatting, dedicated type-checking, unit tests, component tests, and end-to-end commands will be added only during their approved tooling and testing steps.

## Development principles

- Work on one roadmap step at a time.
- Keep changes small, focused, and reviewable.
- Maintain one authoritative owner for each kind of state.
- Keep business logic separate from presentation components.
- Avoid unsafe types and unexplained dependencies.
- Include loading, empty, error, retry, mobile, and keyboard behaviour.
- Document important execution and data flows.
- Add tests for business-critical behaviour.
- Do not mark work complete until it can be explained and debugged without AI assistance.

## Current roadmap position

- Step 1 — Figma Design: completed
- Step 2 — Project Requirements and Scope Documentation: completed
- Step 3 — React, TypeScript and GitHub Setup: completed
- Step 4 — Code Quality and Development Tooling: not approved to begin

Suraj approved the Version 1 requirements and explicitly confirmed Step 2 complete on September 7, 2026.

## Author

Suraj Adhikary  
Frontend / Software Engineer  
[heysuraj.dev](https://www.heysuraj.dev/)

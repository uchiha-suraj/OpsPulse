# OpsPulse — Incident Management Dashboard

> Monitor, coordinate, and resolve incidents faster.

OpsPulse is a production-style incident-management dashboard for engineering teams. It brings service health, active incidents, responders, timeline updates, internal notes, and resolution details into one focused interface.

This project is being built by [Suraj Adhikary](https://www.heysuraj.dev/) to demonstrate senior-level frontend engineering with React and TypeScript: clear architecture, explicit state ownership, realistic failure handling, accessibility, testing, and maintainable documentation.

> **Work in progress:** the design, requirements, architecture, domain model, mock-data foundation, and local persistence layer are complete. Mock API development is currently in progress. Features listed under the Version 1 scope are planned unless they also appear under “Implemented so far.”

## Why OpsPulse?

During a production incident, responders often have to assemble context from monitoring tools, deployment systems, chat channels, and service dashboards. That fragmentation slows down triage and makes it harder to maintain a reliable incident record.

OpsPulse explores how a single frontend can help a response team:

- understand the current health of production systems;
- find and prioritize active incidents;
- identify affected services and assigned responders;
- record a chronological incident timeline;
- communicate status and internal context; and
- document a clear resolution.

The product is designed for Site Reliability Engineers, DevOps Engineers, Incident Commanders, Engineering Managers, and Software Engineers participating in incident response.

## Core workflows

### Monitor production

```text
Open dashboard
→ review active incidents
→ check service health and incident metrics
→ open a critical incident
```

### Find an incident

```text
Open incidents
→ search, filter, and sort
→ paginate through matching records
→ open incident details
```

### Manage an incident

```text
Create incident
→ assign severity and responders
→ add timeline updates and internal notes
→ change status
→ resolve incident
```

These three workflows define the Version 1 boundary. New ideas are intentionally deferred unless they directly strengthen one of them.

## Implemented so far

- React and Vite application foundation
- Strict TypeScript configuration
- Type-aware ESLint and Prettier workflows
- Feature-oriented source architecture and import boundaries
- Incident, service-health, and responder domain models
- Mock Service Worker browser setup
- Versioned, time-relative demo seed data
- 32 realistic incidents, including active and historical records
- Seeded services and responders
- Zod-validated local persistence
- Recovery from missing, invalid, or incompatible persisted data
- Documented requirements, architecture, state ownership, and failure boundaries

The current roadmap position is **Step 7 — Mock API and Seed Data**.

## Version 1 scope

### Operations dashboard

- Critical incident banner
- Active and resolved incident metrics
- Mean time to acknowledge and resolve
- Incident trend and severity-distribution charts
- Service-health overview
- Recent incident activity
- Current on-call responders
- Predefined dashboard ranges: 24 hours, 7 days, and 30 days

### Incident discovery

- Search and multi-field filtering
- Active-filter indicators and clear-filters action
- Sorting and page-based pagination
- URL-synchronized list state
- Desktop data table and responsive mobile cards
- Desktop column visibility controls

### Incident management

- Incident details and metadata
- Create and edit workflows
- Commander and responder assignment
- Status transitions
- Timeline updates and internal notes
- Resolution workflow
- Validation, success feedback, failure feedback, and retry behaviour

### Interface quality

- Responsive desktop and mobile layouts
- Dark and light themes
- Keyboard navigation and visible focus states
- Accessible labels and non-colour status indicators
- Accessible chart summaries
- Loading, empty, error, offline, permission, optimistic-update, rollback, 404, and unexpected-error states
- WCAG 2.2 AA target for primary workflows

## Design

The approved implementation baseline contains desktop, mobile, light-theme, form-state, loading, empty, error, offline, permission, optimistic-update, 404, and 500-state designs.

[View the OpsPulse design in Figma](https://www.figma.com/design/R2G8NGciWbcc4IB2y2upjw/OpsPulse-%25E2%2580%2594-Incident-Management-Dashboard?node-id=1-77&p=f)

The design is intentionally treated as a strong baseline rather than a blocker. Interaction details, accessibility states, and a small deferred design backlog are refined during the relevant implementation steps.

## Architecture

OpsPulse is frontend-only in Version 1, but its data boundary is structured like a real client-server application:

```text
React interface
→ TanStack Query
→ typed API service functions
→ Mock Service Worker request handlers
→ validated repository
→ seeded data and localStorage
```

This boundary keeps presentation components independent from browser storage. A real backend can later replace the mock handlers without requiring the interface to be rewritten.

### State ownership

| State                                         | Owner                            |
| --------------------------------------------- | -------------------------------- |
| Simulated server data and request state       | TanStack Query                   |
| Search, filters, sorting, page, and page size | URL parameters                   |
| Form values and validation                    | React Hook Form and Zod          |
| Small global interface preferences            | Zustand, only when justified     |
| Temporary interaction state                   | Local component state            |
| Durable demo records                          | Mock repository and localStorage |
| Metrics and projections                       | Derived from authoritative data  |

The same information should not be stored in multiple state systems without a documented reason.

### Source direction

```text
src/
├── app/          # application composition, providers, and routing
├── components/   # shared layout and reusable UI primitives
├── features/     # dashboard, incident, and service-health features
├── hooks/        # shared React hooks
├── lib/          # framework-independent utilities and configuration
├── mocks/        # MSW handlers, seed data, and persistence
├── styles/       # global styles and design tokens
└── types/        # shared domain models
```

For the complete reasoning and dependency rules, see [Frontend architecture](docs/ARCHITECTURE.md).

## Technology

### In the project today

- React 19
- Vite
- TypeScript in strict mode
- Zod
- Mock Service Worker
- ESLint with type-aware rules
- Prettier

### Introduced when their roadmap step requires them

- React Router
- TanStack Query and Query Devtools
- TanStack Table
- React Hook Form
- Zustand
- Recharts
- Tailwind CSS
- Accessible Radix UI or shadcn-style components
- Lucide React
- Vitest and React Testing Library
- Playwright
- GitHub Actions
- Vercel

Dependencies are added incrementally so that every package has a clear owner and purpose.

## Demo-data behaviour

Version 1 uses a predefined demo user:

```text
Name: Ananya Rao
Role: SRE / Incident Responder
Status: On call
Initials: AR
```

Successful incident changes will persist across refreshes. A Reset Demo Data action will restore the original dataset for reviewers.

Authentication and real authorization are intentionally out of scope. Permission-denied behaviour is a simulated product state.

## Simulated integrations

OpsPulse does not claim to connect to production services. The following behaviour is simulated for the frontend demonstration:

- Datadog alerts
- Grafana dashboards and links
- Slack incident channels
- Service-health monitoring
- On-call availability
- Real-time incident activity
- Network latency and failures
- Permission restrictions
- Offline conditions
- Optimistic failure and rollback

Version 1 also excludes a real backend, database, authentication system, WebSockets, billing, AI incident summaries, file uploads, and multi-organization support.

## Local development

### Requirements

- Node.js 24.18.0
- npm 10.4.0

### Setup

```bash
git clone https://github.com/uchiha-suraj/OpsPulse.git
cd OpsPulse
npm install
npm run dev
```

The application is available at `http://localhost:5173` by default.

### Quality checks

```bash
npm run format:check
npm run lint
npm run typecheck
npm run build
```

Run the complete current quality workflow with:

```bash
npm run check
```

Testing commands will be added during the approved testing roadmap steps.

## Documentation

- [Project overview](docs/PROJECT_OVERVIEW.md)
- [Version 1 requirements](docs/REQUIREMENTS.md)
- [Frontend architecture](docs/ARCHITECTURE.md)

The documentation records not only what is being built, but why decisions were made, where state lives, how data flows, what can fail, and how behaviour should be verified.

## Roadmap

| Phase                                                | Status      |
| ---------------------------------------------------- | ----------- |
| Design and Version 1 scope                           | Complete    |
| Project setup and code-quality tooling               | Complete    |
| Architecture and domain modelling                    | Complete    |
| Mock API, seed data, and persistence                 | In progress |
| Routing, providers, and design system                | Planned     |
| Dashboard and incident workflows                     | Planned     |
| Resilience, accessibility, and responsive review     | Planned     |
| Automated testing and CI                             | Planned     |
| Performance, deployment, and production verification | Planned     |
| Portfolio case study and launch material             | Planned     |

The roadmap is deliberately sequential: each foundation is understood, verified, and documented before the next layer is introduced.

## Repository status

This repository is public so recruiters and other engineers can follow the project as it develops. It is not yet presented as a finished product or an open-source contribution project.

No open-source licence has been added yet. Until that changes, the code is available for review, but reuse and redistribution are not granted. Contribution guidelines, a code of conduct, security policy, templates, and a formal release will be considered after the core product is complete.

## Author

**Suraj Adhikary**<br>
Frontend / Software Engineer<br>
[Portfolio](https://www.heysuraj.dev/) · [GitHub](https://github.com/uchiha-suraj)

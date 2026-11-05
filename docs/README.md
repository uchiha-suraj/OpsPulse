# OpsPulse — Documentation Guide

This directory is the single source of truth for OpsPulse product and technical
documentation. Notion is no longer required to understand, build, review, or
debug the project.

## Recommended reading order

For a new developer:

1. Read `README.md` at the repository root for the product and setup summary.
2. Read `docs/PROJECT_OVERVIEW.md` for scope, current status, and roadmap.
3. Read `docs/ARCHITECTURE.md` for module boundaries and state ownership.
4. Read `docs/WORKFLOWS.md` for runtime call order and responsible functions.
5. Use `docs/DEBUGGING.md` when behaviour differs from expectations.
6. Consult the remaining reference documents only when their subject is needed.

## Documentation map

| Document                   | Purpose                                                      | Update when                                              |
| -------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| `README.md`                | Public product overview, setup, stack, and current milestone | Public capabilities or setup changes                     |
| `docs/PROJECT_OVERVIEW.md` | Product boundary, roadmap, status, and success criteria      | A roadmap step or scope decision changes                 |
| `docs/REQUIREMENTS.md`     | Detailed Version 1 behaviour and acceptance criteria         | Approved product behaviour changes                       |
| `docs/ARCHITECTURE.md`     | Module boundaries, dependency direction, and state ownership | An architectural boundary changes                        |
| `docs/DATA_FLOW.md`        | HTTP, persistence, cache, and data-transformation flows      | A data contract or data owner changes                    |
| `docs/WORKFLOWS.md`        | User-to-code execution paths and function call order         | A workflow is implemented or its call path changes       |
| `docs/COMPONENTS.md`       | Shared component responsibilities and interaction contracts  | Shared or layout components are added or changed         |
| `docs/DECISIONS.md`        | Accepted technical and product decisions with rationale      | A material choice is accepted, rejected, or superseded   |
| `docs/DEBUGGING.md`        | Failure isolation, symptoms, checkpoints, and recovery       | A new failure mode or diagnostic technique is discovered |
| `docs/DAILY_PROGRESS.md`   | Concise implementation checkpoints and verification evidence | A meaningful checkpoint or roadmap step completes        |

## Source-of-truth rules

- Requirements describe what the product must do.
- Architecture describes where responsibilities belong.
- Data Flow describes how information crosses system boundaries.
- Workflows describe when functions run and how the code collaborates.
- Decisions explain why a material option was selected.
- Debugging explains how to locate and recover from failures.
- Daily Progress records evidence; it must not redefine requirements or
  architecture.
- Code remains authoritative for exact implementation details. Documentation
  must be corrected when it disagrees with verified code.

## Documentation quality rules

- Document demonstrated behaviour, not speculative abstractions.
- Name the responsible module, state owner, trigger, failure path, and
  verification method.
- Link to an existing explanation instead of duplicating it.
- Mark planned and implemented behaviour explicitly.
- Record important alternatives and trade-offs in `docs/DECISIONS.md`.
- Keep progress entries concise; do not copy entire implementation discussions.
- Update workflow and debugging documentation as part of a feature's definition
  of done.

## Current checkpoint

- Steps 1–10 are complete and approved.
- Step 11 — Operations Dashboard is approved to begin but implementation has not
  started.
- The repository is the only maintained OpsPulse documentation system.

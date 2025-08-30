## Sprint 0 Backlog — Foundation

### Goal
Stand up the platform, repositories, CI/CD, RBAC baseline, observability baseline, and Admin UI shell to enable Sprint 1 delivery.

### Scope (In)
- Appwrite project setup (Databases, Storage, Functions, Auth)
- Repo scaffolding (functions monorepo, shared libs), local run scripts
- CI/CD pipelines for dev/stage; secrets management
- RBAC baseline (teams/roles, collection rules)
- Observability/logging baseline; dashboards skeleton
- Admin UI shell (auth, routing, layout)

### Non-Goals (Out)
- Business logic for ingestion/normalization/resolution (next sprints)

---

### User Stories

1) S0-01 — Appwrite project bootstrap
- Acceptance criteria:
  - Project created; Databases and Storage buckets provisioned
  - Baseline collections created empty; environment variables documented
  - Access via service API keys verified
- Estimate: 5 points — Owner: DevOps

2) S0-02 — Repositories & scaffolding
- Acceptance criteria:
  - Mono-repo with packages: functions (ingest, normalize, enrich, publish), shared-lib, admin-ui
  - Linting/formatting, commit hooks, TS config (if applicable)
  - Local dev scripts (up, seed, test)
- Estimate: 5 points — Owner: BE

3) S0-03 — CI/CD pipelines (dev/stage)
- Acceptance criteria:
  - Pipelines for build/test/lint; deploy functions to dev/stage
  - Secrets managed per environment; no secrets in code
  - Rollback command verified
- Estimate: 8 points — Owner: DevOps

4) S0-04 — RBAC baseline
- Acceptance criteria:
  - Teams/roles created: Admin, Editor, Bot, ReadOnly
  - Collection rules applied to baseline collections (deny writes by default)
  - Function permissions limited to required roles
- Estimate: 5 points — Owner: DevOps

5) S0-05 — Observability & logging baseline
- Acceptance criteria:
  - Structured logging library; correlation IDs across functions
  - Dashboard skeleton for function success/failure and latency
  - Alert rule draft for error spikes
- Estimate: 3 points — Owner: DevOps

6) S0-06 — Admin UI shell
- Acceptance criteria:
  - Auth integration; protected routes; environment banner
  - Navigation to placeholders: Sources, Queue, Entities, Settings
  - Responsive layout and basic theme
- Estimate: 8 points — Owner: FE

7) S0-07 — Local developer experience (DX)
- Acceptance criteria:
  - One-command local start; seeded demo data; README with steps
  - Debuggable functions with breakpoints
- Estimate: 3 points — Owner: BE

---

### Progress Checklist
- [ ] S0-01 — Appwrite project bootstrap
- [ ] S0-02 — Repositories & scaffolding
- [ ] S0-03 — CI/CD pipelines (dev/stage)
- [ ] S0-04 — RBAC baseline
- [ ] S0-05 — Observability & logging baseline
- [ ] S0-06 — Admin UI shell
- [ ] S0-07 — Local developer experience (DX)

### Technical Tasks (by story)
- S0-01: Appwrite CLI scripts; env templates; service key test
- S0-02: Repo init; workspace config; shared logger/util packages
- S0-03: Workflow files; environment matrices; deploy steps; artifact retention
- S0-04: Teams & roles provisioning; rules JSON; permission tests
- S0-05: Logger middleware; dashboard JSON; alert policy draft
- S0-06: UI project init; routing/auth; nav/layout components
- S0-07: Docker/devcontainer (optional); seed scripts; VSCode debug configs

### Definition of Done (Sprint 0)
- Dev/stage environments operational; CI pipeline green
- RBAC enforced on write paths; secrets validated in stage
- Admin UI shell deployed to stage and accessible to team
- Onboarding doc allows new dev to run locally in < 15 minutes

### Risks & Mitigations
- Appwrite limits/quotas: Validate plan/limits early; design for quotas
- CI/CD complexity: Start with dev/stage only; iterate to prod later
- UI shell time sink: Keep scope minimal; focus on auth + nav only



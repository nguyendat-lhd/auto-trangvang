## Auto-TrangVang Content Hub — Sprint Plan

### Cadence & Assumptions
- Sprint length: 2 weeks
- Team: 2 BE (Functions/Appwrite), 1 FE (Admin UI), 1 DevOps, 1 Editor (SME), 1 PM
- Environments: dev, stage, prod
- Definition of Done (DoD): Code merged, pipeline green, deployed to stage, docs updated, smoke tests pass, feature flag set appropriately

### Sprint Map
| Sprint | Objective | Primary Epics |
| --- | --- | --- |
| 0 | Foundation: platform setup, CI/CD, security, observability, UI shell | Platform Setup & Scaffolding; CI/CD & Environments; Security & RBAC Baseline; Observability & Logging Baseline; Admin UI Shell; Dev Productivity |
| 1 | MVP ingestion: sources, ingestion, normalization | Source Management & Onboarding; Crawler & Ingestion; Parsing & Normalization; Observability Baseline |
| 2 | Resolution & enrichment MVP | Entity Resolution & Deduplication; Enrichment & Validation; Taxonomy Management |
| 3 | Editorial & publishing MVP | Moderation Queue & Editorial Tools; Publishing Layer & Read APIs |
| 4 | Versioning & performance | Snapshots/Versioning & Rollback; Advanced Observability; Performance tuning |
| 5 | Security & cost guardrails | Advanced Security/RBAC; Cost, Rate-Limiting & Quotas |
| 6 | Hardening & launch prep | NFR validation, DR rehearsal, docs/training, backlog cleanup |

---

### Sprint 0 — Foundation
- **Objectives**: Stand up Appwrite project, repos, CI/CD; baseline RBAC; logging/metrics; Admin UI shell; local tooling.
- **Scope**:
  - Appwrite project, databases, storage, auth; baseline collections created empty
  - Repo scaffolding (functions monorepo, shared libs); local run scripts and seeds
  - CI/CD pipelines (build/test/deploy dev/stage), secrets management
  - RBAC baseline (teams/roles), minimal collection rules
  - Observability baseline (structured logs, correlation IDs), dashboards skeleton
  - Admin UI shell (auth, navigation, placeholders)
- **Deliverables**: Running dev/stage envs; pipelines green; UI shell navigable; docs/README for setup
- **Exit criteria**: New dev can run locally < 15 mins; rollback verified; RBAC enforced on write paths

### Sprint 1 — MVP Ingestion
- **Objectives**: Configure sources; ingest raw items via schedule/webhook; basic normalization; minimal UI to manage sources.
- **Scope**:
  - `sources` CRUD with validation; canary run harness
  - Ingestion function with schedule + webhook entry; idempotent `raw_items`
  - Basic normalization (phones/emails/URLs) and provenance capture
  - Admin UI for Sources (list/create/detail) and latest run status
  - Observability for ingestion throughput/errors
- **Deliverables**: 1–2 live sources; 10k `raw_items` in dev; basic normalized fields
- **Exit criteria**: >95% successful runs on dev over 3 days; duplicates in `raw_items` <1%

### Sprint 2 — Resolution & Enrichment MVP
- **Objectives**: Entity resolution and enrichment pipeline; taxonomy CRUD.
- **Scope**:
  - Matching heuristics and thresholds; merge policy engine
  - Geocoding; URL/phone/email validation; taxonomy mapping
  - `taxonomy_categories` CRUD and synonyms
- **Deliverables**: 50k entities resolved in dev; enrichment jobs stable
- **Exit criteria**: Duplicate rate <3%; geocode success >90%; mapping latency acceptable

### Sprint 3 — Editorial & Publishing MVP
- **Objectives**: Moderation queue with audit trail; publish read APIs.
- **Scope**:
  - Triage rules, assignment, status transitions; inline edits; audit trail
  - Read APIs with filters/pagination; publish notifications
- **Deliverables**: Editors operating queue; consumers reading published entities
- **Exit criteria**: Median moderation <24h (test); P95 read <350ms on stage

### Sprint 4 — Versioning & Performance
- **Objectives**: Snapshots (full/incremental), performance tuning, advanced dashboards.
- **Scope**:
  - Snapshot create/restore; storage references and checksums
  - Indexing and query optimization; hot paths tuning
  - Dashboards for latency, error budgets, backlog
- **Deliverables**: Snapshots for 100k+ entities; perf reports
- **Exit criteria**: Snapshot <30 min for 300k; P95 read <300ms

### Sprint 5 — Security & Cost Guardrails
- **Objectives**: Advanced RBAC; secrets rotation; rate limits/quotas; budget alerts.
- **Scope**:
  - Field-level protections; key rotation flows; access audit
  - Per-source concurrency/rate/quotas; cost estimation and alerts
- **Deliverables**: Policy documents; enforced quotas; alerting live
- **Exit criteria**: Zero critical findings; within monthly budget

### Sprint 6 — Hardening & Launch Prep
- **Objectives**: NFR verification, DR rehearsal, documentation, partner onboarding.
- **Scope**:
  - Load/reliability tests; failure drills; disaster recovery
  - Docs: runbooks, API docs, editor handbook; training
  - Backlog cleanup and polish
- **Deliverables**: Launch checklist complete; sign-offs from Eng/Ops/Editorial
- **Exit criteria**: 99.9% read availability in test; DR RTO/RPO met

---

### Epics → Sprint Mapping (Detailed)
| Epic | Sprint(s) |
| --- | --- |
| Platform Setup & Scaffolding | 0 |
| CI/CD & Environments | 0 |
| Security & RBAC Baseline | 0, 5 |
| Observability & Logging Baseline | 0, 4 |
| Admin UI Shell & Navigation | 0, 1 |
| Developer Productivity & Local Tooling | 0 |
| Source Management & Onboarding | 1 |
| Crawler & Ingestion Framework | 1 |
| Parsing & Normalization | 1 |
| Entity Resolution & Deduplication | 2 |
| Enrichment & Validation | 2 |
| Taxonomy & Category Management | 2 |
| Moderation Queue & Editorial Tools | 3 |
| Publishing Layer & Read APIs | 3 |
| Snapshots, Versioning & Rollback | 4 |
| Advanced Observability, Monitoring & Alerting | 4 |
| Advanced Security, Roles & Permissions | 5 |
| Cost, Rate-Limiting & Quotas | 5 |
| Hardening & Launch Prep | 6 |

### Related Documents
- [PRD](./PRD.md)
- [EPICS](./EPICS.md)
- [BACKLOG (Sprint 1)](./BACKLOG.md)
- [BACKLOG (Sprint 0)](./BACKLOG_SPRINT0.md)



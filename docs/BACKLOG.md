## Sprint 1 Backlog — MVP Ingestion

### Goal
Enable basic ingestion from 1–2 sources into `raw_items` with idempotency and initial normalization, managed via a minimal Sources UI.

### Scope (In)
- `sources` CRUD with validation and canary run
- Scheduled + webhook ingestion into `raw_items`
- Basic normalization (phones, emails, URLs) and provenance
- Sources UI (list/create/detail) with last run status
- Ingestion observability (throughput, errors)

### Non-Goals (Out)
- Entity resolution, enrichment, moderation, publishing (future sprints)

---

### User Stories

1) S1-01 — Create `sources` collection and CRUD API
- Acceptance criteria:
  - Create/read/update/pause/delete sources with schema validation
  - Fields: name (unique), type, config (json), schedule_cron, trust_level, status
  - Audit fields and indexes in place
- Estimate: 5 points — Owner: BE

2) S1-02 — Canary run harness for a source
- Acceptance criteria:
  - Trigger one-off canary run; fetch N sample items; no schedule impact
  - Report success/error and sample counts in UI
- Estimate: 3 points — Owner: BE

3) S1-03 — Ingestion function (scheduled pull)
- Acceptance criteria:
  - Runs on cron per source; respects rate limits and retries
  - Writes idempotent `raw_items` keyed by (source_id, source_item_id)
- Estimate: 8 points — Owner: BE

4) S1-04 — Webhook ingestion endpoint (push)
- Acceptance criteria:
  - Validates signature/secret; rate limits by source
  - Persists raw payload and preliminary parse into `raw_items`
- Estimate: 5 points — Owner: BE

5) S1-05 — Define `raw_items` schema, storage, and indexes
- Acceptance criteria:
  - Schema: source_id, source_item_id, payload_raw, parsed, ingested_at
  - Composite index (source_id, source_item_id); TTL/archival policy drafted
- Estimate: 3 points — Owner: BE

6) S1-06 — Basic normalization pipeline
- Acceptance criteria:
  - Normalize phones/emails/URLs; capture validation results
  - Attach provenance to normalized fields
- Estimate: 5 points — Owner: BE

7) S1-07 — Admin UI: Sources list/create/detail
- Acceptance criteria:
  - Auth-protected; table of sources; create form with validation
  - Detail view shows last run and canary trigger
- Estimate: 8 points — Owner: FE

8) S1-08 — Observability for ingestion
- Acceptance criteria:
  - Structured logs with correlation IDs; dashboard for runs/errors
  - Alerts on error spikes or stalled jobs
- Estimate: 3 points — Owner: DevOps

9) S1-09 — Security & RBAC rules for Sprint 1 surfaces
- Acceptance criteria:
  - Teams/roles apply to `sources`, `raw_items`, functions
  - Secrets handled via environment; no secrets in code
- Estimate: 3 points — Owner: DevOps

---

### Progress Checklist
- [ ] S1-01 — `sources` collection and CRUD API
- [ ] S1-02 — Canary run harness
- [ ] S1-03 — Ingestion function (scheduled)
- [ ] S1-04 — Webhook ingestion endpoint
- [ ] S1-05 — `raw_items` schema and indexes
- [ ] S1-06 — Basic normalization pipeline
- [ ] S1-07 — Admin UI: Sources
- [ ] S1-08 — Ingestion observability
- [ ] S1-09 — Security & RBAC rules

### Technical Tasks (by story)
- S1-01: Collection schema, indexes, validators; API handlers; tests
- S1-02: Function entrypoint; dry-run mode; sample report; tests
- S1-03: Scheduler config; rate limiting; retry/backoff; idempotent writes
- S1-04: Webhook verification; payload size limits; DLQ strategy
- S1-05: Storage for large payloads; pointer in DB; archival plan
- S1-06: Utility library for normalization; provenance schema; tests
- S1-07: UI routes, forms, API integration; auth guard; table and detail
- S1-08: Logging format; dashboard scaffold; alert rules
- S1-09: Collection rules; function permissions; secret rotation checklist

### Definition of Done (Sprint 1)
- All stories meet acceptance criteria and are demoed
- CI pipeline green; deploy to stage; basic runbook updated
- Error rate < 5% on dev over a 3-day soak test

### Risks & Mitigations
- Parser variability: Start with 1–2 stable sources; canary gating
- Rate limits: Conservative concurrency defaults; exponential backoff
- UI iteration speed: Reuse UI shell; keep forms minimal



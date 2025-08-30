## Auto-TrangVang Content Hub – Epics

### 1) Platform Setup & Project Scaffolding
- **Goal**: Establish Appwrite project, environments, repositories, base folders, and shared libraries.
- **Key user stories**:
  - As an Admin, I have an Appwrite project with Databases, Functions, Storage, Auth configured.
  - As a Developer, I bootstrap mono-repo structure with shared config, linting, and scripts.
  - As a Developer, I can run the system locally with seeded data.
- **Acceptance criteria**:
  - Appwrite project created; base database and buckets; environment secrets set.
  - Code scaffolding for functions (ingest, normalize, enrich, publish) and internal UI shell.
  - Local dev scripts (env, seed, start) and docs.
- **KPIs**: New dev onboarding < 1 day; local run < 15 minutes.
- **Dependencies**: Appwrite instance, repo access.

### 2) CI/CD & Environments
- **Goal**: Automated build/test/deploy across dev/stage/prod with approvals and rollbacks.
- **Key user stories**:
  - As a Developer, my PRs run tests and lint checks automatically.
  - As Ops, I can promote builds from stage to prod with approvals.
  - As Ops, I can rollback functions and database migrations quickly.
- **Acceptance criteria**:
  - Pipelines for unit/integration tests, function deploys, infra-as-code.
  - Environment variables/secrets managed per environment.
  - Blue/green or canary deploy for crawler/parser functions.
- **KPIs**: Build < 10 min; rollback < 10 min; >90% pipeline success rate.
- **Dependencies**: Repo, Appwrite CLI/API, secrets store.

### 3) Security & RBAC Baseline
- **Goal**: Least-privilege access model for Admin, Editor, Bot, and ReadOnly roles.
- **Key user stories**:
  - As an Admin, I create teams and roles.
  - As a System, I restrict writes to protected collections and functions.
  - As Ops, I rotate API keys and audit access.
- **Acceptance criteria**:
  - Teams/RBAC rules applied to all collections; public read-only endpoints gated.
  - Secret rotation procedure documented and tested.
  - Basic field-level protections for sensitive attributes.
- **KPIs**: Zero high-severity findings in baseline scan.
- **Dependencies**: Auth, Databases rules.

### 4) Observability & Logging Baseline
- **Goal**: Foundational logs, metrics, traces for all jobs and APIs.
- **Key user stories**:
  - As Ops, I view function logs and job outcomes.
  - As Ops, I track ingestion throughput and error rates.
  - As a Developer, I can correlate a user report to logs and traces.
- **Acceptance criteria**:
  - Structured logging; correlation IDs across pipeline steps.
  - Minimal dashboards for job success/failure and backlog.
  - Alerts on function error spikes and stalled queues.
- **KPIs**: MTTR < 4h baseline; alert precision > 70%.
- **Dependencies**: Functions, logging sink.

### 5) Admin UI Shell & Navigation
- **Goal**: Deliver a minimal admin UI skeleton for navigation, auth, and layout.
- **Key user stories**:
  - As an Editor, I sign in and see a navigation shell (Sources, Queue, Entities, Settings).
  - As an Admin, I manage access via the UI and view environment banners.
- **Acceptance criteria**:
  - Responsive layout, session handling, and protected routes.
  - Placeholder pages for key modules, with feature flags.
- **KPIs**: Navigation render < 200ms; auth success > 99%.
- **Dependencies**: Auth, UI framework, routing.

### 6) Developer Productivity & Local Tooling
- **Goal**: Make common tasks (seed, run, debug) fast and consistent.
- **Key user stories**:
  - As a Developer, I run a single command to start local services.
  - As a Developer, I seed sources and sample raw items locally.
  - As a Developer, I debug functions with breakpoints.
- **Acceptance criteria**:
  - Unified CLI scripts; example env files; debug configs.
  - Sample datasets and golden tests.
- **KPIs**: Local e2e test < 10 mins; >80% developers use scripts weekly.
- **Dependencies**: Appwrite emulator/remote dev, repo scripts.

### 7) Source Management & Onboarding
- **Goal**: Onboard, configure, and manage data sources safely with versioned configs and canary runs.
- **Key user stories**:
  - As an Admin, I add a source with auth, rate limits, and schedules.
  - As an Admin, I pause/resume sources and view last run outcomes.
  - As an Admin, I version/rollback source configurations.
- **Acceptance criteria**:
  - CRUD with schema validation (selectors, pagination, auth, rate limits).
  - Canary test run passes before enabling full schedules.
  - Status and health per source with last_run_at and error summary.
- **KPIs**: Setup time < 30 mins; < 5% config rollbacks.
- **Dependencies**: Auth, Databases, Secrets.

### 8) Crawler & Ingestion Framework
- **Goal**: Reliable idempotent ingestion via schedules and webhooks into `raw_items`.
- **Key user stories**:
  - As a Bot, I run on schedule with concurrency and retries.
  - As an Admin, I trigger on-demand runs.
  - As a System, I accept webhook push ingestion.
- **Acceptance criteria**:
  - Idempotency on `(source_id, source_item_id)`.
  - Per-source concurrency/backoff/retry policies.
  - Metrics for throughput, error rate, duration.
- **KPIs**: >95% successful runs; <1% duplicate raw items.
- **Dependencies**: Functions, Webhooks, `sources`, `raw_items`.

### 9) Parsing & Normalization
- **Goal**: Convert raw payloads to canonical fields with validation and provenance.
- **Key user stories**:
  - As a System, I normalize names, addresses, phones, emails, URLs.
  - As an Editor, I view field-level provenance and validation results.
- **Acceptance criteria**:
  - Trigger on `raw_items` create; capture transform and errors.
  - Provenance and validation results associated to candidate entity.
- **KPIs**: <2% normalization failures; 100% provenance coverage.
- **Dependencies**: Functions, `raw_items`, `entities`.

### 10) Entity Resolution & Deduplication
- **Goal**: Merge duplicates into a canonical entity using rules and heuristics.
- **Key user stories**:
  - As a System, I match by name, address, geo, phones, emails, website, aliases.
  - As an Admin, I configure trust weights and conflict policies.
- **Acceptance criteria**:
  - Deterministic + heuristic scoring with thresholds.
  - Merge policy engine; conflict flags when ambiguous.
  - Cross-references from `raw_items` to `entities`.
- **KPIs**: Duplicate rate < 2–3%; false merges < 0.5%.
- **Dependencies**: `entities`, `aliases`, taxonomy, normalization.

### 11) Enrichment & Validation
- **Goal**: Geo, taxonomy mapping, and contact validation to enhance entities.
- **Key user stories**:
  - As a System, I geocode and validate URLs, phones, emails.
  - As an Editor, I see alias and category suggestions.
- **Acceptance criteria**:
  - Enrichment queue with retries and API rate limits.
  - Taxonomy mapping with synonyms; alias suggestion records.
- **KPIs**: 95% geocode success; 90% category precision in suggestions.
- **Dependencies**: `taxonomy_categories`, `aliases`, external APIs.

### 12) Moderation Queue & Editorial Tools
- **Goal**: Efficient human review workflow with bulk actions and audit trails.
- **Key user stories**:
  - As an Editor, I see prioritized items with reasons and diffs.
  - As an Editor, I batch approve/reject and edit inline.
  - As an Admin, I track SLAs, assignments, and backlog.
- **Acceptance criteria**:
  - Triage rules to `moderation_queue`; assignment; status transitions.
  - Full audit history (who/what/when); revert edits.
  - Bulk operations and keyboard-focused UI.
- **KPIs**: Median resolution < 24h; >80% batchable actions.
- **Dependencies**: Auth/RBAC, `moderation_queue`, `entities`.

### 13) Publishing Layer & Read APIs
- **Goal**: Low-latency, stable read endpoints and publish notifications.
- **Key user stories**:
  - As a Consumer, I query by category, geo, and name.
  - As a System, I emit webhooks on publish/update/delete.
- **Acceptance criteria**:
  - Read-only APIs with filters, search, pagination; rate limits.
  - Publish toggles, `published_at` timestamps.
  - Webhook events for publish lifecycle.
- **KPIs**: P95 < 300ms; 99.9% read availability.
- **Dependencies**: Indexes, `entities`, Notifications.

### 14) Snapshots, Versioning & Rollback
- **Goal**: Immutable data exports for recovery and partners, with restore.
- **Key user stories**:
  - As an Admin, I create full/incremental snapshots and restore.
  - As a Partner, I fetch signed URLs to the latest snapshot.
- **Acceptance criteria**:
  - `snapshots` metadata with Storage references and checksums.
  - Restore procedure with integrity verification.
- **KPIs**: Snapshot < 30 min for 300k entities; zero data loss on rollback.
- **Dependencies**: Storage, `snapshots`, `entities`.

### 15) Taxonomy & Category Management
- **Goal**: Curate hierarchical categories with synonyms and slugs.
- **Key user stories**:
  - As an Admin, I manage categories and synonyms.
  - As a System, I map entities consistently to taxonomy.
- **Acceptance criteria**:
  - CRUD for `taxonomy_categories` with parent-child relations.
  - Safe migrations/deprecations; referential integrity.
- **KPIs**: <5% uncategorized entities; monthly drift audits.
- **Dependencies**: `taxonomy_categories`, enrichment.

### 16) Advanced Observability, Monitoring & Alerting
- **Goal**: End-to-end visibility and alerting across the pipeline.
- **Key user stories**:
  - As an Admin, I view dashboards for throughput, errors, backlogs.
  - As Ops, I receive alerts on failures and SLA breaches.
- **Acceptance criteria**:
  - Function logs/metrics, job statuses, DLQs/backoff stats.
  - Alert rules for error spikes, backlog growth, latency SLOs.
- **KPIs**: MTTR < 2h; alert precision > 80%.
- **Dependencies**: Functions, logging/metrics, dashboards.

### 17) Advanced Security, Roles & Permissions
- **Goal**: Least-privilege access, secret hygiene, and auditability.
- **Key user stories**:
  - As an Admin, I define teams/roles (Admin, Editor, Bot, ReadOnly).
  - As a System, I restrict writes and mask PII.
- **Acceptance criteria**:
  - Appwrite Teams/RBAC rules for all collections and functions.
  - API key rotation and access logs.
- **KPIs**: Zero critical findings; key rotation < 1 day.
- **Dependencies**: Auth, Database rules, Secrets.

### 18) Cost, Rate-Limiting & Quotas
- **Goal**: Guardrails for executions, external APIs, and storage.
- **Key user stories**:
  - As an Admin, I configure per-source limits and monthly budgets.
  - As Ops, I see cost dashboards and get alerts on thresholds.
- **Acceptance criteria**:
  - Enforce per-source concurrency, rate, quota.
  - Cost estimates for jobs; threshold alerts.
- **KPIs**: Within monthly budget; <10% overage.
- **Dependencies**: Observability, `sources` configs, Functions.

### Related Documents
- [PRD](./PRD.md)
- [SPRINTS](./SPRINTS.md)
- [BACKLOG](./BACKLOG.md)
- [BACKLOG (Sprint 0)](./BACKLOG_SPRINT0.md)



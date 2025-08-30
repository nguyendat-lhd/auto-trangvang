## Auto-TrangVang Content Hub – Product Requirements Document (PRD)

### Document Control
- **Owner**: Product Management
- **Stakeholders**: Engineering, Data/Crawler, Editorial, Operations
- **Status**: Draft v1.0
- **Target Stack**: Appwrite (Databases, Functions, Storage, Auth, Teams/Roles, Webhooks)

## 1) Goals
The Auto-TrangVang Content Hub aggregates business listings and related content from multiple sources, normalizes and enriches the data, and publishes a high-quality, de-duplicated, and searchable catalog suitable for websites, APIs, and downstream applications.

Objectives:
- Ensure high coverage and freshness from diverse sources (official sites, public directories, open data, user submissions).
- Standardize and de-duplicate content into canonical entities with clear provenance.
- Provide a workflow for editors/curators to moderate, correct, and approve items.
- Serve a stable, queryable, and versioned dataset to internal products and external consumers.
- Operate reliably and securely at scale using Appwrite-managed services.

Success Metrics (examples):
- >95% successful ingestion jobs per schedule.
- <2% duplicate rate among published entities.
- <24h median time from source change to published update.
- <2% editor rejection rate due to schema mismatches or broken parsing.

## 2) Scope

### In-Scope
- Automated crawling/ingestion from configured sources (pull) and webhook-based ingestion (push).
- Data normalization (schema mapping, text cleanup), deduplication, and entity resolution.
- Metadata enrichment (geocoding, category mapping, alias detection, website/email/phone validation).
- Editorial moderation queue, batch actions, and audit trail.
- Publishing approved entities to read-optimized endpoints and generating periodic snapshots.
- Admin features: source lifecycle, taxonomy management, role/permission management, observability.

### Out-of-Scope
- Building public-facing website or mobile apps (only publishing endpoints and snapshots are in-scope).
- Paid data acquisition or commercial data licensing management.
- Advanced ML-based NER/custom models beyond basic heuristics and third-party APIs.
- Real-time streaming analytics beyond operational dashboards.

## 3) User Personas
- **Crawler Bot**: Automated agent executing scheduled or on-demand ingestion and transformation jobs.
- **Editor/Curator**: Human reviewer who resolves duplicates, validates fields, edits content, and approves publishing.
- **Admin**: Configures sources/taxonomies, manages permissions, monitors system health and costs.
- **Visitor (Consumer)**: External/internal client reading published entities via APIs/exports (not an Appwrite-authenticated user).

## 4) Primary Use Cases
1) Configure Source
- Admin adds a new `source` with crawl rules, parser profile, schedule, and credentials.

2) Ingest Content
- Crawler Bot runs via scheduled Appwrite Function. New/updated items go into `raw_items` with provenance.

3) Normalize & Deduplicate
- Normalization maps raw fields to canonical schema; entity resolution merges to or creates an `entity`.

4) Enrich
- System augments with geocoding, category mapping, website/email/phone validation, and alias suggestions.

5) Moderate
- Editor reviews `moderation_queue` items, fixes fields, resolves conflicts, and approves/rejects.

6) Publish
- Approved entities are marked publishable, indexed for read APIs, and a `snapshot` is recorded for rollback.

7) Administer & Observe
- Admin adjusts taxonomies, aliases, monitors job runs, sets rate limits, and manages roles/permissions.

## 5) Functional Requirements

### 5.1 Crawl & Ingest
- Support pull (scheduled crawl) and push (webhook) patterns per `source`.
- Configurable rate limits, concurrency, and retries per source.
- Store raw payloads and parse results in `raw_items` with source references and timestamps.
- Idempotent ingestion: re-runs must not duplicate raw items.

### 5.2 Normalize
- Map raw fields to canonical entity schema (name, addresses, contacts, category, metadata).
- Clean/standardize text (trim, case, punctuation), unify phone formats, normalize URLs and emails.
- Track field-level provenance.

### 5.3 Deduplicate & Entity Resolution
- Deterministic + heuristic matching using name, address, geo, phones, emails, websites, aliases.
- Merge rules with conflict resolution policies (e.g., trusted sources override less-trusted ones).
- Maintain cross-references from `raw_items` to canonical `entities`.

### 5.4 Enrich
- Geocode addresses to lat/lng and administrative levels.
- Map to controlled `taxonomy_categories` (hierarchical).
- Validate websites, emails, and phones; detect redirects.
- Suggest `aliases` (a.k.a. alternate names, transliterations).

### 5.5 Moderation
- Auto-triage to `moderation_queue` when confidence is low or conflicts exist.
- Batch approve/reject; inline edit canonical fields before approval.
- Full audit trail of actions and diffs.

### 5.6 Publish
- Mark `entities` as published; expose read-only endpoints optimized for search and filters.
- Generate immutable `snapshots` (full or incremental) for rollback/export.
- Webhook notifications to downstream consumers when publish events occur.

### 5.7 Admin Features
- Manage `sources` lifecycle and schedules.
- Manage `taxonomy_categories` and `aliases`.
- Role/permission control via Appwrite Teams and JWTs.
- Operational dashboards (job status, throughput, error rates).

## 6) Data Model (Appwrite Collections)
All collections live in Appwrite Databases with appropriate indexes and rules. Field types are indicative.

### 6.1 `sources`
- `name` (string, unique)
- `type` (enum: crawler, webhook, import)
- `config` (json: pagination, selectors, auth, rate limits)
- `schedule_cron` (string, optional)
- `trust_level` (int: 1–5)
- `status` (enum: active, paused)
- `last_run_at` (datetime)

Indexes: unique(name); by(status); by(last_run_at)

### 6.2 `raw_items`
- `source_id` (ref -> `sources`)
- `source_item_id` (string, unique per source)
- `payload_raw` (json or Storage ref)
- `parsed` (json: preliminary extraction)
- `ingested_at` (datetime)
- `entity_candidate_id` (ref -> `entities`, nullable)

Indexes: composite(source_id, source_item_id); by(ingested_at)

### 6.3 `entities`
- `name` (string)
- `aliases` (array<string>)
- `category_ids` (array<ref -> `taxonomy_categories`>)
- `address` (json: street, ward, district, city, country, postal_code)
- `geo` (json: lat, lng, geohash)
- `phones` (array<string>)
- `emails` (array<string>)
- `website` (string)
- `open_hours` (json)
- `attributes` (json: arbitrary structured fields)
- `provenance` (json: field-level source weights)
- `confidence` (float 0–1)
- `published` (bool)
- `published_at` (datetime, nullable)
- `version` (int)

Indexes: text(name, aliases); geo(geo); by(published, category_ids)

### 6.4 `aliases`
- `entity_id` (ref -> `entities`)
- `alias` (string)
- `type` (enum: alt_spelling, transliteration, legacy)

Indexes: composite(entity_id, alias)

### 6.5 `taxonomy_categories`
- `name` (string)
- `slug` (string, unique)
- `parent_id` (ref -> `taxonomy_categories`, nullable)
- `synonyms` (array<string>)

Indexes: unique(slug); by(parent_id)

### 6.6 `moderation_queue`
- `entity_id` (ref -> `entities`)
- `reason` (enum: low_confidence, conflict, policy_flag, manual)
- `details` (json)
- `status` (enum: pending, approved, rejected)
- `assignee_id` (ref -> Appwrite user)
- `created_at` (datetime)
- `resolved_at` (datetime, nullable)

Indexes: by(status); by(assignee_id)

### 6.7 `snapshots`
- `snapshot_id` (string, unique)
- `type` (enum: full, incremental)
- `created_at` (datetime)
- `entity_ids` (array<ref -> `entities`>)
- `storage_path` (string: Appwrite Storage reference)
- `notes` (string)

Indexes: by(created_at); unique(snapshot_id)

## 7) User Flow
```mermaid
flowchart LR
  A[Admin configures Source] --> B[Scheduled/On-demand Crawl]
  B --> C[raw_items stored]
  C --> D[Normalize]
  D --> E[Deduplicate & Entity Resolution]
  E --> F[Enrich (geo, validation, taxonomy)]
  F -->|Conflicts/Low confidence| G[Moderation Queue]
  G -->|Approve| H[Publish Entities]
  D -->|High confidence| H
  H --> I[Expose Read APIs]
  H --> J[Create Snapshot]
  I --> K[Visitors/Clients]
  J --> L[Exports/Backups]

  subgraph Admin & Ops
    A
    M[Monitor Jobs & Metrics]
  end
  B --> M
  H --> M
```

## 8) Non-Functional Requirements
- **Scalability**: Handle 500k–2M `raw_items`/month; 100k–500k active `entities`. Horizontal scaling through Appwrite Functions concurrency and database indexes.
- **Performance**: P95 read API < 300ms for common filters; batch ingestion 1k items/min sustained per source under rate limits.
- **Availability**: Target 99.9% for read endpoints; graceful degradation during ingestion peaks.
- **Security**: Appwrite Auth with least-privilege API keys; per-team roles; field-level rules for write paths; PII minimization.
- **Maintainability**: Config-driven source parsing; versioned schema; automated tests for parsers and matchers; clear observability.
- **Observability**: Centralized logs, metrics for job throughput/error rates, alerting on failures and backlog growth.

## 9) Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- |
| Source layout changes break parsers | Ingestion failures | High | Parser versioning, smoke tests, canary runs, alerts |
| Rate limits/CAPTCHA from sources | Slow/blocked ingestion | Medium | Rotating schedules, backoff, respect robots, use push/webhooks where possible |
| Duplicate/dirty data | Poor UX, inflated counts | High | Strong matching heuristics, editor review, alias management |
| PII exposure | Compliance/security issues | Medium | Data minimization, masking, access control, audit logs |
| Taxonomy drift | Inconsistent categorization | Medium | Central taxonomy with synonyms, periodic audits |
| Moderation backlog | Delayed publishing | Medium | Confidence thresholds, batch actions, prioritization, staffing |
| Vendor lock-in | Migration difficulty | Low | Clear abstraction, snapshots/exports, infra-as-code |
| Cost overruns | Budget risk | Medium | Per-source rate limits, job budgeting, monitor function executions |

## 10) Roadmap

### Phase 1 (Month 1) – MVP
- Core Appwrite setup (Auth, Teams/Roles, Database, Storage).
- Collections: `sources`, `raw_items`, `entities`, `taxonomy_categories` (minimal), `moderation_queue`.
- Basic crawler function for 1–2 sources; basic normalizer; manual dedupe tool.
- Simple moderation UI (Appwrite Console-driven and lightweight internal UI).
- Publish read API (basic filters) and manual snapshot export.

Deliverables: first 10k entities, P95 < 500ms, editor flow E2E.

### Phase 2 (Months 2–3) – V1
- Add `aliases`, `snapshots` collections and enrichment jobs (geocoding, validation, taxonomy mapping).
- Heuristic matching and merge policies; provenance tracking; audit trail.
- Webhook-based ingestion for push sources; per-source rate limiting and retries.
- Dashboard for job metrics and moderation SLA; alerting.
- Incremental snapshotting and publish notifications.

Deliverables: 100k entities live, <3% duplicate rate, P95 < 350ms.

### Phase 3 (Months 3–6) – V2
- Advanced parser profiles (schema versioning, canary deploys).
- Bulk editor tooling, batch moderation, conflict resolution UI.
- Read-optimized indexes and search facets; geo and text search improvements.
- SLA hardening, perf tuning, cost guardrails; disaster recovery rehearsals.
- Optional partner APIs and self-serve exports.

Deliverables: 300k+ entities, <2% duplicate rate, P95 < 300ms, 99.9% read availability.

---

### Implementation Notes (for Engineering)
- Prefer Appwrite Functions for: crawlers, normalization, enrichment, moderation triggers, publish and snapshot jobs.
- Use database events to queue downstream processing (e.g., on `raw_items` create → normalize).
- Use Appwrite Teams/Roles for Admin vs Editor permissions; read APIs are public but read-only with query constraints.
- Store large raw payloads in Storage with pointer in `raw_items.payload_raw` to reduce DB size.
- Maintain comprehensive indexes aligned to filter patterns and entity resolution joins.

### Related Documents
- [EPICS](./EPICS.md): Product epics aligned with this PRD.
- [SPRINTS](./SPRINTS.md): Sprint plan mapping objectives to epics.
- [BACKLOG](./BACKLOG.md): Detailed Sprint 1 backlog.
- [BACKLOG (Sprint 0)](./BACKLOG_SPRINT0.md): Foundation backlog for setup.
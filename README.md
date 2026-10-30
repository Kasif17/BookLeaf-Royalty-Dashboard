# BookLeaf royalty dashboard supporting deliverables

This repository contains data analysis, Bubble import files, business-rule utilities, integration contracts, and n8n setup guidance for the BookLeaf author royalty dashboard assignment. Bubble.io remains the required application platform; no live Bubble app or n8n instance is connected here.

## Source and current findings

The supplied source is [`bookleaf_sample_data.json`](bookleaf_sample_data.json), copied without edits from `FULLSTACK-SAMPLEDATA (1) (1).json`. It contains 10 authors and 18 nested books (16 `Published & Live`, 2 in production). The source has book-level aggregate sales and royalty fields, not transaction-level royalty entries or payout transaction history. Aggregates: 7,205 copies sold; ₹243,382 earned; ₹202,543 paid; ₹40,839 pending. All stable IDs are unique. These amounts are sums of the source fields, not independently verified ledger totals.

The workspace was empty before this work: no Assignment 1 source, README, package manifest, knowledge base, or API specification was available. The source itself supplies no quarterly payout policy or 45-day processing rule, despite the assignment prompt referring to them. Do not infer those timing rules from the sample.

## Contents

- `docs/`: dataset findings, schema/import and Bubble/n8n/API/security/AI/test implementation guides.
- `bubble-import/`: normalized CSV files for Author, Book, and book-level royalty aggregates.
- `src/royalty.js`: reusable validation and status calculation helpers.
- `tests/`: standard-library unit tests.
- `n8n/`: workflow design and safe setup notes. Configure credentials and Bubble endpoints before import/use.

## Quick start

Node.js 18+ runs the utilities, unit tests, and CSV export with no dependencies.

```powershell
node --test
node scripts/export_bubble_csv.js
```

Import order and Bubble linking instructions are in [`docs/bubble-import-guide.md`](docs/bubble-import-guide.md). Configure Bubble privacy rules and backend workflows before exposing records. Configure n8n credentials through its credential store, never in exported workflow files.

## System boundary

Bubble owns authentication, the production database, author/admin pages, privacy rules, and notification records. n8n is the authenticated server-side automation worker. The CSVs and Node.js utilities are developer-side aids and do not populate Bubble. No API call, email send, or workflow execution has occurred. A React UI was not added: the current workspace has no frontend to extend, and the prompt explicitly requires Bubble to remain the application.

## Five-day implementation outline

1. Confirm policy, schema and access roles with BookLeaf; configure Bubble types/privacy.
2. Import and reconcile authors/books/royalty aggregates; test author scoping.
3. Build admin and author workflows/pages in Bubble; verify mobile and accessibility.
4. Configure authenticated n8n webhook, AI provider, idempotency, callback and delivery controls.
5. Run the documented test plan, reconcile totals, rehearse failures, and prepare submission evidence.

## Current limitations and decisions to verify

See [`docs/README.md`](docs/README.md), especially the source data caveats and the questions for the BookLeaf team. Overdue status cannot be reliably decided from the supplied data because the payout cadence, reporting cycle, and history granularity are unknown. No payout events can be imported because none are supplied.

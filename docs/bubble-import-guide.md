# Bubble import guide

CSV exports are in `bubble-import/`. Counts: 10 authors, 18 books, 18 book-level royalty aggregate records. Values preserve source strings/numbers; empty CSV cells represent source null/empty values. The platform list is pipe-delimited and should be split into a Bubble list after import if needed.

## Import order

1. Create Bubble data types/fields from [bubble-schema.md](bubble-schema.md).
2. Import `authors.csv` into Author. Keep `source_author_id`.
3. Import `books.csv` into Book with `author_source_id` as temporary text.
4. Use a trusted backend workflow to set each Book's Author by matching `author_source_id` to `Author.source_author_id`.
5. Import `royalty-aggregates.csv`; link to Book by `book_source_id` in a backend matching workflow.
6. Verify counts, links, nulls, and sums before enabling pages.

Bubble CSV import may not resolve relationships from text keys automatically; do not assume that it did. Repeat imports should upsert by stable source IDs in a backend workflow or be performed into a clean staging type and reconciled. Do not blindly re-import and create duplicate records.

`User` records are not included: the dataset has no credentials or verified account mapping. Create/login users through Bubble's authentication flow; link a User to Author only after verifying control of the matching email. Never put passwords in CSVs. `Payout` and `NotificationLog` are also not included because no source events exist.

After import compare row counts and aggregate totals with [dataset-analysis.md](dataset-analysis.md). Bubble population has not been performed by this deliverable.

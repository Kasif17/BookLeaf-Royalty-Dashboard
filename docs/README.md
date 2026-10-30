# Documentation index and handoff

## Findings and data

- [Dataset analysis](dataset-analysis.md)
- [Data dictionary](data-dictionary.md)
- [Validation report](data-validation-report.md)
- [Bubble schema](bubble-schema.md)
- [Bubble import guide](bubble-import-guide.md)

## Integrations and operations

- [Bubble integration](bubble-integration.md)
- [API contract](api-contract.md)
- [AI email prompt](ai-email-prompt.md)
- [Test plan](test-plan.md)
- [Founder interview guide](founder-interview-guide.md)

## Review checklist

- [ ] Confirm the sample is the approved assignment dataset.
- [ ] Confirm payout cadence, processing window, currency, rounding, and overdue definition.
- [ ] Approve Bubble data types, privacy rules, admin authorization, and server-side workflows.
- [ ] Import CSVs in the documented order and verify record counts/links.
- [ ] Configure n8n credentials and endpoint authentication outside source control.
- [ ] Test callbacks, retries, duplicate requests, and any email delivery in a non-production environment.
- [ ] Review all statuses and totals against BookLeaf's authoritative ledger.

## Questions for BookLeaf

1. Is the author/book sample complete and authoritative? What do zero/null values mean?
2. What reporting period and payout cadence apply, and what starts the 45-day processing clock?
3. Is payout history tracked per author, per book, or as ledger transactions? Can transaction-level records be supplied?
4. What currency and rounding rule apply? Are royalties considered earned on sale, settlement, or another event?
5. How should overdue be classified when a published title has never been paid, or when publication/payout dates are absent?
6. Which Bubble roles may trigger individual and bulk emails? What approval/audit controls are required?
7. Which AI/email providers are approved, and may author financial data be sent to them?
8. What are the Bubble app/workflow URLs, callback authentication approach, retention period, and operational retry limits?

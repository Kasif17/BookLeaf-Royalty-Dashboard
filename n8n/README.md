# n8n setup specification

No live n8n host or credentials were supplied. An importable workflow JSON is not provided because credentials, callback URL, and the approved payout policy are unknown; a placeholder-only export could imply unsafe defaults. Configure actual n8n nodes and credentials in a non-production instance using this sequence:

1. Webhook (POST, HTTPS reverse proxy, authentication header validation).
2. Validate schema, allowlisted callback endpoint, bounded fields and verified policy.
3. Persist idempotency key `(request_id)` and return existing status for duplicates.
4. Normalize totals from Bubble's trusted snapshot and reject inconsistencies.
5. Build minimized prompt with untrusted fields clearly delimited.
6. AI provider node using n8n credential store; validate structured JSON output.
7. Optional email provider node only after deduplication strategy is in place.
8. Callback Bubble with same request ID and terminal status.
9. Error branch logs sanitized details and attempts a bounded failure callback.

## Response and retry behavior

Return accepted/queued from the webhook only after durable queue/log creation. Bubble must show `Processing`; webhook acceptance is not success. Use a stable request ID for every retry. Store provider idempotency keys where available. Never retry a send blindly after an ambiguous timeout; reconcile provider delivery status first. Limit retries and concurrency, and continue independent authors during bulk runs.

Set webhook auth secret, AI/email credentials, Bubble callback credential and URLs through n8n credentials/environment configuration. Do not commit actual secrets. Callback must be authenticated and fixed/allowlisted. Keep PII out of execution logs where n8n supports data pruning; set retention deliberately.

The sample does not verify the quarterly payout policy or 45-day window. Do not activate copy that states these as facts until the source policy is approved.

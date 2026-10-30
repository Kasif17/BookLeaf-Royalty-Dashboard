# Bubble ↔ n8n API contract

Transport: HTTPS JSON. Use a high-entropy shared secret/HMAC in a server-to-server header, with rotation and constant-time verification where supported. Never put secrets in JSON or logs. Timestamp and request ID protect against replay; keep a deduplication record in a durable store.

## Bubble → n8n

```json
{
  "request_id": "<uuid>",
  "author": {"author_id": "AUTH001", "name": "<verified display name>", "email": "<verified address>"},
  "reporting_cycle": "<approved period identifier>",
  "currency": "<confirmed ISO 4217 code>",
  "summary": {"earned": 0, "paid": 0, "pending": 0, "copies_sold": 0},
  "books": [{"book_id":"<stable id>","title":"<source title>","status":"<source status>","copies_sold":0,"earned":0,"paid":0,"pending":0,"last_payout_date":null}],
  "policy": {"payout_cycle":"<verified policy>","processing_window_days":0,"policy_version":"<version>"},
  "callback_url": "<allowlisted Bubble backend workflow URL>",
  "requested_at": "<ISO-8601 UTC timestamp>"
}
```

Examples are shape-only; zero values are placeholders, not author data. Validate author ID against the server-created request and restrict callback URL to configured allowlist (prefer fixed configuration, not arbitrary input). Reject missing policy instead of inventing timing.

Webhook acceptance is `202`/accepted and means only queued/received, never successful email delivery. Duplicate `request_id` returns the existing processing/result state and does not send twice. Validate bounded arrays/strings/numbers, finite nonnegative amounts, date formats and aggregate consistency without silently rewriting source values.

## n8n → Bubble callback

```json
{
  "request_id": "<same UUID>",
  "author_id": "<same verified ID>",
  "status": "Success | Failed",
  "subject": "<validated subject or null>",
  "email_body": "<validated body or null>",
  "delivery_status": "NotConfigured | Sent | Failed",
  "completed_at": "<ISO-8601 UTC timestamp>",
  "error": {"code":"<safe code>","message":"<sanitized summary>"}
}
```

Callback is authenticated; update the existing request log. `Success` means the defined generation/delivery outcome succeeded; if email is disabled, make that explicit as `NotConfigured` and do not claim sent. Failed callbacks are retried with the same ID under bounded policy. Avoid logging PII, prompts containing personal information, or secrets.

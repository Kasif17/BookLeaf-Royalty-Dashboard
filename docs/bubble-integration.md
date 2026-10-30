# Bubble integration configuration

Bubble owns login, data, UI, privacy and notification state. Configure a server-side backend API workflow for the n8n request and a separate authenticated callback workflow. Placeholder URLs: `https://<bubble-app>/api/1.1/wf/<workflow>` and `https://<n8n-host>/webhook/<path>`.

## Outbound flow

An authorized backend workflow verifies the current User's role and Author link, creates/reuses a NotificationLog request ID, snapshots only required totals/books and sends HTTPS JSON to n8n with a shared-secret header or HMAC signature. Do not expose the secret in browser workflows, page source, or client-side calls. For bulk, create one request per eligible author and reporting cycle.

## Callback

The callback workflow requires authentication and validates request ID, author reference, allowed status, bounded subject/body/error lengths, and timestamp. It updates the existing NotificationLog for that request ID. Callback authorization must not allow arbitrary author substitution. Store only sanitized errors. A callback failure is operationally distinct from email generation/delivery success; reconcile through n8n execution logs and a safe retry.

Configure API workflow authentication explicitly (Bubble workflow authentication settings and server-side secret checks); do not enable public unauthenticated access. Restrict Bubble Data API keys to least privilege and never put them in browser code. Validate privacy rules using real author and admin test accounts before release.

No Bubble app, URL, credentials, or live records were provided, so this is a configuration specification only.

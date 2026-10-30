# Test plan

## Automated unit checks

Run `node --test` with Node.js 18+. Tests cover parsing and unique IDs, source aggregate reconciliation, null-preserving input behavior, numeric checks, provisional status classification and malformed API payload rejection. Fixtures are small and explicitly synthetic; source totals are checked separately against the supplied file.

## Integration and manual Bubble checks

- Import counts and relationships: 10 Author, 18 Book, 18 aggregate records; every book and aggregate links once.
- Authenticate as two authors and confirm each can only access their own books, royalty data and logs.
- Verify unauthenticated users and non-admin users cannot call admin searches or notification workflows.
- Trigger one notification, duplicate the same request ID, and confirm no duplicate log or email.
- Simulate timeout, AI failure, invalid output, email failure and callback failure; confirm state transitions and bounded retry.
- Bulk run with success/failure mixed; one failure must not prevent processing another author.
- Confirm no secrets or full PII appear in browser bundles or logs.
- Review keyboard access, focus, contrast and mobile layouts in the actual Bubble pages.

## Limits

No Bubble or n8n service is configured here. These integration checks require a non-production environment and approved BookLeaf policy. Do not treat utility tests as proof of Bubble privacy, email delivery, or live workflow behavior.

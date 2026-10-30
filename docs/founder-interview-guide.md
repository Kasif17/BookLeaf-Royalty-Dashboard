# Founder interview guide

## Simple explanation

Bubble should remain the product: it handles sign-in, pages, data access rules and the admin's view. n8n should do the background work: accept a protected request, validate the numbers, prepare an email, optionally send it, and report the outcome back. Each email request gets one stable ID so retries update the same record instead of sending duplicates.

The provided sample gives one latest payout date and paid/pending totals per book. It does not show each payment. That means the prototype can summarize supplied figures, but it cannot prove payout history or explain when a payment should be late. The policy and ledger source need confirmation first.

## Questions to ask

1. Which system is authoritative for sales, earned royalties, paid amounts and payout events?
2. What exact cadence, processing clock, currency and rounding rules should authors see?
3. How are users verified and linked to author records? Who may be an admin?
4. What action should happen when data is inconsistent or missing?
5. Is AI allowed to receive author name, email, book and royalty data? Which provider is approved?
6. Should email sending be enabled, and how do we prevent duplicate delivery on retries?
7. How long should email content, errors and execution logs be retained?

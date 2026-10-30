# Bubble database schema proposal

Use Bubble `User` for authentication and authorization, and a separate `Author` business record. Never create passwords from the sample.

| Type | Suggested fields | Notes |
|---|---|---|
| User (Bubble built-in) | role (option set), author (Author, optional) | Admin role must be assigned server-side by a trusted operator. Author users map explicitly to one Author. |
| Author | source_author_id (text, unique by workflow), name, email, phone, city, joined_date, user (User) | Do not expose other authors' records through searches. |
| Book | source_book_id (text), author (Author), title, isbn, genre, status (text/option set preserving source), publication_date, mrp, royalty_rate_per_copy, print_partner, available_on (list of text) | Keep original status text until a verified mapping is approved. |
| RoyaltyRecord | source_book_id or book (Book), copies_sold, earned, paid, pending, last_payout_date, source_snapshot | This is one imported aggregate per book, not a transaction ledger. Avoid separate duplicate totals in Book. |
| Payout | payout_reference, author (Author), book (optional Book), amount, currency, paid_at, reporting_period, source | Do not create rows from `last_royalty_payout_date`; no event data was supplied. |
| NotificationLog | request_id, author, status, created_at, completed_at, subject, body, sanitized_error, reporting_cycle, retry_count | Unique request ID per logical request/cycle. Restrict body and errors to authorized admins and the owner where appropriate. |

Represent money as Bubble number only after confirming currency and precision. For this integer-valued sample, preserve numeric source values. Use explicit nullable fields for missing values. Configure `source_*_id` as text and enforce uniqueness in backend workflows; Bubble does not provide a general relational unique constraint.

## Privacy rules

- Author user: Author where `Author's user is Current User`; Books/RoyaltyRecord/Payout only where their Author is that linked Author.
- Admin: require authenticated User and server-verified admin role for searches/actions. Do not rely on page visibility or hidden controls.
- NotificationLog: owner/admin access with field-level minimization; do not expose internal errors or other authors' email body.
- Deny by default. Test Data API and backend workflows separately. API tokens and shared secrets belong only in server-side workflows.

# Dataset analysis

## Source and shape

Analyzed `bookleaf_sample_data.json`, the supplied JSON copied into this workspace. Root object has one `authors` array. Each author embeds a `books` array. The source is a snapshot of aggregates; it does not contain separate royalty events or payout records.

| Measure | Observed |
|---|---:|
| Authors | 10 |
| Books | 18 |
| Published & Live | 16 |
| In production | 2 |
| Copies sold | 7,205 |
| Royalty earned | ₹243,382 |
| Royalty paid | ₹202,543 |
| Royalty pending | ₹40,839 |

All totals sum the supplied book fields, including zero-valued production books. No duplicate author IDs or book IDs were found. The 16 published books have complete publication dates; the two production titles have null publication dates, commercial values, partner, and no platforms. One production status is `In Production - Cover Design`; the other is `In Production - Typesetting`.

## Entities and relationships

`Author` (stable `author_id`) has many `Book` records (stable `book_id`). Each book includes aggregate copies sold and earned/paid/pending amounts. Platform availability is a string list. There are no explicit payout IDs, payout dates as events, reporting periods, royalty transaction rows, user/login identifiers, or admin records.

## Interpretation and caveats

- Treat `total_royalty_earned`, `royalty_paid`, and `royalty_pending` as source-reported book aggregates. Do not recompute them from copies times rate or add them to a second ledger.
- The fields `royalty_paid + royalty_pending` reconcile to earned for these supplied rows; this is a consistency observation, not proof of the source's accounting policy.
- A `last_royalty_payout_date` is a date attribute, not a payout event/history. It cannot support payout history views beyond the latest date.
- INR is inferred from the Indian context and `mrp` values; there is no currency field. Confirm currency before production use.
- Dates are ISO calendar dates (`YYYY-MM-DD`) or null. The source has no timezone/timestamp fields.
- Phone and email are personal data. Import only to appropriately restricted Bubble fields.
- No assignment Knowledge Base or existing business-rule/API docs were in the workspace.

## Status and overdue

The proposed green/yellow/red classification needs an approved policy. The sample alone cannot establish the quarterly cycle, processing window, overdue threshold, treatment of future dates, nor whether payout date is author-level or title-level. The utility's optional 90-day rule is explicitly a provisional interpretation and must not be treated as approved policy.

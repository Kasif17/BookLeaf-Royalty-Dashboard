# Data validation report

Validated the supplied JSON structure and generated normalized import CSVs. Results are scoped to this snapshot, not an authoritative ledger audit.

- Parse/root shape: valid JSON object with `authors` array.
- Authors: 10; all 10 author IDs unique.
- Books: 18; all 18 book IDs unique; every book is nested under one author.
- Required text/number fields: present for all supplied rows, with documented null exceptions.
- Dates: ISO date strings or null; no malformed date strings observed.
- Nulls: two production books have null publication date, MRP, royalty rate, payout date, and print partner. There are no missing `available_on` arrays.
- Status distribution: `Published & Live` (16), `In Production - Cover Design` (1), `In Production - Typesetting` (1).
- Aggregate checks: earned ₹243,382; paid ₹202,543; pending ₹40,839; paid + pending equals earned at dataset total and each source book row.
- Sales/rate check: do not assert earned equals copies sold times royalty rate as a universal rule; rates/earned may be rounded or based on settlement, and dataset business rules are absent.
- Duplicate/overlap risk: each book appears once in the nested source; CSV exports keep one book aggregate row per book. Never sum the same values from both Book and RoyaltyAggregate tables.
- Potential issues: no currency code; no transaction/period detail; latest payout date does not explain the paid balance; ISBN values are masked (`X`) and should not be presented as verified ISBNs.

Production snapshots retain all zero financial values exactly. Null is kept distinct from zero.

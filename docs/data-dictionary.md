# Data dictionary

Source field names and values are preserved in the source JSON. `bubble-import` CSVs flatten the nesting and add a source author reference to each book.

## Author

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| `author_id` | string | no | Stable source key, e.g. `AUTH001` |
| `name` | string | no | Display name |
| `email` | string | no | Contact email; not an authentication credential |
| `phone` | string | no in supplied rows | Phone string; retain as text |
| `city` | string | no | City |
| `joined_date` | ISO date | no | Author join date |

## Book

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| `book_id` | string | no | Stable source key |
| `author_id` | string/reference | no | Parent author key |
| `title`, `isbn`, `genre`, `status` | string | no | Source metadata; status values are not normalized |
| `publication_date` | ISO date | yes | Null for two production titles |
| `mrp` | number | yes | Source list price; currency absent |
| `author_royalty_per_copy` | number | yes | Source rate; currency absent |
| `print_partner` | string | yes | Null for production titles |
| `available_on` | array of strings | empty allowed | Distribution platform names; CSV uses `|` delimiter |

## Book-level royalty aggregate

| Field | Type | Nullable | Meaning |
|---|---|---|---|
| `book_id` | string/reference | no | Parent book key |
| `total_copies_sold` | integer | no | Aggregate units in source |
| `total_royalty_earned` | number | no | Source-reported earned total |
| `royalty_paid` | number | no | Source-reported paid total |
| `royalty_pending` | number | no | Source-reported pending total |
| `last_royalty_payout_date` | ISO date | yes | Latest date only; not event history |

No fields are supplied for payouts as separate transactions, royalty period, source system timestamp, currency, user account, or notification log.

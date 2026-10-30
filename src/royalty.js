/** Source-faithful royalty validation helpers for the BookLeaf handoff. */

export function parseDate(value) {
  if (value === null || value === undefined || value === '') return null;
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new TypeError('date must use YYYY-MM-DD or be null');
  }
  const parsed = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== value) {
    throw new TypeError('date must use a valid YYYY-MM-DD date');
  }
  return value;
}

export function amount(value, field = 'amount') {
  if (typeof value === 'boolean' || value === null || value === undefined || value === '') {
    throw new TypeError(`${field} must be a finite non-negative number`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new TypeError(`${field} must be a finite non-negative number`);
  }
  return parsed;
}

export function validateDataset(data) {
  if (!data || !Array.isArray(data.authors)) throw new TypeError('authors must be an array');
  const authorIds = new Set();
  const bookIds = new Set();
  let bookCount = 0;
  for (const author of data.authors) {
    if (!author || typeof author.author_id !== 'string' || !author.author_id) {
      throw new TypeError('each author requires an author_id');
    }
    if (authorIds.has(author.author_id)) throw new TypeError(`duplicate author_id: ${author.author_id}`);
    authorIds.add(author.author_id);
    if (!Array.isArray(author.books)) throw new TypeError(`books must be an array for ${author.author_id}`);
    for (const book of author.books) {
      if (!book || typeof book.book_id !== 'string' || !book.book_id) {
        throw new TypeError(`each book requires a book_id for ${author.author_id}`);
      }
      if (bookIds.has(book.book_id)) throw new TypeError(`duplicate book_id: ${book.book_id}`);
      bookIds.add(book.book_id);
      bookCount += 1;
      for (const field of ['total_copies_sold', 'total_royalty_earned', 'royalty_paid', 'royalty_pending']) {
        amount(book[field], field);
      }
      parseDate(book.publication_date);
      parseDate(book.last_royalty_payout_date);
    }
  }
  return { authors: authorIds.size, books: bookCount };
}

export function calculateTotals(data) {
  validateDataset(data);
  const totals = { total_copies_sold: 0, total_royalty_earned: 0, royalty_paid: 0, royalty_pending: 0 };
  for (const author of data.authors) {
    for (const book of author.books) {
      for (const key of Object.keys(totals)) totals[key] += amount(book[key], key);
    }
  }
  return totals;
}

/**
 * Return Paid/Pending/Overdue. `overdueDays` is a provisional policy input;
 * without it, positive balances remain Pending. Missing/future dates do not
 * create an overdue classification.
 */
export function classifyStatus({
  pending,
  lastPayoutDate = null,
  asOf,
  overdueDays = null,
  publicationDate = null,
  isPublished = true,
}) {
  const due = amount(pending, 'pending');
  if (due === 0) return 'Paid';
  if (overdueDays === null || overdueDays === undefined) return 'Pending';
  if (!Number.isInteger(overdueDays) || overdueDays < 0) throw new TypeError('overdueDays must be a non-negative integer');
  const asOfDate = parseDate(asOf);
  if (!asOfDate) throw new TypeError('asOf is required');
  const anchor = parseDate(lastPayoutDate) ?? (isPublished ? parseDate(publicationDate) : null);
  if (!anchor || anchor > asOfDate) return 'Pending';
  const elapsedDays = (Date.parse(`${asOfDate}T00:00:00Z`) - Date.parse(`${anchor}T00:00:00Z`)) / 86400000;
  return elapsedDays > overdueDays ? 'Overdue' : 'Pending';
}

export function validateRequest(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new TypeError('request must be an object');
  if (typeof payload.request_id !== 'string' || !payload.request_id.trim()) throw new TypeError('request_id is required');
  if (!payload.author || typeof payload.author.author_id !== 'string' || !payload.author.author_id) {
    throw new TypeError('author.author_id is required');
  }
  if (!Array.isArray(payload.books) || payload.books.length > 500) {
    throw new TypeError('books must be an array with at most 500 entries');
  }
  for (const book of payload.books) {
    if (!book || typeof book.book_id !== 'string' || !book.book_id) throw new TypeError('each book requires book_id');
    for (const field of ['copies_sold', 'earned', 'paid', 'pending']) amount(book[field], field);
  }
}

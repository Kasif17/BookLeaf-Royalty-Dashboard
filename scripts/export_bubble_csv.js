import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'bookleaf_sample_data.json'), 'utf8'));
const out = path.join(root, 'bubble-import');
fs.mkdirSync(out, { recursive: true });

function csvCell(value) {
  const text = value == null ? '' : Array.isArray(value) ? value.join('|') : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}
function write(filename, fields, rows) {
  const content = [fields.join(','), ...rows.map(row => fields.map(field => csvCell(row[field])).join(','))].join('\r\n') + '\r\n';
  fs.writeFileSync(path.join(out, filename), '\uFEFF' + content, 'utf8');
}
const authors = [];
const books = [];
const royalties = [];
for (const author of data.authors) {
  authors.push(Object.fromEntries(['author_id', 'name', 'email', 'phone', 'city', 'joined_date'].map(k => [k, author[k]])));
  for (const book of author.books) {
    books.push({ author_source_id: author.author_id, ...Object.fromEntries(['book_id', 'title', 'isbn', 'genre', 'publication_date', 'status', 'mrp', 'author_royalty_per_copy', 'print_partner', 'available_on'].map(k => [k, book[k]])) });
    royalties.push({ book_source_id: book.book_id, ...Object.fromEntries(['total_copies_sold', 'total_royalty_earned', 'royalty_paid', 'royalty_pending', 'last_royalty_payout_date'].map(k => [k, book[k]])) });
  }
}
write('authors.csv', ['author_id', 'name', 'email', 'phone', 'city', 'joined_date'], authors);
write('books.csv', ['book_id', 'author_source_id', 'title', 'isbn', 'genre', 'publication_date', 'status', 'mrp', 'author_royalty_per_copy', 'print_partner', 'available_on'], books);
write('royalty-aggregates.csv', ['book_source_id', 'total_copies_sold', 'total_royalty_earned', 'royalty_paid', 'royalty_pending', 'last_royalty_payout_date'], royalties);
console.log(`Wrote ${authors.length} authors, ${books.length} books, ${royalties.length} royalty aggregates.`);

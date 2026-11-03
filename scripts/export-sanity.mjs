import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import matter from 'gray-matter';

const collections = {
  news: 'blog', services: 'services', production: 'production', jobs: 'jobs',
  delivery: 'delivery', steelPipeCategories: 'steel-pipe-categories', steelPipeProducts: 'steel-pipe-products',
};
async function* files(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else if (entry.name.endsWith('.md')) yield path;
  }
}
function convert(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (Array.isArray(value)) return value.map((item, index) => {
    const converted = convert(item);
    return converted && typeof converted === 'object' ? { ...converted, _key: `item-${index}` } : converted;
  });
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, convert(item)]));
  return value;
}
const documents = [];
const ids = new Set();
for (const [type, directory] of Object.entries(collections)) {
  for await (const path of files(join('src/content', directory))) {
    const { data, content } = matter(await readFile(path, 'utf8'));
    if (!data.slug) throw new Error(`Brak slug: ${path}`);
    const id = `${type}-${createHash('sha256').update(data.slug).digest('hex').slice(0, 32)}`;
    if (ids.has(id)) throw new Error(`Powtórzony slug: ${path}`);
    ids.add(id);
    documents.push({ ...convert(data), _id: id, _type: type, slug: { _type: 'slug', current: data.slug }, body: content });
  }
}
await mkdir('sanity-export', { recursive: true });
await writeFile('sanity-export/content.ndjson', documents.map(document => JSON.stringify(document)).join('\n') + '\n');
console.log(`Wyeksportowano ${documents.length} dokumentów do sanity-export/content.ndjson. Nie wysłano danych do Sanity.`);

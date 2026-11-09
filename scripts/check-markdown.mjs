import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

// No network/deployment needed: execute the actual built Netlify Edge function
// against the prerendered HTML it will receive from the CDN in production.
const { default: edge, config } = await import('../.netlify/v1/edge-functions/middleware/middleware.mjs');
assert.equal(config.path, '/*');
const origin = 'https://ecotechgroup.pl';
const fixture = '<html><head><link rel="canonical" href="https://ecotechgroup.pl/ekspert/"><meta name="description" content="Opis &amp; dane"></head><body><header>MENU</header><main><nav>OKRUSZKI</nav><h1>Ekspert</h1><p>Stal &lt; 5 mm &amp; rury</p><h2>Parametry</h2><table><tr><th>Średnica</th><th>Masa</th></tr><tr><td>100 mm</td><td>12 kg</td></tr></table><a href="/kontakt/">Kontakt</a><details><summary>Pytanie FAQ?</summary><p>Odpowiedź FAQ.</p></details><form>TAJNY_FORMULARZ</form><script>BAD_SCRIPT</script></main><footer>STOPKA</footer></body></html>';
const run = (pathname, html, { accept = 'text/markdown', method = 'GET', userAgent = '', status = 200, extra = {} } = {}) => edge(
  new Request(new URL(pathname, origin), { method, headers: { Accept: accept, 'User-Agent': userAgent } }),
  { next: async () => new Response(method === 'HEAD' || [204, 304].includes(status) ? null : html, { status, headers: { 'Content-Type': 'text/html; charset=utf-8', ETag: 'html-etag', 'Vary': 'Accept-Encoding', ...extra } }) }
);
const assertVary = response => {
  assert.match(response.headers.get('vary'), /\bAccept\b/);
  assert.match(response.headers.get('vary'), /User-Agent/);
  assert.match(response.headers.get('vary'), /Accept-Encoding/);
  assert.equal(response.headers.get('netlify-cdn-cache-control'), 'no-store');
};

const converted = await run('/ekspert/', fixture);
assert.match(converted.headers.get('content-type'), /^text\/markdown/);
assertVary(converted);
assert.equal(converted.headers.get('etag'), null);
const text = await converted.text();
assert.match(text, /^# Ekspert/);
assert.match(text, /Canonical URL: https:\/\/ecotechgroup.pl\/ekspert\//);
assert.match(text, /\| Średnica\s*\| Masa/);
assert.match(text, /\| 100 mm\s*\| 12 kg/);
assert.match(text, /\[Kontakt\]\(https:\/\/ecotechgroup.pl\/kontakt\/\)/);
assert.match(text, /Odpowiedź FAQ/);
assert.match(text, /Opis & dane/);
assert.doesNotMatch(text, /MENU|STOPKA|OKRUSZKI|TAJNY_FORMULARZ|BAD_SCRIPT|<script|<form/);

for (const accept of ['text/html', 'text/markdown;q=0, text/html', 'text/markdown;q=0.2, text/html;q=1', 'text/markdown;q=0.2, */*;q=1']) {
  const response = await run('/ekspert/', fixture, { accept });
  assert.equal(await response.text(), fixture, `HTML preference: ${accept}`);
  assertVary(response);
}
for (const accept of ['text/markdown', 'text/html;q=0.5, text/markdown;q=1']) {
  const head = await run('/ekspert/', fixture, { method: 'HEAD', accept });
  assert.match(head.headers.get('content-type'), /^text\/markdown/);
  assert.equal(await head.text(), '');
  assert.equal(head.headers.get('etag'), null);
  assertVary(head);
}
for (const userAgent of ['ChatGPT-User', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
  assert.match((await run('/ekspert/', fixture, { accept: '*/*', userAgent })).headers.get('content-type'), /^text\/markdown/);
  assert.match((await run('/ekspert/', fixture, { accept: 'text/markdown;q=0, text/html', userAgent })).headers.get('content-type'), /^text\/html/);
}
for (const status of [301, 404, 503, 304]) {
  const response = await run('/missing/', fixture, { status, extra: { Location: '/kontakt/' } });
  assert.equal(response.status, status);
  assert.match(response.headers.get('content-type'), /^text\/html/);
  assert.equal(response.headers.get('location'), '/kontakt/');
}
for (const contentType of ['application/json', 'application/pdf', 'text/plain']) {
  const response = await run('/api/test', 'unchanged', { extra: { 'Content-Type': contentType } });
  assert.equal(response.headers.get('content-type'), contentType);
  assert.equal(await response.text(), 'unchanged');
}
assert.match((await run('/kontakt/', fixture, { method: 'POST' })).headers.get('content-type'), /^text\/html/);
const excluded = await run('/aktualnosci/wigilia-firmowa-2025/', fixture);
assert.equal(excluded.headers.get('x-robots-tag'), 'noindex, follow');
const oldMaintenance = process.env.MAINTENANCE_MODE;
process.env.MAINTENANCE_MODE = 'true';
try {
  const response = await run('/ekspert/', fixture);
  assert.equal(response.status, 503);
  assert.equal(response.headers.get('retry-after'), '3600');
} finally {
  if (oldMaintenance === undefined) delete process.env.MAINTENANCE_MODE;
  else process.env.MAINTENANCE_MODE = oldMaintenance;
}

async function* htmlFiles(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(file);
    else if (entry.name === 'index.html') yield file;
  }
}
let count = 0;
for await (const file of htmlFiles('dist')) {
  const pathname = '/' + path.relative('dist', file).replaceAll('\\', '/').replace(/index\.html$/, '');
  const html = await readFile(file, 'utf8');
  const response = await run(pathname, html);
  assert.equal(response.status, 200, pathname);
  assert.match(response.headers.get('content-type'), /^text\/markdown/, pathname);
  assertVary(response);
  const markdown = await response.text();
  assert.match(markdown, /^# /m, pathname);
  assert.ok(markdown.includes(`Canonical URL: ${origin}${pathname}`), pathname);
  assert.doesNotMatch(markdown, /<script\b|<form\b|application\/ld\+json/i, pathname);
  if (pathname === '/rury-stalowe-bez-szwu/') assert.match(markdown, /https:\/\/ecotechgroup.pl\/rura-stalowa-bez-szwu-/);
  if (pathname === '/rura-stalowa-bez-szwu-fi-133-9-x-12-mm/') {
    assert.match(markdown, /133,9mm/);
    assert.match(markdown, /PN-EN 10210/);
    assert.match(markdown, /P235/);
    assert.match(markdown, /\|/);
  }
  if (++count % 500 === 0) console.log(`Checked ${count} prerendered pages`);
}
assert.ok(count >= 1551, `Expected product pages in build, found ${count} total pages`);
console.log(`PASS: Netlify Edge — ${count} static pages, HTML/Markdown/HEAD, q preferences, bots, cache, tables, links, errors and maintenance`);

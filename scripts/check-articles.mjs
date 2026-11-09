import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse } from 'node-html-parser';
import { isExcludedFromIndexing, excludedArticleSlugs } from '../src/lib/indexing.mjs';

const base = process.argv[2] || 'http://127.0.0.1:4321';
const files = (await readdir('src/content/blog')).filter(file => file.endsWith('.md'));
assert.equal(files.length, 30);
assert.equal(excludedArticleSlugs.size, 9);
let questions = 0, howTos = 0;
const glossaryVariants = new Set();
for (const file of files) {
  const { data } = matter(await readFile(`src/content/blog/${file}`, 'utf8'));
  const pathname = `/aktualnosci/${data.slug}/`;
  const get = options => fetch(new URL(pathname, base), { redirect: 'manual', signal: AbortSignal.timeout(30000), ...options });
  const response = await get({ headers: { Accept: 'text/html' } });
  assert.equal(response.status, 200, pathname);
  const html = await response.text();
  const page = parse(html);
  assert.equal(page.querySelectorAll('h1').length, 1, pathname);
  const toc = page.querySelector('#article-toc');
  assert.ok(toc && !toc.classNames.includes('hidden'), `${pathname}: TOC must be in initial HTML`);
  const links = toc.querySelectorAll('a');
  assert.ok(links.length >= 2);
  const ids = page.querySelectorAll('[id]').map(node => node.id);
  for (const link of links) {
    const id = link.getAttribute('href').slice(1);
    assert.equal(ids.filter(value => value === id).length, 1, `${pathname}: anchor ${id}`);
  }
  for (const heading of page.querySelectorAll('.article-content h2, .article-content h3')) {
    assert.ok(links.some(link => link.getAttribute('href') === `#${heading.id}`), heading.textContent);
  }
  const facts = page.querySelectorAll('aside[aria-label="Kluczowe wnioski"] li');
  assert.ok(facts.length >= 3 && facts.length <= 4);
  assert.deepEqual(facts.map(node => node.textContent), data.keyTakeaways);
  const graph = JSON.parse(page.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  const posting = graph.find(node => node['@type'] === 'BlogPosting');
  assert.equal(posting.author.worksFor['@id'], 'https://ecotechgroup.pl/#organization');
  assert.equal(posting.dateModified, new Date(data.dateModified).toISOString());
  assert.ok(new Date(posting.dateModified) >= new Date(posting.datePublished));
  assert.equal(page.querySelector('[data-date-modified]').getAttribute('datetime'), posting.dateModified);
  assert.equal(page.querySelector('meta[property="article:modified_time"]').getAttribute('content'), posting.dateModified);

  const faq = graph.find(node => node['@type'] === 'FAQPage');
  const visibleFaq = page.querySelectorAll('section[aria-labelledby="article-faq-heading"] details');
  assert.equal(visibleFaq.length, data.faq.length);
  assert.equal(faq.mainEntity.length, data.faq.length);
  assert.ok(data.faq.length >= 3);
  visibleFaq.forEach((item, index) => {
    assert.equal(item.querySelector('summary span').textContent, faq.mainEntity[index].name);
    assert.equal(item.querySelector('p').textContent, faq.mainEntity[index].acceptedAnswer.text);
  });
  const glossary = graph.find(node => node['@type'] === 'DefinedTermSet');
  const definitions = page.querySelectorAll('section[aria-labelledby="article-glossary-heading"] dl > div');
  assert.equal(definitions.length, data.glossary.length);
  definitions.forEach((item, index) => {
    assert.equal(item.querySelector('dt').textContent, glossary.hasDefinedTerm[index].name);
    assert.equal(item.querySelector('dd').textContent, glossary.hasDefinedTerm[index].description);
  });
  glossaryVariants.add(JSON.stringify(data.glossary));
  const howTo = graph.find(node => node['@type'] === 'HowTo');
  if (data.howTo) {
    const steps = page.querySelectorAll('section[aria-labelledby="article-howto-heading"] li');
    assert.equal(steps.length, howTo.step.length);
    steps.forEach((step, index) => {
      assert.equal(step.querySelector('p').textContent, howTo.step[index].text);
      assert.equal(new URL(howTo.step[index].url).hash, `#${step.id}`);
    });
    howTos++;
  } else assert.equal(howTo, undefined);

  const excluded = isExcludedFromIndexing(pathname);
  assert.equal(isExcludedFromIndexing(`/${data.slug}/`), excluded);
  assert.equal(response.headers.get('x-robots-tag'), excluded ? 'noindex, follow' : null);
  assert.equal(page.querySelector('meta[name="robots"]')?.getAttribute('content'), excluded ? 'noindex, follow' : undefined);
  const markdownResponse = await get({ headers: { Accept: 'text/markdown' } });
  assert.equal(markdownResponse.headers.get('x-robots-tag'), excluded ? 'noindex, follow' : null);
  const markdown = await markdownResponse.text();
  assert.match(markdownResponse.headers.get('content-type'), /^text\/markdown/);
  assert.ok(markdown.includes('#article-faq-heading'), `${pathname}: Markdown TOC`);
  for (const { question, answer } of data.faq) {
    const plain = markdown.replace(/\\([\\`*{}\[\]()#+.!_>\-])/g, '$1').replace(/\s+/g, ' ');
    assert.ok(plain.includes(question.replace(/\s+/g, ' ')), question);
    assert.ok(plain.includes(answer.replace(/\s+/g, ' ')), question);
  }
  const head = await get({ method: 'HEAD', headers: { Accept: 'text/markdown' } });
  assert.equal(await head.text(), '');
  assert.equal(head.headers.get('x-robots-tag'), excluded ? 'noindex, follow' : null);
  questions += data.faq.length;
  console.log(`PASS: ${data.slug} — ${links.length} anchors, ${data.faq.length} FAQ${excluded ? ', noindex' : ''}`);
}
assert.ok(glossaryVariants.size >= 20);
assert.equal(howTos, 1);
const sitemap = await readFile('dist/sitemap-0.xml', 'utf8');
for (const slug of excludedArticleSlugs) assert.ok(!sitemap.includes(`/${slug}/`), `Excluded article in sitemap: ${slug}`);
console.log(`PASS: ${files.length} articles, ${questions} FAQ, ${glossaryVariants.size} glossary variants, ${howTos} HowTo, 9 indexing exclusions`);

import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import matter from 'gray-matter';
import { parse } from 'node-html-parser';
import edge from '../.netlify/v1/edge-functions/middleware/middleware.mjs';

const files = (await readdir('src/content/steel-pipe-categories')).filter(file => file.endsWith('.md'));
assert.equal(files.length, 7);
let totalQuestions = 0;
let totalProducts = 0;
const words = text => text.trim().split(/\s+/).length;
for (const file of files) {
  const { data } = matter(await readFile(`src/content/steel-pipe-categories/${file}`, 'utf8'));
  const pathname = `/rury-stalowe-${data.slug}/`;
  const html = await readFile(`dist${pathname}index.html`, 'utf8');
  const page = parse(html);
  const intro = page.querySelector('#podsumowanie');
  const products = page.querySelector('#produkty');
  const guide = page.querySelector('#poradnik-kategorii');
  const faq = page.querySelector('#faq-kategorii');
  assert.ok(intro && products && guide && faq, pathname);
  const positions = [intro, products, guide, faq].map(node => html.indexOf(node.outerHTML));
  assert.ok(positions.every((position, index) => index === 0 || position > positions[index - 1]), `${pathname}: section order`);
  assert.equal(intro.querySelector('p').textContent, data.tldr);
  const introWords = words(intro.querySelector('p').textContent);
  const expertWords = words(guide.textContent) + words(faq.textContent);
  assert.ok(introWords / (introWords + expertWords) <= 0.25, `${pathname}: intro exceeds one quarter of editorial content`);
  assert.equal(page.querySelectorAll('h1').length, 1);
  assert.equal(page.querySelectorAll('.pipe-category-page details').length, data.faq.length, `${pathname}: duplicated FAQ`);
  assert.ok(data.faq.length >= 4);

  const graph = JSON.parse(page.querySelector('script[type="application/ld+json"]').textContent)['@graph'];
  const faqSchema = graph.find(node => node['@type'] === 'FAQPage');
  assert.equal(faqSchema.mainEntity.length, data.faq.length);
  faq.querySelectorAll('details').forEach((entry, index) => {
    assert.equal(entry.querySelector('summary').textContent, faqSchema.mainEntity[index].name);
    assert.equal(entry.querySelector('p').textContent, faqSchema.mainEntity[index].acceptedAnswer.text);
  });
  const listSchema = graph.find(node => node['@type'] === 'ItemList');
  const links = products.querySelectorAll('li a');
  assert.equal(links.length, listSchema.numberOfItems);
  links.forEach((link, index) => assert.equal(new URL(link.getAttribute('href'), 'https://ecotechgroup.pl').href, listSchema.itemListElement[index].url));
  totalProducts += links.length;

  const response = await edge(new Request(`https://ecotechgroup.pl${pathname}`, { headers: { Accept: 'text/markdown' } }), {
    next: async () => new Response(html, { headers: { 'Content-Type': 'text/html' } })
  });
  const markdown = await response.text();
  assert.ok(markdown.indexOf('TL;DR') < markdown.indexOf('## Dostępne rury'));
  assert.ok(markdown.indexOf('## Dostępne rury') < markdown.indexOf('— charakterystyka i dobór'));
  for (const { question, answer } of data.faq) {
    assert.ok(markdown.includes(question), question);
    assert.ok(markdown.includes(answer), question);
  }
  totalQuestions += data.faq.length;
  console.log(`PASS: ${data.slug} — ${links.length} products, ${data.faq.length} FAQ, intro ${Math.round(100 * introWords / (introWords + expertWords))}%`);
}
assert.equal(totalProducts, 1551);
console.log(`PASS: ${files.length} categories, ${totalProducts} unchanged product links, ${totalQuestions} FAQ, HTML/JSON-LD/Markdown parity`);

import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import matter from 'gray-matter';
import { parse } from 'node-html-parser';
import { imageDimensions, getImageDimensions } from '../src/lib/image-dimensions.mjs';

async function files(directory, extension) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(entry => {
    const name = path.join(directory, entry.name);
    return entry.isDirectory() ? files(name, extension) : name.endsWith(extension) ? [name] : [];
  }));
  return nested.flat();
}

for (const [src, expected] of Object.entries(imageDimensions)) {
  const { width, height } = await sharp(`public${src}`).metadata();
  assert.deepEqual(expected, { width, height }, src);
}
assert.deepEqual(getImageDimensions('https://cdn.sanity.io/images/project/production/asset-1200x800.jpg'), { width: 1200, height: 800 });
assert.throws(() => getImageDimensions('/img/missing.jpg'), /Missing image dimensions/);
assert.throws(() => getImageDimensions('https://cdn.sanity.io/images/project/production/asset-1200x800.jpg?rect=0,0,100,100'), /Missing image dimensions/);

let tags = 0;
for (const file of await files('src', '.astro')) {
  const source = await readFile(file, 'utf8');
  // Avoid treating > inside a JSX expression (e.g. ??) as a tag delimiter.
  for (const tag of source.matchAll(/<img\b(?:\{[^}]*\}|[^>])*\/>/g)) {
    assert.match(tag[0], /\bwidth=/, `${file}: missing width`);
    assert.match(tag[0], /\bheight=/, `${file}: missing height`);
    tags++;
  }
}
for (const collection of ['services', 'production', 'steel-pipe-categories']) {
  for (const file of await files(`src/content/${collection}`, '.md')) {
    const { data } = matter(await readFile(file, 'utf8'));
    if (data.image) assert.ok(getImageDimensions(data.image), file);
  }
}

let products = 0;
let templateImages = 0;
let heroes = 0;
for (const file of await files('dist', '.html')) {
  const page = parse(await readFile(file, 'utf8'));
  // Imported legacy article/gallery HTML is separate from template images.
  page.querySelectorAll('.category-content, .service-content, .production-content, .article-content').forEach(node => node.remove());
  for (const img of page.querySelectorAll('img')) {
    const src = img.getAttribute('src');
    if (!imageDimensions[src]) continue;
    assert.equal(Number(img.getAttribute('width')), imageDimensions[src].width, `${file}: ${src} width`);
    assert.equal(Number(img.getAttribute('height')), imageDimensions[src].height, `${file}: ${src} height`);
    templateImages++;
  }
  const hero = page.querySelector('.service-page > section img, .production-page > section img');
  if (hero) {
    assert.equal(hero.getAttribute('loading'), 'eager', file);
    assert.equal(hero.getAttribute('fetchpriority'), 'high', file);
    heroes++;
  }
  for (const thumbnail of page.querySelectorAll('.offer-tile img, [data-steel-pipe-carousel] img')) {
    assert.equal(thumbnail.getAttribute('loading'), 'lazy', file);
  }
  const product = page.querySelector('.product-page figure img');
  if (product) {
    assert.equal(product.getAttribute('loading'), 'eager', file);
    assert.equal(product.getAttribute('fetchpriority'), 'high', file);
    products++;
  }
}
assert.ok(tags >= 14, 'Expected all direct image tags to be checked');
assert.equal(products, 1551);
assert.equal(heroes, 16);
console.log(`PASS: ${tags} direct img tags, ${Object.keys(imageDimensions).length} verified image sizes, ${templateImages} rendered images, ${products} eager/high-priority product images, ${heroes} service/production heroes`);

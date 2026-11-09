import { parse } from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const converter = new NodeHtmlMarkdown({ bulletMarker: '-', maxConsecutiveNewlines: 2 });

/** Convert the same content visitors see, not a second, separately maintained copy. */
export function pageToMarkdown(html: string, pageUrl: URL): string | null {
  const document = parse(html);
  const main = document.querySelector('main');
  if (!main) return null;

  const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const canonicalUrl = new URL(canonical || pageUrl.pathname, 'https://ecotechgroup.pl');
  const description = document.querySelector('meta[name="description"]')?.getAttribute('content');

  // Keep technical panels (including inactive tabs), FAQs and tables; omit UI controls.
  main.querySelectorAll('script, style, svg, template, noscript, nav:not(#article-toc), form, button, input, select, textarea, label, [aria-hidden="true"], [data-markdown-ignore]')
    .forEach(node => node.remove());

  for (const element of main.querySelectorAll('a[href], img[src]')) {
    const attribute = element.tagName === 'A' ? 'href' : 'src';
    const value = element.getAttribute(attribute);
    if (!value) continue;
    try {
      const absolute = new URL(value, canonicalUrl);
      if (['https:', 'http:', 'mailto:', 'tel:'].includes(absolute.protocol)) {
        element.setAttribute(attribute, absolute.href);
      } else {
        element.removeAttribute(attribute);
      }
    } catch { element.removeAttribute(attribute); }
  }

  // Product specifications use definition lists rather than HTML tables.
  for (const list of main.querySelectorAll('dl')) {
    const rows: { label: string; values: string[] }[] = [];
    for (const item of list.querySelectorAll('dt, dd')) {
      if (item.tagName === 'DT') rows.push({ label: item.innerHTML, values: [] });
      else rows.at(-1)?.values.push(item.innerHTML);
    }
    if (rows.length && rows.every(row => row.values.length)) {
      list.replaceWith(`<table><thead><tr><th>Parametr</th><th>Wartość</th></tr></thead><tbody>${rows.map(row => `<tr><td>${row.label}</td><td>${row.values.join('<br>')}</td></tr>`).join('')}</tbody></table>`);
    }
  }

  const markdown = converter.translate(main.innerHTML).trim();
  if (!markdown) return null;
  const metadata = [`Canonical URL: ${canonicalUrl.href}`, ...(description ? [description] : [])].join('\n\n');
  // Keep the visible heading first, with canonical URL and summary directly below it.
  const heading = markdown.match(/^# [^\n]+/m);
  if (heading) {
    const start = heading.index! + heading[0].length;
    return `${markdown.slice(0, start)}\n\n${metadata}${markdown.slice(start)}\n`;
  }
  return `${metadata}\n\n${markdown}\n`;
}

export function varyByRepresentation(headers: Headers): void {
  const vary = new Map((headers.get('Vary') ?? '').split(',').map(value => value.trim()).filter(Boolean).map(value => [value.toLowerCase(), value]));
  vary.set('accept', 'Accept');
  vary.set('user-agent', 'User-Agent');
  headers.set('Vary', [...vary.values()].join(', '));
  // Netlify does not automatically key its CDN cache on arbitrary Vary fields.
  headers.set('Netlify-CDN-Cache-Control', 'no-store');
}

import { parse } from 'node-html-parser';

/** Handle both Markdown-generated headings and legacy HTML headings on the server. */
export function prepareArticle(html: string) {
  const root = parse(html);
  root.querySelectorAll('h1').forEach(heading => heading.replaceWith(heading.outerHTML.replace(/^<h1\b/i, '<h2').replace(/<\/h1>$/i, '</h2>')));
  const headings = root.querySelectorAll('h2, h3');
  const headingSet = new Set(headings);
  const used = new Set(root.querySelectorAll('[id]').filter(node => !headingSet.has(node)).map(node => node.id));
  const toc = headings.map(heading => {
    const text = heading.textContent.trim();
    const base = heading.id || text.toLowerCase().replace(/ł/g, 'l').normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'sekcja';
    let id = base;
    for (let suffix = 2; used.has(id); suffix++) id = `${base}-${suffix}`;
    used.add(id);
    heading.setAttribute('id', id);
    return { id, text, level: Number(heading.tagName.slice(1)) };
  });
  return { html: root.toString(), toc };
}

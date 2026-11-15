import { parse } from 'node-html-parser';

/** Normalize page links in CMS HTML without changing assets or external URLs. */
export function normalizeContentLinks(html) {
  const root = parse(html);
  for (const link of root.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    if (!href || !/^(?:\/(?!\/)|https:\/\/ecotechgroup\.pl\/)/.test(href)) continue;
    const url = new URL(href, 'https://ecotechgroup.pl');
    if (url.pathname.endsWith('/') || /\.[^/]+$/.test(url.pathname)
      || /^\/(?:api|\.well-known)(?:\/|$)/.test(url.pathname)) continue;
    const normalized = `${url.pathname}/${url.search}${url.hash}`;
    link.setAttribute('href', href.startsWith('/') ? normalized : `${url.origin}${normalized}`);
  }
  return root.toString();
}

import { defineMiddleware } from 'astro:middleware';
import { isExcludedFromIndexing } from './lib/indexing.mjs';
import { maintenanceResponse } from './lib/maintenance.mjs';
import { agentLinks, homeMarkdown, acceptsMarkdown } from './lib/agent-resources';
import { pageToMarkdown, varyByRepresentation } from './lib/page-markdown';

const AI_USER_AGENTS = /(?:GPTBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot|OAI-SearchBot)/i;
const BINARY_ASSET = /\.(?:pdf|docx|xlsx|zip)$/i;

export const onRequest = defineMiddleware(async (context, next) => {
  // Build-time prerendering has no request headers. Netlify Edge runs again at request time.
  if (context.isPrerendered && !import.meta.env.DEV) return next();
  const { request, url } = context;
  const maintenanceMode = (process.env.MAINTENANCE_MODE ?? import.meta.env.MAINTENANCE_MODE)?.toLowerCase() === 'true';
  if (maintenanceMode && !context.isPrerendered) return maintenanceResponse();

  if (/^\/uslugi\/(?:ciecie-plazmowe-cnc-wypalanie-blach-cnc|demontaz-rurociagow-stalowych)\/?$/.test(url.pathname)) {
    return context.redirect('https://ecotechgroup.pl/uslugi/', 301);
  }

  const response = await next();
  const headers = new Headers(response.headers);
  if (response.status !== 503 && (BINARY_ASSET.test(url.pathname) || isExcludedFromIndexing(url.pathname))) {
    headers.set('X-Robots-Tag', 'noindex, follow');
  }
  if (url.pathname === '/' && response.ok) headers.append('Link', agentLinks);

  // Negotiate only successful HTML pages. Keep redirects, errors, API and assets intact.
  if (response.status !== 200 || !/^text\/html(?:;|$)/i.test(headers.get('Content-Type') ?? '') || !['GET', 'HEAD'].includes(request.method)) {
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }

  varyByRepresentation(headers);
  headers.append('Link', `<${url.pathname}>; rel="alternate"; type="text/markdown"`);
  const accept = request.headers.get('accept') ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';
  const wantsMarkdown = acceptsMarkdown(accept) || (!accept.toLowerCase().includes('text/markdown') && AI_USER_AGENTS.test(userAgent));
  if (!wantsMarkdown) return new Response(response.body, { status: response.status, headers });

  // HEAD from a static CDN has no body to convert, but uses the same representation headers.
  let markdown: string | null = null;
  if (request.method !== 'HEAD') {
    const html = await response.text();
    markdown = url.pathname === '/' ? homeMarkdown : pageToMarkdown(html, url);
    if (markdown === null) return new Response(html, { status: response.status, headers });
  } else {
    await response.body?.cancel();
  }

  headers.set('Content-Type', 'text/markdown; charset=utf-8');
  headers.set('Cache-Control', 'public, max-age=300');
  headers.set('X-Content-Type-Options', 'nosniff');
  // These describe the upstream HTML bytes and must not be reused for Markdown.
  for (const name of ['Content-Length', 'Content-Encoding', 'ETag', 'Last-Modified', 'Accept-Ranges', 'Content-Range']) headers.delete(name);
  return new Response(markdown, { status: response.status, headers });
});

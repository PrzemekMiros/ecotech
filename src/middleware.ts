import { getCollection } from 'astro:content';
import { defineMiddleware, sequence } from 'astro:middleware';
import { isExcludedFromIndexing } from './lib/indexing.mjs';
import { maintenanceResponse } from './lib/maintenance.mjs';
import { agentLinks, homeMarkdown, acceptsMarkdown, markdownResponse } from './lib/agent-resources';

const AI_USER_AGENTS = /(?:GPTBot|ChatGPT-User|ClaudeBot|Claude-SearchBot|PerplexityBot|OAI-SearchBot)/i;
const BINARY_ASSET = /\.(?:pdf|docx|xlsx|zip)$/i;

const decodeHtmlEntities = (value: string) => value
  .replace(/&nbsp;/gi, ' ')
  .replace(/&amp;/gi, '&')
  .replace(/&quot;/gi, '"')
  .replace(/&#39;|&apos;/gi, "'")
  .replace(/&lt;/gi, '<')
  .replace(/&gt;/gi, '>');

const htmlToMarkdown = (html: string) => decodeHtmlEntities(html)
  .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '# $1\n\n')
  .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '## $1\n\n')
  .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '### $1\n\n')
  .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, '**$1**')
  .replace(/<b[^>]*>([\s\S]*?)<\/b>/gi, '**$1**')
  .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '- $1\n')
  .replace(/<br\s*\/?>(?:\r?\n)?/gi, '\n')
  .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '$1\n\n')
  .replace(/<\/?(?:ul|ol|figure|figcaption|table|thead|tbody|tr|td|th)[^>]*>/gi, '\n')
  .replace(/<[^>]+>/g, '')
  .replace(/\n{3,}/g, '\n\n')
  .trim();

const excludeFromIndexing = defineMiddleware(async (context, next) => {
  const response = await next();
  if (context.url.pathname === '/' && response.ok) response.headers.append('Link', agentLinks);
  if (context.url.pathname === '/' || /^\/aktualnosci\/[^/]+\/?$/.test(context.url.pathname)) {
    const vary = new Set((response.headers.get('Vary') ?? '').split(',').map(value => value.trim()).filter(Boolean));
    vary.add('Accept');
    vary.add('User-Agent');
    response.headers.set('Vary', [...vary].join(', '));
    // Avoid a CDN reusing one negotiated representation for another request.
    response.headers.set('Netlify-CDN-Cache-Control', 'no-store');
  }
  if (response.status !== 503 && isExcludedFromIndexing(context.url.pathname)) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }
  return response;
});

const handleRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const maintenanceMode = (process.env.MAINTENANCE_MODE ?? import.meta.env.MAINTENANCE_MODE)?.toLowerCase() === 'true';

  if (maintenanceMode && !context.isPrerendered) {
    return maintenanceResponse();
  }

  if (/^\/uslugi\/(?:ciecie-plazmowe-cnc-wypalanie-blach-cnc|demontaz-rurociagow-stalowych)\/?$/.test(url.pathname)) {
    return context.redirect('https://ecotechgroup.pl/uslugi/', 301);
  }

  if (context.isPrerendered) return next();

  if (BINARY_ASSET.test(url.pathname)) {
    const response = await next();
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    return response;
  }

  const accept = request.headers.get('accept') ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';
  const wantsMarkdown = acceptsMarkdown(accept) || (!accept.toLowerCase().includes('text/markdown') && AI_USER_AGENTS.test(userAgent));
  const articleMatch = url.pathname.match(/^\/aktualnosci\/([^/]+)\/?$/);

  if (wantsMarkdown && url.pathname === '/' && ['GET', 'HEAD'].includes(request.method)) {
    const response = markdownResponse(homeMarkdown);
    return request.method === 'HEAD' ? new Response(null, response) : response;
  }

  if (!wantsMarkdown || !articleMatch || !['GET', 'HEAD'].includes(request.method)) {
    return next();
  }

  const posts = await getCollection('news');
  const post = posts.find((entry) => entry.data.slug === articleMatch[1]);

  if (!post) return next();

  const canonicalUrl = new URL(`/aktualnosci/${post.data.slug}/`, url.origin).href;
  const markdown = [
    `# ${post.data.title}`,
    `Canonical URL: ${canonicalUrl}`,
    '',
    `> ${post.data.description}`,
    '',
    htmlToMarkdown(post.body ?? '')
  ].join('\n');

  return new Response(request.method === 'HEAD' ? null : `${markdown.trim()}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept, User-Agent',
      'Cache-Control': 'public, max-age=300'
    }
  });
});

export const onRequest = sequence(excludeFromIndexing, handleRequest);

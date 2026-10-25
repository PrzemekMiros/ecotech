import { getCollection } from 'astro:content';
import { defineMiddleware } from 'astro:middleware';

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

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const maintenanceMode = process.env.MAINTENANCE_MODE?.toLowerCase() === 'true';

  if (maintenanceMode && url.pathname !== '/503') {
    return context.rewrite(new URL('/503', url));
  }

  if (BINARY_ASSET.test(url.pathname)) {
    const response = await next();
    response.headers.set('X-Robots-Tag', 'noindex, follow');
    return response;
  }

  if (context.isPrerendered) return next();

  const accept = request.headers.get('accept') ?? '';
  const userAgent = request.headers.get('user-agent') ?? '';
  const wantsMarkdown = accept.toLowerCase().includes('text/markdown') || AI_USER_AGENTS.test(userAgent);
  const articleMatch = url.pathname.match(/^\/aktualnosci\/([^/]+)\/?$/);

  if (!wantsMarkdown || !articleMatch || request.method !== 'GET') {
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

  return new Response(`${markdown.trim()}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      Vary: 'Accept, User-Agent',
      'Cache-Control': 'public, max-age=300'
    }
  });
});

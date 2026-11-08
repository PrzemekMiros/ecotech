import homeMarkdown from '../data/home.md?raw';
import documentation from '../data/agents.md?raw';

export const agentLinks = [
  '</index.md>; rel="alternate"; type="text/markdown"',
  '</llms.txt>; rel="describedby"; type="text/plain"',
  '</llms-full.txt>; rel="describedby"; type="text/plain"',
  '</docs/agents.md>; rel="service-doc"; type="text/markdown"',
  '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"',
  '</openapi.json>; rel="service-desc"; type="application/vnd.oai.openapi+json"',
  '</.well-known/ai-catalog.json>; rel="ai-catalog"; type="application/ai-catalog+json"'
].join(', ');

export { homeMarkdown, documentation };

export function acceptsMarkdown(accept: string): boolean {
  const types = accept.toLowerCase().split(',').map((part) => {
    const [type, ...params] = part.trim().split(';');
    const quality = params.map(p => p.trim()).find(p => p.startsWith('q='));
    const q = quality ? Number(quality.slice(2)) : 1;
    return { type: type.trim(), q: Number.isFinite(q) && q >= 0 && q <= 1 ? q : 0 };
  });
  const markdown = types.find(item => item.type === 'text/markdown')?.q ?? 0;
  const html = types.find(item => item.type === 'text/html')?.q ?? 0;
  return markdown > 0 && markdown >= html;
}

export const markdownResponse = (body: string) => new Response(body, {
  headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=300', 'X-Content-Type-Options': 'nosniff' }
});

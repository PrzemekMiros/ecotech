import type { APIRoute } from 'astro';

export const prerender = false;

const catalog = {
  linkset: [{
    anchor: 'https://ecotechgroup.pl/api/site-info',
    item: [{ href: 'https://ecotechgroup.pl/api/site-info', type: 'application/json' }],
    'service-desc': [{ href: 'https://ecotechgroup.pl/openapi.json', type: 'application/vnd.oai.openapi+json' }],
    'service-doc': [{ href: 'https://ecotechgroup.pl/docs/agents.md', type: 'text/markdown' }],
    'service-meta': [{ href: 'https://ecotechgroup.pl/llms.txt', type: 'text/plain' }]
  }]
};

const response = () => new Response(JSON.stringify(catalog), {
  headers: {
    'Content-Type': 'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600',
    Link: '</.well-known/api-catalog>; rel="api-catalog"'
  }
});

export const GET: APIRoute = response;
export const HEAD: APIRoute = () => new Response(null, response());

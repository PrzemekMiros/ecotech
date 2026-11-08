import type { APIRoute } from 'astro';

export const prerender = false;

const manifest = {
  protocol_version: '0.4',
  organization: {
    name: 'Eco Tech Group Sp. z o.o.',
    domain: 'ecotechgroup.pl',
    logo_uri: 'https://ecotechgroup.pl/img/logo/EcoTech_Logo_white.png'
  },
  web: {},
  apis: [{
    type: 'openapi',
    url: 'https://ecotechgroup.pl/openapi.json',
    description: 'Publiczne informacje o firmie, ofercie i danych kontaktowych; dostęp bez logowania.'
  }],
  skill_index: 'https://ecotechgroup.pl/.well-known/agent-skills/index.json'
};

const response = () => Response.json(manifest, {
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600'
  }
});

export const GET: APIRoute = response;
export const HEAD: APIRoute = () => new Response(null, response());

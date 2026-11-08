import type { APIRoute } from 'astro';
import catalog from '../../data/ai-catalog.json';

export const prerender = false;

const response = () => new Response(JSON.stringify(catalog), {
  headers: {
    'Content-Type': 'application/ai-catalog+json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=3600'
  }
});

export const GET: APIRoute = response;
export const HEAD: APIRoute = () => new Response(null, response());

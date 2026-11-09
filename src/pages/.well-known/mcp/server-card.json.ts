import type { APIRoute } from 'astro';
import { serverCard } from '../../../lib/mcp-server';

export const prerender = false;
const headers = {
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=3600',
  'Access-Control-Allow-Origin': '*',
  'X-Content-Type-Options': 'nosniff'
};
export const GET: APIRoute = () => new Response(JSON.stringify(serverCard), { headers });
export const HEAD: APIRoute = () => new Response(null, { headers });

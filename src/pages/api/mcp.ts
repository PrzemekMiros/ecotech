import type { APIRoute } from 'astro';
import { handleMcpRequest } from '../../lib/mcp-server';

export const prerender = false;
export const ALL: APIRoute = ({ request }) => handleMcpRequest(request);

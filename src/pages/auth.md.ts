import authDocumentation from '../data/auth.md?raw';
import { markdownResponse } from '../lib/agent-resources';

export const GET = () => markdownResponse(authDocumentation);
export const HEAD = () => new Response(null, markdownResponse(authDocumentation));

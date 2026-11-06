import { documentation, markdownResponse } from '../../lib/agent-resources';

export const GET = () => markdownResponse(documentation);
export const HEAD = () => new Response(null, markdownResponse(documentation));

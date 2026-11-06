import { homeMarkdown, markdownResponse } from '../lib/agent-resources';

export const GET = () => markdownResponse(homeMarkdown);
export const HEAD = () => new Response(null, markdownResponse(homeMarkdown));

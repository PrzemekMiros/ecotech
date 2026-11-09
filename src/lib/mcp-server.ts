import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { WebStandardStreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js';
import { CallToolRequestSchema, ListToolsRequestSchema, SUPPORTED_PROTOCOL_VERSIONS, McpError, ErrorCode } from '@modelcontextprotocol/sdk/types.js';
import { agentTools } from './agent-tools';

const identity = { name: 'pl.ecotechgroup/website', version: '1.0.0', title: 'Eco Tech Group' };

export const serverCard = {
  $schema: 'https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json',
  ...identity,
  description: 'Publiczne dane kontaktowe Eco Tech Group i kalkulator masy rur stalowych.',
  websiteUrl: 'https://ecotechgroup.pl',
  remotes: [{
    type: 'streamable-http',
    url: 'https://ecotechgroup.pl/api/mcp',
    supportedProtocolVersions: SUPPORTED_PROTOCOL_VERSIONS
  }]
};

export async function handleMcpRequest(request: Request): Promise<Response> {
  // Reject cross-site browser calls; native MCP clients need not send Origin.
  const origin = request.headers.get('origin');
  const localOrigin = import.meta.env.DEV && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin ?? '');
  if (origin && origin !== 'https://ecotechgroup.pl' && !localOrigin) {
    return new Response('Forbidden origin', { status: 403 });
  }
  if (request.method !== 'POST') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  }

  // No shared user state or sessions: each request gets its own server/transport.
  const server = new Server(identity, { capabilities: { tools: {} } });
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: agentTools.map(({ execute, ...definition }) => definition)
  }));
  server.setRequestHandler(CallToolRequestSchema, async ({ params }) => {
    const tool = agentTools.find(tool => tool.name === params.name);
    if (!tool) throw new McpError(ErrorCode.InvalidParams, 'Nieznane narzędzie.');
    try {
      const result = tool.execute(params.arguments ?? {});
      return { content: [{ type: 'text', text: JSON.stringify(result) }], structuredContent: result };
    } catch (error) {
      return { content: [{ type: 'text', text: error instanceof Error ? error.message : 'Nieprawidłowe parametry.' }], isError: true };
    }
  });
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 64 * 1024
  });
  try {
    await server.connect(transport);
    const response = await transport.handleRequest(request);
    response.headers.set('Cache-Control', 'no-store');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    return response;
  } finally {
    await server.close();
  }
}

import assert from 'node:assert/strict';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const base = new URL(process.argv[2] || 'http://127.0.0.1:4321');
const request = (path, options = {}) => fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(15000), ...options });
const client = new Client({ name: 'ecotech-mcp-check', version: '1.0.0' });

try {
  const path = '/.well-known/mcp/server-card.json';
  const response = await request(path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /^application\/json/);
  const card = await response.json();
  assert.equal(card.name, 'pl.ecotechgroup/website');
  assert.equal(card.remotes[0].type, 'streamable-http');
  assert.equal(card.remotes[0].url, 'https://ecotechgroup.pl/api/mcp');
  assert.ok(card.remotes[0].supportedProtocolVersions.length);
  const head = await request(path, { method: 'HEAD' });
  assert.equal(head.status, 200);
  assert.equal(await head.text(), '');
  assert.deepEqual(await (await request('/api/mcp/server-card')).json(), card);
  const catalog = await (await request('/.well-known/ai-catalog.json')).json();
  assert.ok(catalog.entries.some(entry => entry.url === `https://ecotechgroup.pl${path}`));

  await client.connect(new StreamableHTTPClientTransport(new URL('/api/mcp', base)));
  assert.equal(client.getServerVersion().name, card.name);
  assert.equal(client.getServerVersion().version, card.version);
  const { tools } = await client.listTools();
  assert.equal(tools.length, 2);
  assert.ok(tools.every(tool => tool.annotations.readOnlyHint));
  const contact = await client.callTool({ name: 'ecotech_company_contact', arguments: {} });
  assert.equal(contact.structuredContent.email, 'sprzedaz@ecotechgroup.pl');
  const args = { outerDiameterMm: 100, wallThicknessMm: 5, lengthM: 6, quantity: 10 };
  const weight = await client.callTool({ name: 'ecotech_calculate_pipe_weight', arguments: args });
  assert.equal(weight.structuredContent.kgPerMeter, 11.71);
  assert.equal(weight.structuredContent.totalKg, 702.81);
  for (const invalid of [{ ...args, wallThicknessMm: 50 }, { ...args, quantity: 1.5 }, { ...args, lengthM: -1 }, { ...args, extra: true }, {}]) {
    assert.equal((await client.callTool({ name: 'ecotech_calculate_pipe_weight', arguments: invalid })).isError, true);
  }
  await assert.rejects(() => client.callTool({ name: 'unknown_tool', arguments: {} }));
  for (const method of ['GET', 'DELETE']) assert.equal((await request('/api/mcp', { method })).status, 405);
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' };
  assert.equal((await request('/api/mcp', { method: 'POST', headers: { ...headers, Origin: 'https://untrusted.example' }, body: '{}' })).status, 403);
  assert.equal((await request('/api/mcp', { method: 'POST', headers, body: '{broken' })).status, 400);
  assert.equal((await request('/api/mcp', { method: 'POST', headers, body: JSON.stringify({ padding: 'x'.repeat(65536) }) })).status, 413);
  console.log(`PASS: ${base.origin} — MCP card, discovery, initialization, tools and invalid requests`);
} finally {
  await client.close();
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

test('form saves only to Sanity and never confirms a failed save', async () => {
  const source = await readFile(new URL('../src/pages/api/lead.ts', import.meta.url), 'utf8');
  let saved;
  let fail = false;
  const save = async value => { if (fail) throw Error('Unavailable'); saved = value; };
  const code = (await transform(source.replace(/^import .*$/gm, '').replace('export const prerender', 'const prerender').replace('export const POST: APIRoute', 'const POST: APIRoute'), { loader: 'ts', format: 'esm' })).code;
  const { readSource } = await import('../src/lib/lead-source.mjs');
  const handler = new Function('saveLeadStatistic', 'readSource', 'fetch', code + '\nreturn POST;')(save, readSource, () => { throw Error('Unexpected network/CRM request'); });
  const send = payload => handler({ request: new Request('https://example.com/api/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }) });
  const valid = { name: 'Test', email: 'test@example.com', message: 'Test message', privacy: 'on', source: JSON.stringify({ channel: 'organic' }), formPage: '/kontakt/' };
  assert.equal((await send(valid)).status, 201);
  assert.equal(saved.lead.message, 'Test message');
  assert.equal(saved.source.channel, 'organic');
  saved = undefined;
  for (const payload of [null, [], {}, { ...valid, privacy: '' }, { ...valid, email: 'invalid' }]) assert.equal((await send(payload)).status, 400);
  assert.equal((await send({ ...valid, website: 'bot' })).status, 204);
  assert.equal(saved, undefined);
  fail = true;
  assert.equal((await send(valid)).status, 503);
});

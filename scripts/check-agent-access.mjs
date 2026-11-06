import assert from 'node:assert/strict';

const base = new URL(process.argv[2] || 'https://ecotechgroup.pl');
const get = async (path, options = {}) => {
  const response = await fetch(new URL(path, base), { redirect: 'manual', signal: AbortSignal.timeout(30000), ...options });
  assert.equal(response.status, 200, `${path}: HTTP ${response.status}, Location: ${response.headers.get('location')}`);
  return response;
};

try {
  const html = await get('/', { headers: { Accept: 'text/html' } });
  assert.match(html.headers.get('content-type') ?? '', /^text\/html/i);
  const links = html.headers.get('link') ?? '';
  for (const path of ['/index.md', '/llms.txt', '/llms-full.txt', '/docs/agents.md']) assert.ok(links.includes(`<${path}>`), `Missing Link: ${path}`);
  assert.ok(links.includes('rel="service-doc"'));
  for (const accept of ['text/markdown', 'text/html;q=0.5, text/markdown;q=1']) {
    const response = await get('/', { headers: { Accept: accept } });
    assert.match(response.headers.get('content-type') ?? '', /^text\/markdown/i);
    assert.match(response.headers.get('vary') ?? '', /Accept/i);
    assert.match(await response.text(), /^# Eco Tech Group/);
  }
  const excluded = await get('/', { headers: { Accept: 'text/markdown;q=0, text/html' } });
  assert.match(excluded.headers.get('content-type') ?? '', /^text\/html/i);
  const head = await get('/', { method: 'HEAD', headers: { Accept: 'text/markdown' } });
  assert.match(head.headers.get('content-type') ?? '', /^text\/markdown/i);
  assert.equal(await head.text(), '');
  for (const agent of ['agent-access-check/1.0', 'OAI-SearchBot', 'Claude-SearchBot', 'PerplexityBot']) {
    for (const path of ['/index.md', '/docs/agents.md', '/llms.txt', '/llms-full.txt']) {
      const response = await get(path, { headers: { 'User-Agent': agent } });
      assert.match(response.headers.get('content-type') ?? '', path.endsWith('.md') ? /^text\/markdown/i : /^text\/plain/i);
      assert.match(await response.text(), /^# /, `${path}: expected Markdown, not an authentication or WAF page`);
    }
  }
  console.log(`PASS: ${base.origin} — discovery, Markdown, HTML, HEAD, resources and agent access`);
} catch (error) {
  console.error(`FAIL: ${base.origin} — ${error.message}`);
  process.exitCode = 1;
}

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { detectSource, readSource, getSessionSource } from '../src/lib/lead-source.mjs';

test('attribution distinguishes ads, search, social, email and campaigns', () => {
  for (const [query, referrer, channel] of [
    ['', 'https://www.google.pl/search?q=rury', 'organic'],
    ['?gclid=123', 'https://www.google.com/', 'ads'],
    ['?utm_source=facebook&utm_medium=paid_social', '', 'ads'],
    ['?fbclid=123', 'https://l.facebook.com/', 'social'],
    ['?utm_medium=email&utm_source=newsletter', '', 'email'],
    ['?utm_source=partner', '', 'campaign'],
    ['', 'https://example.com/article', 'referral'],
    ['', 'https://ecotechgroup.pl/other', 'direct'],
    ['', 'not a URL', 'direct'],
    ['', 'https://google.evil.example.com', 'referral'],
  ]) assert.equal(detectSource(`https://ecotechgroup.pl/rury/${query}`, referrer).channel, channel);
});
test('first entry survives navigation to the contact form', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) };
  getSessionSource(storage, 'https://ecotechgroup.pl/rury/?utm_medium=cpc&utm_campaign=steel', '');
  const result = getSessionSource(storage, 'https://ecotechgroup.pl/kontakt/', 'https://ecotechgroup.pl/rury/');
  assert.equal(result.channel, 'ads'); assert.equal(result.landingPage, '/rury/'); assert.equal(result.utmCampaign, 'steel');
});
test('blocked storage and malformed source do not prevent attribution', () => {
  const storage = { getItem() { throw Error(); }, setItem() { throw Error(); } };
  assert.equal(getSessionSource(storage, 'https://ecotechgroup.pl/', '').channel, 'direct');
  for (const value of ['null', '[]', '{', '{"channel":"fake"}', '{"channel":"__proto__"}']) assert.equal(readSource(value), undefined);
  assert.equal(readSource(JSON.stringify({ channel: 'ads', utmCampaign: 'x'.repeat(400) })).utmCampaign.length, 200);
});

export const sourceStorageKey = 'ecotech-lead-source';
export const channelLabels = { ads: 'Reklama', organic: 'Wyniki organiczne', social: 'Social media', email: 'E-mail', referral: 'Polecenia', campaign: 'Inna kampania', direct: 'Bezpośrednie', unknown: 'Nieznane' };
const trim = (value, length = 200) => typeof value === 'string' ? value.trim().slice(0, length) : '';
export function detectSource(href, referrer = '') {
  const url = new URL(href);
  let host = '';
  try { const ref = new URL(referrer); if (ref.host !== url.host) host = ref.hostname; } catch {}
  const params = url.searchParams;
  const medium = trim(params.get('utm_medium')).toLowerCase();
  const utmSource = trim(params.get('utm_source'));
  const paid = /^(cpc|ppc|paid|paid[_ -]?social|paid[_ -]?search|display|cpm|affiliate|retargeting)$/.test(medium)
    || ['gclid', 'gbraid', 'wbraid', 'msclkid', 'ttclid'].some(key => !!params.get(key));
  const search = /(^|\.)(google\.(?:com|[a-z]{2}|com\.[a-z]{2}|co\.[a-z]{2})|bing\.com|search\.yahoo\.com|duckduckgo\.com|yandex\.(?:com|ru|by|kz|ua)|search\.brave\.com)$/.test(host);
  const social = /(^|\.)(facebook\.com|instagram\.com|linkedin\.com|t\.co|twitter\.com|x\.com|tiktok\.com|pinterest\.com)$/.test(host);
  const channel = paid ? 'ads' : medium === 'organic' ? 'organic' : /^(email|e-mail|newsletter)$/.test(medium) ? 'email'
    : /^(social|social-media|social_network)$/.test(medium) ? 'social'
    : utmSource || medium || params.get('utm_campaign') ? 'campaign' : search ? 'organic' : social || params.get('fbclid') ? 'social' : host ? 'referral' : 'direct';
  return { channel, landingPage: url.pathname.slice(0, 300), referrerHost: host.slice(0, 200), utmSource, utmMedium: medium,
    utmCampaign: trim(params.get('utm_campaign')), utmTerm: trim(params.get('utm_term')), utmContent: trim(params.get('utm_content')) };
}
export function readSource(value) {
  try {
    const source = typeof value === 'string' ? JSON.parse(value) : null;
    if (!source || typeof source !== 'object' || !Object.hasOwn(channelLabels, source.channel)) return undefined;
    return Object.fromEntries(['channel', 'landingPage', 'referrerHost', 'utmSource', 'utmMedium', 'utmCampaign', 'utmTerm', 'utmContent'].map(key => [key, trim(source[key], key === 'landingPage' ? 300 : 200)]));
  } catch { return undefined; }
}
export function getSessionSource(storage, href, referrer) {
  let saved;
  try { saved = readSource(storage.getItem(sourceStorageKey)); } catch {}
  if (saved) return saved;
  const source = detectSource(href, referrer);
  try { storage.setItem(sourceStorageKey, JSON.stringify(source)); } catch {}
  return source;
}

export type SchemaNode = Record<string, unknown>;
export type Breadcrumb = { name: string; path: string };

export const siteUrl = 'https://ecotechgroup.pl';
export const organizationId = `${siteUrl}/#organization`;
export const absoluteUrl = (path: string) => new URL(path, siteUrl).href;
export const pageUrl = (path: string) => absoluteUrl(path === '/' ? '/' : `${path.replace(/\/$/, '')}/`);
export const serializeSchema = (data: unknown) => JSON.stringify(data).replace(/</g, '\\u003c');

const sections: Record<string, string> = {
  'aktualnosci': 'Aktualności', 'uslugi': 'Usługi', 'produkcja': 'Produkcja',
  'rury-stalowe': 'Rury stalowe', 'dostawa-rur-stalowych': 'Dostawa rur stalowych',
  'praca': 'Praca'
};

export function pageGraph({ pathname, title, description, entities = [], breadcrumbs }: {
  pathname: string; title: string; description: string;
  entities?: SchemaNode[]; breadcrumbs?: Breadcrumb[];
}) {
  const path = pathname.replace(/\/$/, '') || '/';
  const url = pageUrl(path);
  const name = title.split(' | ')[0];
  const section = path.split('/')[1];
  const isCollection = (Boolean(sections[section]) && path === `/${section}`)
    || path.startsWith('/rury-stalowe-') || ['/oferta', '/do-pobrania', '/wymiary-rur-stalowych', '/wlasciwosci-mechaniczne-stali'].includes(path);
  const type = path === '/kontakt' ? 'ContactPage' : path === '/o-nas' ? 'AboutPage' : isCollection ? 'CollectionPage' : 'WebPage';
  const parents = breadcrumbs ?? (path.split('/').length > 2 && sections[section]
    ? [{ name: sections[section], path: `/${section}` }]
    : path.startsWith('/rury-stalowe-') ? [{ name: 'Rury stalowe', path: '/rury-stalowe' }] : []);
  const crumbs = [{ name: 'Strona główna', path: '/' }, ...parents, { name, path }];
  const nodes: SchemaNode[] = [
    {
      '@type': 'Organization', '@id': organizationId,
      name: 'Eco Tech Group Sp. z o.o.', url: `${siteUrl}/`,
      logo: { '@type': 'ImageObject', url: absoluteUrl('/img/logo/EcoTech_Logo_white.png') },
      telephone: '+48 508 299 077', email: 'sprzedaz@ecotechgroup.pl',
      address: { '@type': 'PostalAddress', streetAddress: 'ul. Mieczysława Pożaryskiego 32', postalCode: '04-703', addressLocality: 'Warszawa', addressCountry: 'PL' },
      sameAs: ['https://www.facebook.com/RurystaloweHurtownia']
    },
    { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: 'Eco Tech Group', inLanguage: 'pl-PL', publisher: { '@id': organizationId } },
    {
      '@type': type, '@id': `${url}#webpage`, url, name, description, inLanguage: 'pl-PL',
      isPartOf: { '@id': `${siteUrl}/#website` }, publisher: { '@id': organizationId },
      ...(path !== '/' ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
      ...(entities.length ? { mainEntity: { '@id': entities[0]['@id'] ?? `${url}#entity-1` } } : {}),
      ...(['/kontakt', '/o-nas', '/'].includes(path) ? { about: { '@id': organizationId } } : {})
    }
  ];
  if (path !== '/') nodes.push({
    '@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`,
    itemListElement: crumbs.map((crumb, index) => ({ '@type': 'ListItem', position: index + 1, name: crumb.name, item: pageUrl(crumb.path) }))
  });
  nodes.push(...entities.map((entity, index) => ({ '@id': `${url}#entity-${index + 1}`, ...entity })));
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export const serviceSchema = (name: string, description: string, path: string, city?: string): SchemaNode => ({
  '@type': 'Service', name, description, url: pageUrl(path),
  provider: { '@id': organizationId },
  ...(city ? { areaServed: { '@type': 'City', name: city } } : {})
});

export const itemListSchema = (name: string, items: { name: string; path: string }[]): SchemaNode => ({
  '@type': 'ItemList', name, numberOfItems: items.length,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem', position: index + 1, name: item.name, url: pageUrl(item.path)
  }))
});

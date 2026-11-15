export const pipeAttributes = [
  { name: 'diameter', label: 'Średnica', unit: 'mm' },
  { name: 'wall', label: 'Ścianka', unit: 'mm' },
  { name: 'length', label: 'Długość', unit: 'm' },
  { name: 'grade', label: 'Gatunek', unit: '' },
  { name: 'standard', label: 'Norma', unit: '' }
];
export const pipeFilterNames = ['type', ...pipeAttributes.map(({ name }) => name), 'q'];

export function isPipeFilterUrl(url) {
  return url.pathname.replace(/\/$/, '') === '/rury-stalowe'
    && pipeFilterNames.some(name => url.searchParams.has(name));
}

export function normalizePipeValue(value, numeric = false) {
  const text = value.trim().replace(/\s+/g, ' ');
  if (!numeric) return text.toLocaleUpperCase('pl');
  // Reject malformed values (e.g. "8,mm") rather than inventing dimensions.
  const match = text.match(/^(\d+(?:[.,]\d+)?)\s*(?:mm|mb|m)?$/i);
  return match ? String(Number(match[1].replace(',', '.'))) : '';
}

export function pipeValues(product, attribute) {
  return [...new Set(product.data.technicalParameters
    .filter(parameter => parameter.label.trim() === attribute.label)
    .flatMap(parameter => parameter.value.split(/,\s+|;/))
    .map(value => normalizePipeValue(value, Boolean(attribute.unit)))
    .filter(Boolean))];
}

export function readPipeFilters(params) {
  return Object.fromEntries(pipeFilterNames.map(name => [name, (params.get(name) ?? '').trim().slice(0, 200)]));
}

export function matchesPipeFilters(product, filters) {
  if (filters.type && product.data.category !== filters.type) return false;
  const text = `${product.data.title} ${product.data.steelGrade ?? ''} ${product.data.description}`.toLocaleLowerCase('pl');
  if (filters.q && !filters.q.toLocaleLowerCase('pl').split(/\s+/).every(term => text.includes(term))) return false;
  return pipeAttributes.every(attribute => {
    if (!filters[attribute.name]) return true;
    const value = normalizePipeValue(filters[attribute.name], Boolean(attribute.unit));
    return Boolean(value) && pipeValues(product, attribute).includes(value);
  });
}

export function pipeFilterOptions(products) {
  return pipeAttributes.map(attribute => ({
    ...attribute,
    values: [...new Set(products.flatMap(product => pipeValues(product, attribute)))].sort((a, b) =>
      attribute.unit ? Number(a) - Number(b) : a.localeCompare(b, 'pl', { numeric: true }))
  }));
}

import { defineField, defineType, type Rule } from 'sanity';

const field = (name: string, title: string, type = 'string', required = false) =>
  defineField({ name, title, type, validation: (rule: Rule) => required ? rule.required() : rule });
const date = (required = true) => field('pubDate', 'Data publikacji', 'date', required);
const source = (required = true) => field('source', 'Adres źródłowy / kanoniczny', 'url', required);
const order = field('order', 'Kolejność', 'number', true);
const images = [
  defineField({ name: 'mainImage', title: 'Zdjęcie', type: 'image', options: { hotspot: false }, description: 'Przesłane zdjęcie zastępuje adres obrazu poniżej.' }),
  field('image', 'Adres istniejącego obrazu (URL lub /img/…)'),
  field('imageAlt', 'Opis alternatywny obrazu'),
];
const objectArray = (name: string, title: string, fields: ReturnType<typeof defineField>[]) =>
  defineField({ name, title, type: 'array', of: [{ type: 'object', name: `${name}Item`, fields }] });

const document = (name: string, title: string, fields: ReturnType<typeof defineField>[]) => defineType({
  name, title, type: 'document',
  fields: [
    field('title', 'Tytuł', 'string', true),
    defineField({ name: 'slug', title: 'Slug (adres strony)', type: 'slug', options: { source: 'title', maxLength: 200 }, validation: rule => rule.required(), description: 'Zmiana adresu opublikowanej strony wymaga przekierowania.' }),
    field('description', 'Opis SEO', 'text', true),
    ...fields,
    defineField({ name: 'body', title: 'Treść (Markdown / HTML)', type: 'text', rows: 25, description: 'Obsługuje Markdown oraz dotychczasowy HTML. Zachowaj klasy HTML przy edycji przeniesionych stron.' }),
  ],
  preview: { select: { title: 'title', subtitle: 'slug.current', media: 'mainImage' } },
});

export const schemaTypes = [
  document('news', 'Aktualności', [date(), source(), ...images,
    defineField({ name: 'category', title: 'Kategoria', type: 'string', options: { list: ['Aktualności', 'Rynek', 'Wiedza', 'Właściwości mechaniczne stali', 'Wymiary rur stalowych'] }, validation: rule => rule.required() }),
    objectArray('faq', 'Pytania i odpowiedzi', [field('question', 'Pytanie', 'string', true), field('answer', 'Odpowiedź', 'text', true)]),
  ]),
  document('services', 'Usługi', [date(), source(), order, ...images]),
  document('production', 'Produkcja', [date(), source(), order, ...images]),
  document('jobs', 'Oferty pracy', [date(false), source(false), order, field('location', 'Lokalizacja')]),
  document('delivery', 'Dostawa', [date(), source(), order, field('city', 'Miasto', 'string', true)]),
  document('steelPipeCategories', 'Kategorie rur', [source(), order, ...images]),
  document('steelPipeProducts', 'Produkty — rury', [
    order, field('sku', 'SKU'),
    defineField({ name: 'category', title: 'Kategoria', type: 'string', description: 'Wpisz dokładny slug kategorii rur.', validation: rule => rule.required() }),
    field('specification', 'Specyfikacja', 'text'),
    defineField({ name: 'technicalSummary', title: 'Podsumowanie techniczne', type: 'text', validation: rule => rule.min(40) }),
    field('steelGrade', 'Gatunek stali'), field('productionMethod', 'Metoda produkcji'), field('intendedUse', 'Przeznaczenie'),
    objectArray('technicalParameters', 'Parametry techniczne', [field('label', 'Parametr', 'string', true), field('value', 'Wartość', 'string', true)]),
    field('qualityStatement', 'Informacja o jakości', 'text'),
    objectArray('documents', 'Dokumenty', [field('title', 'Nazwa', 'string', true), field('url', 'Adres URL', 'url', true),
      defineField({ name: 'type', title: 'Typ', type: 'string', options: { list: ['DoP', 'Atest', 'Certyfikat', 'Karta techniczna'] }, validation: rule => rule.required() }),
    ]),
  ]),
];

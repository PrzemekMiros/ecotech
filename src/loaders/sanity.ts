import { createClient } from '@sanity/client';
import { glob, type Loader } from 'astro/loaders';

/** Keep the existing collection/render API, switching sources explicitly. */
export function contentLoader(type: string, directory: string): Loader {
  const source = import.meta.env.CONTENT_SOURCE || 'local';
  if (source === 'local') return glob({ base: directory, pattern: '**/*.md' });
  if (source !== 'sanity') throw new Error('CONTENT_SOURCE must be local or sanity.');

  return {
    name: `sanity-${type}`,
    async load({ store, parseData, renderMarkdown, generateDigest, logger }) {
      const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
      const dataset = import.meta.env.SANITY_STUDIO_DATASET;
      if (!projectId || !dataset) {
        throw new Error('Set SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET before enabling Sanity.');
      }
      const client = createClient({
        projectId, dataset, apiVersion: '2025-02-19', useCdn: false,
        perspective: 'published', token: import.meta.env.SANITY_API_READ_TOKEN || undefined,
      });
      const documents = await client.fetch<Array<Record<string, any>>>(
        '*[_type == $type && !(_id in path("drafts.**"))]{..., "image": coalesce(mainImage.asset->url, image)}',
        { type },
      );
      const entries = [];
      const slugs = new Set<string>();
      for (const document of documents) {
        const { _id, body = '', ...fields } = document;
        const slug = typeof fields.slug === 'string' ? fields.slug : fields.slug?.current;
        if (!slug || slugs.has(slug)) throw new Error(`Missing or duplicate slug in ${type}: ${slug}`);
        slugs.add(slug);
        // Sanity projects absent optional values as null; Zod expects undefined.
        const data = Object.fromEntries(Object.entries({ ...fields, slug }).filter(([, value]) => value !== null));
        const parsed = await parseData({ id: _id, data });
        entries.push({ id: _id, data: parsed, body, rendered: await renderMarkdown(body), digest: generateDigest(document) });
      }
      // Only replace the store after the complete collection has passed validation.
      store.clear();
      for (const entry of entries) store.set(entry);
      logger.info(`Loaded ${entries.length} published ${type} documents`);
    },
  };
}

import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';

// Dotted IDs prevent anonymous access, including in a public dataset.
export async function saveLeadStatistic({ lead, source, formPage, formId }: {
  lead: { product: string; name: string; email: string; phone: string; company: string; nip: string; message: string };
  source?: Record<string, string>; formPage: string; formId: string;
}) {
  const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = import.meta.env.SANITY_STUDIO_DATASET;
  const token = import.meta.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    throw new Error('Sanity write configuration missing.');
  }
  const document = {
    _id: `leadStatistics.${randomUUID()}`, _type: 'leadStatistic',
    submittedAt: new Date().toISOString(), channel: 'unknown', ...source, formPage, formId,
    ...lead, privacyAccepted: true,
  };
  try {
    const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false, timeout: 5000, maxRetries: 2 });
    await client.createIfNotExists(document);
  } catch {
    throw new Error('Sanity form submission failed.');
  }
}

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
    console.error('Sanity form configuration missing:', {
      projectId: Boolean(projectId), dataset: Boolean(dataset), token: Boolean(token),
    });
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
  } catch (error) {
    // Do not log the request: it contains personal data and authorization headers.
    const statusCode = typeof error === 'object' && error !== null && 'statusCode' in error
      ? error.statusCode : undefined;
    console.error('Sanity form write failed:', { statusCode: typeof statusCode === 'number' ? statusCode : 'network-or-config' });
    throw new Error('Sanity form submission failed.');
  }
}

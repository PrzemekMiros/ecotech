import { createClient } from '@sanity/client';
import { randomUUID } from 'node:crypto';

// Store only attribution metadata; contact details and message stay in Firmao.
export async function saveLeadStatistic({ source, formPage, formId }: {
  source?: Record<string, string>; formPage: string; formId: string;
}) {
  const projectId = import.meta.env.SANITY_STUDIO_PROJECT_ID;
  const dataset = import.meta.env.SANITY_STUDIO_DATASET;
  const token = import.meta.env.SANITY_API_WRITE_TOKEN;
  if (!projectId || !dataset || !token) {
    console.warn('Lead statistics not saved: Sanity write configuration missing.');
    return;
  }
  const document = {
    _id: `leadStatistics.${randomUUID()}`, _type: 'leadStatistic',
    submittedAt: new Date().toISOString(), channel: 'unknown', ...source, formPage, formId,
  };
  try {
    const client = createClient({ projectId, dataset, token, apiVersion: '2025-02-19', useCdn: false, timeout: 5000, maxRetries: 2 });
    await client.createIfNotExists(document);
  } catch {
    // CRM has already accepted the message. Do not prompt a duplicate submission.
    console.error('Lead statistics save failed after CRM success.', document._id);
  }
}

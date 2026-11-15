import type { APIRoute } from 'astro';
import { readSource } from '../../lib/lead-source.mjs';
import { saveLeadStatistic } from '../../lib/lead-statistics';

export const prerender = false;

const MAX_LENGTHS = { product: 300, name: 160, email: 254, phone: 64, company: 160, nip: 32, message: 5000, source: 200 };

type Lead = { product: string; name: string; email: string; phone: string; company: string; nip: string; message: string };
type LeadSource = { channel: string; landingPage: string; referrerHost: string; utmSource: string; utmMedium: string; utmCampaign: string; utmTerm: string; utmContent: string };

function readString(value: unknown, maximum: number) {
  return typeof value === 'string' ? value.trim().slice(0, maximum) : '';
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
    if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Invalid payload');
  } catch {
    return Response.json({ message: 'Nieprawidłowe dane formularza.' }, { status: 400 });
  }

  if (readString(payload.website, 200)) return new Response(null, { status: 204 });
  const lead: Lead = {
    product: readString(payload.product, MAX_LENGTHS.product), name: readString(payload.name, MAX_LENGTHS.name), email: readString(payload.email, MAX_LENGTHS.email),
    phone: readString(payload.phone, MAX_LENGTHS.phone), company: readString(payload.company, MAX_LENGTHS.company),
    nip: readString(payload.nip, MAX_LENGTHS.nip), message: readString(payload.message, MAX_LENGTHS.message),
  };
  const source = readSource(payload.source) as LeadSource | undefined;
  const formPage = readString(payload.formPage, 300).split(/[?#]/)[0];
  const formId = readString(payload.formId, 100);
  if (!lead.name || !lead.message || (!lead.email && !lead.phone)) {
    return Response.json({ message: 'Podaj imię, wiadomość oraz adres e-mail lub numer telefonu.' }, { status: 400 });
  }
  if (lead.email && !isEmail(lead.email)) return Response.json({ message: 'Podaj prawidłowy adres e-mail.' }, { status: 400 });
  if (payload.privacy !== 'on') return Response.json({ message: 'Wymagana jest zgoda na przetwarzanie danych.' }, { status: 400 });

  try {
    await saveLeadStatistic({ lead, source, formPage, formId });
    return Response.json({ message: 'Dziękujemy — zapytanie zostało wysłane.' }, { status: 201 });
  } catch {
    console.error('Sanity form submission failed.');
    return Response.json({ message: 'Nie udało się zapisać zapytania. Spróbuj ponownie później.' }, { status: 503 });
  }
};

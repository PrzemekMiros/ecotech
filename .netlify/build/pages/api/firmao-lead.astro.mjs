export { renderers } from '../../renderers.mjs';

const prerender = false;
const MAX_LENGTHS = { product: 300, name: 160, email: 254, phone: 64, company: 160, nip: 32, message: 5e3, source: 200 };
function readString(value, maximum) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}
function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
function readSource(value) {
  if (typeof value !== "string" || !value) return void 0;
  try {
    const source = JSON.parse(value);
    const channel = readString(source.channel, 20);
    if (!["ads", "organic", "referral", "direct"].includes(channel)) return void 0;
    return {
      channel,
      landingPage: readString(source.landingPage, 300),
      referrerHost: readString(source.referrerHost, MAX_LENGTHS.source),
      utmSource: readString(source.utmSource, MAX_LENGTHS.source),
      utmMedium: readString(source.utmMedium, MAX_LENGTHS.source),
      utmCampaign: readString(source.utmCampaign, MAX_LENGTHS.source),
      utmTerm: readString(source.utmTerm, MAX_LENGTHS.source),
      utmContent: readString(source.utmContent, MAX_LENGTHS.source)
    };
  } catch {
    return void 0;
  }
}
function getCustomerId(body) {
  if (!body || typeof body !== "object") return void 0;
  const changelog = body.changelog;
  if (!Array.isArray(changelog)) return void 0;
  const created = changelog.find((entry) => {
    if (!entry || typeof entry !== "object") return false;
    const change = entry;
    return change.modification === "CREATE" && change.objectClass === "customer" && (typeof change.objectId === "number" || typeof change.objectId === "string");
  });
  return created?.objectId;
}
function getExistingCustomerId(body) {
  if (!body || typeof body !== "object") return void 0;
  const data = body.data;
  if (!Array.isArray(data) || !data[0] || typeof data[0] !== "object") return void 0;
  const id = data[0].id;
  return typeof id === "number" || typeof id === "string" ? id : void 0;
}
function leadDescription(lead, source) {
  const sourceDetails = source ? [
    "",
    "Źródło formularza:",
    `Kanał: ${source.channel}`,
    `Strona wejścia: ${source.landingPage || "nieznana"}`,
    ...source.referrerHost ? [`Referrer: ${source.referrerHost}`] : [],
    ...source.utmSource ? [`UTM source: ${source.utmSource}`] : [],
    ...source.utmMedium ? [`UTM medium: ${source.utmMedium}`] : [],
    ...source.utmCampaign ? [`UTM campaign: ${source.utmCampaign}`] : [],
    ...source.utmTerm ? [`UTM term: ${source.utmTerm}`] : [],
    ...source.utmContent ? [`UTM content: ${source.utmContent}`] : []
  ] : [];
  return [
    "Zapytanie z formularza strony ecotechgroup.pl",
    `Produkt: ${lead.product || "nie podano"}`,
    `Imię i nazwisko: ${lead.name}`,
    `E-mail: ${lead.email || "nie podano"}`,
    `Telefon: ${lead.phone || "nie podano"}`,
    `Firma: ${lead.company || "nie podano"}`,
    `NIP: ${lead.nip || "nie podano"}`,
    "",
    "Wiadomość:",
    lead.message,
    ...sourceDetails
  ].join("\n");
}
const POST = async ({ request }) => {
  const organizationId = "przemyslawmiros";
  const login = "przemyslawmiros.api@firmao.pl";
  const password = "b9aa250cf4884363bf8c4b3024ec55a5";
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ message: "Nieprawidłowe dane formularza." }, { status: 400 });
  }
  if (readString(payload.website, 200)) return new Response(null, { status: 204 });
  const lead = {
    product: readString(payload.product, MAX_LENGTHS.product),
    name: readString(payload.name, MAX_LENGTHS.name),
    email: readString(payload.email, MAX_LENGTHS.email),
    phone: readString(payload.phone, MAX_LENGTHS.phone),
    company: readString(payload.company, MAX_LENGTHS.company),
    nip: readString(payload.nip, MAX_LENGTHS.nip),
    message: readString(payload.message, MAX_LENGTHS.message)
  };
  const source = readSource(payload.source);
  if (!lead.name || !lead.message || !lead.email && !lead.phone) {
    return Response.json({ message: "Podaj imię, wiadomość oraz adres e-mail lub numer telefonu." }, { status: 400 });
  }
  if (lead.email && !isEmail(lead.email)) return Response.json({ message: "Podaj prawidłowy adres e-mail." }, { status: 400 });
  if (payload.privacy !== "on") return Response.json({ message: "Wymagana jest zgoda na przetwarzanie danych." }, { status: 400 });
  const baseUrl = `https://system.firmao.pl/${encodeURIComponent(organizationId)}/svc/v1`;
  const headers = {
    Authorization: `Basic ${Buffer.from(`${login}:${password}`).toString("base64")}`,
    "Content-Type": "application/json; charset=UTF-8"
  };
  const description = leadDescription(lead, source);
  try {
    let customerId;
    if (lead.nip) {
      const params = new URLSearchParams({ start: "0", limit: "1", "nipNumber(eq)": lead.nip, dataFormat: "MEDIUM" });
      const existingResponse = await fetch(`${baseUrl}/customers?${params}`, { headers });
      if (existingResponse.ok) customerId = getExistingCustomerId(await existingResponse.json().catch(() => null));
    }
    if (customerId === void 0) {
      const customerResponse = await fetch(`${baseUrl}/customers`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          label: lead.company || lead.name,
          name: lead.company ? `${lead.company} — ${lead.name}` : lead.name,
          ...lead.email ? { emails: [lead.email] } : {},
          ...lead.phone ? { phones: [lead.phone] } : {},
          ...lead.nip ? { nipNumber: lead.nip } : {},
          description,
          customerGroups: [],
          tags: []
        })
      });
      const customerBody = await customerResponse.json().catch(() => null);
      customerId = getCustomerId(customerBody);
      if (!customerResponse.ok || customerId === void 0) {
        console.error("Firmao customer creation failed.", customerResponse.status, customerBody);
        return Response.json({ message: "Nie udało się zapisać zapytania. Spróbuj ponownie później." }, { status: 502 });
      }
    }
    const noteResponse = await fetch(`${baseUrl}/salesnotes`, {
      method: "POST",
      headers,
      body: JSON.stringify({ customer: customerId, description, tags: [], date: (/* @__PURE__ */ new Date()).toISOString() })
    });
    if (!noteResponse.ok) {
      console.error("Firmao sales note creation failed.", noteResponse.status, await noteResponse.text());
      return Response.json({ message: "Dane kontaktowe zapisano, ale nie udało się dodać treści zapytania." }, { status: 502 });
    }
    return Response.json({ message: "Dziękujemy — zapytanie zostało wysłane." }, { status: 201 });
  } catch (error) {
    console.error("Firmao request failed.", error);
    return Response.json({ message: "Nie udało się połączyć z CRM. Spróbuj ponownie później." }, { status: 502 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };

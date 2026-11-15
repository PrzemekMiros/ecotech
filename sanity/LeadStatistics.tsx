import React, { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { channelLabels } from '../src/lib/lead-source.mjs';

type Row = { _id: string; submittedAt: string; channel: string; formPage?: string; formId?: string; landingPage?: string; referrerHost?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; name?: string; email?: string; phone?: string; company?: string; nip?: string; product?: string; message?: string };
const label = (key: string) => channelLabels[key as keyof typeof channelLabels] || key;
const cell: React.CSSProperties = { padding: '10px 14px', textAlign: 'left', borderBottom: '1px solid #8884', overflowWrap: 'anywhere' };
function Breakdown({ title, rows, field }: { title: string; rows: Row[]; field: keyof Row }) {
  const counts = new Map<string, number>();
  for (const row of rows) { const key = row[field] || 'Nieznane / brak'; counts.set(key, (counts.get(key) || 0) + 1); }
  return <section><h2>{title}</h2><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr><th style={cell}>Źródło</th><th style={cell}>Zapytania</th><th style={cell}>Udział</th></tr></thead><tbody>
    {[...counts].sort((a, b) => b[1] - a[1]).map(([key, count]) => <tr key={key}><td style={cell}>{field === 'channel' ? label(key) : key}</td><td style={cell}>{count}</td><td style={cell}>{(100 * count / rows.length).toFixed(1)}%</td></tr>)}
  </tbody></table></section>;
}
export function LeadStatistics() {
  const client = useClient({ apiVersion: '2025-02-19' });
  const [days, setDays] = useState('30');
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const since = new Date(Date.now() - Number(days) * 86400000).toISOString();
    // Page through the entire period, without silently truncating statistics.
    (async () => {
      const result: Row[] = [];
      let after = '';
      while (active) {
        const batch = await client.withConfig({ useCdn: false, perspective: 'published' }).fetch<Row[]>(
          '*[_type == "leadStatistic" && _id in path("leadStatistics.**") && submittedAt >= $since && _id > $after] | order(_id asc)[0...1000]{_id,submittedAt,channel,formPage,formId,landingPage,referrerHost,utmSource,utmMedium,utmCampaign,name,email,phone,company,nip,product,message}', { since, after });
        result.push(...batch);
        if (batch.length < 1000) break;
        after = batch[batch.length - 1]._id;
      }
      if (active) setRows(result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt)));
    })().catch(() => { if (active) setError('Nie udało się pobrać statystyk. Sprawdź połączenie i uprawnienia do projektu.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [client, days, refresh]);
  return <main style={{ padding: 32, maxWidth: 1400, margin: 'auto', height: '100%', overflow: 'auto', boxSizing: 'border-box' }}>
    <h1>Statystyki formularzy</h1>
    <p>Zapytania zapisane w Sanity. Źródło: pierwsze wejście w sesji karty przeglądarki. Czas wyświetlany w strefie Europe/Warsaw.</p>
    <label>Okres: <select value={days} onChange={event => setDays(event.target.value)}>{[7, 30, 90, 365].map(value => <option key={value} value={value}>Ostatnie {value} dni</option>)}</select></label>{' '}
    <button onClick={() => setRefresh(value => value + 1)} disabled={loading}>Odśwież</button>
    {loading ? <p role="status">Wczytywanie…</p> : error ? <p role="alert">{error}</p> : <>
      <h2>Wysłane zapytania: {rows.length}</h2>
      {!rows.length ? <p>Brak zapisanych zapytań w tym okresie. Dane pojawią się po konfiguracji tokenu serwerowego i wysłaniu formularza.</p> : <>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          <Breakdown title="Kanały pozyskania" rows={rows} field="channel" />
          <Breakdown title="Strony formularzy" rows={rows} field="formPage" />
          <Breakdown title="Strony wejścia" rows={rows} field="landingPage" />
          <Breakdown title="Kampanie UTM" rows={rows} field="utmCampaign" />
          <Breakdown title="Źródła UTM" rows={rows} field="utmSource" />
          <Breakdown title="Witryny odsyłające" rows={rows} field="referrerHost" />
        </div>
        <h2>Ostatnie 100 zapytań</h2><div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}><thead><tr>{['Data', 'Kanał', 'Strona formularza', 'Formularz', 'Strona wejścia', 'Źródło / medium', 'Kampania'].map(title => <th key={title} style={cell}>{title}</th>)}</tr></thead><tbody>
          {rows.slice(0, 100).map(row => <tr key={row._id}>{[new Date(row.submittedAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }), label(row.channel), row.formPage, row.formId, row.landingPage, [row.utmSource, row.utmMedium].filter(Boolean).join(' / '), row.utmCampaign].map((value, i) => <td key={i} style={cell}>{value || '—'}</td>)}</tr>)}
        </tbody></table></div>
        <h2>Treść otrzymanych zapytań</h2>
        {rows.map(row => <details key={row._id} style={{ padding: 12, borderBottom: '1px solid #8884' }}>
          <summary>{new Date(row.submittedAt).toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })} — {row.name || 'Wpis archiwalny'} — {row.product || row.formPage || 'Zapytanie'}</summary>
          <p>Kontakt: {row.email || '—'} · {row.phone || '—'}</p>
          <p>Firma: {row.company || '—'} · NIP: {row.nip || '—'}</p>
          <p style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{row.message || 'Ten wpis zawiera tylko statystyki — treść nie była zapisywana.'}</p>
        </details>)}
      </>}
    </>}
    <p>Statystyki obejmują zapisane wysłania od uruchomienia integracji, nie wizyty ani współczynnik konwersji. Brak referrera może oznaczać wejście bezpośrednie lub ukryte źródło.</p>
  </main>;
}

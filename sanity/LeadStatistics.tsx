import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useClient } from 'sanity';
import { channelLabels } from '../src/lib/lead-source.mjs';
import './LeadStatistics.css';

export type LeadRow = { _id: string; submittedAt: string; channel: string; formPage?: string; formId?: string; landingPage?: string; referrerHost?: string; utmSource?: string; utmMedium?: string; utmCampaign?: string; name?: string; email?: string; phone?: string; company?: string; nip?: string; product?: string; message?: string };
const label = (key: string) => channelLabels[key as keyof typeof channelLabels] || 'Nieznane';
const number = (value: number) => value.toLocaleString('pl-PL');
const date = (value: string, time = false) => new Date(value).toLocaleString('pl-PL', time
  ? { timeZone: 'Europe/Warsaw', hour: '2-digit', minute: '2-digit' }
  : { timeZone: 'Europe/Warsaw', day: '2-digit', month: 'short', year: 'numeric' });
function Icon({ kind }: { kind: 'search' | 'arrow' | 'refresh' | 'close' | 'inbox' }) {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {kind === 'search' ? <><circle cx="10.5" cy="10.5" r="6.5" /><path d="m16 16 4 4" /></> : kind === 'arrow' ? <path d="m9 5 7 7-7 7" /> : kind === 'close' ? <path d="m6 6 12 12M18 6 6 18" /> : kind === 'refresh' ? <><path d="M20 7v5h-5M4 17v-5h5" /><path d="M6 7a7 7 0 0 1 12-1l2 3M4 15l2 3a7 7 0 0 0 12-1" /></> : <><path d="M4 4h16l2 12v4H2v-4L4 4Z" /><path d="M2 15h6l2 3h4l2-3h6" /></>}
  </svg>;
}
function Badge({ channel }: { channel: string }) {
  return <span className="ls-badge" data-channel={channel}><i />{label(channel)}</span>;
}
function Breakdown({ title, description, rows, field }: { title: string; description: string; rows: LeadRow[]; field: keyof LeadRow }) {
  const [expanded, setExpanded] = useState(false);
  const counts = new Map<string, number>();
  for (const row of rows) { const key = row[field] || ''; counts.set(key, (counts.get(key) || 0) + 1); }
  const entries = [...counts].sort((a, b) => b[1] - a[1]);
  return <section className="ls-panel ls-breakdown"><div className="ls-section-heading"><h2>{title}</h2><span className="ls-muted">{entries.length} pozycji</span></div><p className="ls-muted">{description}</p>
    <div className="ls-bars">{entries.slice(0, expanded ? undefined : 5).map(([key, count]) => <div className="ls-bar-item" key={key}>
      <div><span className="ls-bar-name" title={key}>{field === 'channel' ? label(key) : key || 'Brak oznaczenia'}</span><span className="ls-bar-value"><strong>{number(count)}</strong><small>{Math.round(100 * count / rows.length)}%</small></span></div>
      <div className="ls-track"><span style={{ width: `${100 * count / rows.length}%` }} /></div>
    </div>)}</div>
    {entries.length > 5 && <button className="ls-text-button" onClick={() => setExpanded(!expanded)}>{expanded ? 'Pokaż mniej' : `Pokaż wszystkie (${entries.length})`}</button>}
  </section>;
}
function LeadDetails({ row, close }: { row: LeadRow; close: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => { dialog.current?.showModal(); }, []);
  return <dialog ref={dialog} className="ls-dialog" aria-labelledby="ls-detail-title" onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div className="ls-dialog-head"><div><span className="ls-eyebrow">SZCZEGÓŁY ZAPYTANIA</span><h2 id="ls-detail-title">{row.name || 'Zapytanie archiwalne'}</h2><p className="ls-muted">{date(row.submittedAt)} · {date(row.submittedAt, true)}</p></div><button className="ls-icon-button" onClick={close} aria-label="Zamknij szczegóły" autoFocus><Icon kind="close" /></button></div>
    <div className="ls-dialog-body"><Badge channel={row.channel} />
      <section><h3>Dane kontaktowe</h3><dl className="ls-details-grid">
        <div><dt>E-mail</dt><dd>{row.email ? <a href={`mailto:${encodeURIComponent(row.email)}`}>{row.email}</a> : 'Nie podano'}</dd></div>
        <div><dt>Telefon</dt><dd>{row.phone ? <a href={`tel:${row.phone.replace(/[^+\d]/g, '')}`}>{row.phone}</a> : 'Nie podano'}</dd></div>
        <div><dt>Firma</dt><dd>{row.company || 'Nie podano'}</dd></div><div><dt>NIP</dt><dd>{row.nip || 'Nie podano'}</dd></div>
      </dl></section>
      <section><h3>{row.product || 'Wiadomość'}</h3><div className="ls-message">{row.message || 'Ten archiwalny wpis zawiera tylko statystyki. Treść wiadomości nie była zapisywana.'}</div></section>
      <section><h3>Skąd pochodzi zapytanie?</h3><dl className="ls-details-grid">
        {([['Strona formularza', row.formPage], ['Pierwsza strona wejścia', row.landingPage], ['Kampania', row.utmCampaign], ['Źródło / medium', [row.utmSource, row.utmMedium].filter(Boolean).join(' / ')], ['Witryna odsyłająca', row.referrerHost], ['Identyfikator formularza', row.formId]] as const).map(([title, value]) => <div key={title}><dt>{title}</dt><dd>{value || 'Brak danych'}</dd></div>)}
      </dl></section>
    </div><div className="ls-dialog-foot"><span className="ls-muted">Czas lokalny: Warszawa</span><button className="ls-button" onClick={close}>Zamknij</button></div>
  </dialog>;
}

type ViewProps = { rows: LeadRow[]; days: string; setDays: (days: string) => void; loading: boolean; error: string; refresh: () => void; updatedAt?: Date };
export function LeadStatisticsView({ rows, days, setDays, loading, error, refresh, updatedAt }: ViewProps) {
  const [view, setView] = useState('inbox');
  const [search, setSearch] = useState('');
  const [channel, setChannel] = useState('all');
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<LeadRow | null>(null);
  const filtered = useMemo(() => rows.filter(row => (channel === 'all' || row.channel === channel) &&
    [row.name, row.company, row.email, row.phone, row.product, row.message, row.formPage, row.utmCampaign].filter(Boolean).join(' ').toLocaleLowerCase('pl-PL').includes(search.trim().toLocaleLowerCase('pl-PL'))), [rows, search, channel]);
  useEffect(() => { setPage(0); }, [search, channel, days]);
  const pages = Math.max(1, Math.ceil(filtered.length / 10));
  const activePage = Math.min(page, pages - 1);
  const paid = filtered.filter(row => row.channel === 'ads').length;
  const organic = filtered.filter(row => row.channel === 'organic').length;
  const campaigns = new Set(filtered.map(row => row.utmCampaign).filter(Boolean)).size;
  const hasFilter = !!search || channel !== 'all';
  return <main className="ls-root"><div className="ls-content">
    <header className="ls-header"><div><div className="ls-eyebrow"><span className="ls-live-dot" /> ECO TECH GROUP / ZAPYTANIA</div><h1>Statystyki formularzy</h1><p className="ls-muted">Wszystkie zapytania i ich źródła w jednym miejscu.</p></div>
      <div className="ls-header-actions"><label className="ls-sr-only" htmlFor="ls-days">Okres statystyk</label><select id="ls-days" className="ls-control" value={days} onChange={event => setDays(event.target.value)}>{[7, 30, 90, 365].map(value => <option key={value} value={value}>Ostatnie {value} dni</option>)}</select><button className="ls-button" onClick={refresh} disabled={loading}><Icon kind="refresh" />{loading ? 'Wczytywanie…' : 'Odśwież'}</button></div>
    </header>
    <div className="ls-toolbar"><div className="ls-search"><Icon kind="search" /><label className="ls-sr-only" htmlFor="ls-search">Szukaj zapytań</label><input id="ls-search" placeholder="Szukaj klienta, wiadomości, kampanii…" value={search} onChange={event => setSearch(event.target.value)} /></div><label className="ls-sr-only" htmlFor="ls-channel">Kanał pozyskania</label><select id="ls-channel" className="ls-control" value={channel} onChange={event => setChannel(event.target.value)}><option value="all">Wszystkie kanały</option>{Object.entries(channelLabels).map(([key, value]) => <option value={key} key={key}>{value}</option>)}</select>{hasFilter && <button className="ls-text-button" onClick={() => { setSearch(''); setChannel('all'); }}>Wyczyść filtry</button>}</div>
    {loading ? <div className="ls-loading" role="status"><span className="ls-spinner" />Pobieranie zapytań…</div> : error ? <div className="ls-empty ls-error" role="alert"><h2>Nie udało się pobrać zapytań</h2><p>{error}</p><button className="ls-button" onClick={refresh}>Spróbuj ponownie</button></div> : <>
      <div className="ls-metrics" aria-label="Podsumowanie wybranego okresu">
        {[['Wszystkie zapytania', filtered.length, hasFilter ? 'Po zastosowaniu filtrów' : `W ciągu ostatnich ${days} dni`], ['Z reklam', paid, filtered.length ? `${Math.round(paid / filtered.length * 100)}% wszystkich zapytań` : 'Brak zapytań w tym okresie'], ['Z wyników organicznych', organic, filtered.length ? `${Math.round(organic / filtered.length * 100)}% wszystkich zapytań` : 'Brak zapytań w tym okresie'], ['Oznaczone kampanie', campaigns, 'Unikalne nazwy kampanii UTM']].map(([title, value, description], index) => <section className={`ls-metric ${index === 0 ? 'ls-metric-primary' : ''}`} key={title}><h2>{title}</h2><strong>{number(Number(value))}</strong><p>{description}</p></section>)}
      </div>
      <div className="ls-view-bar"><nav aria-label="Widok zapytań"><button aria-pressed={view === 'inbox'} onClick={() => setView('inbox')}>Zapytania <span>{number(filtered.length)}</span></button><button aria-pressed={view === 'sources'} onClick={() => setView('sources')}>Analiza źródeł</button></nav><span className="ls-updated">{updatedAt ? `Aktualizacja: ${date(updatedAt.toISOString(), true)}` : ''}</span></div>
      {!filtered.length ? <div className="ls-empty"><span className="ls-empty-icon"><Icon kind="inbox" /></span><h2>{hasFilter ? 'Brak pasujących zapytań' : 'Tutaj pojawią się nowe zapytania'}</h2><p>{hasFilter ? 'Zmień wyszukiwaną frazę lub wybierz inny kanał.' : 'W tym okresie nie ma jeszcze wysłanych formularzy. Wybierz dłuższy okres lub wróć po otrzymaniu zapytania.'}</p>{hasFilter && <button className="ls-button" onClick={() => { setSearch(''); setChannel('all'); }}>Wyczyść filtry</button>}</div> : view === 'inbox' ? <section className="ls-panel ls-inbox" aria-label="Lista zapytań">
        <div className="ls-table-wrap"><table className="ls-table"><thead><tr><th>Klient / zapytanie</th><th>Źródło</th><th>Strona formularza</th><th>Otrzymano</th><th><span className="ls-sr-only">Szczegóły</span></th></tr></thead><tbody>
          {filtered.slice(activePage * 10, activePage * 10 + 10).map(row => <tr key={row._id}><td><div className="ls-client"><span className="ls-avatar" aria-hidden="true">{(row.name || '?').trim().slice(0, 1).toUpperCase()}</span><div><button className="ls-client-name" onClick={() => setSelected(row)}>{row.name || 'Zapytanie archiwalne'}</button><span className="ls-preview">{row.product || row.message || row.company || 'Brak treści wiadomości'}</span></div></div></td><td><Badge channel={row.channel} /><span className="ls-table-secondary">{row.utmCampaign || row.utmSource || '—'}</span></td><td><span className="ls-path" title={row.formPage}>{row.formPage || 'Nieznana'}</span></td><td className="ls-date">{date(row.submittedAt)}<span className="ls-table-secondary">{date(row.submittedAt, true)}</span></td><td><button className="ls-icon-button" aria-label={`Otwórz zapytanie: ${row.name || date(row.submittedAt)}`} onClick={() => setSelected(row)}><Icon kind="arrow" /></button></td></tr>)}
        </tbody></table></div>
        <div className="ls-pagination"><span>{activePage * 10 + 1}–{Math.min((activePage + 1) * 10, filtered.length)} z {number(filtered.length)} zapytań</span><div><button className="ls-button" disabled={!activePage} onClick={() => setPage(activePage - 1)}>Poprzednie</button><span>{activePage + 1} / {pages}</span><button className="ls-button" disabled={activePage + 1 >= pages} onClick={() => setPage(activePage + 1)}>Następne</button></div></div>
      </section> : <div className="ls-analysis">
        <Breakdown title="Kanały pozyskania" description="Co przyciąga klientów do Twojej strony?" rows={filtered} field="channel" />
        <Breakdown title="Strony formularzy" description="Na których stronach klienci wysyłają zapytania?" rows={filtered} field="formPage" />
        <Breakdown title="Kampanie" description="Zapytania przypisane do kampanii UTM." rows={filtered} field="utmCampaign" />
        <Breakdown title="Strony wejścia" description="Pierwsza odwiedzona strona w sesji." rows={filtered} field="landingPage" />
        <Breakdown title="Źródła UTM" description="Źródła oznaczone w linkach do strony." rows={filtered} field="utmSource" />
        <Breakdown title="Witryny odsyłające" description="Strony, z których przyszli klienci." rows={filtered} field="referrerHost" />
      </div>}
    </>}
    <footer className="ls-footer"><span>Statystyki wysłanych formularzy · czas: Warszawa</span><details><summary>Jak liczymy źródła?</summary><p>Źródło to pierwsze wejście w sesji karty przeglądarki. Brak informacji o witrynie odsyłającej może oznaczać wejście bezpośrednie lub ukryte źródło. Dane obejmują zapisane wysłania, nie unikalne osoby, wizyty ani współczynnik konwersji. Filtry dotyczą listy, podsumowania i analizy źródeł.</p></details></footer>
    {selected && <LeadDetails row={selected} close={() => setSelected(null)} />}
  </div></main>;
}

export function LeadStatistics() {
  const client = useClient({ apiVersion: '2025-02-19' });
  const [days, setDays] = useState('30');
  const [rows, setRows] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [updatedAt, setUpdatedAt] = useState<Date>();
  useEffect(() => {
    let active = true;
    setLoading(true); setError('');
    const since = new Date(Date.now() - Number(days) * 86400000).toISOString();
    (async () => {
      const result: LeadRow[] = [];
      let after = '';
      while (active) {
        const batch = await client.withConfig({ useCdn: false, perspective: 'published' }).fetch<LeadRow[]>(
          '*[_type == "leadStatistic" && _id in path("leadStatistics.**") && submittedAt >= $since && _id > $after] | order(_id asc)[0...1000]{_id,submittedAt,channel,formPage,formId,landingPage,referrerHost,utmSource,utmMedium,utmCampaign,name,email,phone,company,nip,product,message}', { since, after });
        result.push(...batch);
        if (batch.length < 1000) break;
        after = batch[batch.length - 1]._id;
      }
      if (active) { setRows(result.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))); setUpdatedAt(new Date()); }
    })().catch(() => { if (active) setError('Sprawdź połączenie i uprawnienia do projektu, a następnie spróbuj ponownie.'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [client, days, refresh]);
  return <LeadStatisticsView rows={rows} days={days} setDays={setDays} loading={loading} error={error} refresh={() => setRefresh(value => value + 1)} updatedAt={updatedAt} />;
}

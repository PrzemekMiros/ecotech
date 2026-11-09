# Dostęp do treści Eco Tech Group dla agentów

Wersja dokumentacji: 1.3.0

## Zasoby publiczne

- `/llms.txt` — indeks zasobów, `text/plain; charset=utf-8`.
- `/llms-full.txt` — kompendium techniczne, `text/plain; charset=utf-8`.
- `/index.md` — tekstowy przegląd strony głównej, `text/markdown; charset=utf-8`.
- `/docs/agents.md` — niniejsza dokumentacja, `text/markdown; charset=utf-8`.
- `/auth.md` — zasady dostępu i informacja o braku rejestracji/OAuth, `text/markdown; charset=utf-8`.
- `/.well-known/api-catalog` — katalog publicznego API zgodny z RFC 9727.
- `/openapi.json` — opis publicznego API tylko do odczytu.
- `/.well-known/mcp/server-card.json` — karta publicznego serwera MCP (również `/api/mcp/server-card`).
- `/.well-known/ai-catalog.json` i `/.well-known/ard.json` — katalog zasobów ARD/AI Catalog.
- `/.well-known/agent-skills/index.json` — indeks publicznych umiejętności agentów.
- `/.well-known/poppy.json` — manifest Poppy dla zwykłego, niezalogowanego przeglądania witryny.

Adres bazowy: https://ecotechgroup.pl. Odczyt nie wymaga uwierzytelnienia.

## Negocjacja formatu

Wyślij żądanie GET strony z nagłówkiem `Accept: text/markdown`, aby otrzymać Markdown. Dotyczy to strony głównej, artykułów, kategorii `/rury-stalowe-{kategoria}/`, produktów `/{produkt}/`, usług, produkcji, dostaw oraz pozostałych stron informacyjnych i eksperckich. Zwykłe żądania przeglądarki otrzymują HTML. Uwzględniane są preferencje `q` nagłówka Accept; `text/markdown;q=0` nie włącza Markdown.

Przykład:

```sh
curl -i -H 'Accept: text/markdown' https://ecotechgroup.pl/
```

Strona główna zwraca nagłówek `Link` wskazujący alternatywny Markdown, indeks treści, kompendium i tę dokumentację. Odpowiedzi negocjowane zawierają `Vary: Accept, User-Agent`. Nagłówek `HEAD` udostępnia metadane bez treści odpowiedzi.

Markdown podstron powstaje z głównej treści HTML, zachowując nagłówki, linki, tabele techniczne i FAQ, bez skryptów, nawigacji i formularzy. Zawiera adres kanoniczny. Dla strony głównej dostępny jest również przygotowany przegląd `/index.md`. Negocjacja działa na Netlify także dla stron prerenderowanych dzięki middleware Edge. Błędy 404/503, przekierowania, pliki i odpowiedzi API zachowują swój format i status. Publiczny endpoint `GET /api/site-info` nadal zwraca JSON; nie przyjmuje zamówień ani danych osobowych.

## MCP

Endpoint `https://ecotechgroup.pl/api/mcp` obsługuje MCP przez Streamable HTTP, bez sesji i uwierzytelnienia. Żądania JSON-RPC należy wysyłać metodą POST z `Content-Type: application/json` i `Accept: application/json, text/event-stream`. Serwer zwraca JSON; nie udostępnia strumienia SSE przez GET ani sesji do usunięcia przez DELETE (405). Maksymalny rozmiar żądania to 64 KiB.

Po inicjalizacji klient może pobrać `tools/list` i wywołać `tools/call`:

- `ecotech_company_contact` — publiczne dane kontaktowe, bez argumentów.
- `ecotech_calculate_pipe_weight` — orientacyjna masa rur; argumenty: `outerDiameterMm`, `wallThicknessMm`, `lengthM` (dodatnie liczby) oraz `quantity` (dodatnia liczba całkowita). Ścianka musi być cieńsza niż połowa średnicy.

Narzędzia są tylko do odczytu, współdzielą logikę z WebMCP w przeglądarce i nie wysyłają formularzy ani zamówień. Klienci bez nagłówka Origin są obsługiwani; żądania przeglądarkowe są ograniczone do domeny witryny.

Serwis nie udostępnia logowania OAuth/OIDC, chronionych zasobów OAuth ani agenta A2A. Brak ich metadanych jest zamierzony.

## Statusy i zasady dostępu

Nieistniejące zasoby zwracają 404. Podczas prac serwisowych możliwy jest status 503 z `Retry-After: 3600`. Należy respektować `robots.txt` i nagłówki indeksowania; dostępność Markdown nie zmienia tych zasad.

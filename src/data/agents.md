# Dostęp do treści Eco Tech Group dla agentów

Wersja dokumentacji: 1.1.0

## Zasoby publiczne

- `/llms.txt` — indeks zasobów, `text/plain; charset=utf-8`.
- `/llms-full.txt` — kompendium techniczne, `text/plain; charset=utf-8`.
- `/index.md` — tekstowy przegląd strony głównej, `text/markdown; charset=utf-8`.
- `/docs/agents.md` — niniejsza dokumentacja, `text/markdown; charset=utf-8`.
- `/auth.md` — zasady dostępu i informacja o braku rejestracji/OAuth, `text/markdown; charset=utf-8`.
- `/.well-known/api-catalog` — katalog publicznego API zgodny z RFC 9727.
- `/openapi.json` — opis publicznego API tylko do odczytu.
- `/.well-known/ai-catalog.json` i `/.well-known/ard.json` — katalog zasobów ARD/AI Catalog.
- `/.well-known/agent-skills/index.json` — indeks publicznych umiejętności agentów.
- `/.well-known/poppy.json` — manifest Poppy dla zwykłego, niezalogowanego przeglądania witryny.

Adres bazowy: https://ecotechgroup.pl. Odczyt nie wymaga uwierzytelnienia.

## Negocjacja formatu

Wyślij `GET /` lub `GET /aktualnosci/{slug}/` z nagłówkiem `Accept: text/markdown`, aby otrzymać Markdown. Zwykłe żądania przeglądarki otrzymują HTML. Uwzględniane są preferencje `q` nagłówka Accept; `text/markdown;q=0` nie włącza Markdown.

Przykład:

```sh
curl -i -H 'Accept: text/markdown' https://ecotechgroup.pl/
```

Strona główna zwraca nagłówek `Link` wskazujący alternatywny Markdown, indeks treści, kompendium i tę dokumentację. Odpowiedzi negocjowane zawierają `Vary: Accept, User-Agent`. Nagłówek `HEAD` udostępnia metadane bez treści odpowiedzi.

Obsługa negocjacji dotyczy strony głównej i artykułów. Pozostałe strony nadal udostępniają HTML z JSON-LD. Publiczny endpoint `GET /api/site-info` zwraca wyłącznie informacje o firmie, ofercie i kontakcie; nie przyjmuje zamówień ani danych osobowych.

Serwis nie udostępnia obecnie logowania OAuth/OIDC, chronionych zasobów OAuth, zdalnego serwera MCP ani agenta A2A. Brak ich metadanych jest zamierzony — witryna nie deklaruje usług, których nie realizuje.

## Statusy i zasady dostępu

Nieistniejące zasoby zwracają 404. Podczas prac serwisowych możliwy jest status 503 z `Retry-After: 3600`. Należy respektować `robots.txt` i nagłówki indeksowania; dostępność Markdown nie zmienia tych zasad.

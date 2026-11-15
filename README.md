# Eco Tech Group

Strona Astro z formularzami zapisywanymi wyłącznie w panelu Sanity.

## Uruchomienie

```bash
npm install
npm run dev
```

## Konfiguracja formularzy

1. Uzupełnij `.env` według `.env.example`.
2. Ustaw `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` i serwerowy `SANITY_API_WRITE_TOKEN` z prawem zapisu.
3. Zapytania i ich źródła odczytasz w zakładce „Statystyki formularzy” w Sanity.

Token nie może mieć prefiksu `PUBLIC_` ani `SANITY_STUDIO_`. Dane formularza są zapisywane przez endpoint serwerowy w dokumentach o ograniczonym dostępie. Firmao nie jest wywoływane.

## Wdrożenie

Formularze wymagają działającego endpointu serwerowego. Ustaw powyższe zmienne w hostingu i wdróż stronę przez adapter Netlify skonfigurowany w projekcie (`npm run build`). Studio publikuje się osobno przez `npm run studio:deploy`.


## Sanity CMS

Konfiguracja panelu, import obecnych treści i publikacja: [sanity/README.md](sanity/README.md).

## Błędy HTTP i prace serwisowe

- `src/pages/404.astro` zwraca HTTP 404, linki do głównych sekcji i formularz wyszukujący produkty w `/rury-stalowe/?q=...`. Nieistniejące artykuły także korzystają z tej strony.
- Wycofane usługi `/uslugi/ciecie-plazmowe-cnc-wypalanie-blach-cnc/` i `/uslugi/demontaz-rurociagow-stalowych/` zwracają 301 do `https://ecotechgroup.pl/uslugi/` (także bez końcowego ukośnika).
- Aby włączyć prace serwisowe, ustaw `MAINTENANCE_MODE=true`. Lokalnie użyj `.env` i ponownie uruchom serwer. Na Netlify ustaw zmienną w panelu hostingu dla Functions (obejmuje Edge Functions) i wykonaj ponowne wdrożenie. Aby wyłączyć tryb, ustaw `false` i ponownie wdróż witrynę.
- Funkcja `netlify/edge-functions/maintenance.js` obejmuje również pliki statyczne i podstrony prerenderowane. Middleware Astro obsługuje tryb dla tras dynamicznych. Podczas budowania nie zapisujemy komunikatów serwisowych w statycznych stronach.
- Wspólny szablon `src/lib/maintenance.mjs` zwraca 503, `Retry-After: 3600`, `X-Robots-Tag: noindex, nofollow, noarchive` i zakaz cache. Jest niezależny od CMS i zasobów strony. `/503` pozwala sprawdzić szablon bez włączania prac serwisowych.
- Po wdrożeniu sprawdź status i treść nieistniejącego URL, nieistniejącego artykułu, obu przekierowań oraz — przy włączonym trybie — strony głównej i statycznej podstrony produktu. Po wyłączeniu trybu potwierdź powrót odpowiedzi 200.

## Dane strukturalne JSON-LD

Wspólny layout generuje graf Organization, WebSite i WebPage (lub ContactPage, AboutPage, CollectionPage), z BreadcrumbList dla podstron. Szablony uzupełniają go o Product, BlogPosting, Service, ItemList oraz JobPosting dla ofert z datą i lokalizacją. FAQPage opisuje tylko pytania i odpowiedzi wyświetlane w treści. Strony błędów nie emitują grafu. Dane firmy i funkcje pomocnicze znajdują się w `src/lib/structured-data.ts`.

Nie dodajemy domyślnych cen, ocen, stanów magazynowych ani dat aktualizacji. Przy wycofywaniu oferty pracy należy również usunąć jej publikację. JSON-LD jest bezpiecznie serializowany i używa adresów domeny produkcyjnej. Po wdrożeniu sprawdź reprezentatywne URL w Schema Markup Validator i Google Rich Results Test. Poprawna składnia Schema.org nie gwarantuje rozszerzonego wyniku Google (np. produkty bez cen/ofert lub ocen mogą nie kwalifikować się do tego wyniku).

W layoucie pozostaje istniejąca globalna dyrektywa `noindex`; wdrożenie JSON-LD nie zmienia ustawień indeksowania.

## Markdown i wykrywanie zasobów przez agentów

Konfiguracja wersji 1.0.0 znajduje się w `src/lib/agent-resources.ts`, middleware i endpointach `/index.md` oraz `/docs/agents.md`. Źródła Markdown są w `src/data/home.md` i `src/data/agents.md`; aktualizuj przegląd przy zmianach oferty lub danych kontaktowych na stronie głównej.

Strona główna zwraca `Link` z relacjami `alternate`, `describedby` i `service-doc` zgodnie z [RFC 8288](https://www.rfc-editor.org/rfc/rfc8288) i [rejestrem IANA](https://www.iana.org/assignments/link-relations/). Dokumentacja opisuje dostęp HTTP do treści; nie deklarujemy nieistniejącego katalogu API. Nagłówki strony renderowanej przez SSR są ustawiane w middleware, a nie w regułach Netlify przeznaczonych tylko dla plików statycznych.

`GET /` i artykuły przyjmują `Accept: text/markdown`; `HEAD` zwraca te same metadane bez treści. Obie reprezentacje mają `Vary: Accept, User-Agent`, a cache CDN dla tych tras jest wyłączony, aby nie mieszać HTML i Markdown. Zasoby `.md` zwracają `text/markdown; charset=utf-8`. Istniejące reguły `robots.txt`, `noindex` i tryb serwisowy pozostają w mocy.

Walidacja lokalna: `npm run check:agents -- http://localhost:4321`. Po każdym wdrożeniu: `npm run check:agents -- https://ecotechgroup.pl`. Skrypt kończy się błędem przy przekierowaniu, braku Link, niewłaściwym statusie/MIME, braku Markdown albo blokadzie żądań z testowanymi User-Agent. Uruchamiaj również cyklicznie w monitoringu hostingu; test nie wprowadza zmian w witrynie. Nie należy omijać uwierzytelnienia/WAF — zasoby mają być publiczne z założenia.

Po poprawnym teście domeny produkcyjnej ponów audyt w oryginalnym narzędziu AEO i zachowaj raport. Ten skrypt sprawdza transport HTTP i dostęp do zasobów; nie zastępuje zewnętrznego skanera ani weryfikacji z sieci konkretnego dostawcy AI.
